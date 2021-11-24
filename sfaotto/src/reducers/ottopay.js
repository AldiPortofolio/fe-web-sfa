import initialState from './initialState'
import { GET_OTTOPAYS, GET_OTTOPAY, FETCHING_OTTOPAY, ERROR_FETCHING_OTTOPAY } from '../actions/constants'

const ottopay = (state = initialState.ottopay, action = {}) => {
  switch (action.type) {
    case FETCHING_OTTOPAY:
      return {...state, loading: true}
    case GET_OTTOPAYS:
      return {...state, loading: false, data: action.data, filter: action.filter}
    case GET_OTTOPAY:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_OTTOPAY:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default ottopay
