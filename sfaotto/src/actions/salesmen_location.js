import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_FEEDING_LONGLAT,
  FETCHING_SALESMEN_LOCATION,
  ERROR_FETCHING_SALESMEN_LOCATION,
  GET_SALESMAN_LOCATION,
  GET_SALESMEN_LOCATION,
} from "./constants";

export const getFeedingLonglat = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_FEEDING_LONGLAT + "/web-sfa-mongo/location-sales/list", {
          ...param,
        })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_SALESMEN_LOCATION,
              data: data.data.sales_feeds,
              meta: data.data.meta,
            });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getFeedingLonglatAll = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetching());

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_FEEDING_LONGLAT + "/web-sfa-mongo/location-sales/all", {
          ...param,
        })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({
              type: GET_SALESMEN_LOCATION,
              data: data.data.sales_list,
              meta: data.data.meta,
            });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetching(error));
          reject(error);
        });
    });
  };
};

export const getDetail = (obj = {}) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: GET_SALESMAN_LOCATION,
        one: obj,
      });
    });
  };
};

const fetching = () => {
  return { type: FETCHING_SALESMEN_LOCATION };
};

const errorFetching = (error) => {
  return { type: ERROR_FETCHING_SALESMEN_LOCATION, error };
};
