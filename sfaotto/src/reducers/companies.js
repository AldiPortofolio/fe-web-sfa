import initialState from './initialState'
import { GET_COMPANIES, FETCHING_COMPANY, ERROR_FETCHING_COMPANY } from '../actions/constants'

const companies = (state = initialState.companies, action = {}) => {
  switch (action.type) {
    case FETCHING_COMPANY:
      return {...state, loading: true}
    case GET_COMPANIES:
      return {...state, loading: false, data: action.data, form: action.form}
    case ERROR_FETCHING_COMPANY:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default companies
