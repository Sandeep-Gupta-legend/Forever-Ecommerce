import React, { createContext, useState, useEffect, useCallback } from 'react'
import { Backend_URL as APP_BACKEND_URL } from '../App'

export const ShopContext = createContext(null)

const ShopContextProvider = ({ children }) => {
    // Use a single source of truth for the backend URL
    const API_BASE = APP_BACKEND_URL || 'http://localhost:3000'
    const PRODUCT_ENDPOINT = `${API_BASE}/api/product`
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const [showSearch, setShowSearch] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    
    const [cartItems, setCartItems] = useState({})
    
    // ADD ORDERS STATE
    const [orders, setOrders] = useState([])
    
    const [currency] = useState('$')
    const [delivery_fee] = useState(5)
    const [token,setToken]=useState('');
    
    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            setError(null)
            
            try {
                console.log('Fetching products from:', PRODUCT_ENDPOINT)
                const response = await fetch(PRODUCT_ENDPOINT)
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }
                
                const data = await response.json()
                console.log('API Response:', data)
                
                // Your API returns { success: true, data: [...] }
                let productsData = data.data || []
                
                if (!Array.isArray(productsData)) {
                    console.error('Expected array but got:', productsData)
                    productsData = []
                }
                
                const transformedProducts = productsData.map(product => ({
                    ...product,
                    id: product._id || product.id,
                    // Your backend returns images as array
                    image: Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                        ? product.images[0] 
                        : null,
                    images: product.images || [],
                    price: parseFloat(product.price) || 0,
                    bestseller: product.bestseller || false,
                    category: product.category || 'Uncategorized',
                    subCatogory: product.subCategory || product.subCatogory || ''
                }))
                
                console.log('Transformed products:', transformedProducts)
                setProducts(transformedProducts)
            } catch (err) {
                console.error('Error fetching products:', err)
                setError(err.message)
                
                // Fallback data
                const sampleProducts = [
                    {
                        _id: '1',
                        id: 1,
                        name: 'Sample T-Shirt',
                        price: 29.99,
                        description: 'A comfortable sample t-shirt',
                        images: [],
                        category: 'Men',
                        subCategory: 'Topwear',
                        bestseller: true
                    }
                ]
                setProducts(sampleProducts)
            } finally {
                setLoading(false)
            }
        }
        
        fetchProducts()
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cartItems')
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart))
            } catch (err) {
                console.error('Error parsing cart:', err)
            }
        }
        
        // Load orders from localStorage
        const savedOrders = localStorage.getItem('orders')
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders))
            } catch (err) {
                console.error('Error parsing orders:', err)
            }
        }
    }, [])
    
    // Save cart to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])
    
    // Save orders to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders))
    }, [orders])
    
    // ADD ORDER FUNCTION
    const addOrder = (orderData) => {
        const orderId = Date.now() // Unique order ID
        
        // Get current cart items with details
        const cartItemsWithDetails = getCartItemsWithDetails()
        
        // Create order items from cart
        const orderItems = cartItemsWithDetails.map(item => ({
            orderId: orderId,
            productId: item._id || item.id,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
            size: item.size || 'M',
            total: item.price * item.quantity,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            status: 'Processing'
        }))
        
        // Create the order object
        const newOrder = {
            orderId: orderId,
            items: orderItems,
            shippingDetails: orderData.shippingDetails || {},
            paymentMethod: orderData.paymentMethod || 'cod',
            totalAmount: orderData.totalAmount || getCartAmount(),
            orderDate: new Date().toISOString(),
            status: 'Processing',
            trackingNumber: `TRK${orderId.toString().slice(-6)}`
        }
        
        // Add to orders
        const updatedOrders = [newOrder, ...orders]
        setOrders(updatedOrders)
        
        // Clear the cart after order is placed
        setCartItems({})
        localStorage.setItem('cartItems', JSON.stringify({}))
        
        return newOrder
    }
    
    // Cart functions
    const addToCart = (itemId) => {
        setCartItems(prev => {
            const newQuantity = (prev[itemId] || 0) + 1
            return { ...prev, [itemId]: newQuantity }
        })
    }
    
    const removeFromCart = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev }
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1
            } else {
                delete newCart[itemId]
            }
            return newCart
        })
    }
    
    const deleteFromCart = (itemId) => {
        setCartItems(prev => {
            const newCart = { ...prev }
            delete newCart[itemId]
            return newCart
        })
    }
    
    const clearCart = () => {
        setCartItems({})
        localStorage.setItem('cartItems', JSON.stringify({}))
    }
    
    const updateCartQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            deleteFromCart(itemId)
        } else {
            setCartItems(prev => ({ ...prev, [itemId]: newQuantity }))
        }
    }
    
    const getCartItemCount = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)
    }
    
    const getCartAmount = () => {
        let total = 0
        Object.keys(cartItems).forEach(itemId => {
            const item = getProductById(itemId)
            if (item) {
                total += (item.price * cartItems[itemId])
            }
        })
        return total
    }
    
    const getProductById = (productId) => {
        if (!productId) return null
        const idStr = String(productId)
        return products.find(product => 
            String(product._id) === idStr || 
            String(product.id) === idStr || 
            product._id === productId || 
            product.id === productId
        )
    }
    
    const getCartItemsWithDetails = () => {
        return Object.keys(cartItems).map(itemId => {
            const product = getProductById(itemId)
            if (product) {
                return {
                    ...product,
                    quantity: cartItems[itemId],
                    total: product.price * cartItems[itemId]
                }
            }
            return null
        }).filter(item => item !== null)
    }
    
    // Search functions - FIXED
    const performSearch = useCallback((searchQuery) => {
        if (!searchQuery.trim() || !products.length) {
            setSearchResults([])
            return []
        }
        
        const query = searchQuery.toLowerCase()
        const results = products.filter(product => 
            (product.name && product.name.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.category && product.category.toLowerCase().includes(query)) ||
            (product.subCatogory && product.subCatogory.toLowerCase().includes(query)) ||
            (product.subCategory && product.subCategory.toLowerCase().includes(query))
        )
        
        console.log('Search performed:', { query, resultsFound: results.length, results })
        setSearchResults(results)
        return results
    }, [products])
    
    const clearSearch = () => {
        setSearchTerm('')
        setSearchResults([])
        setShowSearch(false)
    }
    
    // Function to open search modal
    const openSearch = () => {
        setShowSearch(true)
    }
    
    // Refresh products
    const refreshProducts = async () => {
        setLoading(true)
        try {
            const response = await fetch(PRODUCT_ENDPOINT)
            const data = await response.json()
            const productsData = data.data || []
            
            const transformedProducts = productsData.map(product => ({
                ...product,
                id: product._id || product.id,
                image: Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                    ? product.images[0] 
                    : null,
                price: parseFloat(product.price) || 0,
                bestseller: product.bestseller || false
            }))
            
            setProducts(transformedProducts)
        } catch (err) {
            console.error('Error refreshing products:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    
    // Product filtering
    const getProductsByCategory = (category) => {
        return products.filter(product => product.category === category)
    }
    
    const getProductsBySubCategory = (subCategory) => {
        return products.filter(product => 
            product.subCategory === subCategory || product.subCatogory === subCategory
        )
    }
    
    const getBestsellerProducts = () => {
        return products.filter(product => product.bestseller)
    }
    
    const getLatestProducts = (count = 10) => {
        return [...products]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, count)
    }
    
    const contextValue = {
        // Products
        products,
        setProducts,
        loading,
        error,
        
        // Search - FIXED
        showSearch,
        setShowSearch,
        openSearch, // Added
        searchResults,
        setSearchResults,
        searchTerm,
        setSearchTerm,
        performSearch,
        clearSearch,
        
        // Cart
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        updateCartQuantity,
        getCartItemCount,
        getCartAmount,
        getCartItemsWithDetails,
        
        // Orders - ADDED
        orders,
        setOrders,
        addOrder,
        
        // Product utilities
        getProductById,
        getProductsByCategory,
        getProductsBySubCategory,
        getBestsellerProducts,
        getLatestProducts,
        refreshProducts,
        
        // Shop settings
        currency,
        delivery_fee,
        token,
        setToken
    }
    
    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider