import api from '../api/axios';

export const login = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const getMembers = async (page, limit) => {
    const response = await api.get(`/member?page=${page}&limit=${limit}`);
    return response.data;
};

export const getTickets = async (page, limit) => {
    const response = await api.get(`/ticket?page=${page}&limit=${limit}`);
    return response.data;
};

export const addTicket = async (data) => {
    const response = await api.post('/ticket/manual', data);
    return response.data;
};

export const updateTicket = async (id, data) => {
    const response = await api.put(`/ticket/${id}`, data);
    return response.data;
};

export const deleteTicket = async (id) => {
    const response = await api.delete(`/ticket/${id}`);
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/ticket/stats');
    return response.data;
};

export const addMember = async (data) => {
    const response = await api.post('/member', data);
    return response.data;
};

export const updateMember = async (id, data) => {
    const response = await api.put(`/member/${id}`, data);
    return response.data;
};

export const deleteMember = async (id) => {
    const response = await api.delete(`/member/${id}`);
    return response.data;
};

export const getBuildings = async () => {
    const response = await api.get('/buildings');
    return response.data;
};

export const getPaginatedBuildings = async () => {
    const response = await api.get('/buildings/paginated');
    return response.data;
};

export const deleteBuilding = async (id) => {
    const response = await api.delete(`/buildings/${id}`);
    return response.data;
};

export const addBuilding = async (data) => {
    const response = await api.post('/buildings', data);
    return response.data;
};

export const updateBuilding = async (id, data) => {
    const response = await api.put(`/buildings/${id}`, data);
    return response.data;
};



