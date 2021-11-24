import initialState from './initialState'
import { GET_CALENDARS, GET_CALENDAR, FETCHING_CALENDAR, ERROR_FETCHING_CALENDAR } from '../actions/constants'

const calendars = (state = initialState.calendars, action = {}) => {
  switch (action.type) {
    case FETCHING_CALENDAR:
      return {...state, loading: true}
    case GET_CALENDARS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_CALENDAR:
      return {...state, loading: false, one: action.data, meta: action.meta}
    case ERROR_FETCHING_CALENDAR:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default calendars
