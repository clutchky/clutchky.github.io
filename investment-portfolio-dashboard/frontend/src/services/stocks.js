import axios from "axios";
const baseUrl = 'http://localhost:3001/api/stocks';

const getAll = () => {
    return axios.get(baseUrl);
}

const create = (newStockObject) => {
    return axios.post(baseUrl, newStockObject);
}

const update = (id, newStockObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newStockObject);
    return request.then(response => response.data);
}

const deleteStock = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

const stockServices = { getAll, create, update, deleteStock };
export default stockServices;