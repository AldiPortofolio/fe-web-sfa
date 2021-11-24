import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getCalendars, deleteCalendar, bulkDeleteCalendar  } from '../../actions/calendar'
import { NotAuthorize, SelectComponent, ModalDelete, LoadingDots, Pagination, DatePickerSelect } from '../../components'
import { IconTrash, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/calendar'

// const style = {

//   link: {
//     cursor: 'pointer'
//   }
// }

const type_list = [
  {value: '', label: 'All'},
  {value: 'National Holiday', label: 'National Holiday'},
  {value: 'Office Leave', label: 'Office Leave'},
]

const initState = {
  id: '',
  date: '',
  to: '',
  type: '',
  selected: [],
  calendar_ids: [],
  dateStatus: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  typeStatus: 'success',
  languages: {},
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Calendar"
    
    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }
    this.fetchCalendar(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchCalendar(this.props.location.search);
    }
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
    }, 200)
  }

  filterCalendar = debounce(() => {
    const { date, to, type } = this.state

    if (date !== '' && to === '') {
      this.setState({dateStatus: true})
    } else {
      this.props.getCalendars({date, to, type: type.value})
    }

    
  }, 350)

  fetchCalendar = (pageNumber) => {
    const { date, to, type } = this.state
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getCalendars({date, to, type: type.value}, page)
  }

  render() {
    const { auth, calendars, deleteCalendar, bulkDeleteCalendar } = this.props
    const { 
      confirmIsOpen, 
      resultIsOpen, 
      id,
      type, 
      date, 
      to, 
      languages, 
      typeStatus, 
      dateStatus, 
      selected, 
      calendar_ids,
      confirmText,
      resultText, } = this.state

    if (auth.isAuthenticated && (auth.authority["calendar_setup"] === "" || auth.authority["calendar_setup"] === "No Access")) {
      return <NotAuthorize />
    }

    let newParams = ""

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={typeStatus}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false, confirmText: confirmText}, () => {
                if(calendar_ids.length > 0){
                    bulkDeleteCalendar({calendar_ids: calendar_ids})
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', resultText: data.meta.message, calendar_ids: [], selected: []}, () => this.fetchCalendar())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }else{
                    deleteCalendar(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', resultText: data.meta.message}, () => this.fetchCalendar())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }
              })
            }}
          />
          <div className="col-12">
            <h2>{languages.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              {(auth.authority["calendar_setup"] === "Full Access") &&
                <Link to="/system-configuration/calendar/new" className="btn btn-danger btn-rounded ml-3">{languages.add}</Link>
              }
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  
                  <div className="col-12 mt-3">
                    <div className="row">

                      <div className="col-12 col-lg-6">
                        <div className="form-inline">
                          <div className="col-sm-2 d-flex"><label className="col-form-label">{languages.date}</label></div>
                          <div className="col-sm-4 input-filter d-flex">
                            <DatePickerSelect handleChange={date => this.setState({date})} value={date}/>
                          </div>
                          <div className="d-flex ml-2 mr-1"><label className="col-form-label">{languages.to}</label></div>
                          <div className="col-sm-4 input-filter d-flex">
                            <DatePickerSelect handleChange={to => this.setState({to, dateStatus: false})} value={to} required/>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-lg-6">
                        <div className={`form-inline d-flex ${selected.length > 0 || dateStatus ? '' : 'mb-3'}`}>
                          <div className="d-flex"><label className="col-form-label">{languages.type}</label></div>
                          <div className="d-flex col-lg-6 input-filter" >
                            <SelectComponent options={type_list} initValue={type}
                            handleChange={(type) => this.setState({type}) }
                            />
                          </div>
                          <div className="col-lg-3 d-flex">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.setState({page: 1}, () => this.filterCalendar())}}>{languages.search}</button>
                          </div>
                          { (date !== '' || to !== '' || type !== '') &&
                            <div className="col-lg-1 d-flex ">
                              <button className="btn btn-link text-danger" onClick={() => {
                                  this.setState({
                                    dateStatus: false,
                                    date: '',
                                    to: '',
                                    type: '',
                                    }, 
                                  this.reset())}}>{languages.reset}</button>
                            </div>
                          }
                          
                        </div>
                      </div>

                      <div className={`col-12 col-lg-6 ${selected.length > 0 ? 'mb-3': ''}`}>
                        <div className="form-inline">
                          <div className="col-sm-2 d-flex"></div>
                          <div className="col-sm-4 input-filter d-flex mr-1">
                          </div>
                          <div className="d-flex ml-4"></div>
                          <div className="col-sm-4 input-filter">
                            { dateStatus && <small className="text-danger">{languages.errTo}</small>}
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-lg-6">
                        <div className="form-inline">
                          <div className="col-sm-2 d-flex"></div>
                          <div className="col-sm-4 input-filter d-flex mr-1">
                          </div>
                          <div className="d-flex ml-4"></div>
                          <div className="col-sm-4 input-filter">
                          </div>
                        </div>
                      </div>

                      { selected.length > 0 &&
                      <React.Fragment>
                        <div className="card-body border-top col-12 mb-0">
                          <div className="col-12">
                              <div className="d-flex">
                                <button type="submit" className="btn btn-outline-danger"  onClick={() => this.setState({calendar_ids: selected, confirmText: `${languages.hapusData} ${selected.length} data?`, confirmIsOpen: true})}>{languages.delete}</button>
                              </div>
                          </div>
                        </div>
                      </React.Fragment>
                      }
                    </div>
                  </div>

                </div>
              </div>


              <div className="table-fixed">
                <table className="table table-header table-striped">
                  <thead>
                    <tr>
                      <th width="4%">
                        <input type="checkbox" onChange={(e) => {
                          let calendar_ids = calendars.data.map(data => data.id)
                          let newSelected = e.target.checked ? calendar_ids : []

                          this.setState({selected: newSelected})
                        }}/>
                      </th>
                      <th width="15%">{languages.id}</th>
                      <th width="20%">{languages.date}</th>
                      <th width="20%">{languages.type}</th>
                      <th width="20%">{languages.desc}</th>
                      <th width="10%">{languages.actions}</th>
                    </tr>
                  </thead>
                  {calendars.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {calendars.data && calendars.data.map((calendar, idx) => {
                        return(
                          <tr key={idx}>
                            <td>
                              <input type="checkbox" checked={selected.includes(calendar.id)} onChange={(e) => {
                                let newSelected = selected

                                if(e.target.checked){
                                  newSelected.push(calendar.id)
                                }else{
                                  newSelected = selected.filter(id => id !== calendar.id)
                                }

                                this.setState({selected: newSelected})
                              }}/>
                            </td>
                            <td className="text-capitalize">{calendar.id}</td>
                            <td>{moment(calendar.event_date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
                            <td className="text-capitalize">{calendar.event_type}</td>
                            <td className="text-capitalize">{calendar.description}</td>

                            {(auth.authority["calendar_setup"] === "Full Access") ?
                              <td className="d-flex align-items-center justify-content-center">
                                <Link to={`/system-configuration/calendar/edit/${calendar.id}`} className="px-2 btn-circle">
                                  <IconEdit/>
                                </Link>
                                <button className="px-2 btn-circle text-danger"
                                  style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                  onClick={() => this.setState({id: calendar.id, confirmIsOpen: true, confirmText: languages.singleDelete})}
                                  >
                                  <IconTrash/>
                                </button>
                              </td>
                              :
                              <td></td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                  {(!calendars.loading && isEmpty(calendars.data)) &&
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center">There is no Data</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={calendars.meta} routeName="system-configuration/calendar" parameter={newParams} handleClick={(pageNumber) => this.fetchCalendar(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, calendars }) => ({ auth, calendars }),
  { getCalendars, deleteCalendar, bulkDeleteCalendar }
)(Index)
