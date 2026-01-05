from flask import Blueprint, request, jsonify, session
from src.models.admin import db, Admin
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def login_required(f):
    """登入驗證裝飾器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({
                'success': False,
                'message': '請先登入'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/login', methods=['POST'])
def login():
    """管理員登入"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and admin.check_password(password) and admin.is_active:
            session['admin_id'] = admin.id
            session['admin_username'] = admin.username
            
            return jsonify({
                'success': True,
                'message': '登入成功',
                'admin': admin.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': '帳號或密碼錯誤'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'登入失敗: {str(e)}'
        }), 500

@admin_bp.route('/admin/logout', methods=['POST'])
@login_required
def logout():
    """管理員登出"""
    session.pop('admin_id', None)
    session.pop('admin_username', None)
    
    return jsonify({
        'success': True,
        'message': '已登出'
    }), 200

@admin_bp.route('/admin/check', methods=['GET'])
def check_login():
    """檢查登入狀態"""
    if 'admin_id' in session:
        admin = Admin.query.get(session['admin_id'])
        if admin:
            return jsonify({
                'success': True,
                'logged_in': True,
                'admin': admin.to_dict()
            }), 200
    
    return jsonify({
        'success': True,
        'logged_in': False
    }), 200

@admin_bp.route('/admin/create', methods=['POST'])
def create_admin():
    """建立管理員帳號（僅用於初始化）"""
    try:
        # 檢查是否已有管理員
        if Admin.query.count() > 0:
            return jsonify({
                'success': False,
                'message': '已存在管理員帳號'
            }), 400
        
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': '請提供帳號和密碼'
            }), 400
        
        admin = Admin(username=username, email=email)
        admin.set_password(password)
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '管理員帳號建立成功',
            'admin': admin.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'建立管理員失敗: {str(e)}'
        }), 500

