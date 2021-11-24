import React from 'react';
import { debounce, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import { getRegions } from '../../actions/region'
import { getSale, getFunctionalRoles, findSales, getSalesManagementDetail, updateFunctionalSales } from '../../actions/sale'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectAsync } from '../../components'
import BulkAssignPosition from '../../components/sales/BulkAssignPosition'
import { ind, en } from '../../languages/position'
// import axios from '../../actions/config'

class PositionNew extends React.Component {
  state = {
    id: null,
    selectedSales: '',
    selectedRole: '',
    salesDetail: '',
    sales: '',
    roles: [],
    occupation: '',
    confirmIsOpen: false,
    expandCard: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    status: '',
    languages: {}
  }

  componentDidMount(){
    document.title = "SFA OTTO - Assign Sales Position"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.recruit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.recruit})
    }

    this.props.getFunctionalRoles()
    .then((data) => {
      let newRoles = []

      data.data.map((role) => newRoles.push({value: role.id, label: role.name}))

      this.setState({roles: newRoles})
    })

    this.props.findSales(null, "functional")
      .then((data) => {
        let newSales = []
        data.data.map((sales) => newSales.push({value: sales.id, label: `${sales.sfa_id} - ${sales.name}`}))

        this.setState({listSales: newSales})
      })
  }


  filterSales = debounce((inputValue) => {
    if(inputValue.length > 0){

      this.props.findSales(inputValue, "functional")
      .then((data) => {
        let newSales = []
        data.data.map((sales) => newSales.push({value: sales.id, label: `${sales.sfa_id} - ${sales.name}`}))

        this.setState({listSales: newSales})
      })
    }
  });

  render() {
    const { auth, history, getSalesManagementDetail, updateFunctionalSales } = this.props
    const { sales,
      listSales,
      occupation,
      // listSubareas,
      roles,
      confirmIsOpen,
      // expandCard,
      type,
      textSuccess,
      textError,
      textReason,
      selectedSales,
      selectedRole,
      languages
      // status
    } = this.state

      if (auth.isAuthenticated && (auth.authority["assign_position"] === "" || auth.authority["assign_position"] === "No Access")) {
        return <NotAuthorize />
      }

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sales')}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
          />
          <form className="col-12" onSubmit={(e) => {
            e.preventDefault()
            let formData = {
              sales_id: selectedSales.value,
              functional_position: selectedRole.value,
              occupation
            }

            if(!isEmpty(selectedSales) && !isEmpty(selectedRole)){
              updateFunctionalSales(formData)
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message, textReason: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Assign sales position success' })
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: 'Assign sales position fail', textReason: e.message})
              })
            }else{
              this.setState({confirmIsOpen: true, type: 'error', textError: 'Assign sales position fail', textReason: "Please make sure Role and sales are filled"})
            }
          }}>
            <div className="row">
              <div className="col-12 mb-5">
                <h2>{languages.header}</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6>{languages.header1}</h6>
                      <div className="form-group mt-3 mb-2">
                        <label>{languages.sales}</label>
                        <div className="form-row">
                          <div className="col-6">
                            <SelectAsync initValue={selectedSales} options={listSales} handleChange={(selectedSales) => {

                              getSalesManagementDetail(selectedSales.value)
                              .then((data) => this.setState({selectedSales: selectedSales, sales: data.data}))

                              this.setState({selectedSales: selectedSales})
                            }} onInputChange={debounce((value) => {
                              this.filterSales(value)
                            }, 500)} placeholder="Type sales name or NIP" required></SelectAsync>
                          </div>
                          <div className="col-3">
                            { /* <a href="" className="btn btn-danger btn-block">Search</a> */ }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  { sales &&
                    <React.Fragment>
                      <div className="card-footer border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-2 text-center d-flex justify-content-center align-items-center">
                              <div className="avatar  d-flex justify-content-center align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                              </div>
                            </div>
                            <div className="col-12 col-lg-7">
                              <p>{sales.first_name} {sales.last_name}</p>
                            </div>
                            <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                              <strong className="mb-0"><small>{languages.status}</small></strong>
                              <span className="badge badge-status">{sales.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      { !isEmpty(sales.positions) &&
                        <div className="card-footer border-top">
                          <div className="col-12">
                            { sales.positions.map((position) => (
                              <div className="row">
                                <div className="col-12 col-lg-3">
                                  <small><strong className="mb-0">{languages.roleSebelum}</strong></small>
                                </div>
                                <div className="col-12 col-lg-9">
                                  <p className="mb-2">{position.role}</p>
                                  <p className="mb-2">{position.region}</p>
                                  <p className="mb-2">{position.branch}</p>
                                  <p className="mb-2">{position.area}</p>
                                  <p className="mb-2">{position.sub_area}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    </React.Fragment>
                  }
                </div>
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6>{languages.header2}</h6>
                      <div className="form-group mt-3 mb-2">
                        <div className="row">
                          <div className="col-6">
                            <label>{languages.fungsional}</label>
                            <SelectLineComponent initValue={selectedRole} options={roles} handleChange={(selectedRole) => {
                              this.setState({selectedRole: selectedRole})
                            }} placeholder="Type Jabatan Fungsional"></SelectLineComponent>
                          </div>
                          <div className="col-6">
                            <div className="form-group">
                              <label>{languages.title}</label>
                              <input
                                onChange={e => this.setState({occupation: e.target.value})}
                                value={occupation} type="text" className="form-control form-control-line" placeholder="Masukan Jabatan Title" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <BulkAssignPosition history={history} />
              </div>

              { auth.authority["assign_position"] === "Full Access" &&
                <div className="col-12 mb-3">
                  <hr className="content-hr"/>
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/sales/positions" className="btn btn-default">{languages.cancel}</Link>
                    <button type="submit" className="btn btn-danger">{languages.save}</button>
                  </div>
                </div>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales, regions, branches, areas}) => ({ auth, sales, regions, branches, areas }),
  {
    getSale, getFunctionalRoles, findSales, getSalesManagementDetail, updateFunctionalSales
  }
)(PositionNew)
