import initialState from './initialState'
import {
  GET_SALES_TYPE,
  FETCHING_SALES_TYPE,
  ERROR_FETCHING_SALES_TYPE
} from '../actions/constants'

const sales_types = (state = initialState.sales_types, action = {}) => {
  switch (action.type) {
    case FETCHING_SALES_TYPE:
      return {...state, loading: true}
    case GET_SALES_TYPE:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case ERROR_FETCHING_SALES_TYPE:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default sales_types
