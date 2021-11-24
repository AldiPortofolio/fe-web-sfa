import initialState from './initialState'
import {
  GET_SALES_ACTIVITY,
  GET_SALES_ACTIVITIES,
  FETCHING_SALES_ACTIVITIES,
  ERROR_FETCHING_SALES_ACTIVITIES } from '../actions/constants'

const activities = (state = initialState.activities, action = {}) => {
  switch (action.type) {
    case FETCHING_SALES_ACTIVITIES:
      return {...state, loading: true}
    case GET_SALES_ACTIVITIES:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_SALES_ACTIVITY:
      return {...state, loading: false, one: action.one, meta: action.meta}
    case ERROR_FETCHING_SALES_ACTIVITIES:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default activities
