import initialState from "./initialState";
import {
  FETCHING_MERCHANT_TYPE,
  ERROR_FETCHING_MERCHANT_TYPE,
  GET_MERCHANT_TYPES,
} from "../actions/constants";

const merchant_types = (state = initialState.merchant_types, action = {}) => {
  switch (action.type) {
    case FETCHING_MERCHANT_TYPE:
      return { ...state, loading: true };
    case GET_MERCHANT_TYPES:
      return { ...state, loading: false, data: action.data, meta: action.meta };
    case ERROR_FETCHING_MERCHANT_TYPE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default merchant_types;
