import initialState from './initialState'
import { GET_CALL_PLANS, FETCHING_CALL_PLAN } from '../actions/constants'

const call_plan = (state = initialState.call_plan, action = {}) => {
  switch (action.type) {
    case FETCHING_CALL_PLAN:
      return {...state, loading: true}
    case GET_CALL_PLANS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    default: return state
  }
}

export default call_plan