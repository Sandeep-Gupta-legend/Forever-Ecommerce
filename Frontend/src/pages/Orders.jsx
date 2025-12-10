import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { Backend_URL } from '../App'
import { toast } from 'react-toastify'

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders from public route
      const response = await axios.get(`${Backend_URL}/api/order/all`);

      if (response.data.success) {
        setOrders(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch orders');
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Fallback to localStorage if backend is unavailable
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
          toast.info('Showing locally saved orders');
        }
      } catch (err) {
        console.error('Error parsing local orders:', err);
      }
      
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Flatten order items for display
  const allOrderItems = orders.flatMap(order => 
    order.items ? order.items.map(item => ({
      ...item,
      orderId: order.orderId,
      orderDate: order.orderDate,
      status: order.status,
      trackingNumber: order.trackingNumber,
      shippingDetails: order.shippingDetails
    })) : []
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex justify-between items-center'>
        <div>
          <Title text1={'MY'} text2={'ORDERS'}/>
          <p className='text-gray-600 mt-2'>View all your past orders and their status</p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Note: Using local data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {allOrderItems.length > 0 ? (
        <div className='space-y-6'>
          {allOrderItems.map((item, index) => (
            <div 
              key={`${item.orderId}-${item.productId}-${index}`} 
              className='bg-white rounded-lg shadow-sm border p-4 md:p-6 hover:shadow-md transition'
            >
              <div className='flex flex-col md:flex-row md:items-start gap-4'>
                {/* Product Image */}
                <div className='md:w-1/4'>
                  <img 
                    src={item.productImage || 'https://via.placeholder.com/150'} 
                    alt={item.productName} 
                    className='w-full h-48 object-cover rounded-lg'
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className='md:w-2/4'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    {item.productName}
                  </h3>
                  
                  <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3'>
                    <div>
                      <p className='font-medium'>Order ID:</p>
                      <p className='text-blue-600'>#{item.orderId}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Price:</p>
                      <p className='text-lg font-bold text-gray-800'>{currency}{item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Quantity:</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Size:</p>
                      <p>{item.size || 'M'}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Total:</p>
                      <p className='font-bold'>{currency}{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Tracking:</p>
                      <p className='text-blue-600'>{item.trackingNumber || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {item.shippingDetails && (
                    <div className='bg-gray-50 p-3 rounded text-sm mb-3'>
                      <p className='font-medium text-gray-700 mb-1'>Shipping To:</p>
                      <p className='text-gray-600'>
                        {item.shippingDetails.firstName} {item.shippingDetails.lastName}
                      </p>
                      <p className='text-gray-600'>
                        {item.shippingDetails.street}, {item.shippingDetails.city}
                      </p>
                      <p className='text-gray-600'>
                        {item.shippingDetails.state} {item.shippingDetails.zipcode}, {item.shippingDetails.country}
                      </p>
                    </div>
                  )}

                  <div className='flex items-center gap-2 mt-4'>
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'Delivered' ? 'bg-green-500' :
                      item.status === 'Shipped' || item.status === 'Out for Delivery' ? 'bg-blue-500' :
                      item.status === 'Confirmed' ? 'bg-purple-500' :
                      item.status === 'Processing' ? 'bg-yellow-500' :
                      item.status === 'Cancelled' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className='font-medium'>
                      {item.status || 'Processing'}
                    </span>
                  </div>
                  
                  <p className='text-sm text-gray-500 mt-2'>
                    Ordered on: {new Date(item.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className='md:w-1/4 flex flex-col gap-3'>
                  <button className='border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 font-medium transition-colors'>
                    Track Order
                  </button>
                  <button className='border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 font-medium transition-colors'>
                    View Details
                  </button>
                  {item.status === 'Delivered' && (
                    <button className='border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 font-medium transition-colors'>
                      Buy Again
                    </button>
                  )}
                  {(item.status === 'Processing' || item.status === 'Confirmed') && (
                    <button className='border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 font-medium transition-colors'>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-white rounded-lg shadow'>
          <div className='text-gray-400 mb-4'>
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>No orders yet</h3>
          <p className='text-gray-500 mb-6'>You haven't placed any orders yet.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium'
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  )
}

export default Orders
