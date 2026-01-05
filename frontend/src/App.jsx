import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Phone, Mail, ShoppingCart, LogOut, Package, TrendingUp, Clock, CheckCircle, XCircle, Plus, Minus } from 'lucide-react'
import './App.css'

// 導入圖片
import amulet from './assets/948093_0.jpg'
import buddha from './assets/948098_0.jpg'
import beads from './assets/948097_0.jpg'
import coins from './assets/948094_0.jpg'
import greatWall from './assets/948100_0.jpg'
import mirror from './assets/948096_0.jpg'
import businessCard from './assets/948101.jpg'
import wealthGod from './assets/948099_0.jpg'

// 導入新生成的圖片
import logo from './assets/logo.png'
import heroBg from './assets/hero-bg.png'
import serviceHome from './assets/service-home.jpg'
import servicePalmistry from './assets/service-palmistry.jpg'
import serviceFace from './assets/service-face.jpg'
import serviceBazi from './assets/service-bazi.jpg'
import serviceWealth from './assets/service-wealth.jpg'
import serviceCareerNew from './assets/service-career-new.jpg'
import serviceLove from './assets/service-love.jpg'
import serviceBaby from './assets/service-baby.jpg'
import serviceDestiny from './assets/service-destiny.jpg'

const API_BASE = '/api'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cart, setCart] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminData, setAdminData] = useState(null)

  // 風水物品資料
  const products = [
    { id: 1, name: '開運護身符', price: 2360, image: amulet, description: '精緻開運護身符,招財納福,保平安' },
    { id: 2, name: '招財彌勒佛', price: '限量(預訂中)', image: buddha, description: '手工雕刻招財彌勒佛,笑口常開,財源廣進' },
    { id: 3, name: '黑曜石佛珠', price: 880, image: beads, description: '天然黑曜石108顆佛珠,辟邪化煞,增強氣場' },
    { id: 4, name: '六帝錢吊飾', price: 680, image: coins, description: '正宗六帝錢吊飾,招財擋煞,鎮宅保平安' },
    { id: 5, name: '萬里長城擺件', price: 4880, image: greatWall, description: '精美萬里長城風水擺件,事業穩固,步步高升' },
    { id: 6, name: '八卦寶鏡', price: 1580, image: mirror, description: '開光八卦寶鏡,化解煞氣,鎮宅辟邪' },
    { id: 7, name: '財神爺擺件', price: 5280, image: wealthGod, description: '精雕財神爺擺件,招財進寶,生意興隆' }
  ]

  // 命理服務資料（更新圖片）
  const services = [
    { id: 1, name: '居家風水', image: serviceHome, description: '專業居家風水勘察,調整家居氣場,提升運勢', price: '面議' },
    { id: 2, name: '手相', image: servicePalmistry, description: '手相分析,了解命運軌跡,掌握人生方向', price: '1600元起' },
    { id: 3, name: '面相', image: serviceFace, description: '面相解析,洞察性格特質,預知未來運勢', price: '1600元起' },
    { id: 4, name: '生辰八字', image: serviceBazi, description: '八字命理分析,了解命格強弱,趨吉避凶', price: '2000元起' },
    { id: 5, name: '財運', image: serviceWealth, description: '財運分析與開運建議,助您財源廣進', price: '1800元起' },
    { id: 6, name: '命運', image: serviceDestiny, description: '整體命運分析,掌握人生大運', price: '2500元起' },
    { id: 7, name: '事業名片', image: serviceCareerNew, description: '事業運勢分析,名片風水設計', price: '2000元起' },
    { id: 8, name: '愛情', image: serviceLove, description: '姻緣分析,桃花運提升,感情問題諮詢', price: '1800元起' },
    { id: 9, name: '生子', image: serviceBaby, description: '求子問卜,生育時機分析', price: '2000元起' }
  ]

  // 檢查登入狀態
  useEffect(() => {
    checkAdminLogin()
  }, [])

  const checkAdminLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/check`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.logged_in) {
        setIsAdmin(true)
        setAdminData(data.admin)
      }
    } catch (error) {
      console.error('檢查登入狀態失敗:', error)
    }
  }

  // 加入購物車（支援數量）
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  // 更新購物車數量
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  // 移除購物車項目
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  // 計算總金額
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // 導航欄
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-red-800 to-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <img src={logo} alt="聚寶風水網" className="h-12 w-12 rounded-full" />
            <h1 className="text-3xl font-bold">
              聚寶風水網
            </h1>
          </div>
          <div className="flex gap-6 items-center">
            <button onClick={() => setCurrentPage('home')} className="hover:text-yellow-300 transition-colors">首頁</button>
            <button onClick={() => setCurrentPage('products')} className="hover:text-yellow-300 transition-colors">風水物品</button>
            <button onClick={() => setCurrentPage('services')} className="hover:text-yellow-300 transition-colors">命理服務</button>
            <button onClick={() => setCurrentPage('contact')} className="hover:text-yellow-300 transition-colors">聯絡我們</button>
            <button onClick={() => setCurrentPage('order')} className="hover:text-yellow-300 transition-colors flex items-center gap-2">
              <ShoppingCart size={20} />
              訂購 {cart.length > 0 && `(${cart.reduce((sum, item) => sum + item.quantity, 0)})`}
            </button>
            {isAdmin ? (
              <>
                <button onClick={() => setCurrentPage('admin')} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold transition-colors">
                  後台管理
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                  <LogOut size={20} />
                  登出
                </button>
              </>
            ) : (
              <button onClick={() => setCurrentPage('login')} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold transition-colors">
                高級會員登入
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

  // 首頁（更新背景圖片）
  const HomePage = () => (
    <div className="min-h-screen">
      <div 
        className="text-white py-20 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <img src={logo} alt="聚寶風水網" className="h-32 w-32 mx-auto mb-6 rounded-full shadow-2xl" />
          <h2 className="text-5xl font-bold mb-6">專業風水命理服務</h2>
          <p className="text-2xl mb-8">陳威君老師 - 二十年經驗,值得信賴</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setCurrentPage('products')} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              選購風水物品
            </Button>
            <Button onClick={() => setCurrentPage('services')} size="lg" variant="outline" className="bg-white text-red-800 hover:bg-gray-100">
              查看命理服務
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h3 className="text-4xl font-bold text-center mb-12 text-red-800">我們的服務</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {services.slice(0, 3).map(service => (
            <Card key={service.id} className="hover:shadow-xl transition-shadow cursor-pointer overflow-hidden" onClick={() => setCurrentPage('services')}>
              <CardHeader className="p-0">
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-center text-2xl mb-2">{service.name}</CardTitle>
                <p className="text-center text-gray-600">{service.description}</p>
                <p className="text-center text-red-600 font-bold mt-4">{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12 text-red-800">精選風水物品</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-red-600">NT$ {product.price}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>加入訂單</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl font-bold mb-6">聯絡我們</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone size={24} />
                  <span className="text-xl">0978-202-192</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={24} />
                  <span className="text-xl">陳威君老師</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img src={businessCard} alt="名片" className="rounded-lg shadow-2xl max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 風水物品頁面（支援數量選擇）
  const ProductsPage = () => {
    const [quantities, setQuantities] = useState({})

    const handleQuantityChange = (productId, delta) => {
      const currentQty = quantities[productId] || 1
      const newQty = Math.max(1, currentQty + delta)
      setQuantities({ ...quantities, [productId]: newQty })
    }

    const handleAddToCart = (product) => {
      const quantity = quantities[product.id] || 1
      addToCart(product, quantity)
      setQuantities({ ...quantities, [product.id]: 1 })
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-red-800">風水物品</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const qty = quantities[product.id] || 1
            return (
              <Card key={product.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="p-0">
                  <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-red-600">NT$ {product.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">數量:</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-12 text-center font-bold">{qty}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(product)} 
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    加入訂單
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // 命理服務頁面（使用真實圖片）
  const ServicesPage = () => (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-12 text-red-800">文化命理服務</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map(service => (
          <Card key={service.id} className="hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
            <CardHeader className="p-0">
              <img src={service.image} alt={service.name} className="w-full h-56 object-cover" />
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-center text-2xl mb-3">{service.name}</CardTitle>
              <p className="text-center text-gray-700 mb-4">{service.description}</p>
              <p className="text-center text-2xl font-bold text-red-600 mb-4">{service.price}</p>
              <Button 
                onClick={() => setCurrentPage('order')} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                立即預約
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h3 className="text-3xl font-bold mb-6 text-red-800">加入LINE諮詢</h3>
        <img src={businessCard} alt="LINE QR Code" className="mx-auto max-w-md rounded-lg shadow-xl" />
      </div>
    </div>
  )

  // 聯絡我們頁面
  const ContactPage = () => (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-12 text-red-800">聯絡我們</h2>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">聯絡資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="text-red-600 mt-1" size={24} />
                <div>
                  <h4 className="font-bold mb-1">電話</h4>
                  <p className="text-lg">0978-202-192</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-red-600 mt-1" size={24} />
                <div>
                  <h4 className="font-bold mb-1">命理老師</h4>
                  <p className="text-lg">陳威君老師</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">LINE 諮詢</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={businessCard} alt="名片與LINE QR Code" className="w-full rounded-lg shadow-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  // 訂購頁面（支援數量調整）
  const OrderPage = () => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      paymentMethod: 'postal',
      serviceType: '',
      message: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setSubmitting(true)

      try {
        const orderData = {
          ...formData,
          cart: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalAmount: getTotalAmount()
        }

        const response = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        })

        const data = await response.json()

        if (data.success) {
          alert(`訂單已成功送出！\n訂單編號: ${data.order_number}\n\n我們將盡快與您聯繫。`)
          setCart([])
          setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            paymentMethod: 'postal',
            serviceType: '',
            message: ''
          })
          setCurrentPage('home')
        } else {
          alert('訂單送出失敗，請稍後再試。')
        }
      } catch (error) {
        console.error('送出訂單錯誤:', error)
        alert('訂單送出失敗，請稍後再試。')
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-red-800">訂購表單</h2>
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>訂購明細</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">購物車是空的</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-gray-600">NT$ {item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-12 text-center font-bold">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">NT$ {item.price * item.quantity}</p>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          移除
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-right pt-4 border-t-2">
                    <p className="text-2xl font-bold text-red-600">
                      總計: NT$ {getTotalAmount()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>填寫訂購資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 font-bold">姓名 *</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">電話 *</label>
                  <input
                    type="tel"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">地址 *</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-bold">服務類型</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  >
                    <option value="">選擇服務(若需要)</option>
                    {services.map(service => (
                      <option key={service.id} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-bold">付款方式 *</label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="postal"
                        checked={formData.paymentMethod === 'postal'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold">郵局匯款</p>
                        <p className="text-sm text-gray-600 mt-1">
                          代號: 700 | 帳號: 0011263-0136104<br/>
                          戶名: 陳華玉 | 郵局: 基隆大武崙局
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold">貨到付款</p>
                        <p className="text-sm text-gray-600 mt-1">收到商品時付款給物流人員</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-bold">備註</label>
                  <textarea
                    className="w-full border rounded-lg px-4 py-2 h-32"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="其他需求或備註事項"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
                  disabled={submitting || cart.length === 0}
                >
                  {submitting ? '送出中...' : '送出訂單'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 登入頁面（改為高級會員登入）
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
      e.preventDefault()
      setError('')

      try {
        const response = await fetch(`${API_BASE}/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (data.success) {
          setIsAdmin(true)
          setAdminData(data.admin)
          setCurrentPage('admin')
        } else {
          setError(data.message || '登入失敗')
        }
      } catch (error) {
        console.error('登入錯誤:', error)
        setError('登入失敗，請稍後再試')
      }
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">高級會員登入</CardTitle>
              <CardDescription className="text-center">請輸入您的帳號密碼</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block mb-2 font-bold">帳號</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-bold">密碼</label>
                  <input
                    type="password"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  登入
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 登出
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      setIsAdmin(false)
      setAdminData(null)
      setCurrentPage('home')
    } catch (error) {
      console.error('登出錯誤:', error)
    }
  }

  // 後台管理頁面
  const AdminPage = () => {
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetchOrders()
      fetchStats()
    }, [])

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE}/orders`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error('取得訂單失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/orders/stats`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('取得統計資料失敗:', error)
      }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        })

        const data = await response.json()
        if (data.success) {
          fetchOrders()
          fetchStats()
        }
      } catch (error) {
        console.error('更新訂單狀態失敗:', error)
      }
    }

    const getStatusBadge = (status) => {
      const statusMap = {
        'pending': { text: '待處理', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        'processing': { text: '處理中', color: 'bg-blue-100 text-blue-800', icon: Package },
        'completed': { text: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'cancelled': { text: '已取消', color: 'bg-red-100 text-red-800', icon: XCircle }
      }
      const statusInfo = statusMap[status] || statusMap['pending']
      const Icon = statusInfo.icon
      return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
          <Icon size={16} />
          {statusInfo.text}
        </span>
      )
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-red-800">後台管理</h2>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={20} />
            登出
          </Button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">總訂單數</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total_orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">待處理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.pending_orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">已完成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.completed_orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">總營收</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">NT$ {stats.total_revenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={24} />
              訂單列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">載入中...</p>
            ) : orders.length === 0 ? (
              <p className="text-center py-8 text-gray-500">目前沒有訂單</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">訂單編號: {order.order_number}</h4>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString('zh-TW')}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">客戶資訊</p>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-sm">{order.phone}</p>
                        <p className="text-sm">{order.email}</p>
                        <p className="text-sm">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">訂單資訊</p>
                        <p className="font-bold text-xl text-red-600">NT$ {order.total_amount.toLocaleString()}</p>
                        <p className="text-sm">付款方式: {order.payment_method === 'postal' ? '郵局匯款' : '貨到付款'}</p>
                        {order.service_type && <p className="text-sm">服務類型: {order.service_type}</p>}
                      </div>
                    </div>

                    {order.items && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">訂購項目</p>
                        <div className="bg-gray-50 p-3 rounded">
                          {JSON.parse(order.items).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm py-1">
                              <span>{item.name} x {item.quantity}</span>
                              <span>NT$ {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.message && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">備註</p>
                        <p className="text-sm bg-gray-50 p-3 rounded">{order.message}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                      >
                        <option value="pending">待處理</option>
                        <option value="processing">處理中</option>
                        <option value="completed">已完成</option>
                        <option value="cancelled">已取消</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // 頁尾
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">聚寶風水網 © 2026 版權所有</p>
        <p className="text-gray-400">陳威君老師 | 電話: 0978-202-192</p>
      </div>
    </footer>
  )

  // 渲染當前頁面
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'products':
        return <ProductsPage />
      case 'services':
        return <ServicesPage />
      case 'contact':
        return <ContactPage />
      case 'order':
        return <OrderPage />
      case 'login':
        return <LoginPage />
      case 'admin':
        return isAdmin ? <AdminPage /> : <LoginPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App

