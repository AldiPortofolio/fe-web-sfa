import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_V2,
  GET_MERCHANT_TYPES,
  FETCHING_MERCHANT_TYPE,
  ERROR_FETCHING_MERCHANT_TYPE,
} from "./constants";

export const getSalesRetails = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    // dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios
        .get(`${NEWAPI_V2}/sales-retail/list`, { params: param })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          //   dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

const fetcing = () => {
  return { type: FETCHING_MERCHANT_TYPE };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_MERCHANT_TYPE, error };
};
