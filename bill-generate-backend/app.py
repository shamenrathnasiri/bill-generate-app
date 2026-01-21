from flask import Flask
from flask_cors import CORS
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    from api.customer_api import customer_bp
    from api.service_api import service_bp
    from api.bill_api import bill_bp
    
    app.register_blueprint(customer_bp, url_prefix='/api/customers')
    app.register_blueprint(service_bp, url_prefix='/api/services')
    app.register_blueprint(bill_bp, url_prefix='/api/bills')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
