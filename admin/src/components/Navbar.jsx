import React from 'react'
import assets from '../assets/assets'

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (typeof setToken === 'function') setToken('');
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 4%' }}>
        <img src={assets.logo} alt="Logo" style={{ height: 40, width: 'auto' }} />
        <button onClick={handleLogout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar