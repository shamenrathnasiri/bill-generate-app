from flask import Blueprint, request, jsonify
from models import db, Bill, Customer, Service
from datetime import datetime
from sqlalchemy.exc import IntegrityError

bill_bp = Blueprint('bills', __name__)

def _normalize_year(year: int) -> int:
    year_int = int(year)
    # If a 2-digit year is ever passed, normalize to 2000-based.
    if 0 <= year_int < 100:
        year_int = 2000 + year_int
    return year_int


def _max_suffix_for_prefix(prefix: str) -> int:
    """Find the highest numeric suffix for bill_number values matching prefix."""
    last_bill = (
        Bill.query
        .filter(Bill.bill_number.like(f"{prefix}%"))
        .order_by(Bill.bill_number.desc())
        .first()
    )
    if not last_bill or not last_bill.bill_number:
        return 0
    try:
        return int(last_bill.bill_number.split("-")[-1])
    except (ValueError, IndexError):
        return 0


def next_invoice_number(year: int, start_from: int | None = None) -> str:
    """Generate next invoice number as INV-YY-0001 (YY is the 2-digit year)."""
    year_int = _normalize_year(year)
    yy = year_int % 100
    desired_prefix = f"INV-{yy:02d}-"

    if start_from is None:
        prefixes_to_consider = [
            desired_prefix,
            f"inv-{yy:02d}-",
            # Also consider any existing 4-digit-year invoices for continuity.
            f"INV-{year_int}-",
            f"inv-{year_int}-",
        ]
        start_from = 0
        for prefix in prefixes_to_consider:
            start_from = max(start_from, _max_suffix_for_prefix(prefix))

    return f"{desired_prefix}{(start_from + 1):04d}"

# Get all bills (excluding soft deleted)
@bill_bp.route('', methods=['GET'])
def get_bills():
    try:
        bills = Bill.query.filter_by(is_deleted=False).all()
        return jsonify({
            'success': True,
            'data': [bill.to_dict() for bill in bills]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Get single bill
@bill_bp.route('/<int:id>', methods=['GET'])
def get_bill(id):
    try:
        bill = Bill.query.filter_by(id=id, is_deleted=False).first()
        if not bill:
            return jsonify({
                'success': False,
                'message': 'Bill not found'
            }), 404
        return jsonify({
            'success': True,
            'data': bill.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Create bill
@bill_bp.route('', methods=['POST'])
def create_bill():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('customer_id') or not data.get('service_id'):
            return jsonify({
                'success': False,
                'message': 'Customer and service are required'
            }), 400
        
        # Verify customer exists
        customer = Customer.query.filter_by(id=data['customer_id'], is_deleted=False).first()
        if not customer:
            return jsonify({
                'success': False,
                'message': 'Customer not found'
            }), 404
        
        # Verify service exists
        service = Service.query.filter_by(id=data['service_id'], is_deleted=False).first()
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        
        quantity = int(data.get('quantity', 1))
        unit_price = float(data.get('unit_price', service.price))
        total = quantity * unit_price
        
        # Parse date
        bill_date = datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date()

        # Create bill with sequential invoice number.
        # IMPORTANT: Don't mask other IntegrityErrors as "invoice number" errors.
        year_int = _normalize_year(bill_date.year)
        yy = year_int % 100
        base_suffix = None
        bill = None

        for _ in range(50):
            if base_suffix is None:
                # Compute current max once; then increment locally on each retry.
                prefixes_to_consider = [
                    f"INV-{yy:02d}-",
                    f"inv-{yy:02d}-",
                    # Also consider any existing 4-digit-year invoices for continuity.
                    f"INV-{year_int}-",
                    f"inv-{year_int}-",
                ]
                base_suffix = 0
                for prefix in prefixes_to_consider:
                    base_suffix = max(base_suffix, _max_suffix_for_prefix(prefix))
            else:
                base_suffix += 1

            invoice_number = f"INV-{yy:02d}-{(base_suffix + 1):04d}"

            bill = Bill(
                bill_number=invoice_number,
                customer_id=data['customer_id'],
                service_id=data['service_id'],
                quantity=quantity,
                unit_price=unit_price,
                total=total,
                date=bill_date,
                is_paid=data.get('is_paid', False)
            )

            try:
                db.session.add(bill)
                db.session.commit()
                break
            except IntegrityError as e:
                db.session.rollback()
                message = str(getattr(e, 'orig', e))
                # Only retry if it's the bill_number unique constraint.
                if 'UNIQUE constraint failed' in message and 'bills.bill_number' in message:
                    bill = None
                    continue
                return jsonify({
                    'success': False,
                    'message': message
                }), 500

        if bill is None:
            return jsonify({
                'success': False,
                'message': 'Failed to generate a unique invoice number'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Bill created successfully',
            'data': bill.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Update bill
@bill_bp.route('/<int:id>', methods=['PUT'])
def update_bill(id):
    try:
        bill = Bill.query.filter_by(id=id, is_deleted=False).first()
        if not bill:
            return jsonify({
                'success': False,
                'message': 'Bill not found'
            }), 404
        
        data = request.get_json()
        
        # Update customer if provided
        if data.get('customer_id'):
            customer = Customer.query.filter_by(id=data['customer_id'], is_deleted=False).first()
            if not customer:
                return jsonify({
                    'success': False,
                    'message': 'Customer not found'
                }), 404
            bill.customer_id = data['customer_id']
        
        # Update service if provided
        if data.get('service_id'):
            service = Service.query.filter_by(id=data['service_id'], is_deleted=False).first()
            if not service:
                return jsonify({
                    'success': False,
                    'message': 'Service not found'
                }), 404
            bill.service_id = data['service_id']
        
        # Update other fields
        if data.get('quantity'):
            bill.quantity = int(data['quantity'])
        if data.get('unit_price'):
            bill.unit_price = float(data['unit_price'])
        if data.get('date'):
            bill.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'is_paid' in data:
            bill.is_paid = data['is_paid']
        
        # Recalculate total
        bill.total = bill.quantity * bill.unit_price
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Bill updated successfully',
            'data': bill.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Toggle paid status
@bill_bp.route('/<int:id>/toggle-paid', methods=['PATCH'])
def toggle_paid_status(id):
    try:
        bill = Bill.query.filter_by(id=id, is_deleted=False).first()
        if not bill:
            return jsonify({
                'success': False,
                'message': 'Bill not found'
            }), 404
        
        bill.is_paid = not bill.is_paid
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Bill marked as {"paid" if bill.is_paid else "unpaid"}',
            'data': bill.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Soft delete bill
@bill_bp.route('/<int:id>', methods=['DELETE'])
def delete_bill(id):
    try:
        bill = Bill.query.filter_by(id=id, is_deleted=False).first()
        if not bill:
            return jsonify({
                'success': False,
                'message': 'Bill not found'
            }), 404
        
        # Soft delete
        bill.is_deleted = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Bill deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
