import React from 'react';
import { find, includes, debounce } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isNaN, isEmpty } from 'lodash'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { searchAreas } from '../../actions/area'
import { searchSubAreas } from '../../actions/subarea'
import { getSale, getSalesRoles, findSales, getSalesManagementDetail, positionAssignment } from '../../actions/sale'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectAsync, LoadingSpinner, DatePicker, SelectComponentLoad } from '../../components'
import BulkAssignment from '../../components/sales/BulkAssignment'
import RegionForm from '../../components/sales/RegionForm'
import axios from '../../actions/config'
import { IconUser } from '../../components/Icons'

class NewAssignment extends React.Component {
  state = {
    id: null,
    selectedSales: '',
    selectedRole: '',
    salesDetail: '',
    sales: '',
    listSales: [],
    listSubareas: [1],
    roles: [],
    confirmIsOpen: false,
    expandCard: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    status: '',
    regionalProvince: '',
    regionalCity: '',
    branches: [],
    areas: [],
    subareas: [],
    emptyBranch: false,
    emptyArea: false,
    emptySubArea: false,

    selectedRegional: {value: '', label: 'Semua'},
    selectedBranch: {value: '', label: 'Semua'},
    selectedArea: {value: '', label: 'Semua'},
    selectedSubArea: {value: '', label: 'Semua'},
    selectedAssignment: {},
  }

  componentDidMount(){
    document.title = "SFA OTTO - Assignment Sales"

    this.props.getSalesRoles()
    .then((data) => {
      let newRoles = []

      data.data.map((role) => {
        newRoles.push({value: role.id, label: role.name, section: role.section})
      })

      this.setState({roles: newRoles})
    })

    this.props.findSales(null)
      .then((data) => {
        let newSales = []
        data.data.map((sales) => {
          newSales.push({value: sales.id, label: `${sales.sfa_id} - ${sales.name}`})
        })

        this.setState({listSales: newSales})
      })
  }


  filterSales = debounce((inputValue) => {
    if(inputValue.length > 0){
      let newSales = []
      this.props.findSales(inputValue)
      .then((data) => {
        let newSales = []
        data.data.map((sales) => {
          newSales.push({value: sales.id, label: `${sales.sfa_id} - ${sales.name}`})
        })

        this.setState({listSales: newSales})
      })
    }
  });

  render() {
    const { auth, history, verifySale, regions,
      searchBranch, searchSubAreas, searchAreas,
      getSalesManagementDetail, positionAssignment } = this.props
    const { sales,
      listSales,
      listSubareas,
      roles,
      confirmIsOpen,
      expandCard,
      type,
      textSuccess,
      textError,
      textReason,
      selectedSales,
      selectedRole,
      branches,
      areas,
      subareas,
      selectedRegional,
      selectedBranch,
      selectedArea,
      emptyBranch,
      emptyArea,
      emptySubArea,
      selectedAssignment,
      selectedSubArea,
      status } = this.state

      if (auth.authority["assignment_sales"] === "" || auth.authority["assignment_sales"] === "No Access") {
        return <NotAuthorize />
      }

      const regionOptions = []

      regions.data.map((region) => {
        regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`})
      })

      console.log(selectedSales.label + " - " + selectedRole.label + " - " +selectedAssignment)

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
              role_id: selectedRole.value,
              regional_id: selectedAssignment,
            }

            if(selectedSales.value && selectedRole.value){
              positionAssignment(formData)
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message, textReason: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Assign sales position success', textReason: undefined})
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
                <h2>Assignment Sales</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12 col-lg-6">
                      <h6>Select New Role</h6>
                      <div className="form-group mt-3 mb-2">
                        <label>Role</label>
                        <SelectLineComponent options={roles} handleChange={(selectedRole) => {
                          this.props.getRegions()

                          this.setState({selectedRole: selectedRole})
                        }} placeholder="Type Role"></SelectLineComponent>
                      </div>
                    </div>
                  </div>
                  { selectedRole.section &&
                    <div className="card-body border-top">
                      <div className="col-12">
                        <h6>Regional Detail</h6>
                        <div className="row">
                          { ["Region", "Branch", "Area", "Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>Regional Code</label>
                                <SelectLineComponent options={regionOptions} placeholder="Type Region" handleChange={(selectedRegion) => {
                                  searchBranch(selectedRegion.value)
                                    .then((data) => {
                                      let newBranches = []

                                      if(data.data.length > 0){
                                        data.data.map((branch) => {
                                          newBranches.push({value: branch.id, label: `${branch.id} - ${branch.name}`})
                                        })
                                        this.setState({branches: newBranches, emptyBranch: false})
                                      }else{
                                        this.setState({branches: [], emptyBranch: true})
                                      }
                                    })
                                  this.setState({selectedRegion, selectedAssignment: selectedRegion.value})
                                }}/>
                                {
                                  emptyBranch &&
                                  <small className="text-danger">This Region have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { ["Branch", "Area", "Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>Branch Code</label>
                                <SelectLineComponent options={branches} placeholder="Type Branch" handleChange={(selectedBranch) => {
                                  searchAreas(selectedBranch.value)
                                    .then((data) => {
                                      let newAreas = []

                                      if(data.data.length > 0){
                                        data.data.map((area) => {
                                          newAreas.push({value: area.id, label: `${area.id} - ${area.name}`})
                                        })
                                        this.setState({areas: newAreas, emptyArea: false})
                                      }else{
                                        this.setState({areas: [], emptyArea: true})
                                      }
                                    })
                                  this.setState({selectedBranch, selectedAssignment: selectedBranch.value})
                                }}/>
                                {
                                  emptyArea &&
                                  <small className="text-danger">This Branch have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { ["Area", "Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>Area Code</label>
                                <SelectLineComponent options={areas} placeholder="Type Area" handleChange={(selectedArea) => {
                                  searchSubAreas(selectedArea.value)
                                    .then((data) => {
                                      let newSubAreas = []

                                      if(data.data.length > 0){
                                        data.data.map((subarea) => {
                                          newSubAreas.push({value: subarea.id, label: `${subarea.id} - ${subarea.name}`})
                                        })
                                        this.setState({subareas: newSubAreas, emptySubArea: false})
                                      }else{
                                        this.setState({subareas: [], emptySubArea: true})
                                      }
                                    })
                                  this.setState({selectedArea, selectedAssignment: selectedArea.value})
                                }}/>
                                {
                                  emptySubArea &&
                                  <small className="text-danger">This Area have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { ["Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>Subarea Code</label>
                                <SelectLineComponent options={subareas} placeholder="Type Sub Area" handleChange={(selectedSubArea) => {
                                  searchSubAreas(selectedSubArea.value)
                                    .then((data) => {
                                      let newSubAreas = []

                                      if(data.data.length > 0){
                                        data.data.map((subarea) => {
                                          newSubAreas.push({value: subarea.id, label: `${subarea.id} - ${subarea.name}`})
                                        })
                                      }
                                    })
                                  this.setState({selectedSubArea, selectedAssignment: selectedSubArea.value})
                                }}/>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6>Choose Sales</h6>
                      <div className="form-group mt-3 mb-2">
                        <label>Sales</label>
                        <div className="form-row">
                          <div className="col-6">
                            <SelectAsync initValue={selectedSales} options={listSales} handleChange={(selectedSales) => {

                              getSalesManagementDetail(selectedSales.value)
                              .then((data) => {
                                this.setState({selectedSales: selectedSales, sales: data.data})
                              })

                              this.props.getRegions(1)

                              this.setState({selectedSales: selectedSales})
                            }} onInputChange={(value) => {
                              this.filterSales(value)
                            }} placeholder="Type sales name or NIP"></SelectAsync>
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
                            <div className="col-12 col-lg-3 text-center d-flex">
                              <div className="avatar  d-flex justify-content-center align-items-center">
                                <IconUser />
                              </div>
                            </div>
                            <div className="col-12 col-lg-6">
                              <p>{sales.first_name} {sales.last_name}</p>
                            </div>
                            <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                              <strong className="mb-0"><small>Status</small></strong>
                              <span className="badge badge-status">{sales.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer border-top">
                        <div className="col-12">
                          { sales.positions.map((position) => (
                            <div className="row">
                              <div className="col-12 col-lg-3">
                                <small><strong className="mb-0">Role Sebelumnya</strong></small>
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
                    </React.Fragment>
                  }
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <BulkAssignment history={history} />
              </div>

              { auth.authority["assignment_sales"] === "Full Access" &&
                <div className="col-12 mb-3">
                  <hr className="content-hr"/>
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/sales" className="btn btn-default">Cancel</Link>
                    <button type="submit" className="btn btn-danger">Save</button>
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
    getSale, getSalesRoles, findSales, getSalesManagementDetail,
    getRegions, searchBranch, searchAreas, searchSubAreas, positionAssignment
  }
)(NewAssignment)
