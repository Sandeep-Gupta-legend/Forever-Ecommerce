import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>

      <div className='w-full sm:w-1/2 flex flex-col items-center justify-center py-10 sm:py-0'>

        <div className='text-[#414141] flex flex-col items-start gap-1'>

          {/* BESTSELLER */}
          <div className='flex items-center gap-1'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLER</p>
          </div>

          {/* HEADING */}
          <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl leading-relaxed font-bold'>
            Latest Arrivals
          </h1>

          {/* SHOP NOW (Now Below!) */}
          <div className='flex items-center gap-1 mt-1'>
            <p className='font-semibold text-sm md:text-base cursor-pointer'>
              SHOP NOW
            </p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>

        </div>

      </div>
      <img src={assets.hero_image} className='w-full sm:w-1/2 h-99' />

    </div>
  )
}

export default Hero
