import initialState from './initialState'
import { GET_MANAGE_TARGETS, GET_MANAGE_TARGETS_MONTHLY, GET_MANAGE_TARGET,
         FETCHING_MANAGE_TARGET, ERROR_FETCHING_MANAGE_TARGET, GET_MANAGE_TARGETS_REGIONAL } from '../actions/constants'

const manage_targets = (state = initialState.manage_targets, action = {}) => {
  switch (action.type) {
    case FETCHING_MANAGE_TARGET:
      return {...state, loading: true}
    case GET_MANAGE_TARGETS:
      return {...state, loading: false, data: action.data, filter: action.filter}
    case GET_MANAGE_TARGETS_MONTHLY:
      return {...state, loading: false, monthly_data: action.data, filter: action.filter}
    case GET_MANAGE_TARGETS_REGIONAL:
      return {...state, loading: false, region_data: action.data, filter: action.filter}
    case GET_MANAGE_TARGET:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_MANAGE_TARGET:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default manage_targets
