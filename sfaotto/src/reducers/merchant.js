import initialState from './initialState'
import { GET_MERCHANTS, FETCHING_MERCHANT, ERROR_FETCHING_MERCHANT } from '../actions/constants'

const calendars = (state = initialState.merchants, action = {}) => {
  switch (action.type) {
    case FETCHING_MERCHANT:
      return {...state, loading: true}
    case GET_MERCHANTS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case ERROR_FETCHING_MERCHANT:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default calendars
