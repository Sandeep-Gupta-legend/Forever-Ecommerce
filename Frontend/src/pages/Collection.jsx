import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products,Search,ShowSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [FilterProducts, setFilterProducts] = useState(products);

  const [Catogory, setCatogory] = useState([]);
  const [SubCatogory, setSubCatogary] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // CATEGORY SELECT
  const toggleCategory = (e) => {
    if (Catogory.includes(e.target.value)) {
      setCatogory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCatogory((prev) => [...prev, e.target.value]);
    }
  };

  // SUBCATEGORY SELECT
  const toggleSubCategory = (e) => {
    if (SubCatogory.includes(e.target.value)) {
      setSubCatogary((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCatogary((prev) => [...prev, e.target.value]);
    }
  };

  // MAIN FILTER FUNCTION
  const ApplyFilter = () => {
    let productCopy = [...products];
    if(ShowSearch && Search){
      productCopy=productCopy.filter(item=> item.name.toLowerCase().includes(Search.toLowerCase()))
    }

    // CATEGORY FILTER (MATCHES YOUR DATA)
    if (Catogory.length > 0) {
      productCopy = productCopy.filter((item) =>
        Catogory.includes(item.category.toUpperCase())
      );
    }

    // SUBCATEGORY FILTER (MATCHES YOUR DATA EXACTLY)
    if (SubCatogory.length > 0) {
      productCopy = productCopy.filter((item) => {
        const sub = item.subCatogory; // your correct key

        return sub && SubCatogory.includes(sub.toUpperCase());
      });
    }

    // SORTING
    if (sortType === "low-high") {
      productCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      productCopy.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(productCopy);
  };

  useEffect(() => {
    ApplyFilter();
  }, [Catogory, SubCatogory, sortType,Search,ShowSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* LEFT FILTERS */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* CATEGORY BOX */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORY</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"MEN"}
                onChange={toggleCategory}
              />
              MEN
            </p>

            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"WOMEN"}
                onChange={toggleCategory}
              />
              WOMEN
            </p>

            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"KIDS"}
                onChange={toggleCategory}
              />
              KIDS
            </p>
          </div>
        </div>

        {/* SUBCATEGORY BOX */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"TOPWEAR"}
                onChange={toggleSubCategory}
              />
              TOPWEAR
            </p>

            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"BOTTOMWEAR"}
                onChange={toggleSubCategory}
              />
              BOTTOMWEAR
            </p>

            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"WINTERWEAR"}
                onChange={toggleSubCategory}
              />
              WINTERWEAR
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PRODUCT SECTION */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4 ml-9">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select
            className="border-2 border-gray-300 text-sm px-2"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {FilterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item.id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
