import React, { useState } from 'react'
import axios from 'axios'
import { Backend_URL } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({setToken}) => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSumbitHandler=async(e)=>{
        e.preventDefault();
        setLoading(true);
        
        // Add default backend URL for local development
        const backendUrl = Backend_URL || 'http://localhost:3000';
        const url = `${backendUrl}/api/user/adminlogin`;
        
        console.log('Attempting login to:', url);
        console.log('With credentials:', { email, password });
        
        try{
            const response = await axios.post(url, { 
                email: email.trim(), 
                password: password.trim() 
            }, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = response.data;
            console.log('Login response:', data);
            
            if(data && data.success){
                const token = data.token;
                console.log('Token received:', token ? 'Yes' : 'No');
                localStorage.setItem('token', token);
                if(typeof setToken === 'function') setToken(token);
                toast.success('Login successful');
                navigate('/list');
            } else {
                toast.error(data?.message || 'Invalid email or password');
            }
        }catch(error){
            console.error('Login error details:', error);
            
            // Detailed error handling
            if(error.code === 'ECONNREFUSED'){
                toast.error('Cannot connect to server. Make sure backend is running.');
                console.error('Backend URL:', backendUrl);
            } else if(error.code === 'ENETUNREACH' || error.code === 'ENOTFOUND'){
                toast.error('Network error. Check your internet connection.');
            } else if(error.code === 'ERR_NETWORK'){
                toast.error('Network error. Cannot reach the server.');
            } else if(error.response){
                // Server responded with error status
                const status = error.response.status;
                const data = error.response.data;
                
                if(status === 401 || status === 403){
                    toast.error(data?.message || 'Invalid credentials');
                } else if(status === 404){
                    toast.error('Login endpoint not found. Check backend routes.');
                } else if(status >= 500){
                    toast.error('Server error. Please try again later.');
                } else {
                    toast.error(data?.message || `Error: ${status}`);
                }
                console.error('Server response error:', data);
            } else if(error.request){
                // Request was made but no response
                toast.error('No response from server. Check if backend is running.');
                console.error('No response received. Request:', error.request);
            } else {
                // Other errors
                toast.error(error.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full mx-4'>
            <h1 className='text-2xl font-bold mb-6 text-center'>Admin Panel</h1>
            <form onSubmit={onSumbitHandler}>
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                    <input 
                        onChange={(e)=>setEmail(e.target.value)} 
                        value={email} 
                        className='rounded-md w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition' 
                        type="email" 
                        placeholder='admin@example.com' 
                        required
                        disabled={loading}
                    />
                </div>

                 <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                    <input 
                        onChange={(e)=>setPassword(e.target.value)} 
                        value={password}  
                        className='rounded-md w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition' 
                        type="password" 
                        placeholder='Enter admin password' 
                        required
                        disabled={loading}
                    />
                </div>
                
                <button 
                    className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`} 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                
               
            </form>
        </div>
    </div>
  )
}

export default Login