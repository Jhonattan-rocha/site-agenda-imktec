import * as types from '../types'

export function PERMISSIONS_REQUEST(payload){
    return {
        type: types.PERMISSIONS_REQUEST,
        payload: payload,  
    };
}

export function PERMISSIONS_SUCCESS(payload){
    return {
        type: types.PERMISSIONS_SUCCESS,
        payload: payload
    };
}

export function PERMISSIONS_FALURE(payload){
    return  {
        type: types.PERMISSIONS_FALURE,
        payload: payload,
    };
}

export function PERMISSION_CREATE_REQUEST(payload){
    return {
        type: types.PERMISSION_CREATE_REQUEST,
        payload: payload,  
    };
}

export function PERMISSION_CREATE_SUCCESS(payload){
    return {
        type: types.PERMISSION_CREATE_SUCCESS,
        payload: payload
    };
}

export function PERMISSION_CREATE_FALURE(payload){
    return  {
        type: types.PERMISSION_CREATE_FALURE,
        payload: payload,
    };
}


export function PERMISSION_UPDATE_REQUEST(payload){
    return {
        type: types.PERMISSION_UPDATE_REQUEST,
        payload: payload,  
    };
}

export function PERMISSION_UPDATE_SUCCESS(payload){
    return {
        type: types.PERMISSION_UPDATE_SUCCESS,
        payload: payload
    };
}

export function PERMISSION_UPDATE_FALURE(payload){
    return  {
        type: types.PERMISSION_UPDATE_FALURE,
        payload: payload,
    };
}


export function PERMISSION_DELETE_REQUEST(payload){
    return {
        type: types.PERMISSION_DELETE_REQUEST,
        payload: payload,  
    };
}

export function PERMISSION_DELETE_SUCCESS(payload){
    return {
        type: types.PERMISSION_DELETE_SUCCESS,
        payload: payload
    };
}

export function PERMISSION_DELETE_FALURE(payload){
    return  {
        type: types.PERMISSION_DELETE_FALURE,
        payload: payload,
    };
}
