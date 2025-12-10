import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Backend_URL } from '../App';

const Placeorder = () => {
  const [method, setMethod] = useState('cod'); 
  const { navigate, getCartItemsWithDetails, getCartAmount, delivery_fee, clearCart } = useContext(ShopContext);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast.error('Please fill in all fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    const cartItems = getCartItemsWithDetails();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderId = Date.now();
      const totalAmount = getCartAmount() + delivery_fee;

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item._id || item.id,
        productName: item.name,
        productImage: item.image || (item.images && item.images[0]) || '',
        price: item.price,
        quantity: item.quantity,
        size: item.size || 'M',
        total: item.price * item.quantity
      }));

      // Create order payload
      const orderData = {
        orderId: orderId.toString(),
        items: orderItems,
        shippingDetails: formData,
        paymentMethod: method,
        totalAmount: totalAmount
      };

      console.log('Placing order:', orderData);

      // Send to backend
      const response = await axios.post(
        `${Backend_URL}/api/order/create`,
        orderData
      );

      console.log('Order response:', response.data);

      if (response.data.success) {
        toast.success('Order placed successfully!');
        
        // Clear cart using context function
        clearCart();
        
        // Navigate to orders page
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
        </div>
        
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='First name'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Last name'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="email" 
          placeholder='Email Address'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="text" 
          placeholder='Street'
          name='street'
          value={formData.street}
          onChange={handleChange}
          required
        />

        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='City'
            name='city'
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='State'
            name='state'
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Zipcode'
            name='zipcode'
            value={formData.zipcode}
            onChange={handleChange}
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            placeholder='Country'
            name='country'
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="tel" 
          placeholder='Phone No.'
          name='phone'
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div 
              onClick={() => setMethod('stripe')} 
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-green-400'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
 
            <div 
              onClick={() => setMethod('razorpay')} 
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-green-400'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="Razorpay" />
            </div>

            <div 
              onClick={() => setMethod('cod')} 
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer hover:border-green-400'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          
          <div className='w-full text-end mt-8'>
            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`bg-black text-white px-16 py-6 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Placeorder
port default Placeorder
