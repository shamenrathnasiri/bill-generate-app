from flask import Blueprint, request, jsonify
from models import db, Service

service_bp = Blueprint('services', __name__)

# Get all services (excluding soft deleted)
@service_bp.route('', methods=['GET'])
def get_services():
    try:
        services = Service.query.filter_by(is_deleted=False).all()
        return jsonify({
            'success': True,
            'data': [service.to_dict() for service in services]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Get single service
@service_bp.route('/<int:id>', methods=['GET'])
def get_service(id):
    try:
        service = Service.query.filter_by(id=id, is_deleted=False).first()
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        return jsonify({
            'success': True,
            'data': service.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Create service
@service_bp.route('', methods=['POST'])
def create_service():
    try:
        data = request.get_json()
        
        if not data.get('name') or data.get('price') is None:
            return jsonify({
                'success': False,
                'message': 'Name and price are required'
            }), 400
        
        service = Service(
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price'])
        )
        
        db.session.add(service)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service created successfully',
            'data': service.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Update service
@service_bp.route('/<int:id>', methods=['PUT'])
def update_service(id):
    try:
        service = Service.query.filter_by(id=id, is_deleted=False).first()
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        
        data = request.get_json()
        
        service.name = data.get('name', service.name)
        service.description = data.get('description', service.description)
        if data.get('price') is not None:
            service.price = float(data['price'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service updated successfully',
            'data': service.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Soft delete service
@service_bp.route('/<int:id>', methods=['DELETE'])
def delete_service(id):
    try:
        service = Service.query.filter_by(id=id, is_deleted=False).first()
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        
        # Soft delete
        service.is_deleted = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
