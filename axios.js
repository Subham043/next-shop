import axios from 'axios';
import constant from './constant';



const instance = axios.create({
    baseURL: constant.api_route,
    headers: {
        post: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
        get: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
    },
    withCredentials: false,
})

export default instance;