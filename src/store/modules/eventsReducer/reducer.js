import * as type from '../types';
import { toast } from 'react-toastify';


const initialState = {
    events: [],
}

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.EVENTS_SUCCESS: {
            const newState = {...state}
            let aux = [];
            for(let obj of Object.values(action.payload)){
                aux.push(obj);
            }
            newState.events = aux;
            return newState;
        }

        case type.EVENTS_FALURE: {
            toast.error(`Erro ao buscar os eventos`)
            return state
        }

        case type.EVENTS_CREATE_SUCCESS: {
            toast.success("Evento criado com sucesso");
            return state;
        }

        case type.EVENTS_CREATE_FALURE: {
            toast.error(`Erro ao criar o evento`);
            return state;
        }

        case type.EVENTS_UPDATE_SUCCESS: {
            toast.success("Evento editado com sucesso");
            return state;
        }

        case type.EVENTS_UPDATE_FALURE: {
            toast.error(`Erro ao editar o evento`);
            return state;
        }

        case type.EVENTS_DELETE_SUCCESS: {
            toast.success("Evento deletado com sucesso");
            return state;
        }

        case type.EVENTS_DELETE_FALURE: {
            toast.error(`Erro ao deletar o Evento`);
            return state;
        }

      default:
        return state;
    }
};

