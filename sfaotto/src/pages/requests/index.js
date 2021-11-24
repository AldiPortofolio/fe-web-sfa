import React from 'react';
import { isEmpty, debounce } from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getRequests, getRequestsV2, getRequestActionTypes, getRequestModules, getRequestStatus } from '../../actions/request'
import { Pagination, LoadingDots, SelectComponent } from '../../components'
import { IconSearch, IconTrash } from '../../components/Icons'
import { ind, en } from '../../languages/request'

const initState = {
  selectedActionType: {value: '', label: 'All'},
  selectedStatus: {value: '', label: 'All'},
  selectedModule: {value: '', label: 'All'},
  selectedRequests: [],
  keyword: '',
  request_ids: [],
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  type: 'success',
  languages: {}
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - List Request"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.setState({selectedRequests: [], request_ids: []})

    this.fetchRequests()
    this.getData()
  }

  getData = async () => {
    try {
      await this.props.getRequestActionTypes()
      await this.props.getRequestModules()
      await this.props.getRequestStatus()
    } catch(e) {
      console.log(e)
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchRequests();
    }
  }

  fetchRequests = () => {
    const { auth } = this.props
    const { selectedActionType, selectedStatus, selectedModule, keyword } = this.state

    let parameter
    let requestType = auth.position === 'Checker' ? 'checker' : 'maker'
    let paramUrl = new URL(window.location)
    let pageNumber = paramUrl.searchParams.get("page") ? paramUrl.searchParams.get("page") : ''

    if(requestType === 'checker'){
      parameter = `?action_type=${selectedActionType.value}&status=${selectedStatus.value}&keyword=${isEmpty(keyword) ? '' : keyword}`
    }else{
      parameter = `?action_type=${selectedActionType.value}&status=${selectedStatus.value}&module=${selectedModule.value}&keyword=${isEmpty(keyword) ? '' : keyword}`
    }

    if(pageNumber){
      parameter = parameter + `&page=${pageNumber}`
    }

    this.props.getRequestsV2(requestType, parameter)
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {}
      obj[toggle] = !this.state[toggle]
      this.setState(obj)
    }, 175)
  }

  filterRequest = debounce(() => {
    this.fetchRequests()
  }, 350)

  render() {
    const { auth, requests } = this.props
    const {
      // resultIsOpen,
      // confirmText,
      // resultText,
      // request_ids,
      // type,
      keyword,
      selectedActionType,
      selectedStatus,
      selectedModule,
      selectedRequests,
      languages
    } = this.state

    let requestActionTypes = requests.action_types.map((action_type) => ({value: action_type.id, label: action_type.name}))
    let requestStatus = requests.status.map((status) => ({value: status.id, label: status.name}))
    let requestModules = requests.modules.map((module) => ({value: module.id, label: module.name}))

    requestActionTypes.unshift({value: '', label: 'All'})
    requestStatus.unshift({value: '', label: 'All'})
    requestModules.unshift({value: '', label: 'All'})

    return (
      <div className="container">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <label>{languages.filter}</label>
                    <form className="form-inline d-flex justify-content-between">
                      <div className="form-group d-flex flex-fill pr-3 align-items-center">
                        <small className="mr-2">{languages.reqType}</small>
                        <SelectComponent initValue={selectedActionType} options={requestActionTypes} handleChange={(selectedActionType) => {
                          this.setState({selectedActionType: selectedActionType}, () => this.fetchRequests())
                        }}></SelectComponent>
                      </div>
                      <div className="form-group d-flex flex-fill px-3 align-items-center">
                        <small className="mr-2">{languages.status}</small>
                        <SelectComponent initValue={selectedStatus} options={requestStatus} handleChange={(selectedStatus) => {
                          this.setState({selectedStatus: selectedStatus}, () => this.fetchRequests())
                        }}></SelectComponent>
                      </div>
                      <div className="form-group d-flex flex-fill px-3 align-items-center">
                        <small className="mr-2">{languages.module}</small>
                        <SelectComponent initValue={selectedModule} options={requestModules} handleChange={(selectedModule) => {
                          this.setState({selectedModule: selectedModule}, () => this.fetchRequests())
                        }}></SelectComponent>
                      </div>
                      <div className="form-group d-flex flex-fill pl-3 align-items-center">
                        <div className="input-action w-100">
                          <IconSearch/>
                          <input placeholder='Search Request' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterRequest() )} />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                      { /* <th width="5%">
                        <input type="checkbox" onChange={(e) => {
                          let requestIds = requests.data.map(request => request.id)
                          let newSelectedRequests = e.target.checked ? requestIds : []

                          this.setState({selectedRequests: newSelectedRequests})
                        }}/>
                      </th> */}
                      <th width="10%">
                      { selectedRequests.length > 0 ?
                        <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                          onClick={() => this.setState({request_ids: selectedRequests, confirmText: `Apakah Anda ingin menghapus ${selectedRequests.length} regional?`})}>
                          <IconTrash/>
                          <span className="ml-2">{languages.delete}</span>
                        </span>
                        :
                        <span>{languages.id}</span>
                      }
                      </th>
                      <th width="10%">{ selectedRequests.length > 0 || languages.reqType }</th>
                      { auth.position === 'Checker' && <th width="20%">{ selectedRequests.length > 0 || languages.maker }</th>}
                      <th width="20%">{ selectedRequests.length > 0 || languages.module }</th>
                      <th width="15%">{ selectedRequests.length > 0 || languages.reqDate }</th>
                      <th width="10%">{ selectedRequests.length > 0 || languages.status }</th>
                    </tr>
                  </thead>
                  {requests.loading ?
                    <tbody>
                      <tr>
                        <td colSpan="7">
                          <div className="d-flex flex-column justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {!isEmpty(requests.data) && requests.data.map(request => {
                        let requestStatus

                        if(request.status === "Rejected"){
                          requestStatus = "badge-danger"
                        }else if(request.status === "Approved"){
                          requestStatus = "badge-status"
                        }else{
                          requestStatus = "badge-gray"
                        }

                        return (
                          <tr key={request.id}>
                            { /* <td>
                              <input type="checkbox" checked={selectedRequests.includes(request.id)} onChange={(e) => {
                                let newSelectedRequests = selectedRequests

                                if(e.target.checked){
                                  newSelectedRequests.push(request.id)
                                }else{
                                  newSelectedRequests = selectedRequests.filter(requestID => requestID !== request.id)
                                }

                                this.setState({selectedRequests: newSelectedRequests})
                              }}/>
                            </td> */}
                            <td>
                              <Link to={`/requests/${request.id}`}>{request.id}</Link>
                            </td>
                            <td>{request.action_type}</td>
                            { auth.position === 'Checker' && <td>{request.maker}</td>}
                            <td>{request.module}</td>
                            <td>{moment(request.request_date).format('DD-MM-YYYY')}</td>
                            <td>
                              <span className={`badge ${requestStatus}`}>{request.status}</span>
                            </td>
                          </tr>
                        )
                      })}
                      {isEmpty(requests.data) &&
                        <tr>
                          <td colSpan="7" className="text-center">{languages.no}</td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>
              { !isEmpty(requests.meta) &&
                <div className="card-body border-top">
                  <Pagination pages={requests.meta} routeName="requests" />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, requests}) => ({ auth, requests }),
  { getRequests, getRequestActionTypes, getRequestModules, getRequestStatus, getRequestsV2 }
)(Index)
