import * as types from '../types'

export function GENERICS_REQUEST(payload){
    return {
        type: types.GENERICS_REQUEST,
        payload: payload,  
    };
}

export function GENERICS_SUCCESS(payload){
    return {
        type: types.GENERICS_SUCCESS,
        payload: payload
    };
}

export function GENERICS_FALURE(payload){
    return  {
        type: types.GENERICS_FALURE,
        payload: payload,
    };
}

export function GENERIC_CREATE_REQUEST(payload){
    return {
        type: types.GENERIC_CREATE_REQUEST,
        payload: payload,  
    };
}

export function GENERIC_CREATE_SUCCESS(payload){
    return {
        type: types.GENERIC_CREATE_SUCCESS,
        payload: payload
    };
}

export function GENERIC_CREATE_FALURE(payload){
    return  {
        type: types.GENERIC_CREATE_FALURE,
        payload: payload,
    };
}


export function GENERIC_UPDATE_REQUEST(payload){
    return {
        type: types.GENERIC_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function GENERIC_UPDATE_SUCCESS(payload){
    return {
        type: types.GENERIC_UPDATE_SUCCESS,
        payload: payload
    };
}

export function GENERIC_UPDATE_FALURE(payload){
    return  {
        type: types.GENERIC_UPDATE_FALURE,
        payload: payload,
    };
}


export function GENERIC_DELETE_REQUEST(payload){
    return {
        type: types.GENERIC_DELETE_REQUEST,
        payload: payload,  
    };
}

export function GENERIC_DELETE_SUCCESS(payload){
    return {
        type: types.GENERIC_DELETE_SUCCESS,
        payload: payload
    };
}

export function GENERIC_DELETE_FALURE(payload){
    return  {
        type: types.GENERIC_DELETE_FALURE,
        payload: payload,
    };
}

export function RESET_GENERIC_REQUEST(payload){
    return {
        type: types.RESET_GENERIC_REQUEST,
        payload: payload,  
    };
}

export function RESET_GENERIC_SUCCESS(payload){
    return {
        type: types.RESET_GENERIC_SUCCESS,
        payload: payload
    };
}

export function RESET_GENERIC_FALURE(payload){
    return  {
        type: types.RESET_GENERIC_FALURE,
        payload: payload,
    };
}
