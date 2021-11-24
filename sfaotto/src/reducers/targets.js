import initialState from './initialState'
import { GET_TARGET_STATISTIC, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_DISTRICT, FILTER_VILLAGE, FETCHING_TARGET_COUNTRY, FETCHING_TARGET_PROVINCE, FETCHING_TARGET_CITY, FETCHING_TARGET_DISTRICT, FETCHING_TARGET, ERROR_FETCHING_TARGET } from '../actions/constants'

const targets = (state = initialState.targets, action = {}) => {
  switch (action.type) {
    case FETCHING_TARGET:
      return {...state, loading: true}
    case FETCHING_TARGET_PROVINCE:
      return {...state, loading_province: true}
    case FETCHING_TARGET_CITY:
      return {...state, loading_city: true}
    case FETCHING_TARGET_DISTRICT:
      return {...state, loading_district: true}
    case GET_TARGET_STATISTIC:
      return {...state, loading: false, statistic: action.statistic}
    case FILTER_COUNTRY:
      return {...state, loading_country: false, filter_country: action.filter_country, invalid_token: action.invalid_token}
    case FILTER_PROVINCE:
      return {...state, loading_province: false, filter_province: action.filter_province, invalid_token: action.invalid_token}
    case FILTER_CITY:
      return {...state, loading_city: false, filter_city: action.filter_city}
    case FILTER_DISTRICT:
      return {...state, loading_district: false, filter_district: action.filter_district}
    case FILTER_VILLAGE:
      return {...state, loading_village: false, filter_village: action.filter_village}
    case ERROR_FETCHING_TARGET:
      return {...state, loading: false, error: action.error}
    default: return state
  }
}

export default targets
