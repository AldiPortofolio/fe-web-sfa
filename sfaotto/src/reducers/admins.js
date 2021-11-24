import initialState from './initialState'
import { GET_ADMINS, GET_ADMIN, GET_ADMIN_STATUS, FETCHING_ADMIN, ERROR_FETCHING_ADMIN } from '../actions/constants'

const admins = (state = initialState.admins, action = {}) => {
  switch (action.type) {
    case FETCHING_ADMIN:
      return {...state, loading: true}
    case GET_ADMINS:
      return {...state, loading: false, data: action.data, role: action.role}
    case GET_ADMIN_STATUS:
      return {...state, loading: false, statuses: action.statuses, labels: action.labels}
    case GET_ADMIN:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_ADMIN:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default admins
