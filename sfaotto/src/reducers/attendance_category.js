import initialState from './initialState'
import { GET_ATTENDANCE_CATEGORY, FETCHING_ATTENDANCE_CATEGORY } from '../actions/constants'

const attendance_category = (state = initialState.attendance_category, action = {}) => {
  switch (action.type) {
    case FETCHING_ATTENDANCE_CATEGORY:
      return {...state, loading: true}
    case GET_ATTENDANCE_CATEGORY:
      return {...state, loading: false, data: action.data, meta: action.meta}
    default: return state
  }
}

export default attendance_category