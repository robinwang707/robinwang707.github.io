from flask import Blueprint, request, jsonify, session
from src.models.order import db, Order
import json
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from functools import wraps

order_bp = Blueprint('order', __name__)

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

def send_order_email(order):
    """發送訂單通知郵件到Gmail"""
    try:
        # 從環境變數取得Gmail設定
        gmail_user = os.environ.get('GMAIL_USER', 'robinwang707@gmail.com')
        gmail_password = os.environ.get("GMAIL_APP_PASSWORD", "fgnv oucv gngs mfct")
        # 準備郵件內容
        subject = f'【聚寶風水網】新訂單通知 - {order.order_number}'
        
        # 解析商品列表
        items_list = json.loads(order.items) if order.items else []
        items_html = ''
        for item in items_list:
            items_html += f'''
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">{item.get('name', '')}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{item.get('quantity', 0)}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">NT$ {item.get('price', 0):,}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">NT$ {item.get('price', 0) * item.get('quantity', 0):,}</td>
            </tr>
            '''
        
        payment_method_text = '郵局匯款' if order.payment_method == 'postal' else '貨到付款'
        
        html_content = f'''
        <html>
        <head>
            <style>
                body {{ font-family: "Microsoft JhengHei", Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; }}
                .info-section {{ margin: 20px 0; }}
                .info-table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
                .info-table th {{ background-color: #b91c1c; color: white; padding: 12px; text-align: left; }}
                .info-table td {{ padding: 12px; border: 1px solid #ddd; }}
                .total-row {{ background-color: #fef2f2; font-weight: bold; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; background-color: #f9fafb; border-radius: 0 0 10px 10px; }}
                .highlight {{ color: #b91c1c; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">🏮 聚寶風水網</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">新訂單通知</p>
                </div>
                <div class="content">
                    <div class="info-section">
                        <h2 style="color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 10px;">訂單資訊</h2>
                        <p><strong>訂單編號:</strong> <span class="highlight">{order.order_number}</span></p>
                        <p><strong>訂單時間:</strong> {order.created_at.strftime('%Y年%m月%d日 %H:%M:%S')}</p>
                        <p><strong>訂單狀態:</strong> 待處理</p>
                    </div>
                    
                    <div class="info-section">
                        <h3 style="color: #b91c1c;">客戶資訊</h3>
                        <table class="info-table">
                            <tr>
                                <th style="width: 120px;">姓名</th>
                                <td>{order.name}</td>
                            </tr>
                            <tr>
                                <th>聯絡電話</th>
                                <td>{order.phone}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{order.email}</td>
                            </tr>
                            <tr>
                                <th>收件地址</th>
                                <td>{order.address}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="info-section">
                        <h3 style="color: #b91c1c;">訂購項目</h3>
                        <table class="info-table">
                            <tr>
                                <th>商品名稱</th>
                                <th style="text-align: center; width: 80px;">數量</th>
                                <th style="text-align: right; width: 120px;">單價</th>
                                <th style="text-align: right; width: 120px;">小計</th>
                            </tr>
                            {items_html}
                            <tr class="total-row">
                                <td colspan="3" style="text-align: right; padding: 15px;">訂單總金額:</td>
                                <td style="text-align: right; color: #b91c1c; font-size: 18px; padding: 15px;">NT$ {order.total_amount:,}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="info-section">
                        <h3 style="color: #b91c1c;">付款資訊</h3>
                        <p><strong>付款方式:</strong> {payment_method_text}</p>
                        {f'<div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #b91c1c; margin-top: 10px;"><p style="margin: 0;"><strong>郵局匯款資訊:</strong></p><p style="margin: 5px 0 0 0;">代號: 700<br>帳號: 0011263-0136104<br>戶名: 陳華玉<br>郵局: 基隆大武崙局</p></div>' if order.payment_method == 'postal' else ''}
                    </div>
                    
                    {f'<div class="info-section"><h3 style="color: #b91c1c;">服務類型</h3><p>{order.service_type}</p></div>' if order.service_type else ''}
                    
                    {f'<div class="info-section"><h3 style="color: #b91c1c;">客戶備註</h3><div style="background-color: #f9fafb; padding: 15px; border-radius: 5px;"><p style="margin: 0;">{order.message}</p></div></div>' if order.message else ''}
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 5px; text-align: center;">
                        <p style="margin: 0; color: #b91c1c; font-weight: bold;">請盡快處理此訂單</p>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">您可以登入後台管理系統查看完整訂單資訊</p>
                    </div>
                </div>
                <div class="footer">
                    <p style="margin: 0;">此為系統自動發送的郵件，請勿直接回覆</p>
                    <p style="margin: 10px 0 0 0;">聚寶風水網 © 2024 | 陳威君老師 | 電話: 0978-202-192</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        # 建立郵件
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f'聚寶風水網 <{gmail_user}>'
        msg['To'] = gmail_user
        
        # 附加HTML內容
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # 如果有設定Gmail密碼,則發送郵件
        if gmail_password:
            try:
                smtp_server = smtplib.SMTP('smtp.gmail.com', 587)
                smtp_server.starttls()
                smtp_server.login(gmail_user, gmail_password)
                smtp_server.send_message(msg)
                smtp_server.quit()
                print(f"✅ 訂單郵件已成功發送到: {gmail_user}")
                print(f"   訂單編號: {order.order_number}")
                return True
            except Exception as e:
                print(f"❌ 發送郵件失敗: {str(e)}")
                print(f"   請檢查Gmail設定,詳見 GMAIL_SETUP.md")
                return False
        else:
            print(f"⚠️  Gmail密碼未設定,無法發送郵件")
            print(f"   訂單已建立: {order.order_number}")
            print(f"   請設定 GMAIL_APP_PASSWORD 環境變數以啟用郵件通知")
            print(f"   詳細說明請參考: GMAIL_SETUP.md")
            return False
            
    except Exception as e:
        print(f"❌ 郵件處理錯誤: {str(e)}")
        return False

@order_bp.route('/orders', methods=['POST'])
def create_order():
    """建立新訂單"""
    try:
        data = request.get_json()
        
        # 生成訂單編號
        order_number = f"FS{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # 建立訂單
        order = Order(
            order_number=order_number,
            name=data.get('name'),
            phone=data.get('phone'),
            email=data.get('email'),
            address=data.get('address'),
            payment_method=data.get('paymentMethod', 'postal'),
            service_type=data.get('serviceType', ''),
            items=json.dumps(data.get('cart', []), ensure_ascii=False),
            total_amount=data.get('totalAmount', 0),
            message=data.get('message', ''),
            status='pending'
        )
        
        db.session.add(order)
        db.session.commit()
        
        # 發送郵件通知
        send_order_email(order)
        
        return jsonify({
            'success': True,
            'message': '訂單已成功送出',
            'order_number': order_number,
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"建立訂單錯誤: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'訂單建立失敗: {str(e)}'
        }), 500

@order_bp.route('/orders', methods=['GET'])
@login_required
def get_orders():
    """取得所有訂單（後台管理用）"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', None)
        
        query = Order.query
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'success': True,
            'orders': [order.to_dict() for order in orders.items],
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'取得訂單失敗: {str(e)}'
        }), 500

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """取得單一訂單詳情"""
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify({
            'success': True,
            'order': order.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'取得訂單失敗: {str(e)}'
        }), 404

@order_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@login_required
def update_order_status(order_id):
    """更新訂單狀態"""
    try:
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        new_status = data.get('status')
        if new_status in ['pending', 'processing', 'completed', 'cancelled']:
            order.status = new_status
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': '訂單狀態已更新',
                'order': order.to_dict()
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': '無效的訂單狀態'
            }), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'更新訂單失敗: {str(e)}'
        }), 500

@order_bp.route('/orders/<int:order_id>', methods=['DELETE'])
@login_required
def delete_order(order_id):
    """刪除訂單"""
    try:
        order = Order.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '訂單已刪除'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'刪除訂單失敗: {str(e)}'
        }), 500

@order_bp.route('/orders/stats', methods=['GET'])
@login_required
def get_order_stats():
    """取得訂單統計資料"""
    try:
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status='pending').count()
        processing_orders = Order.query.filter_by(status='processing').count()
        completed_orders = Order.query.filter_by(status='completed').count()
        cancelled_orders = Order.query.filter_by(status='cancelled').count()
        
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).filter_by(status='completed').scalar() or 0
        
        return jsonify({
            'success': True,
            'stats': {
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'processing_orders': processing_orders,
                'completed_orders': completed_orders,
                'cancelled_orders': cancelled_orders,
                'total_revenue': total_revenue
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'取得統計資料失敗: {str(e)}'
        }), 500

