import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'; // Fixed import
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    
    useEffect(() => {
        if (products && products.length > 0) {
            // Sort by creation date or ID, and take first 10
            const sortedProducts = [...products]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 10);
            
            setLatestProducts(sortedProducts);
        }
    }, [products]);
    
    if (latestProducts.length === 0) {
        return (
            <div className="my-10">
                <div className="text-center py-2 text-3xl">
                    <Title text1={'LATEST'} text2={'COLLECTION'}/>
                </div>
                <p className="text-center text-gray-500">No products available</p>
            </div>
        )
    }
    
    return (
        <div className='my-10 px-4 md:px-8'>
            <div className='text-center py-2'>
                <Title text1={'LATEST'} text2={'COLLECTION'}/>
                <p className='w-full md:w-3/4 mx-auto text-sm md:text-base text-gray-600 mt-3'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum sequi aliquid voluptas maiores eligendi quos provident magnam cumque, minus veniam, architecto reprehenderit aut perferendis.
                </p>
            </div>
            
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8 mt-8'>
                {latestProducts.map((item) => (
                    <ProductItem 
                        key={item._id || item.id} 
                        id={item._id || item.id} 
                        image={item.image || item.images?.[0]} 
                        name={item.name} 
                        price={item.price}
                        bestseller={item.bestseller}
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection