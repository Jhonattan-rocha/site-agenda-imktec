import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Profiles({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}/user_profile/?limit=${encodeURIComponent(payload.limit)}&skip=${encodeURIComponent(payload.skip)}&filters=${encodeURIComponent(payload.filters)}`);
        yield put(actions.USER_PROFILES_SUCCESS({ ...response.data }));
    } catch (err) {
        yield put(actions.USER_PROFILES_FALURE({error: err}));
    }
}

function* CreateUserProfile({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/user_profile/", payload);
        for(let permission of payload.permissions){
            let data = {
                entity_name: permission.entity_name,
                can_view: permission.can_view,
                can_delete: permission.can_delete,
                can_update: permission.can_update,
                can_create: permission.can_create,
                profile_id: response.data.id
            }
            yield call(axios.post, `${alias}`+"/permissions/", data);
        }
        yield put(actions.USER_PROFILES_CREATE_SUCCESS({ ...response.data }));

    } catch (err) {
        console.log(err);
        yield put(actions.USER_PROFILES_CREATE_FALURE({error: err}));
    }
}

function* UpdateUserProfile({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}`+`/user_profile/${payload.id}`, payload);
        for(let permission of payload.permissions){
            let data = {
                ...permission,
                profile_id: payload.id
            }
            if(!permission.id){
                yield call(axios.post, `${alias}`+"/permissions/", data);
            }else{
                yield call(axios.put, `${alias}`+`/permissions/${permission.id}`, data);
            }
        }
        yield put(actions.USER_PROFILES_UPDATE_SUCCESS({ ...response.data }));


    } catch (err) {
        console.log(err)
        yield put(actions.USER_PROFILES_UPDATE_FALURE({error: err}));
    }
}

function* DeleteUserProfile({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        for(let permission of payload.permissions){
            yield call(axios.delete, `${alias}`+`/permissions/${permission.id}`);
        }
        const response = yield call(axios.delete, `${alias}`+`/user_profile/${payload.id}`, payload);
        yield put(actions.USER_PROFILES_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.USER_PROFILES_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.USER_PROFILES_REQUEST, Profiles),
    takeLatest(types.USER_PROFILES_CREATE_REQUEST, CreateUserProfile),
    takeLatest(types.USER_PROFILES_UPDATE_REQUEST, UpdateUserProfile),
    takeLatest(types.USER_PROFILES_DELETE_REQUEST, DeleteUserProfile)
]);
