import * as types from '../actions/types';

const INITIAL_STATE = {
  value: '',
  loading: false,
  result: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CHANGE_SEARCH_VALUE:
    return {
      ...state,
      value: action.value
    }
    case types.START_FETCH_SEARCH_DATA:
    return {
      ...state,
      loading: true,
      value: ''
    }
    case types.FINISH_SEARCH:
    return {
      ...state,
      result: action.result,
      loading: false,
    }
    default:
      return state;
  }
}