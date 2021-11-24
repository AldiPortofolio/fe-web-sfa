import initialState from './initialState'
import { GET_REPORTS, GET_SALES_REPORTS, GET_REPORT, FETCHING_REPORT, ERROR_FETCHING_REPORT } from '../actions/constants'

const reports = (state = initialState.reports, action = {}) => {
  switch (action.type) {
    case FETCHING_REPORT:
      return {...state, loading: true}
    case GET_REPORTS:
      return {...state, loading: false, charts: action.charts, sales: action.sales, filter: action.filter}
    case GET_SALES_REPORTS:
      return {...state, loading: false, sales: action.sales, filter: action.filter}
    case GET_REPORT:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_REPORT:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default reports
