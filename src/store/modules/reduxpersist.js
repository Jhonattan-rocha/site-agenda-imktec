import storage from "redux-persist/lib/storage";
import { persistReducer } from 'redux-persist';

export default function reducers(reducers){
    const persistReducers = persistReducer(
        {
            key: "BASE",
            storage,
            whitelist: ['authreducer', 'userreducer', 'userprofilereducer', 'permissionreducer', 'genericreducer', 'eventsReducer', 'tasksReducer'],
        }, reducers
    );

    return persistReducers;
};

