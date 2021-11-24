import initialState from './initialState'
import { GET_SUBAREAS, GET_SUBAREA, FETCHING_SUBAREA, ERROR_FETCHING_SUBAREA } from '../actions/constants'

const areas = (state = initialState.areas, action = {}) => {
  switch (action.type) {
    case FETCHING_SUBAREA:
      return {...state, loading: true}
    case GET_SUBAREAS:
      return {...state, loading: false, data: action.data, meta: action.meta, filter: action.filter}
    case GET_SUBAREA:
      return {...state, loading: false, one: action.one}
    case ERROR_FETCHING_SUBAREA:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default areas
