import { result } from "lodash";
import axios from "./config";
import {
  NEWAPI_V2_3,
  FETCHING_MINIO,
  GET_MINIO,
  ERROR_FETCHING_MINIO,
} from "./constants";

export const minioUpload = async (body = {}) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
      axios
        .post(NEWAPI_V2_3 + "/upload-image", { ...body })
        .then(({ data }) => {
          if (result(data, "data")) {
            dispatch({ type: GET_MINIO, one: data.data });
            resolve(data);
          } else {
            reject("error");
          }
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

const fetcing = () => {
  return { type: FETCHING_MINIO };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_MINIO, error };
};
