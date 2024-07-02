import axios from 'axios';
import { parseCookies } from 'nookies'

const cookies = parseCookies();


(function () {
    const token = cookies['SolidarIta.token'];
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${cookies['SolidarIta.token']}`;
    } else {
        axios.defaults.headers.common['Authorization'] = '';
    }
})();

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Access-Control-Allow-Origin': `${process.env.REACT_APP_API_URL}`
    }

})

export default api