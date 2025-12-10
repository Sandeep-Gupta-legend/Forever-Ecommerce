import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductDetail = () => {
    const { id } = useParams()
    const { products, addToCart } = useContext(ShopContext)
    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        const foundProduct = products.find(p => p._id === id)
        setProduct(foundProduct)
    }, [id, products])

    if (!product) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Product not found</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                    <div className="mb-4">
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((img, index) => (
                            <img 
                                key={index}
                                src={img}
                                alt={`${product.name} ${index + 1}`}
                                className={`w-20 h-20 object-cover cursor-pointer rounded ${selectedImage === index ? 'ring-2 ring-black' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl font-semibold text-gray-800 mb-4">${product.price}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    <button 
                        onClick={() => addToCart(product._id)}
                        className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail