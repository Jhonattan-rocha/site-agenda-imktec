import * as type from '../types';
import { toast } from 'react-toastify';

const initialState = {
    users: [],
}

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.USERS_SUCCESS: {
            const newState = {...state}
            let aux = [];
            for(let obj of Object.values(action.payload)){
                aux.push(obj);
            }
            newState.users = aux;
            return newState;
        }

        case type.USERS_FALURE: {
            toast.error(`Erro ao buscar o usuário`)
            return state
        }

        case type.USER_CREATE_SUCCESS: {
            toast.success("Usuário criado com sucesso");
            return state;
        }

        case type.USER_CREATE_FALURE: {
            toast.error(`Erro ao criar o usuário`);
            return state;
        }

        case type.USER_UPDATE_SUCCESS: {
            toast.success("Usuário editado com sucesso");
            return state;
        }

        case type.USER_UPDATE_FALURE: {
            toast.error(`Erro ao editar o usuário`);
            return state;
        }

        case type.USER_DELETE_SUCCESS: {
            toast.success("Usuário deletado com sucesso");
            return state;
        }

        case type.USER_DELETE_FALURE: {
            toast.error(`Erro ao deletar o usuário`);
            return state;
        }

      default:
        return state;
    }
};

