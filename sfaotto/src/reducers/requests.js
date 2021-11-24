import initialState from './initialState'
import {
  GET_REQUESTS,
  GET_REQUEST,
  FETCHING_REQUEST,
  ERROR_FETCHING_REQUEST,
  GET_REQUEST_ACTION_TYPE,
  GET_REQUEST_STATUS,
  GET_REQUEST_MODULE } from '../actions/constants'

const requests = (state = initialState.requests, action = {}) => {
  switch (action.type) {
    case FETCHING_REQUEST:
      return {...state, loading: true}
    case GET_REQUESTS:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_REQUEST:
      return {...state, loading: false, one: action.one}
    case GET_REQUEST_ACTION_TYPE:
      return {...state, loading: false, action_types: action.action_types}
    case GET_REQUEST_STATUS:
      return {...state, loading: false, status: action.status}
    case GET_REQUEST_MODULE:
      return {...state, loading: false, modules: action.modules}
    case ERROR_FETCHING_REQUEST:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default requests
