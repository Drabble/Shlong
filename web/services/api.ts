// api.js
import axios from 'axios';
import router from 'next/router';
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SHLONG_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    validateStatus: function (status) {
        if(status === 403){
            Cookies.remove('token');
            router.push('/login');
            return false;
        }
        return true;
    }
});

export default api;