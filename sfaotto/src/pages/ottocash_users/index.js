// import React from 'react';
// import DatePicker from 'react-datepicker'
// import { isEmpty, debounce } from 'lodash'
// import { Link } from 'react-router-dom'
// import moment from 'moment'
// import { connect } from 'react-redux'
// import { getOttocashUsers, exportOttocashUser } from '../../actions/ottocash_user'
// import { Pagination, LoadingDots, SelectComponent } from '../../components'
// import { IconSearch, IconTrash } from '../../components/Icons'

// const initState = {
//   keyword: '',
//   request_ids: [],
//   resultIsOpen: false,
//   confirmText: '',
//   resultText: '',
//   start_date: moment(),
//   end_date: moment(),
//   type: 'success'
// }

// const defaultUrl = process.env.REACT_APP_API_URL

// class Index extends React.Component {
//   state = initState

//   componentDidMount(){
//     document.title = "SFA OTTO - List Request"

//     this.props.getOttocashUsers()
//   }

//   // componentDidUpdate(prevProps) {
//   //   if (this.props.location.search !== prevProps.location.search) {
//   //     this.getOttocashUsers();
//   //   }
//   // }

//   toggleDropdown(toggle) {
//     let obj = {}
//     obj[toggle] = !this.state[toggle]
//     this.setState(obj)
//   }

//   hide(e, toggle) {
//     setTimeout(() => {
//       let obj = {}
//       obj[toggle] = !this.state[toggle]
//       this.setState(obj)
//     }, 175)
//   }

//   filterOttocash = debounce(() => {
//     this.props.getOttocashUsers(this.state.keyword)
//   }, 500)

//   handleExport() {
//     const { start_date, end_date } = this.state
    
//     this.props.exportOttocashUser(start_date, end_date)
//     .then((data) => {
//       debugger
//     })
//   }

//   render() {
//     const { auth, ottocash_user } = this.props
//     const {
//       type,
//       keyword,
//       start_date,
//       end_date
//     } = this.state

//     return (
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-12 mb-3">
//             <h2>List User Ottocash</h2>
//           </div>
//           <div className="col-12 col-md-9 mb-4">
//             <div className="card noSelect">
//               <div className="card-body my-3 d-flex justify-content-end">
//                 <div className="form-group input-action mr-3 w-30 mb-0">
//                   <IconSearch/>
//                   <input placeholder='Search...' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterOttocash() )} />
//                 </div>
//               </div>
//               <div className="table-fixed">
//                 <table className="table table-header mb-0">
//                   <thead>
//                     <tr>
//                       <th>No Hp User</th>
//                       <th>Nama User</th>
//                       <th>Tanggal pencatatan</th>
//                       <th>No Hp Sales</th>
//                       <th>Nama Sales</th>
//                     </tr>
//                   </thead>
//                   {ottocash_user.loading ?
//                     <tbody>
//                       <tr>
//                         <td colSpan="7">
//                           <div className="d-flex flex-column justify-content-center align-items-center">
//                             <LoadingDots color="black" />
//                           </div>
//                         </td>
//                       </tr>
//                     </tbody>
//                     :
//                     <tbody>
//                       {!isEmpty(ottocash_user.data) && ottocash_user.data.map(ottocash_user => {

//                         return (
//                           <tr key={ottocash_user.id}>
//                             <td>{ottocash_user.phone_number}</td>
//                             <td>{ottocash_user.name}</td>
//                             <td>{ottocash_user.transaction_date}</td>
//                             <td>{ottocash_user.sales_phone_number}</td>
//                             <td><Link to={`/ottocash/users/${ottocash_user.sales_phone_number}`}>{ottocash_user.sales_name}</Link></td>
//                           </tr>
//                         )
//                       })}
//                       {isEmpty(ottocash_user.data) &&
//                         <tr>
//                           <td colSpan="7" className="text-center">No Request</td>
//                         </tr>
//                       }
//                     </tbody>
//                   }
//                 </table>
//               </div>
//               { !isEmpty(ottocash_user.meta) &&
//                 <div className="card-body border-top">
//                   <Pagination pages={ottocash_user.meta} routeName="ottocash_user" />
//                 </div>
//               }
//             </div>
//           </div>
//           <div className="col-12 col-md-3 mb-4">
//             <div className="card">
//               <div className="card-body">
//                 <h6>Export</h6>
//                 <div className="mt-4">
//                   <div className="form-group">
//                     <label htmlFor="start-date">Start Date</label>
//                     <DatePicker selected={start_date} className="form-control" onChange={date => this.setState({start_date: date})} />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="end-date">End Date</label>
//                     <DatePicker selected={end_date} className="form-control" onChange={date => this.setState({end_date: date})} />
//                   </div>
//                   <div className="form-group text-right mb-0">
//                     <a
//                     href={`${defaultUrl}/otto_cash_users/export?start_date=${start_date}&end_date=${end_date}`}
//                     className="btn btn-danger"
//                     target="_blank"
//                     >Terapkan</a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default connect(
//   ({ auth, ottocash_user }) => ({ auth, ottocash_user }),
//   { getOttocashUsers, exportOttocashUser }
// )(Index)


import React from 'react';
// import DatePicker from 'react-datepicker'
import { isEmpty, debounce } from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getOttocashUsers, exportOttocashUser } from '../../actions/ottocash_user'
import { Pagination, LoadingDots, SelectComponent, DatePicker } from '../../components'
import { IconSearch, IconTrash } from '../../components/Icons'
import { linkSync } from 'fs';
import { ind, en } from '../../languages/ottocash_users'

const initState = {
  keyword: '',
  request_ids: [],
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  start_date: moment(),
  end_date: moment(),
  type: 'success',
  linkdownload: '',
  dateMessage: '',
  languages: {}
}

const defaultUrl = process.env.REACT_APP_API_URL

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - List Request"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.props.getOttocashUsers()
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.location.search !== prevProps.location.search) {
  //     this.getOttocashUsers();
  //   }
  // }

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

  filterOttocash = debounce(() => {
    this.props.getOttocashUsers(this.state.keyword)
  }, 500)

  handleExport() {
    const { start_date, end_date } = this.state
    
    this.props.exportOttocashUser(start_date, end_date)
    .then((data) => {
      debugger
    })
  }

  fetchReviews = (pageNumber) => {
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getReviews({}, page)
  }

  dateValidate(endDate) {
    endDate = moment(endDate, 'DD-MM-YYYY')
    var startDate = moment(this.state.start_date, 'DD-MM-YYYY')

    if (endDate < startDate) {
      this.setState({dateMessage: 1})
    } else {
      this.setState({dateMessage: 0})
    }

    this.setState({linkdownload: `${defaultUrl}/otto_cash_users/export?start_date=${this.state.start_date}&end_date=${this.state.end_date}`})
    
  }

  dateValidate2(startDate) {
    startDate = moment(startDate, 'DD-MM-YYYY')
    var endDate = moment(this.state.end_date, 'DD-MM-YYYY')

    if (endDate < startDate) {
      this.setState({dateMessage: 1})
    } else {
      this.setState({dateMessage: 0})
    }
    
  }

  render() {
    const { auth, ottocash_user } = this.props
    const {
      type,
      keyword,
      start_date,
      end_date,
      linkdownload,
      dateMessage,
      languages
    } = this.state

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
          </div>
          <div className="col-12 col-md-9 mb-4">
            <div className="card noSelect">
              <div className="card-body my-3 d-flex justify-content-end">
                <div className="form-group input-action mr-3 w-30 mb-0">
                  <IconSearch/>
                  <input placeholder='Search...' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterOttocash() )} />
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                      <th>{languages.noHp}</th>
                      <th>{languages.nama}</th>
                      <th>{languages.tanggal}</th>
                      <th>{languages.noSales}</th>
                      <th>{languages.namaSales}</th>
                    </tr>
                  </thead>
                  {ottocash_user.loading ?
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
                      {!isEmpty(ottocash_user.data) && ottocash_user.data.map(ottocash_user => {

                        return (
                          <tr key={ottocash_user.id}>
                            <td>{ottocash_user.phone_number}</td>
                            <td>{ottocash_user.name}</td>
                            <td>{ottocash_user.transaction_date}</td>
                            <td>{ottocash_user.sales_phone_number}</td>
                            {/* <td><Link to={`/ottocash/users/${ottocash_user.sales_phone_number}`}>{ottocash_user.sales_name}</Link></td> */}
                            <td><Link to={`/sales/detail/${ottocash_user.sales_id}`}>{ottocash_user.sales_name}</Link></td>
                          </tr>
                        )
                      })}
                      {isEmpty(ottocash_user.data) &&
                        <tr>
                          <td colSpan="7" className="text-center">{languages.noReq}</td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={ottocash_user.meta} routeName="ottocash/users" handleClick={(pageNumber) => this.fetchReviews(pageNumber)}/>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h6>{languages.export}</h6>
                <div className="mt-4">
                  <div className="form-group">
                    <label htmlFor="start-date">{languages.start}</label>
                    {/* <DatePicker selected={start_date} className="form-control" onChange={start_date => this.setState({start_date})} /> */}
                    <DatePicker handleChange={start_date => this.setState({start_date}, () => this.dateValidate2(start_date))} value={start_date}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="end-date">{languages.end}</label>
                    <DatePicker handleChange={end_date => this.setState({end_date}, () => this.dateValidate(end_date))} value={end_date}/>
                    {
                      (dateMessage === 1 && <small className="text-danger">{languages.canNot}</small>)
                    }
                  </div>
                  <div className="form-group text-right mb-0">
                    <a
                    href={linkdownload}
                    className={`btn btn-danger ${dateMessage === 1 ? 'disabled' : ''}`}
                    target="_blank"
                    >{languages.terapkan}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, ottocash_user }) => ({ auth, ottocash_user }),
  { getOttocashUsers, exportOttocashUser }
)(Index)
