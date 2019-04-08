import { combineReducers } from 'redux';
import authReducer from './authReducer';
import searchReducer from './searchReducer';
import chatReducer from './chatReducer';

export default combineReducers({
  auth: authReducer,
  search: searchReducer,
  chat: chatReducer
})