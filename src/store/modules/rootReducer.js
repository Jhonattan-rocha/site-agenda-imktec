import { combineReducers } from 'redux';
import authreducer from './authReducer/reducer';
import userreducer from './userReducer/reducer';
import userprofilereducer from './userProfileReducer/reducer';
import permissionreducer from './permissionReducer/reducer';
import genericreducer from './genericReducer/reducer';
import eventsReducer from './eventsReducer/reducer';
import tasksReducer from './tasksReducer/reducer';

export default combineReducers({
    authreducer: authreducer,
    userreducer: userreducer,
    userprofilereducer: userprofilereducer,
    permissionreducer: permissionreducer,
    genericreducer: genericreducer,
    eventsReducer: eventsReducer,
    tasksReducer: tasksReducer
});
