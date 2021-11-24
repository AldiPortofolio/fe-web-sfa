import axios from "./config";
// import { isEmpty } from 'lodash'
import {
  NEWAPI,
  NEWAPI_V2_2,
  GET_MERCHANTS,
  FETCHING_MERCHANT,
  ERROR_FETCHING_MERCHANT,
} from "./constants";

export const getMerchants = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/merchants/list";
    } else {
      actionURL = `/merchants/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_MERCHANTS,
            data: data.data,
            meta: data.meta,
            filter: { ...param },
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

export const getMerchantsV2 = (param = {}, search = null) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    dispatch(fetcing());

    let actionURL;

    if (search === null) {
      actionURL = "/merchants/list";
    } else {
      actionURL = `/merchants/list${search}`;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI_V2_2 + actionURL, { ...param })
        .then(({ data }) => {
          dispatch({
            type: GET_MERCHANTS,
            data: data.data.merchants,
            meta: data.data.meta,
            filter: { ...param },
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

// export const getCalendar = (id) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
//     dispatch(fetcing())

//     return new Promise((resolve, reject) => {
//       axios(NEWAPI + `/calendar_setup/detail/${id}`)
//       .then(({data}) => {
//         dispatch({ type: GET_CALENDAR, one: data.data, meta: data.meta });
//         resolve(data)
//       }).catch(error => {
//         dispatch(errorFetcing(error))
//         reject(error)
//       })
//     });
//   }
// }

// export const deleteCalendar = (areaID) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

//     return new Promise((resolve, reject) => {
//       axios.delete(NEWAPI + `/calendar_setup/delete/${areaID}`).then(({data}) => {
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     });
//   }
// }

export const setStatusMerchant = (data) => {
  return (dispatch, getState) => {
    const {
      auth: { access_token },
    } = getState();
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    return new Promise((resolve, reject) => {
      axios
        .post(NEWAPI + `/merchants/set_status`, data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

// export const createCalendar = (data) => {
//   return (dispatch, getState) => {
//     const { auth: {access_token} } = getState()
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
//     dispatch(fetcing())

//     return new Promise((resolve, reject) => {
//       axios.post(NEWAPI + '/calendar_setup/create', data)
//         .then(({data}) => {
//           dispatch({ type: GET_CALENDAR, one: data.data });
//           resolve(data)
//         }).catch(error => {
//           dispatch(errorFetcing(error))
//           reject(error)
//         })
//     });
//   }
// }

const fetcing = () => {
  return { type: FETCHING_MERCHANT };
};

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_MERCHANT, error };
};
