import initialState from './initialState'
import { GET_CITIES, FETCHING_CITY, ERROR_FETCHING_CITY } from '../actions/constants'

const cities = (state = initialState.cities, action = {}) => {
  switch (action.type) {
    case FETCHING_CITY:
      return {...state, loading: true}
    case GET_CITIES:
      return {...state, loading: false, data: action.data}
    case ERROR_FETCHING_CITY:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default cities
