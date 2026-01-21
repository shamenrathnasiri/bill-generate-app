from flask import Blueprint, request, jsonify
from models import db, Customer

customer_bp = Blueprint('customers', __name__)

# Get all customers (excluding soft deleted)
@customer_bp.route('', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.filter_by(is_deleted=False).all()
        return jsonify({
            'success': True,
            'data': [customer.to_dict() for customer in customers]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Get single customer
@customer_bp.route('/<int:id>', methods=['GET'])
def get_customer(id):
    try:
        customer = Customer.query.filter_by(id=id, is_deleted=False).first()
        if not customer:
            return jsonify({
                'success': False,
                'message': 'Customer not found'
            }), 404
        return jsonify({
            'success': True,
            'data': customer.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Create customer
@customer_bp.route('', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('email') or not data.get('phone'):
            return jsonify({
                'success': False,
                'message': 'Name, email, and phone are required'
            }), 400
        
        customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            address=data.get('address', '')
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer created successfully',
            'data': customer.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Update customer
@customer_bp.route('/<int:id>', methods=['PUT'])
def update_customer(id):
    try:
        customer = Customer.query.filter_by(id=id, is_deleted=False).first()
        if not customer:
            return jsonify({
                'success': False,
                'message': 'Customer not found'
            }), 404
        
        data = request.get_json()
        
        customer.name = data.get('name', customer.name)
        customer.email = data.get('email', customer.email)
        customer.phone = data.get('phone', customer.phone)
        customer.address = data.get('address', customer.address)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer updated successfully',
            'data': customer.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Soft delete customer
@customer_bp.route('/<int:id>', methods=['DELETE'])
def delete_customer(id):
    try:
        customer = Customer.query.filter_by(id=id, is_deleted=False).first()
        if not customer:
            return jsonify({
                'success': False,
                'message': 'Customer not found'
            }), 404
        
        # Soft delete
        customer.is_deleted = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
