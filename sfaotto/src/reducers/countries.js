import initialState from './initialState'
import { GET_COUNTRIES, FETCHING_COUNTRY, ERROR_FETCHING_COUNTRY } from '../actions/constants'

const countries = (state = initialState.countries, action = {}) => {
  switch (action.type) {
    case FETCHING_COUNTRY:
      return {...state, loading: true}
    case GET_COUNTRIES:
      return {...state, loading: false, data: action.data}
    case ERROR_FETCHING_COUNTRY:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default countries
