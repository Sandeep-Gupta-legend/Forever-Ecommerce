import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({ id, image, name, price, bestseller }) => {
    const navigate = useNavigate()
    const { addToCart } = useContext(ShopContext)

    const handleImageClick = () => {
        navigate(`/product/${id}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()
        addToCart(id)
    }

    // Create a simple SVG placeholder as data URI
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23e5e7eb' width='300' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
    
    // Handle image source - can be string or array
    let imageSrc = placeholderImage
    if (image) {
        if (Array.isArray(image)) {
            imageSrc = image.length > 0 && image[0] ? image[0] : placeholderImage
        } else if (typeof image === 'string' && image.trim() !== '') {
            imageSrc = image
        }
    }

    return (
        <div className="cursor-pointer group" onClick={handleImageClick}>
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
                <img 
                    src={imageSrc} 
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = placeholderImage
                        e.target.onerror = null // Prevent infinite loop
                    }}
                />
                
                {bestseller && (
                    <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                        Bestseller
                    </div>
                )}
                
                <button 
                    onClick={handleAddToCart}
                    className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800"
                >
                    Add to Cart
                </button>
            </div>
            
            <div className="mt-3">
                <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                <p className="font-semibold mt-1">${price}</p>
            </div>
        </div>
    )
}

export default ProductItem