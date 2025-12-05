import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import CheckStatus from './components/CheckStatus'

// Pages
import Home from './pages/Home'
import ProductDetail from './components/ProductDetail'
import SearchResults from './components/SearchResults'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders' // ✅ Add this import

// Export backend URL for all components
export const Backend_URL = 'http://localhost:3000'
export const currency = '$'

function App() {
  const location = useLocation(); // Get current route

  return (
    <>
      <CheckStatus />
      <Navbar />
      {/* Conditionally render SearchBar only on Home and Collection pages */}
      {['/', '/collection'].includes(location.pathname) && <SearchBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} /> {/* ✅ Add this route */}
      </Routes>
      <Footer />
    </>
  )
}

export default App