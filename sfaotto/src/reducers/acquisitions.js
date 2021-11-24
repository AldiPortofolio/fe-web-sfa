import initialState from "./initialState";
import {
  FETCHING_ACQUISITION,
  ERROR_FETCHING_ACQUISITION,
  GET_ACQUISITION,
  GET_ACQUISITIONS,
} from "../actions/constants";

const acquisitions = (state = initialState.acquisitions, action = {}) => {
  switch (action.type) {
    case FETCHING_ACQUISITION:
      return { ...state, loading: true };
    case GET_ACQUISITIONS:
      return { ...state, loading: false, data: action.data, meta: action.meta };
    case GET_ACQUISITION:
      return { ...state, loading: false, one: action.one };
    case ERROR_FETCHING_ACQUISITION:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default acquisitions;
