const axios = require('axios');

class ApiService {
    static token = '';

    constructor({ Username, Password }) {
        this.baseURL = 'https://app.smartadvocate.com';
        this.authEndpoint = '/CaseSyncAPI/Users/authenticate';
        this.createCaseEndpoint = '/CaseSyncAPI/case/CreateCase';
        this.getCaseGroupsEndpoint = '/CaseSyncAPI/case/CaseGroup';
        this.auth = {
            Username,
            Password
        }

        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add interceptor to always use the latest token
        this.axiosInstance.interceptors.request.use((config) => {
            if (ApiService.token) {
                config.headers = config.headers || { 'Content-Type': 'application/json' };
                config.headers['Authorization'] = `Bearer ${ApiService.token}`;
            }
            return config;
        });

        this.getToken().then((data) => {
            ApiService.token = data?.token;
            console.log('App authenticated successfully!');
        });
    }

    async getToken() {
        const response = await this.axiosInstance.post(
            this.authEndpoint,
            this.auth
        );
        if (response.status !== 200) {
            console.log(response);
            throw new Error('Failed to authenticate and retrieve token');
        }
        return response.data;
    }

    async createCase(payload) {
        const response = await this.axiosInstance.post(
            this.createCaseEndpoint,
            payload
        );
        if (response.status !== 200) {
            return { status: response.status, message: response.data?.message, meta: response.statusText };
        }
        console.log(response);
        return response.data;
    }

    async getCaseGroups() {
        const response = await this.axiosInstance.get(this.getCaseGroupsEndpoint)
        if (response.status !== 200) {
            return { status: response.status, message: response.data?.message, meta: response.statusText };
        }
        console.log(response);
        return response.data;
    }
}


module.exports = ApiService;