import { call, put, all, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import { alias } from '../../../config/appConfig';

function* Login({ payload }) {
    try {
        const response = yield call(axios.post, `${alias}/token/`, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        yield put(
            actions.LoginSuccess({
                ...response.data,
            })
        );
    } catch (err) {
        console.error(err);
        yield put(actions.LoginFALURE());
    }
}

export default all([
    takeLatest(types.LOGIN_REQUEST, Login),
]);
