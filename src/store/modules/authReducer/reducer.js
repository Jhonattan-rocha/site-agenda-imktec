import * as type from '../types';
import { toast } from 'react-toastify';

const initialState = {
    isLoggedIn: false,
    type: "",
    token: "",
    user: {},
    crypt_token: "",
    iv: []
}
// caso precise de mais de um reducer, usar a função combineReducer

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.LOGIN_SUCCESS: {
            const newState = {...state};
            newState.user = action.payload.user;
            newState.token = action.payload.access_token;
            newState.type = action.payload.token_type;
            newState.isLoggedIn = true;
            newState.crypt_token = action.payload.crypt_token;
            newState.iv = action.payload.iv;
            return newState;
        }

        case type.LOGIN_FALURE: {
            toast.error("Erro ao realizar o login");
            const newState = initialState;
            return newState;
        }

        case type.LOGOUT: {
            const newState = initialState;
            toast.success("Login feito com sucesso");
            return newState;
        }

      // aqui você pode definir suas ações e como o estado deve ser atualizado;
      default:
        return state;
    }
};

