import initialState from './initialState'
import { GET_MANAGE_TARGET_TYPES, GET_MANAGE_TARGET_TYPE, FETCHING_MANAGE_TARGET_TYPE, ERROR_FETCHING_MANAGE_TARGET_TYPE } from '../actions/constants'

const manage_target_types = (state = initialState.manage_target_types, action = {}) => {
  switch (action.type) {
    case FETCHING_MANAGE_TARGET_TYPE:
      return {...state, loading: true}
    case GET_MANAGE_TARGET_TYPES:
      return {...state, loading: false, data: action.data, filter: action.filter}
    case GET_MANAGE_TARGET_TYPE:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_MANAGE_TARGET_TYPE:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default manage_target_types
