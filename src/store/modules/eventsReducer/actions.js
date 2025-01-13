import * as types from '../types'

export function EVENTS_REQUEST(payload){
    return {
        type: types.EVENTS_REQUEST,
        payload: payload,  
    };
}

export function EVENTS_SUCCESS(payload){
    return {
        type: types.EVENTS_SUCCESS,
        payload: payload
    };
}

export function EVENTS_FALURE(payload){
    return  {
        type: types.EVENTS_FALURE,
        payload: payload,
    };
}

export function EVENTS_CREATE_REQUEST(payload){
    return {
        type: types.EVENTS_CREATE_REQUEST,
        payload: payload,  
    };
}

export function EVENTS_CREATE_SUCCESS(payload){
    return {
        type: types.EVENTS_CREATE_SUCCESS,
        payload: payload
    };
}

export function EVENTS_CREATE_FALURE(payload){
    return  {
        type: types.EVENTS_CREATE_FALURE,
        payload: payload,
    };
}

export function EVENTS_DUPLICATE_CREATE_REQUEST(payload){
    return {
        type: types.EVENTS_DUPLICATE_CREATE_REQUEST,
        payload: payload,  
    };
}

export function EVENTS_DUPLICATE_CREATE_SUCCESS(payload){
    return {
        type: types.EVENTS_DUPLICATE_CREATE_SUCCESS,
        payload: payload
    };
}

export function EVENTS_DUPLICATE_CREATE_FALURE(payload){
    return  {
        type: types.EVENTS_DUPLICATE_CREATE_FALURE,
        payload: payload,
    };
}

export function EVENTS_UPDATE_REQUEST(payload){
    return {
        type: types.EVENTS_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function EVENTS_UPDATE_SUCCESS(payload){
    return {
        type: types.EVENTS_UPDATE_SUCCESS,
        payload: payload
    };
}

export function EVENTS_UPDATE_FALURE(payload){
    return  {
        type: types.EVENTS_UPDATE_FALURE,
        payload: payload,
    };
}


export function EVENTS_DELETE_REQUEST(payload){
    return {
        type: types.EVENTS_DELETE_REQUEST,
        payload: payload,  
    };
}

export function EVENTS_DELETE_SUCCESS(payload){
    return {
        type: types.EVENTS_DELETE_SUCCESS,
        payload: payload
    };
}

export function EVENTS_DELETE_FALURE(payload){
    return  {
        type: types.EVENTS_DELETE_FALURE,
        payload: payload,
    };
}
