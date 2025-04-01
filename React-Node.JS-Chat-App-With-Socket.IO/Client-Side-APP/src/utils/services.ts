import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

export const postRequest = (url: string, body: Object) => {
    return axios.post(url, body, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
}

export const getRequest = (url: string) => {
    return axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
}