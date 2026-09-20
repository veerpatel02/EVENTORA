import React from 'react'

const axios = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
            'Content-Type': 'application/json',
    },
});

api.interceotors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
});

export default axios
