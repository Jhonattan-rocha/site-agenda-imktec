import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Permissions({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}`+"/permissions/");
        yield put(actions.PERMISSIONS_SUCCESS({ ...response.data }));
    } catch (err) {
        yield put(actions.PERMISSIONS_FALURE({error: err}));
    }
}

function* CreatePermission({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/permissions/", payload);
        yield put(actions.PERMISSION_CREATE_SUCCESS({ ...response.data }));
    } catch (err) {
        yield put(actions.PERMISSION_CREATE_FALURE({error: err}));
    }
}

function* UpdatePermission({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}`+`/permissions/${payload.id}`, payload);
        yield put(actions.PERMISSION_UPDATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.PERMISSION_UPDATE_FALURE({error: err}));
    }
}

function* DeletePermission({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.delete, `${alias}`+`/permissions/${payload.id}`, payload);
        yield put(actions.PERMISSION_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.PERMISSION_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.PERMISSIONS_REQUEST, Permissions),
    takeLatest(types.PERMISSION_CREATE_REQUEST, CreatePermission),
    takeLatest(types.PERMISSION_UPDATE_REQUEST, UpdatePermission),
    takeLatest(types.PERMISSION_DELETE_REQUEST, DeletePermission)
]);
