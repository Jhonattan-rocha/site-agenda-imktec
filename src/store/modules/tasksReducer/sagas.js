import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Tasks({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}/task/?limit=${encodeURIComponent(payload.limit)}&skip=${encodeURIComponent(payload.skip)}&filters=${encodeURIComponent(payload.filters)}`);
        yield put(actions.TASKS_SUCCESS({ ...response.data }));
    } catch (err) {
        yield put(actions.TASKS_FALURE({error: err}));
    }
}

function* CreateTasks({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/task/", payload);
        yield put(actions.TASKS_CREATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err);
        yield put(actions.TASKS_CREATE_FALURE({error: err}));
    }
}

function* UpdateTasks({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}`+`/task/${payload.id}`, payload);
        yield put(actions.TASKS_UPDATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.TASKS_UPDATE_FALURE({error: err}));
    }
}

function* DeleteTasks({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.delete, `${alias}`+`/task/${payload.id}`, payload);
        yield put(actions.TASKS_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.TASKS_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.TASKS_REQUEST, Tasks),
    takeLatest(types.TASKS_CREATE_REQUEST, CreateTasks),
    takeLatest(types.TASKS_UPDATE_REQUEST, UpdateTasks),
    takeLatest(types.TASKS_DELETE_REQUEST, DeleteTasks)
]);
