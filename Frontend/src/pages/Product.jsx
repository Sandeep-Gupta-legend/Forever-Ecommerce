import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, AddToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch product based on route id
  useEffect(() => {
    if (!products || products.length === 0) return;

    const foundProduct = products.find((item) => item.id == productId);

    if (foundProduct) {
      setProductData(foundProduct);
      setSelectedImage(foundProduct.image[0]);
      setSelectedSize(foundProduct.Sizes?.[0] || '');
    }
    
    setLoading(false);

  }, [productId, products]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // This should trigger the toast error from ShopContext
      AddToCart(productData.id, null);
      return;
    }
    
    AddToCart(productData.id, selectedSize);
  }

  if (loading) {
    return <div className="pt-20 text-center text-gray-500">Loading...</div>;
  }

  if (!productData) {
    return <div className="pt-20 text-center text-gray-500">Product not found</div>;
  }

  return (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        
        {/* Left side: images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          
          {/* Thumbnail images */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image?.map((item, index) => (
              <img
                onClick={() => setSelectedImage(item)}
                src={item}
                key={index}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border rounded ${
                  selectedImage === item ? 'border-2 border-blue-500' : 'border-gray-300'
                }`}
                alt="product"
              />
            ))}
          </div>

          {/* Main image */}
          <div className="w-full sm:w-[80%]">
            <img src={selectedImage} alt="selected" className="w-full h-auto" />
          </div>

        </div>

        {/* Right side: product information */}
        <div className="flex-1">
          <div className="sticky top-20">
            {/* Product name and category */}
            <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500 capitalize">
                {productData.category} • {productData.subCatogory}
              </span>
              {productData.bestseller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Bestseller
                </span>
              )}
            </div>

            {/* Price */}
            <div className="text-2xl font-semibold mb-6">
              {currency}{productData.price}
            </div>

            {/* Size selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Size</h3>
              <div className="flex gap-2">
                {productData.Sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600">{productData.description}</p>
            </div>

            {/* Additional product info */}
            <div className="space-y-3 text-sm text-gray-500 mb-6">
              <div className="flex justify-between">
                <span>Product ID:</span>
                <span>{productData.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Added Date:</span>
                <span>{productData.date}</span>
              </div>
            </div>

            {/* Add to cart button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {productData && (
        <RelatedProduct 
          category={productData.category} 
          subCategory={productData.subCatogory}
          currentProductId={productData.id}
        />
      )}
    </div>
  );
}

export default Product;