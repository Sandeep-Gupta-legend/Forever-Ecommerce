import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../assets/assets";
import { useState } from "react";
import { toast } from "react-toastify";

 export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const [Search, setSearch] = useState('');
    const [ShowSearch, setShowSearch] = useState(false);
    const [CartItems, setCartItems] = useState({});
    const navigate= useNavigate();

    const AddToCart = (itemId, size) => {
        if (!size) {
            toast.error('Please select a product size');
            return false;
        }
        
        setCartItems(prevCartItems => {
            const CartData = { ...prevCartItems };
            
            if (CartData[itemId]) {
                if (CartData[itemId][size]) {
                    CartData[itemId][size] += 1;
                } else {
                    CartData[itemId][size] = 1;
                }
            } else {
                CartData[itemId] = {};
                CartData[itemId][size] = 1;
            }
            
            toast.success('Product added to cart!');
            return CartData;
        });
        return true;
    }

    const getCartItemCount = () => {
        let totalcount = 0;
        for(const items in CartItems){
            for(const item in CartItems[items]){
                try{
                    if(CartItems[items][item]>0){
                        totalcount+=CartItems[items][item]
                    }
                }catch(error){
                    console.error(error);
                }
            }
        }
        return totalcount;
    }

    const updatequantity = (itemId,size,quantity) =>{
        let CartData = {...CartItems};
        CartData[itemId][size]=quantity;
        setCartItems(CartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const itemId in CartItems){
            // Convert itemId to number for product lookup
            const productId = Number(itemId);
            const itemInfo = products.find(product => product.id === productId);
            
            if(itemInfo) {
                for(const size in CartItems[itemId]){
                    try{
                        const quantity = CartItems[itemId][size];
                        if(quantity > 0){
                            totalAmount += itemInfo.price * quantity;
                        }
                    }catch(error){
                        console.error(error);
                    }
                }
            }
        }
        return totalAmount;
    }

    const value = {
        products, 
        currency, 
        delivery_fee,
        Search, 
        setSearch, 
        ShowSearch, 
        setShowSearch,
        CartItems, 
        AddToCart,
        getCartItemCount,
        updatequantity,
        getCartAmount,
        navigate
    }

    useEffect(() => {
        console.log('Cart updated:', CartItems);
    }, [CartItems])

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;