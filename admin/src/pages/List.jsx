
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Backend_URL, currency } from '../App'
import { toast } from 'react-toastify'
import { ShopContext } from '../../../Frontend/src/context/ShopContext' // Add this import

const List = ({ token }) => {
  const { products: list, loading, refreshProducts } = useContext(ShopContext) // Use context
  const [removingId, setRemovingId] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    sizes: [],
    bestseller: false,
  })
  const [editImages, setEditImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  })
  const [imagePreviews, setImagePreviews] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  })

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) {
      return
    }

    setRemovingId(id)
    try {
      console.log('=== REMOVE PRODUCT ===')
      console.log('Product ID:', id)
      console.log('Token:', token ? 'Present' : 'Missing')
      
      // Try POST method first
      const response = await axios.post(
        `${Backend_URL}/api/product/remove`,
        { id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token || localStorage.getItem('token') || ''
          }
        }
      )
      
      console.log('Remove response:', response.data)
      
      if (response.data.success) {
        toast.success(`"${name}" removed successfully`)
        // Refresh products list from context
        refreshProducts()
      } else {
        toast.error(response.data.message || 'Failed to remove product')
      }
    } catch (error) {
      console.error('Error removing product:', error)
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        if (status === 401 || status === 403) {
          toast.error('Unauthorized. Please login again.')
        } else if (status === 404) {
          toast.error('Product not found.')
        } else {
          toast.error(data?.message || `Server error: ${status}`)
        }
      } else if (error.request) {
        toast.error('No response from server. Check backend connection.')
      } else {
        toast.error('Error: ' + error.message)
      }
    } finally {
      setRemovingId(null)
    }
  }

  const openEditModal = (product) => {
    console.log('Opening edit modal for product:', product)
    setEditingProduct(product)
    
    // Initialize form with product data
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || 'Men',
      subCategory: product.subCategory || 'Topwear',
      sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? [product.sizes] : []),
      bestseller: product.bestseller || false,
    })
    
    // Initialize image previews
    const previews = {}
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, index) => {
        previews[`image${index + 1}`] = img
      })
    }
    
    setImagePreviews({
      image1: previews.image1 || '',
      image2: previews.image2 || '',
      image3: previews.image3 || '',
      image4: previews.image4 || ''
    })
    
    // Reset file inputs
    setEditImages({
      image1: null,
      image2: null,
      image3: null,
      image4: null
    })
  }

  const closeEditModal = () => {
    setEditingProduct(null)
    setEditLoading(false)
  }

  const handleEditImageChange = (e, imageKey) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file
      if (!file.type.match('image.*')) {
        toast.error('Please upload image files only')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      // Update file
      setEditImages(prev => ({
        ...prev,
        [imageKey]: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [imageKey]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSize = (size) => {
    setEditForm(prev => {
      const newSizes = prev.sizes.includes(size) 
        ? prev.sizes.filter(item => item !== size)
        : [...prev.sizes, size]
      
      return { ...prev, sizes: newSizes }
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    if (!editingProduct) return
    
    setEditLoading(true)
    
    try {
      console.log('=== UPDATE PRODUCT ===')
      console.log('Product ID:', editingProduct._id)
      console.log('Form data:', editForm)
      console.log('Image files:', editImages)
      
      // Validate required fields
      if (!editForm.name || !editForm.description || !editForm.price) {
        toast.error('Please fill all required fields')
        setEditLoading(false)
        return
      }
      
      // Prepare form data
      const formData = new FormData()
      
      // Append basic fields
      formData.append('productId', editingProduct._id)
      formData.append('name', editForm.name)
      formData.append('description', editForm.description)
      formData.append('price', Number(editForm.price))
      formData.append('category', editForm.category)
      formData.append('subCategory', editForm.subCategory)
      formData.append('bestseller', editForm.bestseller)
      
      // Append sizes
      if (editForm.sizes.length > 0) {
        formData.append('sizes', editForm.sizes.join(','))
      } else {
        formData.append('sizes', '')
      }
      
      // Append new images if any
      if (editImages.image1) {
        formData.append('image1', editImages.image1)
      }
      if (editImages.image2) {
        formData.append('image2', editImages.image2)
      }
      if (editImages.image3) {
        formData.append('image3', editImages.image3)
      }
      if (editImages.image4) {
        formData.append('image4', editImages.image4)
      }
      
      // Debug form data
      console.log('Form data entries:')
      for (let [key, value] of formData.entries()) {
        if (key.includes('image')) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }
      
      // Send update request
      const response = await axios.post(
        `${Backend_URL}/api/product/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': token || localStorage.getItem('token') || ''
          }
        }
      )
      
      console.log('Update response:', response.data)
      
      if (response.data.success) {
        toast.success('Product updated successfully!')
        
        // Refresh products list
        refreshProducts()
        
        closeEditModal()
      } else {
        toast.error(response.data.message || 'Failed to update product')
      }
      
    } catch (error) {
      console.error('Error updating product:', error)
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        if (status === 401 || status === 403) {
          toast.error('Unauthorized. Please login again.')
        } else {
          toast.error(data?.message || `Server error: ${status}`)
        }
      } else if (error.request) {
        toast.error('No response from server. Check backend connection.')
      } else {
        toast.error('Error: ' + error.message)
      }
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const removeImage = (imageKey) => {
    setImagePreviews(prev => ({
      ...prev,
      [imageKey]: ''
    }))
    setEditImages(prev => ({
      ...prev,
      [imageKey]: null
    }))
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Products List</h1>
          <p className='text-gray-600 mt-1'>Manage all your products here</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={refreshProducts}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              'Refresh List'
            )}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">Add some products using the "Add Product" page.</p>
          <a 
            href="/add"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add First Product
          </a>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className='hidden lg:block overflow-x-auto bg-white rounded-lg border shadow-sm'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-50 border-b'>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Image</th>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Product Details</th>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Category</th>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Price</th>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Status</th>
                  <th className='p-4 text-left text-sm font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item._id} className='border-b hover:bg-gray-50 transition'>
                    <td className='p-4'>
                      {item.images && item.images[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.name}
                          className='w-16 h-16 object-cover rounded-lg border'
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className='w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center'>
                          <span className='text-xs text-gray-400'>No Image</span>
                        </div>
                      )}
                    </td>
                    <td className='p-4'>
                      <div>
                        <h3 className='font-medium text-gray-800'>{item.name}</h3>
                        <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{item.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.sizes && item.sizes.map((size, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 rounded">{size}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.category === 'Men' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'Women' ? 'bg-pink-100 text-pink-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.category}
                        </span>
                        {item.subCategory && (
                          <p className='text-sm text-gray-600 mt-2'>{item.subCategory}</p>
                        )}
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className="font-bold text-gray-800">{currency}{item.price}</div>
                    </td>
                    <td className='p-4'>
                      {item.bestseller ? (
                        <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="text-sm font-medium">Bestseller</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Regular</span>
                      )}
                    </td>
                    <td className='p-4'>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm transition flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit Product
                        </button>
                        <button 
                          onClick={() => handleRemove(item._id, item.name)}
                          disabled={removingId === item._id}
                          className={`px-3 py-1.5 rounded text-sm transition flex items-center justify-center gap-1 ${
                            removingId === item._id
                              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {removingId === item._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                              Removing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className='lg:hidden space-y-4'>
            {list.map((item) => (
              <div key={item._id} className='bg-white rounded-lg border p-4 shadow-sm'>
                <div className='flex gap-4'>
                  <div className='flex-shrink-0'>
                    {item.images && item.images[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className='w-24 h-24 object-cover rounded-lg border'
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/96x96?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className='w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center'>
                        <span className='text-xs text-gray-400'>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className='flex-grow'>
                    <div className="flex justify-between items-start">
                      <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                      {item.bestseller && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Bestseller
                        </span>
                      )}
                    </div>
                    
                    <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{item.description}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.category === 'Men' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'Women' ? 'bg-pink-100 text-pink-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.category}
                      </span>
                      <span className="font-bold text-gray-800">{currency}{item.price}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm transition flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemove(item._id, item.name)}
                        disabled={removingId === item._id}
                        className={`flex-1 px-3 py-2 rounded text-sm transition flex items-center justify-center gap-1 ${
                          removingId === item._id
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {removingId === item._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                            Removing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal - Same as before */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <p className="text-sm text-gray-600 mb-6">ID: {editingProduct._id}</p>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={editLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={editLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 min-h-[100px]"
                  disabled={editLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={editLoading}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sub Category *</label>
                  <select
                    name="subCategory"
                    value={editForm.subCategory}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                    disabled={editLoading}
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="edit-bestseller"
                    name="bestseller"
                    type="checkbox"
                    checked={editForm.bestseller}
                    onChange={handleEditFormChange}
                    disabled={editLoading}
                    className="w-4 h-4"
                  />
                  <label htmlFor="edit-bestseller" className="text-sm font-medium">Mark as Bestseller</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Available Sizes</label>
                <div className="flex gap-2 flex-wrap">
                  {['S','M','L','XL','XXL'].map(size => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => toggleSize(size)}
                      disabled={editLoading}
                      className={`px-3 py-1 rounded border ${editForm.sizes.includes(size) ? 'bg-black text-white' : 'bg-gray-100'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1,2,3,4].map((num) => {
                    const key = `image${num}`
                    const preview = imagePreviews[key] || ''
                    return (
                      <div key={key} className="space-y-2">
                        <div className="w-full aspect-square border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                          {preview ? (
                            <img src={preview} alt={`Preview ${num}`} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400">No image</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 text-center text-xs bg-gray-100 rounded px-2 py-1 cursor-pointer hover:bg-gray-200">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleEditImageChange(e, key)}
                              disabled={editLoading}
                            />
                          </label>
                          {preview && (
                            <button
                              type="button"
                              onClick={() => removeImage(key)}
                              className="text-xs text-red-600 px-2 py-1 border border-red-200 rounded hover:bg-red-50"
                              disabled={editLoading}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing images; upload to replace.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-4 py-2 rounded text-sm text-white ${editLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Debug Panel */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-sm">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p><span className="font-medium">Backend URL:</span> {Backend_URL}</p>
            <p><span className="font-medium">Token:</span> {token ? 'Present ✓' : 'Missing ✗'}</p>
          </div>
          <div>
            <p><span className="font-medium">Products loaded:</span> {list.length}</p>
            <p><span className="font-medium">Edit endpoint:</span> POST /api/product/update</p>
          </div>
          <div>
            <p><span className="font-medium">Images field:</span> images (array)</p>
            <p className="text-xs text-gray-500">Check browser console (F12) for detailed logs</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
