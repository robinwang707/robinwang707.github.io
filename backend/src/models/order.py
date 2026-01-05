from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)  # postal or cod
    service_type = db.Column(db.String(100))
    items = db.Column(db.Text)  # JSON string of cart items
    total_amount = db.Column(db.Integer, default=0)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, processing, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'payment_method': self.payment_method,
            'service_type': self.service_type,
            'items': json.loads(self.items) if self.items else [],
            'total_amount': self.total_amount,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None
        }

