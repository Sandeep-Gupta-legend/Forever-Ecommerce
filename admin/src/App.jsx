
import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/login'
import { ToastContainer } from 'react-toastify'
import { Navigate } from 'react-router-dom'// Add this import
import ShopContextProvider from '../../Frontend/src/context/ShopContext'


export const Backend_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
export const currency = '$';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : "")
  
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token])

  return (
    <ShopContextProvider> {/* Wrap with ShopContextProvider */}
      <div className='bg-gray-50 min-h-screen'>
        <ToastContainer/>
        {
          token === "" ? <Login setToken={setToken}/>
          : <>
            <Navbar setToken={setToken}/>
            <hr />
            <div className='flex w-full'>
              <Sidebar/>

              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                <Routes>
                  <Route path="/add" element={<Add token={token}/>} />
                  <Route path="/list" element={<List token={token}/>} />
                  <Route path="/orders" element={<Orders token={token}/>} />
                </Routes>
              </div>
            </div>
          </>
        }
      </div>
    </ShopContextProvider>
  )
}

export default App
