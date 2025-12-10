import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, performSearch, searchTerm } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Categories and subcategories
  const categories = ["MEN", "WOMEN", "KIDS"];
  const subCategories = ["BOTTOMWEAR", "TOPWEAR", "WINTERWEAR"];

  // Toggle category selection
  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(item => item !== cat)
        : [...prev, cat]
    );
  };

  // Toggle subcategory selection
  const toggleSubCategory = (subCat) => {
    setSelectedSubCategories(prev =>
      prev.includes(subCat)
        ? prev.filter(item => item !== subCat)
        : [...prev, subCat]
    );
  };

  // Apply filters
  useEffect(() => {
    let productCopy = [...products];

    // Apply search filter - FIXED
    if (searchTerm && searchTerm.trim()) {
      // First filter by search term
      const query = searchTerm.toLowerCase();
      productCopy = productCopy.filter(product => 
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query)) ||
        (product.subCatogory && product.subCatogory.toLowerCase().includes(query)) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      productCopy = productCopy.filter(item =>
        selectedCategories.includes(item.category?.toUpperCase())
      );
    }

    // Apply subcategory filter
    if (selectedSubCategories.length > 0) {
      productCopy = productCopy.filter(item => {
        const sub = item.subCategory || item.subCatogory;
        return sub && selectedSubCategories.includes(sub.toUpperCase());
      });
    }

    // Apply sorting
    if (sortType === "low-high") {
      productCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productCopy);
  }, [products, selectedCategories, selectedSubCategories, sortType, searchTerm]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-10 px-4 max-w-7xl mx-auto">
      {/* Filters Sidebar */}
      <div className="w-full sm:w-64">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-full flex items-center justify-between p-3 border rounded-lg mb-4 sm:hidden"
        >
          <span className="font-medium">FILTERS</span>
          <img
            className={`h-3 transition-transform ${showFilter ? "rotate-180" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </button>

        <div className={`${showFilter ? "block" : "hidden"} sm:block`}>
          {/* Category Filter */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3">CATEGORY</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer min-h-[24px]">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize text-gray-700">
                    {cat === "MEN" ? "Men" : 
                     cat === "WOMEN" ? "Women" : 
                     cat === "KIDS" ? "Kids" : cat.toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory Filter */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">TYPES</h3>
            <div className="flex flex-col gap-2">
              {subCategories.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer min-h-[24px]">
                  <input
                    type="checkbox"
                    checked={selectedSubCategories.includes(type)}
                    onChange={() => toggleSubCategory(type)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize text-gray-700">
                    {type === "BOTTOMWEAR" ? "Bottomwear" : 
                     type === "TOPWEAR" ? "Topwear" : 
                     type === "WINTERWEAR" ? "Winterwear" : type.toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="mt-2 sm:mt-0 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Search info */}
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Showing results for: <span className="font-semibold">"{searchTerm}"</span>
              <button 
                onClick={() => window.location.reload()} // Or use a proper clear function
                className="ml-2 text-blue-500 hover:text-blue-700 underline"
              >
                Clear search
              </button>
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filterProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm 
                ? `No products found for "${searchTerm}" matching your filters` 
                : "No products found matching your filters"}
            </p>
            {searchTerm && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterProducts.map((item) => (
                <ProductItem
                  key={item._id || item.id}
                  id={item._id || item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image || item.images?.[0]}
                  bestseller={item.bestseller}
                />
              ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Showing {filterProducts.length} of {products.length} products
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;