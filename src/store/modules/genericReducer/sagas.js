import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Generics({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}/generic/?limit=${encodeURIComponent(payload.limit)}&skip=${encodeURIComponent(payload.skip)}&filters=${encodeURIComponent(payload.filters)}&model=${encodeURIComponent(payload.model)}`);
        yield put(actions.GENERICS_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err);
        yield put(actions.GENERICS_FALURE({error: err}));
    }
}

function* CreateGeneric({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}/generic/?model=${encodeURIComponent(payload.model)}`, payload);
        yield put(actions.GENERIC_CREATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.GENERIC_CREATE_FALURE({error: err}));
    }
}

function* UpdateGeneric({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}/generic/${payload.id}?model=${encodeURIComponent(payload.model)}`, payload);
        yield put(actions.GENERIC_UPDATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.GENERIC_UPDATE_FALURE({error: err}));
    }
}

function* DeleteGeneric({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.delete, `${alias}/generic/${payload.id}?model=${encodeURIComponent(payload.model)}`, payload);
        yield put(actions.GENERIC_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.GENERIC_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.GENERICS_REQUEST, Generics),
    takeLatest(types.GENERIC_CREATE_REQUEST, CreateGeneric),
    takeLatest(types.GENERIC_UPDATE_REQUEST, UpdateGeneric),
    takeLatest(types.GENERIC_DELETE_REQUEST, DeleteGeneric)
]);
