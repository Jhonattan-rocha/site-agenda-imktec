import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import * as actions from './actions';
import * as task_actions from '../tasksReducer/actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Events({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.get, `${alias}/event/?limit=${encodeURIComponent(payload.limit)}&skip=${encodeURIComponent(payload.skip)}&filters=${encodeURIComponent(payload.filters)}`);
        yield put(actions.EVENTS_SUCCESS({ ...response.data }));
    } catch (err) {
        yield put(actions.EVENTS_FALURE({error: err}));
    }
}

function* CreateEvents({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/event/", payload);
        yield put(actions.EVENTS_CREATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err);
        yield put(actions.EVENTS_CREATE_FALURE({error: err}));
    }
}

function* DuplicateEvents({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.post, `${alias}`+"/event/", payload);

        for(let task of payload.tasks){
            yield put(task_actions.TASKS_CREATE_REQUEST(task));
        }

        yield put(actions.EVENTS_DUPLICATE_CREATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err);
        yield put(actions.EVENTS_DUPLICATE_CREATE_FALURE({error: err}));
    }
}

function* UpdateEvents({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.put, `${alias}`+`/event/${payload.id}`, payload);
        yield put(actions.EVENTS_UPDATE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.EVENTS_UPDATE_FALURE({error: err}));
    }
}

function* DeleteEvents({ payload }) {
    try {
        const token = yield select(state => state.authreducer.token);
        axios.defaults.headers = {
            'Authorization': 'Bearer '+token,
        }
        const response = yield call(axios.delete, `${alias}`+`/event/${payload.id}`, payload);
        yield put(actions.EVENTS_DELETE_SUCCESS({ ...response.data }));
    } catch (err) {
        console.log(err)
        yield put(actions.EVENTS_DELETE_FALURE({error: err}));
    }
}

export default all([
    takeLatest(types.EVENTS_REQUEST, Events),
    takeLatest(types.EVENTS_CREATE_REQUEST, CreateEvents),
    takeLatest(types.EVENTS_DUPLICATE_CREATE_REQUEST, DuplicateEvents),
    takeLatest(types.EVENTS_UPDATE_REQUEST, UpdateEvents),
    takeLatest(types.EVENTS_DELETE_REQUEST, DeleteEvents)
]);
