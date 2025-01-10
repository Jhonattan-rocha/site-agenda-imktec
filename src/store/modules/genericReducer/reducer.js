import * as type from '../types';
import { toast } from 'react-toastify';

const initialState = {
    generics: {
        "User": [],
        "UserProfile": [],
    },
}

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.GENERICS_SUCCESS: {
            if(Object.keys(action.payload).length <= 0){
                return initialState;
            }

            const newState = {...state}
            let data = action.payload;
            let model = '';
            let filtered_data = new Set([]);
            for(let item of Object.values(data)){
                filtered_data.add(item);
                model = item.model
            }
            newState.generics = {...newState.generics, [model]: filtered_data}
            return newState;
        }

        case type.GENERICS_FALURE: {
            toast.error(`Erro ao buscar`)
            return state
        }

        case type.GENERIC_CREATE_SUCCESS: {
            toast.success("Criado!!!");
            return state;
        }

        case type.GENERIC_CREATE_FALURE: {
            toast.error(`Erro ao criar`);
            return state;
        }

        case type.GENERIC_UPDATE_SUCCESS: {
            toast.success("Editado!!!");
            return state;
        }

        case type.GENERIC_UPDATE_FALURE: {
            toast.error(`Erro ao editar`);
            return state;
        }

        case type.GENERIC_DELETE_SUCCESS: {
            toast.success("Deletado!!!");
            return state;
        }

        case type.GENERIC_DELETE_FALURE: {
            toast.error(`Erro ao deletar`);
            return state;
        }

        case type.RESET_GENERIC_REQUEST: {
            return {...initialState};
        }

      default:
        return state;
    }
};

