import React, { useState, useContext } from 'react'
import assets from '../assets/assets'
import axios from 'axios'
import { Backend_URL } from '../App' // Make sure this is set to http://localhost:3000
import { toast } from 'react-toastify'
import { ShopContext } from '../../../Frontend/src/context/ShopContext'

const Add = ({token}) => {
  const { refreshProducts } = useContext(ShopContext)
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
    
    console.log("=== FORM SUBMISSION ===")
    console.log("Backend URL:", Backend_URL)
    console.log("Endpoint:", `${Backend_URL}/api/product/add`)
    
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
      
      // Append fields as your backend expects
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", Number(price))
      formData.append("category", category)
      formData.append("subCategory", subCategory) // Note: subCategory not subCatogory
      formData.append("bestseller", bestseller)
      
      // Sizes as comma separated string
      if(sizes.length > 0) {
        formData.append("sizes", sizes.join(','))
      }
      
      // Append images - backend expects image1, image2, image3, image4 fields
      if(image1) formData.append("image1", image1)
      if(image2) formData.append("image2", image2)
      if(image3) formData.append("image3", image3)
      if(image4) formData.append("image4", image4)
      
      // Debug form data
      console.log("Form Data:")
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `[File] ${value.name}` : value)
      }
      
      const response = await axios.post(
        `${Backend_URL}/api/product/add`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': token
          }
        }
      )
      
      console.log("Response:", response.data)
      
      if(response.data.success) {
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
        
        // Refresh products list so it shows up in List page immediately
        if (refreshProducts) {
          refreshProducts()
        }
        
      } else {
        toast.error(response.data.message || 'Failed to add product')
      }
      
    } catch(error) {
      console.error("Error:", error)
      
      if(error.response) {
        console.error("Response error:", error.response.data)
        toast.error(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`)
      } else if(error.request) {
        toast.error('Cannot connect to backend server')
      } else {
        toast.error('Error: ' + error.message)
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
      
      setImageFunction(file)
    }
  }

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) 
      ? prev.filter(item => item !== size)
      : [...prev, size]
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 p-6 border rounded-lg bg-white shadow'>
        <div>
          <label className='block mb-2 font-medium'>Product Images *</label>
          <div className='flex gap-4 flex-wrap'>
            {[1,2,3,4].map((num) => {
              const imageState = [image1, image2, image3, image4][num-1]
              const setImage = [setImage1, setImage2, setImage3, setImage4][num-1]
              
              return (
                <label key={num} className='cursor-pointer'>
                  <div className='w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-gray-400'>
                    {imageState ? (
                      <img 
                        className='w-full h-full object-cover' 
                        src={URL.createObjectURL(imageState)} 
                        alt={`Preview ${num}`} 
                      />
                    ) : (
                      <div className='text-center'>
                        <img className='w-8 h-8 mx-auto opacity-50' src={assets.upload_area} alt="Upload" />
                        <p className='text-xs mt-1 text-gray-500'>Image {num}</p>
                      </div>
                    )}
                  </div>
                  <input 
                    onChange={(e) => handleImageUpload(e, setImage)} 
                    type="file"  
                    id={`image${num}`} 
                    hidden 
                    accept="image/*"
                    disabled={loading}
                  />
                </label>
              )
            })}
          </div>
          <p className='text-sm text-gray-500 mt-2'>First image is required</p>
        </div>
        
        <div>
          <label className='block mb-2 font-medium'>Product Name *</label>
          <input 
            value={name} 
            onChange={(e)=>setName(e.target.value)} 
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black' 
            type='text' 
            placeholder='Enter product name'
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>Description *</label>
          <textarea 
            value={description} 
            onChange={(e)=>setDescription(e.target.value)} 
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black min-h-[100px]' 
            placeholder='Product description'
            required
            disabled={loading}
          />
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block mb-2 font-medium'>Category *</label>
            <select 
              value={category} 
              onChange={(e)=>setCategory(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black'
              disabled={loading}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <label className='block mb-2 font-medium'>Sub Category *</label>
            <select 
              value={subCategory} 
              onChange={(e)=>setSubCategory(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black'
              disabled={loading}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <label className='block mb-2 font-medium'>Price *</label>
            <input 
              value={price} 
              onChange={(e)=>setPrice(e.target.value)}
              className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black' 
              type="number" 
              placeholder='0.00'
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className='block mb-2 font-medium'>Available Sizes</label>
          <div className='flex gap-2 flex-wrap'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 border rounded ${sizes.includes(size) ? 'bg-black text-white' : 'bg-gray-100'}`}
                disabled={loading}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className='flex gap-2 items-center'>
          <input 
            checked={bestseller} 
            onChange={()=> setBestseller(!bestseller)} 
            type="checkbox" 
            id='bestseller' 
            className='w-4 h-4'
            disabled={loading}
          />
          <label htmlFor="bestseller" className='font-medium'>
            Mark as Bestseller
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 text-white rounded font-medium ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        
        <div className="p-3 bg-gray-50 rounded text-sm">
          <p className="font-medium mb-1">Debug Info:</p>
          <p>Backend: {Backend_URL}</p>
          <p>Token: {token ? 'Present' : 'Missing'}</p>
        </div>
      </form>
    </div>
  )
}

export default Add