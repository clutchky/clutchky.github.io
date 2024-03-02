import axios from "axios";
const baseUrl = '/api/stocks';

let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`;
}

const getAll = async () => {
    return await axios.get(baseUrl);
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
}

const updateOne = async (id, newObject) => {

    const config = {
        headers: { Authorization: token },
    }

    return await axios.put(`${baseUrl}/${id}`, newObject, config);
}

const removeOne = async (id) => {

    const config = {
        headers: { Authorization: token },
    }

    await axios.delete(`${baseUrl}/${id}`, config);
}

const stocksService = { getAll, create, updateOne, removeOne, setToken }

export default stocksService;