import initialState from './initialState'
import { GET_PROVINCES, FETCHING_PROVINCE, ERROR_FETCHING_PROVINCE } from '../actions/constants'

const provinces = (state = initialState.provinces, action = {}) => {
  switch (action.type) {
    case FETCHING_PROVINCE:
      return {...state, loading: true}
    case GET_PROVINCES:
      return {...state, loading: false, data: action.data, form: action.form}
    case ERROR_FETCHING_PROVINCE:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default provinces
