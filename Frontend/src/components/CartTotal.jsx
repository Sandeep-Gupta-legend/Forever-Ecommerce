import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
    
    // Safely handle both function and value cases for getCartAmount
    const cartAmount = typeof getCartAmount === 'function'
        ? getCartAmount()
        : getCartAmount || 0;

    const cartAmountNumber = parseFloat(cartAmount) || 0;
    const deliveryFeeNumber = parseFloat(delivery_fee) || 0;
    const totalAmount = cartAmountNumber > 0
        ? cartAmountNumber + deliveryFeeNumber
        : 0;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTALS'}/>
            </div>
            
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>SubTotal</p>
                    <p>{currency}{cartAmountNumber.toFixed(2)}</p>
                </div>
                
                <hr />
                
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{deliveryFeeNumber.toFixed(2)}</p>
                </div>
                
                <hr />
                
                <div className='flex justify-between'>
                    <b>Total</b>
                    <b>{currency}{totalAmount.toFixed(2)}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal