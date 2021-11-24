import axios from './config'
import { NEWAPI, GET_SALES_TYPE, FETCHING_SALES_TYPE, ERROR_FETCHING_SALES_TYPE } from './constants'

export const getSalesTypeList = () => {
    return (dispatch, getState) => {
      const { auth: {access_token} } = getState()
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      dispatch(fetcing())
  
      return new Promise((resolve, reject) => {
        axios.get(NEWAPI + '/sales/sales_type_list')
          .then(({data}) => {
            const list = data.data.map(s => ({value: s.id, label: s.name}))
            // list.unshift({value: '', label: 'Semua'})
            dispatch({ type: GET_SALES_TYPE, data: list, meta: data.meta});
            resolve(data)
          }).catch(error => {
            dispatch(errorFetcing(error))
            reject(error)
          })
      });
    }
}

const fetcing = () => {
return { type: FETCHING_SALES_TYPE }
}

const errorFetcing = (error) => {
return { type: ERROR_FETCHING_SALES_TYPE, error }
}