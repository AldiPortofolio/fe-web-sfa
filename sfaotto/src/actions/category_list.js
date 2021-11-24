import axios from './config'
import { NEWAPI, GET_CATEGORY_LIST, FETCHING_CATEGORY_LIST, ERROR_FETCHING_CATEGORY_LIST } from './constants'

export const getCategoryList = (value) => {
  return (dispatch, getState) => {
    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())

    return new Promise((resolve, reject) => {
      axios(NEWAPI + `/todolist/category_list?category_merchant=${value}`)
        .then(({data}) => {
          const form = data.data.map(c => ({value: c.id, label: c.name}))
          data = data.data.map(c => ({value: c.id, label: c.name}))
          // data.unshift({value: '', label: 'Semua'})
          dispatch({ type: GET_CATEGORY_LIST, data, form });
          resolve(data)
        }).catch(error => {
          dispatch(errorFetcing(error))
          reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_CATEGORY_LIST }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_CATEGORY_LIST, error }
}
