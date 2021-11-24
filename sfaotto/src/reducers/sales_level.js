import initialState from './initialState'
import { GET_SALES_LEVELS, GET_SALES_LEVEL, FETCHING_SALES_LEVEL, ERROR_FETCHING_SALES_LEVEL } from '../actions/constants'

const sales_levels = (state = initialState.sales_levels, action = {}) => {
  switch (action.type) {
    case FETCHING_SALES_LEVEL:
      return {...state, loading: true}
    case GET_SALES_LEVELS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_SALES_LEVEL:
      return {...state, loading: false, one: action.one, meta: action.meta}
    case ERROR_FETCHING_SALES_LEVEL:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default sales_levels
