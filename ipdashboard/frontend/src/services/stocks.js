import axios from "axios";
const baseUrl = '/api/stocks';

const getAll = () => {
    return axios.get(baseUrl);
}

const create = newObject => {
    return axios.post(baseUrl, newObject);
}

const updateOne = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject);
}

const removeOne = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

const stocksService = { getAll, create, updateOne, removeOne }

export default stocksService;