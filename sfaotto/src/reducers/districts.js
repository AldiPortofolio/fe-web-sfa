import initialState from './initialState'
import { GET_DISTRICTS, FETCHING_DISTRICT, ERROR_FETCHING_DISTRICT } from '../actions/constants'

const districts = (state = initialState.districts, action = {}) => {
  switch (action.type) {
    case FETCHING_DISTRICT:
      return {...state, loading: true}
    case GET_DISTRICTS:
      return {...state, loading: false, data: action.data}
    case ERROR_FETCHING_DISTRICT:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default districts
