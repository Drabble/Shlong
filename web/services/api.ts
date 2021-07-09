// api.js
import axios from 'axios';
import router from 'next/router';
import Cookies from "js-cookie";

let urls = {
    test: `http://localhost:5000`,
    development: 'http://localhost:5000/',
    production: 'https://your-production-url.com/'
}
const api = axios.create({
    baseURL: urls[process.env.NODE_ENV],
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