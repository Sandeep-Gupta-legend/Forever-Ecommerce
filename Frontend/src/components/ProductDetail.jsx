import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProduct from './RelatedProduct'
import Title from './Title'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { products, addToCart, getCartItemCount, getProductById } = useContext(ShopContext)
    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (id && products.length > 0) {
            const foundProduct = getProductById(id)
            if (foundProduct) {
                setProduct(foundProduct)
            } else {
                navigate('/')
            }
        }
    }, [id, products, getProductById, navigate])

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product._id || product.id)
            }
            alert(`${quantity} ${product.name}(s) added to cart!`)
        }
    }

    const handleBuyNow = () => {
        handleAddToCart()
        navigate('/cart')
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        )
    }

    // Create placeholder image
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23e5e7eb' width='500' height='500'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
    
    // Get images array
    const images = Array.isArray(product.images) && product.images.length > 0 
        ? product.images.filter(img => img && img.trim() !== '')
        : product.image 
            ? (Array.isArray(product.image) ? product.image.filter(img => img && img.trim() !== '') : [product.image])
            : [placeholderImage]
    
    // Ensure at least one image
    if (images.length === 0) {
        images.push(placeholderImage)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-sm text-gray-500 mb-6">
                <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
                <span className="mx-2">/</span>
                <span className="cursor-pointer hover:text-black" onClick={() => navigate('/collection')}>Collection</span>
                <span className="mx-2">/</span>
                <span className="text-black">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="mb-4 border rounded-lg overflow-hidden">
                        <img 
                            src={images[selectedImage]} 
                            alt={product.name}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>
                    
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 border rounded overflow-hidden ${selectedImage === index ? 'ring-2 ring-black' : ''}`}
                                >
                                    <img 
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    
                    {product.bestseller && (
                        <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded mb-4">
                            Bestseller
                        </span>
                    )}
                    
                    <p className="text-3xl font-semibold text-gray-800 mb-6">${product.price}</p>
                    
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{product.description || 'No description available.'}</p>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Quantity</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-2 text-xl hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-4 py-2 text-xl hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                {getCartItemCount()} items in cart
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={handleBuyNow}
                            className="flex-1 bg-white text-black border-2 border-black py-3 rounded hover:bg-gray-50 transition"
                        >
                            Buy Now
                        </button>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                        {product.category && <p className="mb-1">Category: {product.category}</p>}
                        {(product.subCatogory || product.subCategory) && (
                            <p>Subcategory: {product.subCatogory || product.subCategory}</p>
                        )}
                    </div>
                </div>
            </div>

            {product.category && (
                <RelatedProduct 
                    category={product.category}
                    subCategory={product.subCatogory || product.subCategory}
                    currentProductId={product._id || product.id}
                />
            )}
        </div>
    )
}

export default ProductDetail