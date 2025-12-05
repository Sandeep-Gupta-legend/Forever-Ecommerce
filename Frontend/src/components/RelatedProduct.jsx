import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import Title from './Title'

const RelatedProduct = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] =  useState([])

  useEffect(() => {
    console.log('🔍 RelatedProduct Debug:');
    console.log('Current Product ID:', currentProductId);
    console.log('Category:', category);
    console.log('SubCategory:', subCategory);
    console.log('All Products:', products);

    if (products.length > 0 && category && currentProductId) {
      // Step 1: Get all products from the SAME CATEGORY (Men, Women, Kids)
      const sameCategoryProducts = products.filter(
        (item) => {
          const itemId = item._id || item.id
          const currentId = currentProductId
          return item.category === category && 
                 itemId !== currentId &&
                 String(itemId) !== String(currentId)
        }
      )

      console.log('Same category products:', sameCategoryProducts);

      // Step 2: Further filter by SAME SUBCATEGORY within the same category
      const sameCategoryAndSubcategory = sameCategoryProducts.filter(
        (item) => (item.subCatogory === subCategory || item.subCategory === subCategory)
      )

      console.log('Same category + subcategory:', sameCategoryAndSubcategory);

      let finalRelatedProducts = [];

      // Priority 1: Same category + same subcategory (most relevant)
      if (sameCategoryAndSubcategory.length >= 4) {
        finalRelatedProducts = sameCategoryAndSubcategory.slice(0, 4);
      }
      // Priority 2: Mix of same subcategory + other subcategories from same category
      else if (sameCategoryAndSubcategory.length > 0) {
        // Get products from same category but different subcategories
        const differentSubcategory = sameCategoryProducts.filter(
          (item) => item.subCatogory !== subCategory && item.subCategory !== subCategory
        )
        
        // Combine: same subcategory first, then different subcategories
        finalRelatedProducts = [
          ...sameCategoryAndSubcategory,
          ...differentSubcategory.slice(0, 4 - sameCategoryAndSubcategory.length)
        ].slice(0, 4);
      }
      // Priority 3: Only different subcategories from same category
      else {
        finalRelatedProducts = sameCategoryProducts.slice(0, 4);
      }

      console.log('Final related products:', finalRelatedProducts);
      setRelated(finalRelatedProducts);
    } else {
      console.log('❌ Missing data for filtering');
      setRelated([]);
    }
  }, [products, category, subCategory, currentProductId])

  if (!category || !currentProductId) {
    console.log('❌ Required props are missing');
    return null;
  }

  if (related.length === 0) {
    return (
      <div className="my-24">
        <div className="text-center text-3xl py-2">
          <Title text1={"RELATED"} text2={"PRODUCTS"} />
        </div>
        <div className="text-center text-gray-500 py-8">
          <p>No related products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
        {related.map((item) => {
          const itemId = item._id || item.id
          const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23e5e7eb' width='300' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
          const itemImage = Array.isArray(item.images) && item.images.length > 0 && item.images[0]
            ? item.images[0] 
            : (item.image || placeholderImage)
          
          return (
            <ProductItem
              key={itemId}
              id={itemId}
              name={item.name}
              price={item.price}
              image={itemImage}
              category={item.category}
              subCategory={item.subCatogory || item.subCategory}
            />
          )
        })}
      </div>
      
      {/* Debug info - you can remove this in production */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Showing {related.length} {category} products</p>
        <p>Includes: {[...new Set(related.map(item => item.subCatogory || item.subCategory).filter(Boolean))].join(', ')}</p>
      </div>
    </div>
  )
}

export default RelatedProduct