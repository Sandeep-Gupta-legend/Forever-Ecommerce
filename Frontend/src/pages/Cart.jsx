import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
    const { 
        products, 
        currency, 
        cartItems, 
        getCartAmount, 
        getProductById, 
        removeFromCart,
        updateCartQuantity 
    } = useContext(ShopContext)
    
    const navigate = useNavigate()
    const [cartData, setCartData] = useState([])

    useEffect(() => {
        const tempData = []
        
        for (const itemId in cartItems) {
            const quantity = cartItems[itemId]
            if (quantity > 0) {
                tempData.push({
                    id: itemId,
                    quantity: quantity
                })
            }
        }
        setCartData(tempData)
    }, [cartItems])

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId)
        } else {
            updateCartQuantity(itemId, newQuantity)
        }
    }

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId)
    }

    if (cartData.length === 0) {
        return (
            <div className='border-t pt-14 text-center py-16'>
                <div className='text-2xl mb-3'>
                    <Title text1={'YOUR'} text2={'CART'}/>
                </div>
                <p className='text-gray-500 mb-6'>Your cart is empty</p>
                <button 
                    onClick={() => navigate('/collection')}
                    className='bg-black text-white text-sm px-8 py-3 hover:bg-gray-800 transition'
                >
                    SHOP NOW
                </button>
            </div>
        )
    }

    return (
      <div className='border-t pt-14 max-w-7xl mx-auto px-4'>
        <div className='text-2xl mb-8'>
            <Title text1={'YOUR'} text2={'CART'}/>
        </div>
        
        <div>
            {cartData.map((item, index) => {
                const productData = getProductById(item.id)
                
                if (!productData) {
                    return null
                }
                
                return (
                    <div key={index} className='py-6 border-b flex flex-col sm:flex-row items-center justify-between gap-6'>
                      <div className='flex items-center gap-6 flex-1'>
                        {(() => {
                            const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e5e7eb' width='80' height='80'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                            const imageSrc = productData.image || (Array.isArray(productData.images) && productData.images.length > 0 ? productData.images[0] : null) || placeholderImage
                            return (
                                <img 
                                    className='w-20 h-20 object-cover rounded' 
                                    src={imageSrc} 
                                    alt={productData.name}
                                    onError={(e) => {
                                        e.target.src = placeholderImage
                                        e.target.onerror = null
                                    }}
                                />
                            )
                        })()}
                         <div>
                            <p className='font-medium text-gray-800'>{productData.name}</p>
                            <div className='flex items-center gap-5 mt-2'>
                                <p className='font-semibold'>{currency}{productData.price}</p>
                            </div>
                         </div>
                      </div>
                      
                      <div className='flex items-center gap-6'>
                        <div className='flex items-center border rounded'>
                            <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className='px-3 py-1 hover:bg-gray-100'
                            >
                                -
                            </button>
                            <input 
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                type="number" 
                                min="1" 
                                className='w-16 text-center py-1 border-x'
                            />
                            <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className='px-3 py-1 hover:bg-gray-100'
                            >
                                +
                            </button>
                        </div>
                        
                        <p className='font-semibold w-20 text-right'>
                            {currency}{productData.price * item.quantity}
                        </p>
                        
                        <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <img 
                                src={assets.bin_icon} 
                                className='w-5 h-5' 
                                alt="Remove" 
                            />
                        </button>
                      </div>
                    </div>
                )
            })}
        </div>
        
        <div className='flex justify-end my-10'>
            <div className='w-full sm:w-[450px]'>
                <CartTotal />
                <div className='w-full text-end mt-8'>
                    <button 
                        onClick={() => navigate('/checkout')} 
                        className='bg-black text-white text-sm px-8 py-3 hover:bg-gray-800 transition'
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </div>
      </div>
    )
}

export default Cart