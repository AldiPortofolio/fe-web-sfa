import initialState from './initialState'
import { GET_COMPANY_CODES, FETCHING_COMPANY_CODE } from '../actions/constants'

const company_codes = (state = initialState.company_codes, action = {}) => {
  switch (action.type) {
    case FETCHING_COMPANY_CODE:
      return {...state, loading: true}
    case GET_COMPANY_CODES:
      return {...state, loading: false, data: action.data, form: action.form}
    default: return state
  }
}

export default company_codes
