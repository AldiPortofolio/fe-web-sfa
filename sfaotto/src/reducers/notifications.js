import initialState from './initialState'
import {
  GET_NOTIFICATIONS,
  FETCHING_NOTIFICATIONS,
  ERROR_FETCHING_NOTIFICATIONS
} from '../actions/constants'

const notifications = (state = initialState.notifications, action = {}) => {
  switch (action.type) {
    case FETCHING_NOTIFICATIONS:
      return {...state, loading: true}
    case GET_NOTIFICATIONS:
      return {...state, loading: false, data: action.data, filter: action.filter}
    case ERROR_FETCHING_NOTIFICATIONS:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default notifications
