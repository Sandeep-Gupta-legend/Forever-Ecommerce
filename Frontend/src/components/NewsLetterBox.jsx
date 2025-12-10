import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler=(event)=>{
        event.preventDefault();

    }
  return (
    <div className='text-center py-12'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe  now to get 20% off</p>
        <p className='text-gay-700 mt-3'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit minus quis autem. Eligendi suscipit sunt neque illo laborum vero natus mollitia totam qui. Libero eius in placeat illo vitae.</p>
      
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input type='email' placeholder='Enter you email' className='w-full sm:flex-1 outline-none' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      
      </form>
    </div>
  )
}

export default NewsLetterBox
