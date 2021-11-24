import initialState from './initialState'
import { GET_ATTENDANCE_HISTORY, FETCHING_ATTENDANCE_HISTORY } from '../actions/constants'

const attendance_history = (state = initialState.attendance_history, action = {}) => {
  switch (action.type) {
    case FETCHING_ATTENDANCE_HISTORY:
      return {...state, loading: true}
    case GET_ATTENDANCE_HISTORY:
      return {...state, loading: false, data: action.data, meta: action.meta}
    default: return state
  }
}

export default attendance_history