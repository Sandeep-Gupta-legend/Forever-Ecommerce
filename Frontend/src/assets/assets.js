// Icon imports
import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.svg'
import bin_icon from './bin_icon.png'
import search_icon from './search_icon.png'
import profile_icon from './profile_icon.png'
import cart_icon from './cart_icon.png'
import menu_icon from './menu_icon.png'
import cross_icon from './cross_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import quality_icon from './quality_icon.png'
import star_icon from './star_icon.png'
import star_dull_icon from './star_dull_icon.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'

// Image imports
import hero_image from './hero_img.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import support_img from './support_img.png'

// Product image imports
import p_img1 from './p_img1.png'
import p_img2 from './p_img2.png'
import p_img3 from './p_img3.png'
import p_img4 from './p_img4.png'
import p_img5 from './p_img5.png'
import p_img6 from './p_img6.png'
import p_img7 from './p_img7.png'
import p_img8 from './p_img8.png'
import p_img9 from './p_img9.png'
import p_img10 from './p_img10.png'
import p_img11 from './p_img11.png'
import p_img12 from './p_img12.png'
import p_img13 from './p_img13.png'
import p_img14 from './p_img14.png'
import p_img15 from './p_img15.png'
import p_img16 from './p_img16.png'
import p_img17 from './p_img17.png'
import p_img18 from './p_img18.png'
import p_img19 from './p_img19.png'
import p_img20 from './p_img20.png'
import p_img21 from './p_img21.png'
import p_img22 from './p_img22.png'
import p_img23 from './p_img23.png'
import p_img24 from './p_img24.png'
import p_img25 from './p_img25.png'
import p_img26 from './p_img26.png'
import p_img27 from './p_img27.png'
import p_img28 from './p_img28.png'
import p_img29 from './p_img29.png'
import p_img30 from './p_img30.png'
import p_img31 from './p_img31.png'
import p_img32 from './p_img32.png'
import p_img33 from './p_img33.png'
import p_img34 from './p_img34.png'
import p_img35 from './p_img35.png'
import p_img36 from './p_img36.png'
import p_img37 from './p_img37.png'
import p_img38 from './p_img38.png'
import p_img39 from './p_img39.png'
import p_img40 from './p_img40.png'
import p_img41 from './p_img41.png'
import p_img42 from './p_img42.png'
import p_img43 from './p_img43.png'
import p_img44 from './p_img44.png'
import p_img45 from './p_img45.png'
import p_img46 from './p_img46.png'
import p_img47 from './p_img47.png'
import p_img48 from './p_img48.png'
import p_img49 from './p_img49.png'
import p_img50 from './p_img50.png'
import p_img51 from './p_img51.png'
import p_img2_1 from './p_img2_1.png'
import p_img2_2 from './p_img2_2.png'
import p_img2_3 from './p_img2_3.png'
import p_img2_4 from './p_img2_4.png'

// Products data
export const products = [
    {
        id: 1,
        name: "Women clothes",
        price: 56,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img1],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
    },
   {
     id: 2,
        name: "Classic White T-Shirt",
        price: 150,
        category: "Men",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img2,p_img2_2,p_img2_3,p_img2_4],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 3,
        name: "Classic White T-Shirt",
        price: 300,
        category: "kids",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img3],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 4,
        name: "Classic White T-Shirt",
        price: 200,
        category: "Men",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img4],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 5,
        name: "Women clothes",
        price: 500,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img5],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 6,
        name: "Kids clothes",
        price: 19.99,
        category: "kids",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img6],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 7,
        name: "Pant",
        price: 150,
        category: "Men",
        subCatogory:"Bottomwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img7],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 8,
        name: "Classic White T-Shirt",
        price: 300,
        category: "Men",
        subCatogory:"Winterwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img8],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 9,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img9],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 10,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img10],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 11,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img11],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 12,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img12],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 13,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img13],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 14,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img14],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 15,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img15],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:true
   },
    {
     id: 16,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img16],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 17,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img17],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 18,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img18],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 19,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img19],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },
    {
     id: 20,
        name: "Classic White T-Shirt",
        price: 19.99,
        category: "Women",
        subCatogory:"Topwear",
        Sizes:["S","M","L"],
        date:"2024-06-15",
        image: [p_img20],
        description: "Comfortable 100% cotton t-shirt",
        bestseller:false
   },

   
]

export const assets = {
    // Icons
    logo,
    add_icon,
    order_icon,
    upload_area,
    parcel_icon,
    bin_icon,
    search_icon,
    profile_icon,
    cart_icon,
    menu_icon,
    cross_icon,
    dropdown_icon,
    exchange_icon,
    quality_icon,
    star_icon,
    star_dull_icon,
    razorpay_logo,
    stripe_logo,
    // Images
    hero_image,
    about_img,
    contact_img,
    support_img,
    // Product images
    p_img1,
    p_img2,
    p_img3,
    p_img4,
    p_img5,
    p_img6,
    p_img7,
    p_img8,
    p_img9,
    p_img10,
    p_img11,
    p_img12,
    p_img13,
    p_img14,
    p_img15,
    p_img16,
    p_img17,
    p_img18,
    p_img19,
    p_img20,
    p_img21,
    p_img22,
    p_img23,
    p_img24,
    p_img25,
    p_img26,
    p_img27,
    p_img28,
    p_img29,
    p_img30,
    p_img31,
    p_img32,
    p_img33,
    p_img34,
    p_img35,
    p_img36,
    p_img37,
    p_img38,
    p_img39,
    p_img40,
    p_img41,
    p_img42,
    p_img43,
    p_img44,
    p_img45,
    p_img46,
    p_img47,
    p_img48,
    p_img49,
    p_img50,
    p_img51,
    p_img2_1,
    p_img2_2,
    p_img2_3,
    p_img2_4,
    products
}