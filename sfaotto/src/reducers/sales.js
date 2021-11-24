import initialState from './initialState'
import {
  GET_SALES,
  GET_ASSIGNMENT_SALES,
  GET_POSITIONS_SALES,
  GET_UNASSIGN_SALES,
  GET_SALE,
  FETCHING_SALE,
  ERROR_FETCHING_SALE } from '../actions/constants'

const sales = (state = initialState.sales, action = {}) => {
  switch (action.type) {
    case FETCHING_SALE:
      return {...state, loading: true}
    case GET_SALES:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_ASSIGNMENT_SALES:
      return {...state, loading: false, assignments: action.assignments, meta: action.meta, filter: action.filter}
    case GET_POSITIONS_SALES:
      return {...state, loading: false, positions: action.positions, meta: action.meta, filter: action.filter}
    case GET_UNASSIGN_SALES:
      return {...state, loading: false, unassign: action.unassign, meta: action.meta, filter: action.filter}
    case GET_SALE:
      return {...state, loading: false, one: action.one, meta: action.meta}
    case ERROR_FETCHING_SALE:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default sales
