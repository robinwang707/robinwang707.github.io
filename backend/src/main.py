import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.order import db as order_db
from src.models.admin import db as admin_db
from src.routes.order import order_bp
from src.routes.admin import admin_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'fengshui-secret-key-2024-secure'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# 啟用CORS
CORS(app, supports_credentials=True)

# 註冊藍圖
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

# 資料庫設定
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化資料庫（使用同一個db實例）
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)

# 重新定義模型以使用統一的db實例
from datetime import datetime
import json

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    service_type = db.Column(db.String(100))
    items = db.Column(db.Text)
    total_amount = db.Column(db.Integer, default=0)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
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

from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active
        }

# 更新路由文件中的db引用
import src.routes.order as order_module
import src.routes.admin as admin_module
order_module.db = db
order_module.Order = Order
admin_module.db = db
admin_module.Admin = Admin

with app.app_context():
    db.create_all()
    
    # 建立預設管理員帳號（如果不存在）
    if Admin.query.count() == 0:
        default_admin = Admin(username='robinwang707', email='robinwang707@gmail.com')
        default_admin.set_password('@hue600600')
        db.session.add(default_admin)
        db.session.commit()
        print("預設管理員帳號已建立: username=robinwang707, password=@hue600600")
    else:
        # 更新現有管理員帳號
        admin = Admin.query.first()
        if admin:
            admin.username = 'robinwang707'
            admin.email = 'robinwang707@gmail.com'
            admin.set_password('@hue600600')
            db.session.commit()
            print("管理員帳號已更新: username=robinwang707, password=@hue600600")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

