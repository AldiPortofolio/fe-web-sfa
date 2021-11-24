import initialState from "./initialState";
import {
  GET_SALESMAN_LOCATION,
  GET_SALESMEN_LOCATION,
  FETCHING_SALESMEN_LOCATION,
  ERROR_FETCHING_SALESMEN_LOCATION,
} from "../actions/constants";

const salesmen_locaion = (
  state = initialState.salesmen_location,
  action = {}
) => {
  switch (action.type) {
    case FETCHING_SALESMEN_LOCATION:
      return { ...state, loading: true };
    case GET_SALESMEN_LOCATION:
      return {
        ...state,
        loading: false,
        data: action.data,
        meta: action.meta,
        filter: action.filter,
      };
    case GET_SALESMAN_LOCATION:
      return { ...state, loading: false, one: action.one, meta: action.meta };
    case ERROR_FETCHING_SALESMEN_LOCATION:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default salesmen_locaion;
