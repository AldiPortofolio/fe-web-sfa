import axios from './config'
import { GET_SUB_CATEGORY, FETCHING_SUB_CATEGORY_LIST, ERROR_FETCHING_SUB_CATEGORY_LIST } from './constants'

export const getSubCategory = (categoryID) => {
    
  return (dispatch, getState) => {

    const { auth: {access_token} } = getState()
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    dispatch(fetcing())
    const newApi = process.env.REACT_APP_API_URL_GO
    
    return new Promise((resolve, reject) => {
      axios.get(newApi + `/todolist/sub_categories/${categoryID}`)
        .then(({data}) => {
          data = data.data.map(c => ({value: c.id, label: c.name}))
          dispatch({ type: GET_SUB_CATEGORY, data});
          resolve(data)
        }).catch(error => {
            dispatch(errorFetcing(error))
            reject(error)
        })
    });
  }
}

const fetcing = () => {
  return { type: FETCHING_SUB_CATEGORY_LIST }
}

const errorFetcing = (error) => {
  return { type: ERROR_FETCHING_SUB_CATEGORY_LIST, error }
}
