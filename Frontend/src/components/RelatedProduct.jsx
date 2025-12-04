import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/Shopcontext'
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
        (item) =>
          item.category === category && 
          item.id !== parseInt(currentProductId)
      )

      console.log('Same category products:', sameCategoryProducts);

      // Step 2: Further filter by SAME SUBCATEGORY within the same category
      const sameCategoryAndSubcategory = sameCategoryProducts.filter(
        (item) => item.subCatogory === subCategory
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
          (item) => item.subCatogory !== subCategory
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
        {related.map((item) => (
          <ProductItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            category={item.category}
            subCategory={item.subCatogory}
          />
        ))}
      </div>
      
      {/* Debug info - you can remove this in production */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Showing {related.length} {category} products</p>
        <p>Includes: {[...new Set(related.map(item => item.subCatogory))].join(', ')}</p>
      </div>
    </div>
  )
}

export default RelatedProduct