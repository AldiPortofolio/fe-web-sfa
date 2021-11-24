import axios from './config'
import { NEWAPI_V2, NEWAPI_V2_3, NEWAPI, FETCHING_REVIEW, ERROR_FETCHING_REVIEW, GET_REVIEWS } from './constants'

export const getReviews = (param) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.get(`/reviews/list${param}`)
        .then(({data}) => {
          dispatch({ type: GET_REVIEWS, data: data.data.reviews, meta: data.data.meta, filter: {...param} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getReview = (review_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      // axios(`/reviews/detail/${review_id}`)
      axios(NEWAPI +  `/todolist/detail/${review_id}`)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const createReview = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/reviews/create', data).then(({data}) => {
        // dispatch(getAdmins);
        if (data.meta.status) {
          resolve(data)
        } else {
          reject(data.meta)
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const createReviewBulk = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/reviews/bulk', data).then(({data}) => {
        // dispatch(getAdmins);
        if (data.meta.status) {
          resolve(data)
        } else {
          reject(data.meta)
        }
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const editReview = (id, data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.put(`/reviews/${id}`, data).then(({data}) => {
        dispatch(getReviews);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const deleteReview = (id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.delete(`/reviews/${id}`).then(({data}) => {
        // dispatch(getReviews);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const bulkDeleteReview = (data) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(`/reviews/bulk_delete`, data).then(({data}) => {
        // dispatch(getReviews);
        resolve(data)
      }).catch(error => {
        dispatch(errorFetcing(error))
        reject(error)
      })
    });
  }
}

export const searchMerchants = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    // const newApi = process.env.REACT_APP_API_URL_GO

    return new Promise((resolve, reject) => {
      // axios.get(`/reviews/search_merchant?keyword=${param}`)
      axios.post(NEWAPI + `/todolist/merchant_list`, keyword)
        .then(({data}) => {
          // dispatch({ type: GET_REVIEWS, data: data.data.reviews, filter: {...param} });
          
          dispatch({ type: GET_REVIEWS, data: data.data, meta: data.meta});
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const searchMerchantsV2 = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    // const newApi = process.env.REACT_APP_API_URL_GO

    return new Promise((resolve, reject) => {
      // axios.get(`/reviews/search_merchant?keyword=${param}`)
      axios.post(NEWAPI_V2_3 + `/todolist/merchant-list`, keyword)
        .then(({data}) => {
          // dispatch({ type: GET_REVIEWS, data: data.data.reviews, filter: {...param} });
          
          dispatch({ type: GET_REVIEWS, data: data.data, meta: data.meta});
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}


export const searchMerchantsRecruit = (keyword) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + `/todolist/new-merchant-list`, keyword)
        .then(({data}) => {
          dispatch({ type: GET_REVIEWS, data: data.data, meta: data.meta});
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getMerchant = (merchant_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI + `/todolist/merchant_detail`, merchant_id)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getMerchantV2 = (merchant_id) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2_3 + `/todolist/merchant-detail`, merchant_id)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getMerchantRecruit = (req) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post(NEWAPI_V2 + `/todolist/new-merchant-detail`, req)
        .then(({data}) => {
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_REVIEW }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_REVIEW, error }
}
