import * as types from '../types'

export function TASKS_REQUEST(payload){
    return {
        type: types.TASKS_REQUEST,
        payload: payload,  
    };
}

export function TASKS_SUCCESS(payload){
    return {
        type: types.TASKS_SUCCESS,
        payload: payload
    };
}

export function TASKS_FALURE(payload){
    return  {
        type: types.TASKS_FALURE,
        payload: payload,
    };
}

export function TASKS_CREATE_REQUEST(payload){
    return {
        type: types.TASKS_CREATE_REQUEST,
        payload: payload,  
    };
}

export function TASKS_CREATE_SUCCESS(payload){
    return {
        type: types.TASKS_CREATE_SUCCESS,
        payload: payload
    };
}

export function TASKS_CREATE_FALURE(payload){
    return  {
        type: types.TASKS_CREATE_FALURE,
        payload: payload,
    };
}


export function TASKS_UPDATE_REQUEST(payload){
    return {
        type: types.TASKS_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function TASKS_UPDATE_SUCCESS(payload){
    return {
        type: types.TASKS_UPDATE_SUCCESS,
        payload: payload
    };
}

export function TASKS_UPDATE_FALURE(payload){
    return  {
        type: types.TASKS_UPDATE_FALURE,
        payload: payload,
    };
}


export function TASKS_DELETE_REQUEST(payload){
    return {
        type: types.TASKS_DELETE_REQUEST,
        payload: payload,  
    };
}

export function TASKS_DELETE_SUCCESS(payload){
    return {
        type: types.TASKS_DELETE_SUCCESS,
        payload: payload
    };
}

export function TASKS_DELETE_FALURE(payload){
    return  {
        type: types.TASKS_DELETE_FALURE,
        payload: payload,
    };
}
