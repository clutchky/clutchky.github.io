import axios from "axios";
const baseUrl = 'http://localhost:3001/stocks';

const getAll = () => {
    return axios.get(baseUrl);
}

const create = newObject => {
    return axios.post(baseUrl, newObject);
}

const stocksService = {
    getAll: getAll,
    create: create
}

export default stocksService;