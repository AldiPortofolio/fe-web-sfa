import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSalesLevelAssignments } from '../../actions/sales_level_assignment';
import { findSalesLevel } from '../../actions/sales_level';
import { NotAuthorize, LoadingDots, Pagination, SelectAsync } from '../../components';
import { IconEdit } from '../../components/Icons';
import Translator from '../../languages/Translator';

// const style = {
//   link: {
//     cursor: 'pointer'
//   }
// }

const initState = {
  id: '',
  sales_level: '',
  sales_level_list: [],
  phone_number: '',
  dateStatus: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  typeStatus: 'success',
  languages: {},
  tPages: {},
  tGeneral: {},
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Sales Level Assignment"
    
    if (this.props.auth.language === 'in'){
      this.setState({tPages: Translator('In').pages.salesLevelAssignment, tGeneral: Translator('In').general})
    } else if (this.props.auth.language === 'en'){
      this.setState({tPages: Translator('En').pages.salesLevelAssignment, tGeneral: Translator('En').general})
    }
    this.fetchSalesLevelAssignment(window.location.search)

    this.filterSalesLevel('')
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSalesLevelAssignment(this.props.location.search);
    }
  }

  filterSalesLevel = debounce((inputValue) => {
    // if(inputValue.length > 0){
      this.props.findSalesLevel(inputValue)
      .then((data) => {
        let new_sales_level = []
        data.data.forEach((level) => {
          new_sales_level.push({value: level.id, label: `${level.name}`})
        })

        this.setState({sales_level_list: new_sales_level})
      })
    // }
  });

  fetchSalesLevelAssignment = (pageNumber) => {
    const { id, sales_level, phone_number } = this.state
    let page = "?page=1";
    let sales_level_id = ''

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }
    if (sales_level) {
      sales_level_id = sales_level.value.toString()
    }

    this.props.getSalesLevelAssignments({id, sales_level_id, phone_number}, page)
  }
  

  render() {
    const { auth, sales_level_assignments } = this.props
    const { 
      sales_level,
      phone_number,
      sales_level_list,
      tPages,
      tGeneral } = this.state

    if (auth.isAuthenticated && (auth.authority["sales_level_assignment"] === "" || auth.authority["sales_level_assignment"] === "No Access")) {
      return <NotAuthorize />
    }

    let newParams = ""

    return (
      <div className="container">
        <div className="row">

          <div className="col-12">
            <h2>{tPages.title}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              {(auth.authority["sales_level_assignment"] === "Full Access") &&
                <Link to="/sales/sales_level_assignment/new" className="btn btn-danger btn-rounded ml-3">{tPages.titleAdd}</Link>
              }
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  
                  <div className="col-12 mt-3">
                    <div className="row">

                      <div className="col-12 col-lg-4">
                        <div className="form-inline d-flex">
                            <div className="col-sm-3 d-flex"><label className="col-form-label">{tPages.phone}</label></div>
                            <div className="col-lg-9 input-filter">
                                <input type="text" name="id" className="form-control form-control-line w-30" 
                                    placeholder={tGeneral.input+' '+tPages.phone}
                                    onChange={e => {
                                    this.setState({phone_number: e.target.value})
                                    }}
                                    value={phone_number}
                                />
                            </div>
                        </div>
                      </div>

                      <div className="col-12 col-lg-5">
                        <div className="form-inline d-flex">
                            <div className="col-sm-4 d-flex"><label className="col-form-label">{tPages.salesLevel}</label></div>
                            <div className="col-lg-8 input-filter">
                                <SelectAsync initValue={sales_level} options={sales_level_list} handleChange={(sales_level) => { 
                                this.setState({sales_level})
                                }} onInputChange={(value) => {
                                  this.filterSalesLevel(value)
                                }} placeholder="Type Sales Level" className="select-circle flex-fill" classNamePrefix="select-circle-inner"></SelectAsync>
                            </div>
                        </div>
                      </div>

                      {/* <div className="col-12 col-lg-6">
                        <div className="form-inline">
                            <div className="col-sm-3 d-flex"><label className="col-form-label">{tGeneral.id}</label></div>
                            <div className="col-lg-9 input-filter">
                                <input type="number" name="sales_phone" className="form-control form-control-line w-30" 
                                    placeholder={tGeneral.input+' '+tGeneral.id}
                                    onChange={e => {
                                    if (isNaN(Number(e.target.value))) {
                                        return
                                    }
                                    this.setState({id: e.target.value})
                                    }}
                                    value={id}
                                />
                            </div>
                        </div>
                      </div> */}

                      <div className="col-12 col-lg-3">
                        <div className="form-inline d-flex">
                          {/* <div className="col-lg-3 d-flex"></div> */}
                          <div className="col-lg-8 d-flex">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.setState({page: 1}, () => this.fetchSalesLevelAssignment())}}>{tGeneral.search}</button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>


              <div className="table-fixed">
                <table className="table table-header table-striped">
                  <thead>
                    <tr>
                      <th width="15%">{'Sales ' + tGeneral.id}</th>
                      <th width="30%">{tPages.salesName}</th>
                      <th width="20%">{'Sales ' + tPages.phone}</th>
                      <th width="15%">{tPages.salesLevel}</th>
                      <th width="10%">{tGeneral.actions}</th>
                    </tr>
                  </thead>
                  {sales_level_assignments.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={5}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {sales_level_assignments.data && sales_level_assignments.data.map((level, idx) => {
                        return(
                          <tr key={idx}>
                            <td className="text-capitalize">{level.id}</td>
                            <td className="text-capitalize">{level.sales_name}</td>
                            <td className="text-capitalize">{level.phone_number}</td>
                            <td className="text-capitalize">{level.sales_level}</td>
                            {(auth.authority["sales_level_assignment"] === "Full Access") ?
                                <td className="d-flex align-items-center justify-content-center">
                                    <Link to={`/sales/sales_level_assignment/${level.id}/edit`} className="px-2 btn-circle">
                                        <IconEdit/>
                                    </Link>
                                </td>
                              :
                              <td></td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                  {(!sales_level_assignments.loading && isEmpty(sales_level_assignments.data)) &&
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center">There is no Data</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={sales_level_assignments.meta} routeName="sales/sales_level_assignment" parameter={newParams} handleClick={(pageNumber) => this.fetchSalesLevel(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales_level_assignments }) => ({ auth, sales_level_assignments }),
  { getSalesLevelAssignments, findSalesLevel }
)(Index)
