import React from 'react';
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { searchAreas } from '../../actions/area'
import { searchSubAreas } from '../../actions/subarea'
import { getSale, getSalesRoles, findTransferSales, getSalesManagementDetail, promoteSales } from '../../actions/sale'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectAsync, SelectComponentLoad } from '../../components'
import SalesDetail from '../../components/sales/SalesDetail'
import { ind, en } from '../../languages/promotion'
// import BulkCreate from '../../components/sales/BulkCreate'
// import axios from '../../actions/config'

class Promotion extends React.Component {
  state = {
    id: null,
    selectedSales: '',
    selectedRole: '',
    salesDetail: '',
    sales: '',
    selectedTranferSales: '',
    transferSalesDetail: '',
    transferSales: '',
    listSales: [],
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
    upload: '',
    uploadStatus: 'Upload File',
    salesPositions: [{
      role: {value: '', label: ''},
      region: {value: '', label: ''},
      branch: {value: '', label: ''},
      area: {value: '', label: ''},
      sub_area: {value: '', label: ''},
    }],

    selectedRegional: {value: '', label: 'Semua'},
    selectedBranch: {value: '', label: 'Semua'},
    selectedArea: {value: '', label: 'Semua'},
    selectedSubArea: {value: '', label: 'Semua'},
    selectedAssignment: {},
    languages: {}
  }

  componentDidMount(){
    document.title = "SFA OTTO - Promotion / Transfer Sales"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.create})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.create})
    }

    this.props.getRegions()

    this.props.getSalesRoles()
    .then((data) => {
      let newRoles = []

      data.data.map((role) => newRoles.push({value: role.id, label: role.name, section: role.section}))

      this.setState({roles: newRoles})
    })
  }

  filterSales = (inputValue) => {
    let newSales = []

    if(inputValue.length > 0){
      newSales.push({value: '', label: 'Searching...', disabled: true})
      this.setState({listSales: newSales})

      this.props.findTransferSales(inputValue)
      .then((data) => {
        let newSales = []
        data.data.map((sales) => newSales.push({value: sales.id, label: `${sales.sfa_id} - ${sales.name}`}))

        this.setState({listSales: newSales})
      })
    }else{
      newSales.push({value: '', label: 'No Options', disabled: true})
      this.setState({listSales: newSales})
    }
  };

  addCoverage(){
    let newSalesPositions = this.state.salesPositions

    let newPosition = {
      role: {value: '', label: ''},
      region: {value: '', label: ''},
      branch: {value: '', label: ''},
      area: {value: '', label: ''},
      sub_area: {value: '', label: ''},
    }

    newSalesPositions.push(newPosition)

    this.setState({salesPositions: newSalesPositions})
  }

  render() {
    const { auth, history, regions,
      searchBranch, searchSubAreas, searchAreas,
      getSalesManagementDetail, promoteSales } = this.props
    const {
      sales,
      listSales,
      roles,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      selectedSales,
      transferSales,
      selectedTransferSales,
      branches,
      areas,
      subareas,
      salesPositions,
      emptyBranch,
      emptyArea,
      emptySubArea,
      languages } = this.state

      if (auth.isAuthenticated && (auth.authority["promotion_or_transfer"] === "" || auth.authority["promotion_or_transfer"] === "No Access")) {
        return <NotAuthorize />
      }

      const regionOptions = []

      regions.data.map((region) => regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`}))

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sales/verifications')}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
          />
          <form className="col-12" onSubmit={(e) => {
            e.preventDefault()
            let newPositions = []

            salesPositions.map((position) => {
              let lastPosition = {}

              if(position.region){
                lastPosition = {role_id: position.role.value, regional_id: position.region.value}
              }

              if(position.branch){
                lastPosition = {role_id: position.role.value, regional_id: position.branch.value}
              }

              if(position.area){
                lastPosition = {role_id: position.role.value, regional_id: position.area.value}
              }

              if(position.sub_area){
                lastPosition = {role_id: position.role.value, regional_id: position.sub_area.value}
              }

              return newPositions.push(lastPosition)
            })

            let formData = {
              sales_id: sales.id,
              transfered_sales_id: selectedTransferSales.value,
              positions: newPositions
            }

            if(selectedSales.value && selectedTransferSales.value){
              promoteSales(formData)
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message, textReason: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: 'Promotion/Transfer Assignment success!'})
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: 'Promotion/Transfer Assignment fail!', textReason: e.message})
              })
            }else{
              this.setState({confirmIsOpen: true, type: 'error', textError: 'Promotion/Transfer Assignment fail!'})
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
                              .then((data) => {
                                this.setState({selectedSales: selectedSales, sales: data.data})
                              })

                              this.props.getRegions()

                              this.setState({selectedSales: selectedSales})
                            }} onInputChange={debounce((value) => {
                              this.filterSales(value)
                            }, 500)} placeholder="Type sales name or NIP"></SelectAsync>
                          </div>
                          <div className="col-3">
                            { /* <a href="" className="btn btn-danger btn-block">Search</a> */ }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  { sales &&
                    <SalesDetail sales={sales} />
                  }
                </div>
                { /* <div className="card mb-5">
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
                                  <small className="text-danger">This Area have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { ["Area", "Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>Area Code</label>
                                <SelectLineComponent options={areas} placeholder="Type Branch" handleChange={(selectedArea) => {
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
                                  <small className="text-danger">This Region have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { ["Sub Area"].includes(selectedRole.section) &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>SubArea Code</label>
                                <SelectLineComponent options={subareas} placeholder="Type Sub Area" handleChange={(selectedSubArea) => {
                                  this.setState({selectedSubArea, selectedAssignment: selectedSubArea.value})
                                }}/>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div> */}

                { salesPositions.map((salesPosition, idx) => (
                  <div className="card mb-5" key={"sales-positions" + idx}>
                    <div className="card-body row m-0">
                      <div className="col-12 col-lg-6">
                        <h6>{languages.header2}</h6>
                        <div className="form-group mt-3 mb-2">
                          <label>{languages.role}</label>
                          <SelectLineComponent initValue={salesPosition.role} options={roles} handleChange={(selectedRole) => {
                            // this.props.getRegions()
                            let newSalesPositions = salesPositions
                            let newSalesPosition = newSalesPositions[idx]
                            newSalesPosition.role = selectedRole

                            if(selectedRole.label === "Region Sales"){
                              delete newSalesPosition.branch
                              delete newSalesPosition.area
                              delete newSalesPosition.sub_area
                            }

                            if(selectedRole.label === "Branch sales"){
                              if(isEmpty(newSalesPosition.branch))   { newSalesPosition.branch = {value: '', label: ''} }
                              delete newSalesPosition.area
                              delete newSalesPosition.sub_area
                            }

                            if(selectedRole.label === "Area Sales"){
                              if(isEmpty(newSalesPosition.branch))   { newSalesPosition.branch = {value: '', label: ''} }
                              if(isEmpty(newSalesPosition.area))     { newSalesPosition.area = {value: '', label: ''} }
                              delete newSalesPosition.sub_area
                            }

                            if(selectedRole.label === "SubArea Sales"){
                              if(isEmpty(newSalesPosition.branch))   { newSalesPosition.branch = {value: '', label: ''} }
                              if(isEmpty(newSalesPosition.area))     { newSalesPosition.area = {value: '', label: ''} }
                              if(isEmpty(newSalesPosition.sub_area)) { newSalesPosition.sub_area = {value: '', label: ''} }
                            }

                            this.setState({salesPositions: newSalesPositions})
                          }} placeholder="Type Role"></SelectLineComponent>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 d-flex justify-content-end align-items-start">
                        { salesPositions.length >= 2 &&
                          <span className="btn btn-sm btn-danger" onClick={() => {
                            let newSalesPositions = salesPositions.filter((sPos) => sPos !== salesPosition)

                            this.setState({salesPositions: newSalesPositions})
                          }}>{languages.remove}</span>
                        }
                      </div>
                    </div>
                    <div className="card-body border-top">
                      <div className="col-12">
                        <h6>{languages.header3}</h6>
                        <div className="row">
                          { salesPosition.region &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.regionalCode}</label>
                                <SelectLineComponent
                                  initValue={salesPosition.region}
                                  options={regionOptions}
                                  placeholder="Type Region"
                                  handleChange={(selectedRegion) => {
                                    let newSalesPositions = salesPositions
                                    let newSalesPosition = salesPositions[idx]
                                    newSalesPosition.region = selectedRegion
                                    if(!isEmpty(newSalesPosition.branch))   { newSalesPosition.branch = {value: '', label: ''} }
                                    if(!isEmpty(newSalesPosition.area))     { newSalesPosition.area = {value: '', label: ''} }
                                    if(!isEmpty(newSalesPosition.sub_area)) { newSalesPosition.sub_area = {value: '', label: ''} }

                                    this.setState({salesPositions: newSalesPositions})
                                }}/>
                                {
                                  emptyBranch &&
                                  <small className="text-danger">This Region have no Coverage yet.</small>
                                }
                              </div>
                            </div>
                          }
                          { salesPosition.branch &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.branchCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.branch}
                                  options={branches}
                                  placeholder="Type Branch"
                                  onFocus={() => {
                                    searchBranch(salesPosition.region.value)
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
                                  }}
                                  handleChange={(selectedBranch) => {
                                    let newSalesPositions = salesPositions
                                    let newSalesPosition = salesPositions[idx]
                                    newSalesPosition.branch = selectedBranch
                                    if(!isEmpty(newSalesPosition.area))     { newSalesPosition.area = {value: '', label: ''} }
                                    if(!isEmpty(newSalesPosition.sub_area)) { newSalesPosition.sub_area = {value: '', label: ''} }

                                    this.setState({salesPositions: newSalesPositions})
                                }}/>
                                {
                                  emptyArea &&
                                  <small className="text-danger">{languages.noBranch}</small>
                                }
                              </div>
                            </div>
                          }
                          { salesPosition.area &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.areaCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.area}
                                  options={areas}
                                  placeholder="Type Area"
                                  onFocus={() => {
                                    searchAreas(salesPosition.branch.value)
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
                                  }}
                                  handleChange={(selectedArea) => {
                                    let newSalesPositions = salesPositions
                                    let newSalesPosition = salesPositions[idx]
                                    newSalesPosition.area = selectedArea
                                    if(!isEmpty(newSalesPosition.sub_area)) { newSalesPosition.sub_area = {value: '', label: ''} }

                                    this.setState({salesPositions: newSalesPositions})
                                }}/>
                                {
                                  emptySubArea &&
                                  <small className="text-danger">{languages.noArea}</small>
                                }
                              </div>
                            </div>
                          }
                          { salesPosition.sub_area &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.subCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.sub_area}
                                  options={subareas}
                                  placeholder="Type Sub Area"
                                  onFocus={() => {
                                    searchSubAreas(salesPosition.area.value)
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
                                  }}
                                  handleChange={(selectedSubArea) => {
                                    let newSalesPositions = salesPositions
                                    let newSalesPosition = salesPositions[idx]
                                    newSalesPosition.sub_area = selectedSubArea

                                    this.setState({salesPositions: newSalesPositions})
                                }}/>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <span className="btn btn-danger btn-sm mb-4" onClick={() => this.addCoverage()}>{languages.add}</span>

                { isEmpty(salesPositions) &&
                  <div className="upload-area d-flex flex-column align-items-center justify-content-center py-4">
                    {languages.noPosisi}

                    <span className="btn btn-danger btn-sm mt-3" onClick={() => this.addCoverage()}>A{languages.add}</span>
                  </div>
                }
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6>{languages.header4}</h6>
                      <div className="form-group mt-3 mb-2">
                        <label>{languages.sales}</label>
                        <div className="form-row">
                          <div className="col-6">
                            <SelectAsync initValue={selectedTransferSales} options={listSales} handleChange={(selectedTransferSales) => {

                              getSalesManagementDetail(selectedTransferSales.value)
                              .then((data) => {
                                this.setState({selectedTransferSales: selectedTransferSales, transferSales: data.data})
                              })

                              this.props.getRegions(1)

                              this.setState({selectedTransferSales: selectedTransferSales})
                            }} onInputChange={debounce((value) => {
                              this.filterSales(value)
                            }, 500)} placeholder="Type sales name or NIP"></SelectAsync>
                          </div>
                          <div className="col-3">
                            { /* <a href="" className="btn btn-danger btn-block">Search</a> */ }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  { transferSales &&
                    <SalesDetail sales={transferSales} />
                  }
                </div>
              </div>
              { auth.authority["promotion_or_transfer"] === "Full Access" &&
                <div className="col-12 mb-3">
                  <hr className="content-hr"/>
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/sales" className="btn btn-default">{languages.cancel}</Link>
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
    getSale, getSalesRoles, findTransferSales, getSalesManagementDetail,
    getRegions, searchBranch, searchAreas, searchSubAreas, promoteSales
  }
)(Promotion)
