import initialState from './initialState'
import { GET_CALL_PLAN_MERCHANTS, FETCHING_CALL_PLAN_MERCHANTS } from '../actions/constants'

const call_plan_merchants = (state = initialState.call_plan_merchants, action = {}) => {
  switch (action.type) {
    case FETCHING_CALL_PLAN_MERCHANTS:
      return {...state, loading: true}
    case GET_CALL_PLAN_MERCHANTS:
      return {...state, loading: false, data: action.data, meta: action.meta}
    default: return state
  }
}

export default call_plan_merchants