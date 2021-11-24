import initialState from './initialState'
import { GET_GENDERS, FETCHING_GENDER, ERROR_FETCHING_GENDER } from '../actions/constants'

const genders = (state = initialState.genders, action = {}) => {
  switch (action.type) {
    case FETCHING_GENDER:
      return {...state, loading: true}
    case GET_GENDERS:
      return {...state, loading: false, data: action.data, form: action.form}
    case ERROR_FETCHING_GENDER:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default genders
