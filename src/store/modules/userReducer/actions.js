import * as types from '../types'

export function USERS_REQUEST(payload){
    return {
        type: types.USERS_REQUEST,
        payload: payload,  
    };
}

export function USERS_SUCCESS(payload){
    return {
        type: types.USERS_SUCCESS,
        payload: payload
    };
}

export function USERS_FALURE(payload){
    return  {
        type: types.USERS_FALURE,
        payload: payload,
    };
}

export function USER_CREATE_REQUEST(payload){
    return {
        type: types.USER_CREATE_REQUEST,
        payload: payload,  
    };
}

export function USER_CREATE_SUCCESS(payload){
    return {
        type: types.USER_CREATE_SUCCESS,
        payload: payload
    };
}

export function USER_CREATE_FALURE(payload){
    return  {
        type: types.USER_CREATE_FALURE,
        payload: payload,
    };
}


export function USER_UPDATE_REQUEST(payload){
    return {
        type: types.USER_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function USER_UPDATE_SUCCESS(payload){
    return {
        type: types.USER_UPDATE_SUCCESS,
        payload: payload
    };
}

export function USER_UPDATE_FALURE(payload){
    return  {
        type: types.USER_UPDATE_FALURE,
        payload: payload,
    };
}


export function USER_DELETE_REQUEST(payload){
    return {
        type: types.USER_DELETE_REQUEST,
        payload: payload,  
    };
}

export function USER_DELETE_SUCCESS(payload){
    return {
        type: types.USER_DELETE_SUCCESS,
        payload: payload
    };
}

export function USER_DELETE_FALURE(payload){
    return  {
        type: types.USER_DELETE_FALURE,
        payload: payload,
    };
}
