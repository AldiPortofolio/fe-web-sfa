import initialState from './initialState'
import { GET_AREAS, GET_AREA, FETCHING_AREA, ERROR_FETCHING_AREA } from '../actions/constants'

const areas = (state = initialState.areas, action = {}) => {
  switch (action.type) {
    case FETCHING_AREA:
      return {...state, loading: true}
    case GET_AREAS:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_AREA:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_AREA:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default areas
