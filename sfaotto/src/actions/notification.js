import axios from "./config";
import {
  NEWAPI,
  FETCHING_NOTIFICATIONS,
  ERROR_FETCHING_NOTIFICATIONS,
  GET_NOTIFICATIONS,
  NOTIFICATION_API,
  NEWAPI_V2_3,
} from "./constants";

export const getNotifications = (type) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios
        .get(`${NOTIFICATION_API}/notification/list`)
        .then(({ data }) => {
          dispatch({
            type: GET_NOTIFICATIONS,
            data: data.data,
            meta: data.meta,
          });
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const changeStatus = (id) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios
        .get(`${NOTIFICATION_API}/notification/update-status/${id}`)
        .then(({ data }) => {
          dispatch(getNotifications);
          resolve(data);
        })
        .catch((error) => {
          dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

export const DeleteAdminSubArea = () => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());
    return new Promise((resolve, reject) => {
      axios
        .post(`${NEWAPI_V2_3}/admin-sub-area/delete-by-admin`)
        .then(({ data }) => {
          // dispatch(getNotifications);
          resolve(data);
        })
        .catch((error) => {
          // dispatch(errorFetcing(error));
          reject(error);
        });
    });
  };
};

const fetcing = () => {
  return { type: FETCHING_NOTIFICATIONS };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_NOTIFICATIONS, error };
};
