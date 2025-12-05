import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Orders = () => {
  const { orders, currency } = useContext(ShopContext);

  // Log orders for debugging
  useEffect(() => {
    console.log('Orders from context:', orders);
  }, [orders]);

  // Flatten order items for display
  const allOrderItems = orders.flatMap(order => 
    order.items ? order.items.map(item => ({
      ...item,
      orderId: order.orderId,
      orderDate: order.orderDate,
      status: order.status,
      trackingNumber: order.trackingNumber
    })) : []
  );

  console.log('All order items:', allOrderItems);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'}/>
        <p className='text-gray-600 mt-2'>View all your past orders and their status</p>
      </div>

      {allOrderItems.length > 0 ? (
        <div className='space-y-6'>
          {allOrderItems.map((item, index) => (
            <div 
              key={`${item.orderId}-${item.productId}-${index}`} 
              className='bg-white rounded-lg shadow-sm border p-4 md:p-6'
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

                  <div className='flex items-center gap-2 mt-4'>
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'Delivered' ? 'bg-green-500' :
                      item.status === 'Shipped' ? 'bg-blue-500' :
                      item.status === 'Processing' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className='font-medium'>
                      {item.status || 'Processing'}
                    </span>
                  </div>
                  
                  <p className='text-sm text-gray-500 mt-2'>
                    Ordered on: {item.date || new Date(item.orderDate).toLocaleDateString()}
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
                  <button className='border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 font-medium transition-colors'>
                    Buy Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16'>
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