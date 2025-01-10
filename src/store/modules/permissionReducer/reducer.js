import * as type from '../types';
import { toast } from 'react-toastify';

const initialState = {
    permissions: [],
}
// caso precise de mais de um reducer, usar a função combineReducer

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.PERMISSIONS_SUCCESS: {
            const newState = {...state}
            let aux = [];
            for(let obj of Object.values(action.payload)){
                aux.push(obj);
            }
            newState.permissions = aux;
            return newState;
        }

        case type.PERMISSIONS_FALURE: {
            toast.error(`Erro ao buscar as permissões`)
            return state
        }

        case type.PERMISSION_CREATE_SUCCESS: {
            toast.success("Permissão criada!!!");
            return state;
        }

        case type.PERMISSION_CREATE_FALURE: {
            toast.error(`Erro ao criar a permissão`);
            return state;
        }

        case type.PERMISSION_UPDATE_SUCCESS: {
            toast.success("Permissão editado!!!");
            return state;
        }

        case type.PERMISSION_UPDATE_FALURE: {
            toast.error(`Erro ao editar a permissão`);
            return state;
        }

        case type.PERMISSION_DELETE_SUCCESS: {
            toast.success("Permissão deletada!!!");
            return state;
        }

        case type.PERMISSION_DELETE_FALURE: {
            toast.error(`Erro ao deletar a permissão`);
            return state;
        }

      default:
        return state;
    }
};

