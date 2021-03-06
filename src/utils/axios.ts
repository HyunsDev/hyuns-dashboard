import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

instance.defaults.headers.common['Authorization'] = localStorage.getItem('token') || '';

export { instance }