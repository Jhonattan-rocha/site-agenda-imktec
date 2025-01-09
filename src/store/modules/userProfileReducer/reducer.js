import * as type from '../types';
import { toast } from 'react-toastify';


const initialState = {
    profiles: [],
}

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.USER_PROFILES_SUCCESS: {
            const newState = {...state}
            let aux = [];
            for(let obj of Object.values(action.payload)){
                aux.push(obj);
            }
            newState.profiles = aux;
            return newState;
        }

        case type.USER_PROFILES_FALURE: {
            toast.error(`Erro ao buscar os perfis: ${action.payload.error.response.data.detail}`)
            return state
        }

        case type.USER_PROFILES_CREATE_SUCCESS: {
            toast.success("Perfil criado com sucesso");
            return state;
        }

        case type.USER_PROFILES_CREATE_FALURE: {
            toast.error(`Erro ao criar o perfil: ${action.payload.error.response.data.detail}`);
            return state;
        }

        case type.USER_PROFILES_UPDATE_SUCCESS: {
            toast.success("Perfil editado com sucesso");
            return state;
        }

        case type.USER_PROFILES_UPDATE_FALURE: {
            toast.error(`Erro ao editar o perfil: ${action.payload.error.response.data.detail}`);
            return state;
        }

        case type.USER_PROFILES_DELETE_SUCCESS: {
            toast.success("Perfil deletado com sucesso");
            return state;
        }

        case type.USER_PROFILES_DELETE_FALURE: {
            toast.error(`Erro ao deletar o perfil: ${action.payload.error.response.data.detail}`);
            return state;
        }

      default:
        return state;
    }
};

