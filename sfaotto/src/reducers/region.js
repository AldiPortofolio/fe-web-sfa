import initialState from './initialState'
import { GET_REGIONS, GET_REGION, FETCHING_REGION, ERROR_FETCHING_REGION } from '../actions/constants'

const regions = (state = initialState.regions, action = {}) => {
  switch (action.type) {
    case FETCHING_REGION:
      return {...state, loading: true}
    case GET_REGIONS:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_REGION:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_REGION:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default regions
