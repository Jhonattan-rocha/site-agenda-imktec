import axios from 'axios';
import { ApiPort, baseURL, protocol } from '../config/appConfig';
import store from '../store';
import * as auth_actions from '../store/modules/authReducer/actions';

const api = axios.create({
    baseURL: `${protocol}${baseURL}:${ApiPort}/`,
    headers: {"Content-Type":"application/json"}
});

api.interceptors.response.use(
    (resposta) => { 
        return resposta;
    },
    (erro) => {
        if (erro.response && erro.response.status === 401) {
            store.dispatch(auth_actions.Loguot());
        }
        return Promise.reject(erro);
    }
);

export default api;