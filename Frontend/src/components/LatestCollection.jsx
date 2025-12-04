import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shopcontext'; // ✅ Fixed import path and case
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => { // ✅ Changed to PascalCase
    const { products } = useContext(ShopContext);
    const [Latestproducts,setLatestproducts]=useState([]);
    useEffect(()=>{
        setLatestproducts(products.slice(0,10));

    },[]);
    
    return (
        <div className='my-10'>
            <div className='text-center py-2  text-3x1'>
            <Title text1={'LATEST'} text2={'COLLECTION'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum sequi aliquid voluptas maiores eligendi quos provident magnam cumque, minus veniam, architecto reprehenderit aut perferendis. Eius iure neque nihil sed minus.
            </p>

         </div>
         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                Latestproducts.map((items,index)=>(
                    <ProductItem key={index} id={items.id} image={items.image} name={items.name} price={items.price}/>
                )

                )
            }
         </div>
        </div>
    )
}

export default LatestCollection