import axios from './config'
import { GET_REPORTS, GET_SALES_REPORTS, FETCHING_REPORT, ERROR_FETCHING_REPORT } from './constants'

export const getReports = (params) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/sales/acquisition_report', {...params})
        .then(({data}) => {
          data.data.charts && dispatch({ type: GET_REPORTS, charts: data.data.charts, sales: data.data.list });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

export const getSalesReports = (params) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios.post('/sales/acquisition_sales_list', {...params})
        .then(({data}) => {
          data.data.list && dispatch({ type: GET_SALES_REPORTS, sales: data.data.list, filter: {...params} });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_REPORT }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_REPORT, error }
}
