import React, { useState } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import { Backend_URL } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {
  const [image1,setImage1]=useState(null)
  const [image2,setImage2]=useState(null)
  const [image3,setImage3]=useState(null)
  const [image4,setImage4]=useState(null)

  const [name,setName]=useState("")
  const [description,setDescription]=useState("")
  const [price,setPrice]=useState("")
  const [category,setCategory]=useState("Men")
  const [subCategory,setSubCategory]=useState("Topwear")
  const [sizes,setSizes]=useState([])
  const [bestseller,setBestseller]=useState(false)
  const [loading, setLoading] = useState(false)
  
  const onSubmitHandler=async(e)=>{
    e.preventDefault()
    setLoading(true)
    
    console.log("=== FORM SUBMISSION STARTED ===")
    console.log("Backend URL:", Backend_URL)
    console.log("Token present:", token ? "Yes" : "No")
    
    // Validation
    if(!name || !description || !price) {
      toast.error('Please fill all required fields')
      setLoading(false)
      return
    }
    
    if(!image1) {
      toast.error('Please upload at least one image')
      setLoading(false)
      return
    }
    
    try{
      const formData=new FormData()
      
      // Append text fields
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", Number(price))
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      
      // FIX: Send sizes as comma-separated string (NOT JSON)
      if(sizes.length > 0) {
        const sizesString = sizes.join(',')
        formData.append("sizes", sizesString)
        console.log("Sending sizes as string:", sizesString)
      } else {
        formData.append("sizes", "")
        console.log("No sizes selected")
      }
      
      // Append images
      if(image1) {
        console.log("Image 1:", image1.name, image1.size)
        formData.append("image1", image1)
      }
      if(image2) {
        formData.append("image2", image2)
      }
      if(image3) {
        formData.append("image3", image3)
      }
      if(image4) {
        formData.append("image4", image4)
      }
      
      // Debug: Log all form data
      console.log("=== FORM DATA CONTENTS ===")
      for (let [key, value] of formData.entries()) {
        if (key === 'image1' || key === 'image2' || key === 'image3' || key === 'image4') {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }
      
      const endpoint = `${Backend_URL}/api/product/add`
      console.log("Sending to endpoint:", endpoint)
      
      const response = await axios.post(
        endpoint, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': token
          },
          timeout: 30000
        }
      )
      
      console.log("=== RESPONSE RECEIVED ===")
      console.log("Response status:", response.status)
      console.log("Response data:", response.data)
      
      if(response.data && response.data.success) {
        toast.success('✅ Product added successfully!')
        
        // Reset form
        setName("")
        setDescription("")
        setPrice("")
        setCategory("Men")
        setSubCategory("Topwear")
        setSizes([])
        setBestseller(false)
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
        
        // Log success
        console.log("✅ Product saved to database")
      } else {
        toast.error(response.data?.message || 'Failed to add product')
      }
      
    } catch(error) {
      console.error("=== ERROR DETAILS ===")
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      
      if(error.response) {
        console.error("Response status:", error.response.status)
        console.error("Response data:", error.response.data)
        console.error("Response headers:", error.response.headers)
        
        toast.error(`Server Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`)
      } else if(error.request) {
        console.error("No response received")
        console.error("Request config:", error.config)
        
        toast.error('Cannot connect to server. Make sure backend is running.')
        
        // Check if backend is accessible
        try {
          const testResponse = await fetch(`${Backend_URL}/api/health`)
          console.log("Health check response:", testResponse.status)
        } catch (healthError) {
          console.error("Cannot reach backend at all:", healthError)
        }
      } else {
        console.error("Request setup error:", error.config)
        toast.error(error.message || 'Request setup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e, setImageFunction) => {
    const file = e.target.files[0]
    if(file) {
      if(!file.type.match('image.*')) {
        toast.error('Please upload image files only')
        return
      }
      
      if(file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      console.log("Image selected:", file.name, file.size, file.type)
      setImageFunction(file)
    }
  }

  const toggleSize = (size) => {
    setSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(item => item !== size)
        : [...prev, size]
      console.log("Sizes updated:", newSizes)
      return newSizes
    })
  }

  // Test endpoint
  const testEndpoint = async () => {
    try {
      console.log("Testing endpoint connection...")
      const response = await axios.get(`${Backend_URL}/api/health`, {
        timeout: 5000
      })
      console.log("✅ Health check response:", response.data)
      toast.success('Backend is connected!')
    } catch (error) {
      console.error("❌ Health check failed:", error)
      toast.error('Cannot connect to backend')
    }
  }

  // Test with simple data
  const testSimpleProduct = async () => {
    try {
      const testFormData = new FormData()
      testFormData.append("name", "Test Product")
      testFormData.append("description", "Test Description")
      testFormData.append("price", "29.99")
      testFormData.append("category", "Men")
      testFormData.append("subCategory", "Topwear")
      testFormData.append("sizes", "M,L") // Simple comma-separated
      testFormData.append("bestseller", "false")
      
      // Create a simple test image
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#FF6B6B'
      ctx.fillRect(0, 0, 100, 100)
      
      canvas.toBlob(async (blob) => {
        testFormData.append("image1", blob, "test.png")
        
        const response = await axios.post(
          `${Backend_URL}/api/product/add`,
          testFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'token': token
            }
          }
        )
        
        console.log("Test product response:", response.data)
        if (response.data.success) {
          toast.success('Test product added!')
        } else {
          toast.error('Test failed: ' + response.data.message)
        }
      })
    } catch (error) {
      console.error("Test error:", error)
      toast.error('Test failed: ' + error.message)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={testEndpoint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          type="button"
        >
          Test Backend Connection
        </button>
        <button 
          onClick={testSimpleProduct}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          type="button"
          disabled={loading}
        >
          Test Simple Product
        </button>
        <button 
          onClick={() => {
            console.log("Current form state:", {
              name, description, price, category, subCategory, sizes, bestseller
            })
            toast.info('Check console for form state')
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          type="button"
        >
          Log Form State
        </button>
      </div>
      
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-4 border rounded-lg bg-white shadow-sm'>
        <div className='w-full'>
          <p className='mb-2 font-medium'>Upload Images (At least one required)</p>
          <div className='flex gap-4 flex-wrap'>
            <label htmlFor="image1" className='cursor-pointer'>
              <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-400 transition'>
                {image1 ? (
                  <img 
                    className='w-full h-full object-cover' 
                    src={URL.createObjectURL(image1)} 
                    alt="Preview 1" 
                  />
                ) : (
                  <img 
                    className='w-10 h-10 opacity-50' 
                    src={assets.upload_area} 
                    alt="Upload" 
                  />
                )}
              </div>
              <p className='text-xs text-center mt-1 text-gray-500'>Image 1 *</p>
              <input 
                onChange={(e) => handleImageUpload(e, setImage1)} 
                type="file"  
                id="image1" 
                hidden 
                accept="image/*"
                disabled={loading}
              />
            </label>

            <label htmlFor="image2" className='cursor-pointer'>
              <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-400 transition'>
                {image2 ? (
                  <img 
                    className='w-full h-full object-cover' 
                    src={URL.createObjectURL(image2)} 
                    alt="Preview 2" 
                  />
                ) : (
                  <img 
                    className='w-10 h-10 opacity-50' 
                    src={assets.upload_area} 
                    alt="Upload" 
                  />
                )}
              </div>
              <p className='text-xs text-center mt-1 text-gray-500'>Image 2</p>
              <input 
                onChange={(e) => handleImageUpload(e, setImage2)} 
                type="file"  
                id="image2" 
                hidden 
                accept="image/*"
                disabled={loading}
              />
            </label>

            <label htmlFor="image3" className='cursor-pointer'>
              <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-400 transition'>
                {image3 ? (
                  <img 
                    className='w-full h-full object-cover' 
                    src={URL.createObjectURL(image3)} 
                    alt="Preview 3" 
                  />
                ) : (
                  <img 
                    className='w-10 h-10 opacity-50' 
                    src={assets.upload_area} 
                    alt="Upload" 
                  />
                )}
              </div>
              <p className='text-xs text-center mt-1 text-gray-500'>Image 3</p>
              <input 
                onChange={(e) => handleImageUpload(e, setImage3)} 
                type="file"  
                id="image3" 
                hidden 
                accept="image/*"
                disabled={loading}
              />
            </label>

            <label htmlFor="image4" className='cursor-pointer'>
              <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-400 transition'>
                {image4 ? (
                  <img 
                    className='w-full h-full object-cover' 
                    src={URL.createObjectURL(image4)} 
                    alt="Preview 4" 
                  />
                ) : (
                  <img 
                    className='w-10 h-10 opacity-50' 
                    src={assets.upload_area} 
                    alt="Upload" 
                  />
                )}
              </div>
              <p className='text-xs text-center mt-1 text-gray-500'>Image 4</p>
              <input 
                onChange={(e) => handleImageUpload(e, setImage4)} 
                type="file"  
                id="image4" 
                hidden 
                accept="image/*"
                disabled={loading}
              />
            </label>
          </div>
        </div>
        
        <div className='w-full'>
          <p className='mb-2 font-medium'>Product Name *</p>
          <input 
            onChange={(e)=>setName(e.target.value)} 
            value={name} 
            className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100' 
            type='text' 
            placeholder='Enter product name' 
            required
            disabled={loading}
          />
        </div>

        <div className='w-full'>
          <p className='mb-2 font-medium'>Product Description *</p>
          <textarea 
            onChange={(e)=>setDescription(e.target.value)} 
            value={description} 
            className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition min-h-[100px] disabled:bg-gray-100' 
            placeholder='Write product description here' 
            required
            disabled={loading}
          />
        </div>
        
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          <div className='w-full sm:w-auto'>
            <p className='mb-2 font-medium'>Category *</p>
            <select 
              onChange={(e)=>setCategory(e.target.value)} 
              value={category}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100' 
              disabled={loading}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className='w-full sm:w-auto'>
            <p className='mb-2 font-medium'>Sub Category *</p>
            <select 
              onChange={(e)=>setSubCategory(e.target.value)} 
              value={subCategory}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100' 
              disabled={loading}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className='w-full sm:w-auto'>
            <p className='mb-2 font-medium'>Price *</p>
            <input 
              onChange={(e)=>setPrice(e.target.value)} 
              value={price}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition disabled:bg-gray-100' 
              type="number" 
              placeholder='25'
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2 font-medium'>Available Sizes</p>
          <div className='flex gap-3 flex-wrap'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 border rounded transition disabled:opacity-50 ${
                  sizes.includes(size) 
                    ? 'bg-pink-100 border-pink-300 text-pink-700 font-medium' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={loading}
              >
                {size}
              </button>
            ))}
          </div>
          <p className={`mt-2 text-sm ${sizes.length > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            Selected: {sizes.length > 0 ? sizes.join(', ') : 'No sizes selected'}
          </p>
        </div>

        <div className='flex gap-2 mt-2 items-center'>
          <input 
            onChange={()=> setBestseller(prev => !prev)} 
            checked={bestseller} 
            type="checkbox" 
            id='bestseller' 
            className='w-4 h-4 disabled:opacity-50'
            disabled={loading}
          />
          <label className={`cursor-pointer font-medium ${loading ? 'opacity-50' : ''}`} htmlFor="bestseller">
            Mark as Bestseller
          </label>
        </div>

        <button 
          type="submit" 
          className={`w-32 py-3 mt-4 text-white rounded font-medium transition ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800'
          }`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        
        <div className="mt-4 p-3 bg-gray-50 rounded border text-sm w-full max-w-[500px]">
          <p className="font-medium mb-1">Debug Info:</p>
          <p><span className="font-medium">Backend URL:</span> {Backend_URL || 'Not set'}</p>
          <p><span className="font-medium">Token:</span> {token ? 'Present' : 'Missing'}</p>
          <p><span className="font-medium">Fields filled:</span> {name && description && price ? '✅' : '❌'}</p>
          <p><span className="font-medium">Image uploaded:</span> {image1 ? '✅' : '❌'}</p>
          <p><span className="font-medium">Sizes selected:</span> {sizes.length} ({sizes.join(', ') || 'None'})</p>
          <p className="mt-1 text-xs">Open browser console (F12) for detailed logs</p>
        </div>
      </form>
    </div>
  )
}

export default Add