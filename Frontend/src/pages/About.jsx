import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'
import NewsLetterBox from '../components/NewsLetterBox'


const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 border-2'>
        <img src={assets.about_img} alt="" className='w-full md:max-w-[450px]'/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam nulla eius distinctio laudantium cumque obcaecati, enim voluptate? Odio molestiae soluta mollitia reiciendis corrupti nemo ea cum nihil. Harum, dolorum dolores.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum iure harum iusto sit, nostrum saepe ab necessitatibus ex obcaecati, quo molestiae, provident veniam enim ratione commodi accusamus sunt earum?</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis quis ipsam qui placeat reprehenderit, dolorem alias nesciunt omnis officiis? Velit laudantium rerum neque vel possimus quas iure repellat asperiores facere.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
       <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus facilis eveniet odit voluptatibus laborum adipisci repellendus eius dignissimos provident nisi, harum magni at in perspiciatis architecto autem non! Similique, nihil.</p>


        </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus facilis eveniet odit voluptatibus laborum adipisci repellendus eius dignissimos provident nisi, harum magni at in perspiciatis architecto autem non! Similique, nihil.</p>
          

        </div>

          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus facilis eveniet odit voluptatibus laborum adipisci repellendus eius dignissimos provident nisi, harum magni at in perspiciatis architecto autem non! Similique, nihil.</p>
          

        </div>

      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default About
