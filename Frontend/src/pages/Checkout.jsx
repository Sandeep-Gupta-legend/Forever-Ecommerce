import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Checkout = () => {
    const { cart, currency, getCartAmount, addOrder } = useContext(ShopContext);
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        phone: ''
    });

    // Calculate total amount
    const cartAmount = typeof getCartAmount === 'function' 
        ? getCartAmount() 
        : getCartAmount || 0;
    const totalAmount = parseFloat(cartAmount) || 0;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Validate form fields
        const requiredFields = ['name', 'email', 'address', 'city', 'pincode'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());
        
        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            // Create order data
            const orderData = {
                shippingDetails: formData,
                paymentMethod: paymentMethod,
                totalAmount: totalAmount,
            };

            if (paymentMethod === 'razorpay') {
                // Razorpay Integration
                const options = {
                    key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay Key
                    amount: totalAmount * 100, // Amount in paise
                    currency: 'INR',
                    name: 'Your Store Name',
                    description: 'Payment for your order',
                    image: 'https://your-store.com/logo.png',
                    handler: async (response) => {
                        console.log('Razorpay Response:', response);
                        
                        // Add order to context
                        const newOrder = addOrder(orderData);
                        
                        alert('Payment successful! Your order has been placed.');
                        navigate('/orders');
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone || '1234567890',
                    },
                    theme: { color: '#F37254' },
                };
                
                if (!window.Razorpay) {
                    alert('Razorpay SDK not loaded');
                    return;
                }
                
                const rzp = new window.Razorpay(options);
                rzp.open();
                
            } else if (paymentMethod === 'stripe') {
                // Stripe Integration
                if (!window.Stripe) {
                    alert('Stripe SDK not loaded');
                    return;
                }
                
                const stripe = window.Stripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your Stripe Key
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements: null,
                    confirmParams: {
                        return_url: `${window.location.origin}/orders`,
                    },
                });

                if (error) {
                    alert('Payment failed: ' + error.message);
                } else {
                    // Add order to context
                    const newOrder = addOrder(orderData);
                    
                    alert('Payment successful! Your order has been placed.');
                    navigate('/orders');
                }
            } else if (paymentMethod === 'cod') {
                // Cash on Delivery - Directly add order
                const newOrder = addOrder(orderData);
                
                alert('Order placed successfully! You will pay cash on delivery.');
                navigate('/orders');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* User Form */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Shipping Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address *"
                        value={formData.address}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City *"
                        value={formData.city}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode *"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                </div>
            </div>

            {/* Payment Methods (Images) */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Payment Method *</h2>
                <div className="flex flex-wrap gap-4">
                    {/* Razorpay */}
                    <div
                        className={`cursor-pointer p-2 border-2 rounded-lg transition-all ${
                            paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('razorpay')}
                    >
                        <img
                            src={assets.razorpay_logo || "https://razorpay.com/assets/razorpay-logo.svg"} 
                            alt="Razorpay"
                            className="w-24 h-12 object-contain"
                        />
                    </div>

                    {/* Stripe */}
                    <div
                        className={`cursor-pointer p-2 border-2 rounded-lg transition-all ${
                            paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('stripe')}
                    >
                        <img
                            src={assets.stripe_logo || "https://stripe.com/img/v3/home/twitter.png"} 
                            alt="Stripe"
                            className="w-24 h-12 object-contain"
                        />
                    </div>

                    {/* COD */}
                    <div
                        className={`cursor-pointer p-2 border-2 rounded-lg transition-all ${
                            paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('cod')}
                    >
                        <div className="w-24 h-12 flex items-center justify-center">
                            <div className="text-center">
                                <div className="font-bold text-gray-700">COD</div>
                                <div className="text-xs text-gray-500">Cash on Delivery</div>
                            </div>
                        </div>
                    </div>
                </div>
                {!paymentMethod && (
                    <p className="text-red-500 text-sm mt-2">Please select a payment method</p>
                )}
            </div>

            {/* Order Summary */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">{currency}{totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Shipping</p>
                        <p className="font-medium">{currency}0.00</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Tax</p>
                        <p className="font-medium">{currency}0.00</p>
                    </div>
                    <hr className="my-3 border-gray-300" />
                    <div className="flex justify-between text-lg font-bold">
                        <p>Total</p>
                        <p>{currency}{totalAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
            >
                Place Order
            </button>
        </div>
    );
};

export default Checkout;