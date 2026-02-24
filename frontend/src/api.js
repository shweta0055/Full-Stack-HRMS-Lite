import axios from 'axios';

const API_BASE_URL = 'https://ideal-consideration-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeApi = {
    list: () => api.get('/employees/'),
    get: (id) => api.get(`/employees/${id}/`),
    create: (data) => api.get('/employees/', { method: 'POST', data }), // Using create helper or just POST
    // wait, fix create:
    create: (data) => api.post('/employees/', data),
    update: (id, data) => api.put(`/employees/${id}/`, data),
    delete: (id) => api.delete(`/employees/${id}/`),
    getDashboardStats: () => api.get('/employees/dashboard_stats/'),
};

export const attendanceApi = {
    list: (employeeId = null) => {
        let url = '/attendances/';
        if (employeeId) url += `?employee_id=${employeeId}`;
        return api.get(url);
    },
    mark: (data) => api.post('/attendances/', data),
    delete: (id) => api.delete(`/attendances/${id}/`),
};

export default api;
