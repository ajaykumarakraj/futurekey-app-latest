import axios from 'axios';

const ApiClient = axios.create({
    baseURL: 'https://api.almonkdigital.in/api',

    headers: {
        'Content-Type': 'application/json',
    },
});

export default ApiClient;
