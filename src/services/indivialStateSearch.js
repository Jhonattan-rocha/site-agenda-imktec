import { alias } from "../config/appConfig";
import axios from "./axios";

export default async function GenericSearch(token="", url="", limit=10, skip=0, filters="", model="") {
    try {
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = await axios.get(`${alias}/${url}/?limit=${encodeURIComponent(limit)}&skip=${encodeURIComponent(skip)}&filters=${encodeURIComponent(filters)}&model=${encodeURIComponent(model)}`);
        let aux = [];
        for(let obj of Object.values(response.data)){
            aux.push(obj);
        }
        return aux;
    } catch (err) {
        console.log(err);
        return null;
    }
}