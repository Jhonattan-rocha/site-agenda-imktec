import * as types from '../types'

export function USER_PROFILES_REQUEST(payload){
    return {
        type: types.USER_PROFILES_REQUEST,
        payload: payload,  
    };
}

export function USER_PROFILES_SUCCESS(payload){
    return {
        type: types.USER_PROFILES_SUCCESS,
        payload: payload
    };
}

export function USER_PROFILES_FALURE(payload){
    return  {
        type: types.USER_PROFILES_FALURE,
        payload: payload,
    };
}

export function USER_PROFILES_CREATE_REQUEST(payload){
    return {
        type: types.USER_PROFILES_CREATE_REQUEST,
        payload: payload,  
    };
}

export function USER_PROFILES_CREATE_SUCCESS(payload){
    return {
        type: types.USER_PROFILES_CREATE_SUCCESS,
        payload: payload
    };
}

export function USER_PROFILES_CREATE_FALURE(payload){
    return  {
        type: types.USER_PROFILES_CREATE_FALURE,
        payload: payload,
    };
}


export function USER_PROFILES_UPDATE_REQUEST(payload){
    return {
        type: types.USER_PROFILES_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function USER_PROFILES_UPDATE_SUCCESS(payload){
    return {
        type: types.USER_PROFILES_UPDATE_SUCCESS,
        payload: payload
    };
}

export function USER_PROFILES_UPDATE_FALURE(payload){
    return  {
        type: types.USER_PROFILES_UPDATE_FALURE,
        payload: payload,
    };
}


export function USER_PROFILES_DELETE_REQUEST(payload){
    return {
        type: types.USER_PROFILES_DELETE_REQUEST,
        payload: payload,  
    };
}

export function USER_PROFILES_DELETE_SUCCESS(payload){
    return {
        type: types.USER_PROFILES_DELETE_SUCCESS,
        payload: payload
    };
}

export function USER_PROFILES_DELETE_FALURE(payload){
    return  {
        type: types.USER_PROFILES_DELETE_FALURE,
        payload: payload,
    };
}
