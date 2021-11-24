import initialState from './initialState'
import { GET_SALES_LEVEL_ASSIGNMENTS, GET_SALES_LEVEL_ASSIGNMENT, FETCHING_SALES_LEVEL_ASSIGNMENT, ERROR_FETCHING_SALES_LEVEL_ASSIGNMENT } from '../actions/constants'

const sales_level_assignments = (state = initialState.sales_level_assignments, action = {}) => {
  switch (action.type) {
    case FETCHING_SALES_LEVEL_ASSIGNMENT:
      return {...state, loading: true}
    case GET_SALES_LEVEL_ASSIGNMENTS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    case GET_SALES_LEVEL_ASSIGNMENT:
      return {...state, loading: false, one: action.one, meta: action.meta}
    case ERROR_FETCHING_SALES_LEVEL_ASSIGNMENT:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default sales_level_assignments
