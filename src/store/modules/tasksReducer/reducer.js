import * as type from '../types';
import { toast } from 'react-toastify';


const initialState = {
    tasks: [],
}

export default function recuder(state = initialState, action){
    switch (action.type) {
        case type.TASKS_SUCCESS: {
            const newState = {...state}
            let aux = [];
            for(let obj of Object.values(action.payload)){
                aux.push(obj);
            }
            newState.tasks = aux;
            return newState;
        }

        case type.TASKS_FALURE: {
            toast.error(`Erro ao buscar as tarefas`)
            return state
        }

        case type.TASKS_CREATE_SUCCESS: {
            toast.success("Tarefa criada com sucesso");
            return state;
        }

        case type.TASKS_CREATE_FALURE: {
            toast.error(`Erro ao criar a tarefa`);
            return state;
        }

        case type.TASKS_UPDATE_SUCCESS: {
            toast.success("Tarefa editada com sucesso");
            return state;
        }

        case type.TASKS_UPDATE_FALURE: {
            toast.error(`Erro ao editar a tarefa`);
            return state;
        }

        case type.TASKS_DELETE_SUCCESS: {
            toast.success("Tarefa deletada com sucesso");
            return state;
        }

        case type.TASKS_DELETE_FALURE: {
            toast.error(`Erro ao deletar a tarefa`);
            return state;
        }

      default:
        return state;
    }
};

