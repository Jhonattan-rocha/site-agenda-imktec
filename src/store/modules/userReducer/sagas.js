import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Users({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}/user/?limit=${encodeURIComponent(payload.limit)}&skip=${encodeURIComponent(payload.skip)}&filters=${encodeURIComponent(payload.filters)}`);
        yield put(actions.USERS_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.USERS_FALURE({error: err}));
    }
}

function* CreateUser({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/user/", payload);
        yield put(actions.USER_CREATE_SUCCESS({ ...response.data }));

    } catch (err) {
        console.log(err)
        yield put(actions.USER_CREATE_FALURE({error: err}));
    }
}

function* UpdateUser({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}`+`/user/${payload.id}`, payload);
        yield put(actions.USER_UPDATE_SUCCESS({ ...response.data }));

        yield put(custom_field_values_actions.CREATE_OR_UPDATE_FIELD_VALUE_REQUEST({...payload, response_id: response.data.id}))

    } catch (err) {
        console.log(err)
        yield put(actions.USER_UPDATE_FALURE({error: err}));
    }
}

function* DeleteUser({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.delete, `${alias}`+`/user/${payload.id}`, payload);
        yield put(actions.USER_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.USER_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.USERS_REQUEST, Users),
    takeLatest(types.USER_CREATE_REQUEST, CreateUser),
    takeLatest(types.USER_UPDATE_REQUEST, UpdateUser),
    takeLatest(types.USER_DELETE_REQUEST, DeleteUser)
]);
