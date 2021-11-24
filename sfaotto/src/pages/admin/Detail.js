import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { find, isEmpty } from 'lodash'
import { getRoles } from '../../actions/role'
import { editAdmin, getAdmin, getAdminStatuses, getAdminV2_1, editAdminV2_1 } from '../../actions/admin'
import { getRegions } from '../../actions/region'
import { searchBranch, getBranches } from '../../actions/branch'
import { searchAreas, getAreas } from '../../actions/area'
import { NotAuthorize, SelectLineComponent, LoadingDots, ModalConfirm, SelectComponentLoad } from '../../components'
import { ind, en } from '../../languages/admin'
import { getAssignmentRoles } from '../../actions/assignment_role'

const PositionOptions = [
  {value: "Maker", label: "Maker"},
  {value: "Checker", label: "Checker"}
]

class Detail extends React.Component {
  state = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    chief_id: '',
    selectedPosition: {},
    selectedRole: {},
    selectedRegion: '',
    selectedBranch: '',
    selectedArea: '',
    emptyBranch: '',
    emptyArea: '',
    branches: [],
    areas: [],
    pin1: '',
    pin2: '',
    pin3: '',
    pin4: '',
    pin5: '',
    pin6: '',
    pinConf1: '',
    pinConf2: '',
    pinConf3: '',
    pinConf4: '',
    pinConf5: '',
    pinConf6: '',
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    isLoading: false,
    languages: {},
    selectedAssigmentRole:{},
    emptySubArea: false,
    assigmentCoverages: [{
      regional: {value: '', label: ''},
      branch: {value: '', label: ''},
      area: {value: '', label: ''},
    }],
    assignmentRoles: []
  }

  getData = async () => {
    const { match, getRegions, getRoles, getAdmin, roles, getAdminV2_1, getBranches, getAreas, searchAreas } = this.props

    await this.props.getAssignmentRoles()
    .then((data) => {
      let newAssignmentRoles = []
      data.data.map((role) => {
        newAssignmentRoles.push({value: role.code, label: role.name})
      })

      this.setState({assignmentRoles: newAssignmentRoles})
    })

    const regionOptions = []
    getRegions()
    .then(async (data) => {
      data.data.regions.map((region) => {
        regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`})
      })
    })

    const branchOptions = []
    getBranches()
    .then(async (data) => {
      data.data.branches.map((region) => {
        branchOptions.push({value: region.id, label: `${region.id} - ${region.name}`})
      })
    })

    const roleOptions = []
    await getRoles()
    .then((data) => {
        data.data.map((role) => {
            roleOptions.push({value: role.id, label: role.name})
        })
    })
    

    getAdminV2_1(match.params.id)
      .then(({data: {admin}}) => {
        let selectedRole = admin.role ? find(roleOptions, {label: admin.role}) : {}
        let selectedPosition = (admin.position === "Checker") ? {value: "Checker", label: "Checker"} : {value: "Maker", label: "Maker"}
        let selectedAssigmentRole = admin.assignment_role ? find(this.state.assignmentRoles, {value: admin.assignment_role}) : {}

        let newAssigmentCoverage = this.state.assigmentCoverages
        if(admin.assignment_coverages != null && admin.assignment_coverages.length > 0){
          newAssigmentCoverage = []
          let index = 0
          admin.assignment_coverages.map(async (coverage) => {
            let objAssignmentCoverage = {}
            objAssignmentCoverage['regional'] = coverage.region_id ? find(regionOptions, {value: coverage.region_id}) : {}
            objAssignmentCoverage['branch'] = coverage.branch_id ? find(branchOptions, {value: coverage.branch_id}) : {} 

            const areaOptions = this.getArea(coverage.branch_id, coverage.area_id)
            objAssignmentCoverage['area'] = await areaOptions.then(function(result) {
                return result
            });

            newAssigmentCoverage.push(objAssignmentCoverage)

            if(index != admin.assignment_coverages.length-1){
              index++
              return
            }

            this.setState({
              ...admin,
              selectedRole,
              selectedPosition,
              selectedAssigmentRole,
              assigmentCoverages: newAssigmentCoverage
            })
          })
        }

        this.setState({
          ...admin,
          selectedRole,
          selectedPosition,
          selectedAssigmentRole,
          assigmentCoverages: newAssigmentCoverage
        })
      })
  }

  componentDidMount(){
    document.title = "SFA OTTO - Edit Admin"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    this.getData()
  }

  getArea = async(brancId, areaId) => {
    const { searchAreas } = this.props
    let areaOptions = {}
    await searchAreas(brancId)
    .then((data) => {
        for (let index = 0; index < data.data.length; index++) {
            if(data.data[index].id === areaId) {
                areaOptions = { value: data.data[index].id, label: `${data.data[index].id} - ${data.data[index].name}`}
                break
            }
        }
    })
    return areaOptions
  }

  setPin = (val, pos) => {
    let obj = {}
    if (isNaN(Number(val)) || !val) {
      obj[`pin${pos}`] = ''
      this.setState(obj)
      return
    }
    obj[`pin${pos}`] = val
    this.setState(obj, () => (pos < 6) && this.refs[`pin${pos+1}`].focus())
  }

  setPinConfirm = (val, pos) => {
    let obj = {}
    if (isNaN(Number(val)) || !val) {
      obj[`pinConf${pos}`] = ''
      this.setState(obj)
      return
    }
    obj[`pinConf${pos}`] = val
    this.setState(obj, () => (pos < 6) && this.refs[`pinConf${pos+1}`].focus())
  }

  convertToDash = ( str ) => {
    return str.replace(/\s+/g, '-').toLowerCase();
  }

  titleCase(str){
    str = str.replace(/_/g, ' ').toLowerCase().split(' ');

    let final = [ ];

      for(let word of str){
        final.push(word.charAt(0).toUpperCase()+ word.slice(1));
      }

    return final.join(' ')
  }

  addCoverage(){
    let newAssigmentCoverage = this.state.assigmentCoverages

    let newCoverage = {
      regional: {value: '', label: ''},
      branch: {value: '', label: ''},
      area: {value: '', label: ''},
    }

    newAssigmentCoverage.push(newCoverage)

    this.setState({assigmentCoverages: newAssigmentCoverage})
  }


  validateCoverageArea = (assigmentCoverages) => {
    let result = true
    let index = 0;
    assigmentCoverages.map((coverage) => {
      for (let i = index+1; i < assigmentCoverages.length; i++) {
        const element = assigmentCoverages[i]
        if(JSON.stringify(coverage) === JSON.stringify(element)) result = false
      }
      index++;
    })

    return result
  }

  render() {
    let allFilled = false
    const { auth, roles, editAdmin, history, regions, searchBranch, searchAreas, editAdminV2_1 } = this.props

    if (auth.isAuthenticated && (auth.authority["add_admin"] === "" || auth.authority["add_admin"] === "No Access")) {
      return <NotAuthorize />
    }

    const { id,
      first_name,
      last_name,
      email,
      selectedPosition,
      selectedRole,
      chief_id,
      selectedRegion,
      selectedArea,
      emptyBranch,
      emptyArea,
      branches,
      areas,
      pin1,
      pin2,
      pin3,
      pin4,
      pin5,
      pin6,
      pinConf1,
      pinConf2,
      pinConf3,
      pinConf4,
      pinConf5,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      pinConf6,
      isLoading,
      languages,
      selectedAssigmentRole,
      assigmentCoverages,
      emptySubArea,
      assignmentRoles  } = this.state

    let pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6
    let pin_confirmation = pinConf1 + pinConf2 + pinConf3 + pinConf4 + pinConf5 + pinConf6

    if (first_name && last_name && email && selectedPosition.label) {
      allFilled = true
    }

    let notMatch = false
    if ((pin.split('')).length === 6 && (pin_confirmation.split('')).length === 6 && pin !== pin_confirmation) {
      notMatch = true
    }

    const regionOptions = []

    regions.data.map((region) => (
      regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`})
    ))

    return (
      <div className="container mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            let newAssignmentCoverage= []
            assigmentCoverages.map((coverage) => {
              let coverageArea = {}

              if(selectedAssigmentRole.label === 'Kantor Pusat') return

              if(selectedAssigmentRole.label === 'Kepala Cabang'){
                coverageArea = {region_id: coverage.regional.value}
              }

              if(selectedAssigmentRole.label === 'Kepala Area Sales'){
                coverageArea = {region_id: coverage.regional.value, branch_id: coverage.branch.value}
              }

              if(selectedAssigmentRole.label === 'Kepala Tim Sales'){
                coverageArea = {region_id: coverage.regional.value, branch_id: coverage.branch.value, area_id: coverage.area.value}
              }

              newAssignmentCoverage.push(coverageArea)

            })

            this.setState({isLoading: true, textError: ""})

            if(!this.validateCoverageArea(assigmentCoverages)){
              this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: "Tidak boleh ada wilayah yang duplikat"})
              return
            }

            if (allFilled) {
              editAdminV2_1(id, {
                admin_id: id,
                first_name,
                last_name,
                email,
                pin,
                pin_confirmation,
                chief_id,
                position: selectedPosition.value,
                role_id: (isEmpty(selectedRole) ? '' : selectedRole.value),
                assignment_role: selectedAssigmentRole.value,
                assignment_coverages: newAssignmentCoverage
              })
                .then(data => this.setState({confirmIsOpen: true, type: 'success', textSuccess: languages.sukses}))
                .catch(e => this.setState({confirmIsOpen: true, type: 'error', textSuccess: languages.gagal}))
            }
          }}
          className="">

          <div className="row">
            <ModalConfirm
              confirmIsOpen={confirmIsOpen}
              type={type}
              confirmClose={() => this.setState({confirmIsOpen: false})}
              confirmSuccess={() => history.push('/admin/manage')}
              textSuccess={textSuccess}
              textError={textError}
            />
            <div className="col-12 mb-5">
              <h2>{languages.detail}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="mb-4">{languages.header2}</h6>
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.namaDpn}</label>
                          <p className="text-blue">{first_name}</p>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.namaBlkg}</label>
                          <p className="text-blue">{last_name}</p>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.email}</label>
                          <p className="text-blue">{email}</p>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-group">
                          <label>{languages.position}</label>
                          <p className="text-blue">{selectedPosition ? selectedPosition.label : ""}</p>
                        </div>
                      </div>
                      { (!isEmpty(selectedPosition) && selectedPosition.value === "Maker") &&
                        <div className="col-12 col-lg-12">
                            <div className="form-group">
                              <label>{languages.role}</label>
                              <p className="text-blue">{selectedRole ? selectedRole.label : ""}</p>
                            </div>
                        </div>
                      }
                    </div>
                </div>
              </div>
              { selectedPosition.value && 
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="mb-4">{languages.assignmentRole}</h6>
                    <div className="row">
                      <div className="col-12 col-lg-12">
                        <div className="form-group">
                          <label className="">{languages.role}</label>
                          <p className="text-blue">{selectedAssigmentRole ? selectedAssigmentRole.label : ""}</p>
                        </div>
                      </div>
                    </div>
                    { selectedAssigmentRole.value && selectedAssigmentRole.label !== 'Kantor Pusat'  &&
                      <div className="border-top pt-3">
                        <h6 className="mb-4">{languages.assignmentCoverageAre}</h6>
                        { assigmentCoverages.map((assigmentCoverage, idx) => (
                          <div className="row" key={"assignment-role-" + idx}>
                            { idx > 0 &&
                              <div className="col-12 col-lg-12 mb-4">
                                <hr className="content-hr"/>
                              </div>
                            }
                            { (selectedAssigmentRole.label === 'Kepala Tim Sales' || selectedAssigmentRole.label === 'Kepala Area Sales' || selectedAssigmentRole.label === 'Kepala Cabang') && assigmentCoverage.regional &&
                              <div className="col-12 col-lg-6">
                                <div className="form-group">
                                  <label className="">{languages.regionalCode}</label>
                                  <p className="text-blue">{assigmentCoverage.regional ? assigmentCoverage.regional.label : ""}</p>
                                </div>
                              </div>
                            }
                            { (selectedAssigmentRole.label === 'Kepala Tim Sales' || selectedAssigmentRole.label === 'Kepala Area Sales') && assigmentCoverage.branch &&
                              <div className="col-12 col-lg-6">
                                <div className="form-group">
                                  <label className="">{languages.branchCode}</label>
                                  <p className="text-blue">{assigmentCoverage.branch ? assigmentCoverage.branch.label : ""}</p>
                                    {
                                      emptyArea &&
                                      <small className="text-danger">{languages.noBranch}</small>
                                    }
                                </div>
                              </div>
                            }
                            { (selectedAssigmentRole.label === 'Kepala Tim Sales') &&  assigmentCoverage.area && 
                                <div className="col-12 col-lg-12">
                                  <div className="form-group">
                                    <label className="">{languages.areaCode}</label>
                                    <p className="text-blue">{assigmentCoverage.area ? assigmentCoverage.area.label : ""}</p>
                                      {
                                        emptySubArea &&
                                        <small className="text-danger">{languages.noArea}</small>
                                      }
                                  </div>
                                </div>
                            }
                          </div>
                          
                        ))}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
            { auth.authority["add_admin"] === "Full Access" &&
              <div className="col-12 text-right mb-5">
                <div className="border-top pt-3">
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/admin/manage" className="btn btn-default">{languages.cancel}</Link>
                    <Link to={`/admin/edit/${id}`} className="btn btn-default">{languages.edit}</Link>
                  </div>
                </div>
              </div>
            }
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({admins, auth, roles, regions, branches, areas }) => ({ admins, auth, roles, regions, branches, areas }),
  {editAdmin, getAdminStatuses, getAdmin, getRegions, searchBranch, searchAreas, getRoles, getAssignmentRoles, getAdminV2_1, getBranches, getAreas, editAdminV2_1}
)(Detail)
