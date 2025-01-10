import {all} from 'redux-saga/effects';

import LoginSagas from './authReducer/sagas';
import UserSagas from './userReducer/sagas';
import UserProfileSagas from './userProfileReducer/sagas';
import PermissionSagas from './permissionReducer/sagas';
import GenericSagas from './genericReducer/sagas';
import eventsSagas from './eventsReducer/sagas';
import tasksSagas from './tasksReducer/sagas';

export default function* rootSaga(){
    return yield all([LoginSagas, UserSagas, UserProfileSagas, PermissionSagas, GenericSagas, eventsSagas, tasksSagas]);
}
