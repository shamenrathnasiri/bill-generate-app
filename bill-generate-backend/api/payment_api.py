from flask import Blueprint, request, jsonify
from models import db, Payment
from datetime import datetime
from sqlalchemy.exc import IntegrityError

payment_bp = Blueprint('payments', __name__)


def _normalize_year(year: int) -> int:
    year_int = int(year)
    if 0 <= year_int < 100:
        year_int = 2000 + year_int
    return year_int


def _max_payment_suffix(prefix: str) -> int:
    """Find the highest numeric suffix for payment_number values matching prefix."""
    last = (
        Payment.query
        .filter(Payment.payment_number.like(f"{prefix}%"))
        .order_by(Payment.payment_number.desc())
        .first()
    )
    if not last or not last.payment_number:
        return 0
    try:
        return int(last.payment_number.split("-")[-1])
    except (ValueError, IndexError):
        return 0


def next_payment_number(year: int) -> str:
    """Generate next payment number as PAY-YY-0001."""
    year_int = _normalize_year(year)
    yy = year_int % 100
    prefix = f"PAY-{yy:02d}-"

    suffixes = [
        prefix,
        f"pay-{yy:02d}-",
        f"PAY-{year_int}-",
        f"pay-{year_int}-",
    ]
    max_suffix = 0
    for p in suffixes:
        max_suffix = max(max_suffix, _max_payment_suffix(p))

    return f"{prefix}{(max_suffix + 1):04d}"


# Get all payments (excluding soft deleted)
@payment_bp.route('', methods=['GET'])
def get_payments():
    try:
        payments = Payment.query.filter_by(is_deleted=False).order_by(Payment.date.desc()).all()
        return jsonify({
            'success': True,
            'data': [p.to_dict() for p in payments]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# Get single payment
@payment_bp.route('/<int:id>', methods=['GET'])
def get_payment(id):
    try:
        payment = Payment.query.filter_by(id=id, is_deleted=False).first()
        if not payment:
            return jsonify({
                'success': False,
                'message': 'Payment not found'
            }), 404
        return jsonify({
            'success': True,
            'data': payment.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# Create payment
@payment_bp.route('', methods=['POST'])
def create_payment():
    try:
        data = request.get_json() or {}

        # Validate required fields
        if not data.get('name'):
            return jsonify({
                'success': False,
                'message': 'Name is required'
            }), 400

        if data.get('amount') is None or data.get('amount') == '':
            return jsonify({
                'success': False,
                'message': 'Amount is required'
            }), 400

        try:
            amount = float(data['amount'])
        except (ValueError, TypeError):
            return jsonify({
                'success': False,
                'message': 'Amount must be a valid number'
            }), 400

        if amount <= 0:
            return jsonify({
                'success': False,
                'message': 'Amount must be greater than 0'
            }), 400

        # Parse date
        payment_date = datetime.strptime(
            data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d'
        ).date()

        # Generate payment number with retry for unique constraint
        year_int = _normalize_year(payment_date.year)
        yy = year_int % 100
        base_suffix = None
        payment = None

        for _ in range(50):
            if base_suffix is None:
                prefixes = [
                    f"PAY-{yy:02d}-",
                    f"pay-{yy:02d}-",
                    f"PAY-{year_int}-",
                    f"pay-{year_int}-",
                ]
                base_suffix = 0
                for prefix in prefixes:
                    base_suffix = max(base_suffix, _max_payment_suffix(prefix))
            else:
                base_suffix += 1

            payment_number = f"PAY-{yy:02d}-{(base_suffix + 1):04d}"

            payment = Payment(
                payment_number=payment_number,
                name=data['name'].strip(),
                amount=amount,
                description=data.get('description', '').strip() if data.get('description') else None,
                date=payment_date,
                payment_method=data.get('payment_method', 'Cash').strip(),
                reference=data.get('reference', '').strip() if data.get('reference') else None,
                notes=data.get('notes', '').strip() if data.get('notes') else None,
            )

            try:
                db.session.add(payment)
                db.session.commit()
                break
            except IntegrityError as e:
                db.session.rollback()
                message = str(getattr(e, 'orig', e))
                if 'UNIQUE constraint failed' in message and 'payments.payment_number' in message:
                    payment = None
                    continue
                return jsonify({
                    'success': False,
                    'message': message
                }), 500

        if payment is None:
            return jsonify({
                'success': False,
                'message': 'Failed to generate a unique payment number'
            }), 500

        return jsonify({
            'success': True,
            'message': 'Payment created successfully',
            'data': payment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# Update payment
@payment_bp.route('/<int:id>', methods=['PUT'])
def update_payment(id):
    try:
        payment = Payment.query.filter_by(id=id, is_deleted=False).first()
        if not payment:
            return jsonify({
                'success': False,
                'message': 'Payment not found'
            }), 404

        data = request.get_json() or {}

        if data.get('name'):
            payment.name = data['name'].strip()

        if data.get('amount') is not None and data.get('amount') != '':
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    return jsonify({
                        'success': False,
                        'message': 'Amount must be greater than 0'
                    }), 400
                payment.amount = amount
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'message': 'Amount must be a valid number'
                }), 400

        if 'description' in data:
            payment.description = data['description'].strip() if data['description'] else None

        if data.get('date'):
            payment.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

        if data.get('payment_method'):
            payment.payment_method = data['payment_method'].strip()

        if 'reference' in data:
            payment.reference = data['reference'].strip() if data['reference'] else None

        if 'notes' in data:
            payment.notes = data['notes'].strip() if data['notes'] else None

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Payment updated successfully',
            'data': payment.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# Soft delete payment
@payment_bp.route('/<int:id>', methods=['DELETE'])
def delete_payment(id):
    try:
        payment = Payment.query.filter_by(id=id, is_deleted=False).first()
        if not payment:
            return jsonify({
                'success': False,
                'message': 'Payment not found'
            }), 404

        payment.is_deleted = True
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Payment deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
