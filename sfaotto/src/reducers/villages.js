import initialState from './initialState'
import { GET_VILLAGES, FETCHING_VILLAGE } from '../actions/constants'

const villages = (state = initialState.villages, action = {}) => {
  switch (action.type) {
    case FETCHING_VILLAGE:
      return {...state, loading: true}
    case GET_VILLAGES:
      return {...state, loading: false, data: action.data}
    default: return state
  }
}

export default villages
