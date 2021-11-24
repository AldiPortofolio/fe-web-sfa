import React from 'react';
import { debounce, isEmpty, find } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUnassignedRegions } from '../../actions/region'
import { getUnassignedBranches } from '../../actions/branch'
import { getUnassignedAreas } from '../../actions/area'
import { searchSubAreas } from '../../actions/subarea'
import { getUnassignSales, getSalesRoles, SetPositionSales } from '../../actions/sale'
import { SelectLineComponent, ModalConfirm, LoadingDots, Pagination, NotAuthorize } from '../../components'
import { ind, en } from '../../languages/unsignment'
// import { IconDownload, IconUpload, IconSearch } from '../../components/Icons'

// const statuses = [
//   'Verified', 'Registered', 'Unregistered', 'Inactive'
// ]

const initState = {
  selectedRegion: {value: '', label: 'Semua'},
  selectedStatus: [],
  branches: [],
  areas: [],
  subareas: [],
  selectedSales: {},
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedBranch: {value: '', label: 'Semua'},
  selectedArea: {value: '', label: 'Semua'},
  assignedSales: [],
  assignedSalesDetails: [],
  roles: [],
  keyword: '',
  id: '',
  params: '',
  confirmIsOpen: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  languages: {}
}

class Unassignment extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Manage Sales"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.table})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.table})
    }
    
    this.fetchSales(window.location.search)
    this.props.getUnassignedRegions()
    this.props.getSalesRoles()
    .then((data) => {
      let newRoles = []

      data.data.map((role) => newRoles.push({value: role.id, label: role.name, section: role.section}))

      this.setState({roles: newRoles})
    })
  }

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSales(this.props.location.search);
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
    }, 175)
  }

  getLastPostion = (sales) => {
    if(!isEmpty(sales.position.sub_area)){
      return sales.position.sub_area
    }else if(!isEmpty(sales.position.area)){
      return sales.position.area
    }else if(!isEmpty(sales.position.branch)){
      return sales.position.branch
    }else if(!isEmpty(sales.position.region)){
      return sales.position.region
    }
  }

  filterSales = debounce(() => {
    const { selectedRegion, keyword, selectedStatus } = this.state
    let newParams = ""

    if(selectedRegion.value){
      newParams = newParams + `region_id=${selectedRegion.value}`
    }

    if(selectedStatus.length > 0){
      newParams = newParams + `status=${selectedStatus.join()}`
    }

    this.props.getUnassignSales({status: selectedStatus.join(), region_id: selectedRegion.value, keyword, params: newParams})
  }, 350)

  getSelectBranches(selectedRegion){
    this.props.getUnassignedBranches(selectedRegion)
      .then((data) => {
        let newBranches = []

        if(data.data.length > 0){
          data.data.map((branch) => newBranches.push({value: branch.id, label: `${branch.id} - ${branch.name}`}))
          this.setState({branches: newBranches, emptyBranch: false})
        }else{
          this.setState({branches: [], emptyBranch: true})
        }
      })
  }

  getSelectAreas(selectedBranch){
    this.props.getUnassignedAreas(selectedBranch)
      .then((data) => {
        let newAreas = []

        if(data.data.length > 0){
          data.data.map((district) => newAreas.push({value: district.id, label: `${district.id} - ${district.name}`}))
          this.setState({areas: newAreas, emptyArea: false})
        }else{
          this.setState({areas: [], emptyArea: true})
        }
      })
  }

  getSelectSubareas(selectedArea){
    this.props.searchSubAreas(selectedArea)
      .then((data) => {
        let newSubAreas = []

        if(data.data.length > 0){
          data.data.map((village) => newSubAreas.push({value: village.id, label: `${village.id} - ${village.name}`}))
        }

        this.setState({subareas: newSubAreas})
      })
  }

  setDetailPosition(id, region, regionName) {
    let newAssignedSalesDetails = this.state.assignedSalesDetails.filter(sales => sales.id !== id)
    let replaceValue = this.state.assignedSalesDetails.filter(sales => sales.id === id)[0]

    if(replaceValue){
      replaceValue[region] = regionName
      newAssignedSalesDetails.push(replaceValue)
    }

    this.setState({assignedSalesDetails: newAssignedSalesDetails})
  }

  setPosition(id, role, regionId) {
    let newAssignedSales = this.state.assignedSales

    let salesDetail = {
      sales_id: id,
      role_type: role,
      regional_id: regionId
    }

    var filterAssignedSales = newAssignedSales.filter((sales) => sales.sales_id !== id)

    filterAssignedSales.push(salesDetail)

    this.setState({assignedSales: filterAssignedSales})
  }

  assignSales() {
    this.props.SetPositionSales({positions: this.state.assignedSales})
      .then((data) => {
        if(data.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
        }else{
          this.setState({confirmIsOpen: true, type: 'success', textSuccess: 'Assign sales success'})
        }
      })
  }

  fetchSales = (pageNumber) => {
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getUnassignSales({}, page)
  }

  findValue(id, name){
    let detail = find(this.state.assignedSalesDetails, function(sales) {return sales.id === id})

    if(detail){
      return detail[name]
    }else{
      return "-"
    }

  }

  render() {
    const { auth, regions, sales } = this.props
    const {
      roles,
      confirmIsOpen,
      textSuccess,
      textError,
      branches,
      areas,
      subareas,
      type,
      selectedRegion,
      selectedStatus,
      selectedSales,
      assignedSales,
      assignedSalesDetails,
      languages } = this.state

    let newRegions = []
    let newParams = ""
    
    if(!isEmpty(regions)){
      regions.data.map(region => newRegions.push({value: region.id, label: `${region.id} - ${region.name}`}))
    }

    if(selectedRegion.value){
      newParams = newParams + `&region_id=${selectedRegion.value}`
    }

    if(selectedStatus.length > 0){
      newParams = newParams + `&status=${selectedStatus.join()}`
    }

    if (auth.isAuthenticated && (auth.authority["unassignment_sales"] === "" || auth.authority["unassignment_sales"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => {
              this.setState({confirmIsOpen: false})
              this.fetchSales()
            }}
            textSuccess={textSuccess}
            textError={textError}
          />
          <div className="col-12 mb-5">
            <h2>{languages.header}</h2>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      <th width="20%">{languages.name}</th>
                      <th width="13%">{languages.role}</th>
                      <th width="13%">{languages.region}</th>
                      <th width="13%">{languages.branch}</th>
                      <th width="13%">{languages.area}</th>
                      <th width="13%">{languages.sub}</th>
                    </tr>
                  </thead>
                  {sales.loading ?
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
                      {sales.unassign && sales.unassign.map((sale, idx) => {
                        return(
                          <tr key={sale.id + sale.name + idx}>
                            <td className="text-capitalize">{sale.name}</td>
                            <td>
                              <SelectLineComponent options={roles} handleChange={(selectedRole) => {
                                this.props.getUnassignedRegions()
                                let newAssignedSalesDetails = assignedSalesDetails.filter(sales => sales.id !== sale.id)

                                let newSelectedSales = {id: sale.id, role: selectedRole.label}
                                newAssignedSalesDetails.push({id: sale.id, role: selectedRole.label, region: '', branch: '', area: '', subarea: ''})

                                this.setState({
                                  selectedRole: selectedRole,
                                  selectedSales: newSelectedSales,
                                  assignedSalesDetails: newAssignedSalesDetails
                                })
                              }} placeholder="Pilih Role"></SelectLineComponent>
                            </td>
                            <td>
                              { selectedSales.id === sale.id &&
                                <SelectLineComponent options={newRegions} placeholder="Pilih Region" handleChange={(selectedRegion) => {
                                  this.getSelectBranches(selectedRegion.value)
                                  this.setDetailPosition(sale.id, "region", selectedRegion.label)

                                  if(selectedSales.role === "Region Sales"){
                                    this.setPosition(sale.id, "Region", selectedRegion.value)
                                  }
                                }}/>
                              }
                              {
                                selectedSales.id !== sale.id && this.findValue(sale.id, "region")
                              }
                            </td>
                            <td>
                              { (selectedSales.id === sale.id && (selectedSales.role === "Branch sales" || selectedSales.role === "Area Sales" || selectedSales.role === "Sub Area Sales")) &&
                                <SelectLineComponent options={branches} placeholder="Pilih Branch" handleChange={(selectedBranch) => {
                                  this.getSelectAreas(selectedBranch.value)
                                  this.setDetailPosition(sale.id, "branch", selectedBranch.label)

                                  if(selectedSales.role === "Branch sales"){
                                    this.setPosition(sale.id, "Branch", selectedBranch.value)
                                  }
                                }}/>
                              }
                              {
                                selectedSales.id !== sale.id && this.findValue(sale.id, "branch")
                              }
                            </td>
                            <td>
                              { (selectedSales.id === sale.id && (selectedSales.role === "Area Sales" || selectedSales.role === "Sub Area Sales")) &&
                                <SelectLineComponent options={areas} placeholder="Pilih Area" handleChange={(selectedArea) => {
                                  this.getSelectSubareas(selectedArea.value)
                                  this.setDetailPosition(sale.id, "area", selectedArea.label)

                                  if(selectedSales.role === "Area Sales"){
                                    this.setPosition(sale.id, "Area", selectedArea.value)
                                  }  
                                }}/>
                              }
                              {
                                selectedSales.id !== sale.id && this.findValue(sale.id, "area")
                              }
                            </td>
                            <td>
                              { (selectedSales.id === sale.id && selectedSales.role === "Sub Area Sales") &&
                                <SelectLineComponent options={subareas} placeholder="Pilih Subarea" handleChange={(selectedSubArea) => {
                                  this.setDetailPosition(sale.id, "subarea", selectedSubArea.label)
                                  
                                  if(selectedSales.role === "Sub Area Sales"){
                                    this.setPosition(sale.id, "Sub Area", selectedSubArea.value)
                                  }  
                                }}/>
                              }
                              {
                                selectedSales.id !== sale.id && this.findValue(sale.id, "subarea")
                              }
                            </td>
                          </tr>
                        )}
                      )}
                    </tbody>
                  }
                  {(!sales.loading && isEmpty(sales.unassign)) &&
                    <tbody>
                      <tr>
                        <td colSpan={8} className="text-center">{languages.no}</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={sales.meta} routeName="sales/unassignment" parameter={newParams} handleClick={(pageNumber) => this.fetchSales(pageNumber)} />
              </div>
            </div>
          </div>
          <div className="col-12 mb-3">
            <hr className="content-hr"/>
            <div className="form-group d-flex justify-content-between">
              <Link to="/sales" className="btn btn-default">{languages.cancel}</Link>
              <button className={`btn btn-danger ${assignedSales.length ? '' : 'disabled'}`}  disabled={!assignedSales.length} onClick={() => this.assignSales()}>{languages.save}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales, regions, branches, areas, subareas}) => ({ auth, sales, regions, branches, areas, subareas }),
  {getUnassignSales, getSalesRoles, SetPositionSales, getUnassignedRegions, getUnassignedBranches, getUnassignedAreas, searchSubAreas}
)(Unassignment)
