import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { capitalize, isEmpty } from 'lodash'
import { createAdmin, getAdminStatuses } from '../../actions/admin'
import { searchBranch } from '../../actions/branch'
import { searchAreas } from '../../actions/area'
import { NotAuthorize, SelectLineComponent, ModalConfirm, LoadingDots, SelectComponentLoad } from '../../components'
import { ind, en } from '../../languages/admin'
import BulkErrorFileV21 from '../../components/BulkErrorFileV21'
import { getRegions } from '../../actions/region'
import { getAssignmentRoles } from '../../actions/assignment_role'

const PositionOptions = [
  {value: "Maker", label: "Maker"},
  {value: "Checker", label: "Checker"}
]

class Register extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    chief_id: '',
    selectedPosition: {},
    selectedRole: {},
    selectedRegion: '',
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

  componentDidMount(){
    document.title = "SFA OTTO - Register Admin"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    // this.prop()
    this.props.getAdminStatuses()
    this.props.getRegions()

    this.props.getAssignmentRoles()
    .then((data) => {
      let newAssignmentRoles = []

      data.data.map((role) => {
        newAssignmentRoles.push({value: role.code, label: role.name})
      })

      this.setState({assignmentRoles: newAssignmentRoles})
    })
  }

  setPin = (target, pos) => {
    let obj = {}
    let val = target.value

    target.select()
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
    const { auth, roles, createAdmin, history, regions, searchBranch, searchAreas } = this.props

    if (auth.isAuthenticated && (auth.authority["add_admin"] === "" || auth.authority["add_admin"] === "No Access")) {
      return <NotAuthorize />
    }

    const { first_name,
      last_name,
      email,
      chief_id,
      selectedPosition,
      selectedRole,
      selectedArea,
      selectedRegion,
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
      isLoading,
      pinConf6,
      languages,
      selectedAssigmentRole,
      assigmentCoverages,
      emptySubArea,
      assignmentRoles } = this.state
    let pin = pin1 + pin2 + pin3 + pin4 + pin5 + pin6
    let pin_confirmation = pinConf1 + pinConf2 + pinConf3 + pinConf4 + pinConf5 + pinConf6

    if (selectedPosition.label && first_name && last_name && email && pin && (pin === pin_confirmation)) {
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

            if(allFilled){
              createAdmin({
                first_name,
                last_name,
                email,
                pin,
                pin_confirmation,
                chief_id,
                position: selectedPosition.value,
                role_id: (isEmpty(selectedRole) ? 0 : selectedRole.value),
                assignment_role: selectedAssigmentRole.value,
                assignment_coverages: newAssignmentCoverage
              })
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: 'Tambah data admin sukses'})
                  }
                })
                .catch(e => this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textSuccess: 'Tambah data admin gagal'}))
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
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-3">
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="mb-4">{languages.header2}</h6>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.namaDpn}</label>
                        <input
                          onChange={e => this.setState({first_name: capitalize(e.target.value)})}
                          value={first_name} type="text" className="form-control form-control-line" placeholder="Masukan Nama Depan" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.namaBlkg}</label>
                        <input
                          onChange={e => this.setState({last_name: capitalize(e.target.value)})}
                          value={last_name} type="text" className="form-control form-control-line" placeholder="Masukan Nama Belakang" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.email}</label>
                        <input name='email' onChange={e => this.setState({email: e.target.value})} value={email} type="email" className="form-control form-control-line" placeholder="Masukan Email" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.position}</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={PositionOptions} initValue={selectedPosition}
                            handleChange={(selectedPosition) => {
                              if(selectedPosition.value === "Checker"){
                                this.setState({selectedPosition, selectedRole: {}})
                              }else{
                                this.setState({selectedPosition})
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-12">
                    { (!isEmpty(selectedPosition) && selectedPosition.value === "Maker") &&
                      <div className="form-group">
                        <label>{languages.roleAuthority}</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={roles.form} initValue={selectedRole}
                            handleChange={(selectedRole) => this.setState({selectedRole}) }
                          />
                        </div>
                      </div>
                    }
                    </div>
                    {/* { (selectedRole.label === "RSM" || selectedRole.label === "BSM" || selectedRole.label === "ASM") && 
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">{languages.region}</label>
                              <div className="custom-select-line">
                                <SelectLineComponent options={regionOptions} placeholder="Type Region" handleChange={(selectedRegion) => {
                                  searchBranch(selectedRegion.value)
                                    .then((data) => {
                                      let newBranches = []

                                      if(data.data.length > 0){
                                        data.data.map((branch) => (
                                          newBranches.push({value: branch.id, label: `${branch.id} - ${branch.name}`})
                                        ))
                                        this.setState({branches: newBranches, emptyBranch: false})
                                      }else{
                                        this.setState({branches: [], emptyBranch: true})
                                      }
                                    })
                                  this.setState({selectedRegion, chief_id: selectedRegion.value})
                                }}/>
                              </div>
                              {
                                emptyBranch &&
                                <small className="text-danger">{languages.noRegion}</small>
                              }
                            </div>
                          </div>
                        { (selectedRole.label === "BSM" || selectedRole.label === "ASM") &&
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">{languages.branch}</label>
                              <div className="custom-select-line">
                                <SelectLineComponent options={branches}
                                  handleChange={(selectedBranch) => {
                                    searchAreas(selectedBranch.value)
                                      .then((data) => {
                                        let newDistricts = []

                                        if(data.data.length > 0){
                                          data.data.map((district) => (
                                            newDistricts.push({value: district.id, label: `${district.id} - ${district.name}`})
                                          ))
                                          this.setState({areas: newDistricts, emptyArea: false})
                                        }else{
                                          this.setState({areas: [], emptyArea: true})
                                        }
                                      })
                                    this.setState({selectedRegion, chief_id: selectedBranch.value, selectedArea: {}})
                                  }}
                                />
                              </div>
                              {
                                emptyArea &&
                                <small className="text-danger">{languages.noBranch}</small>
                              }
                            </div>
                          </div>
                        }
                        { selectedRole.label === "ASM" &&
                          <div className="col-12 col-lg-6">
                            <div className="form-group">
                              <label className="">{languages.area}</label>
                              <div className="custom-select-line">
                                <SelectLineComponent options={areas} initValue={selectedArea}
                                  handleChange={(selectedArea) => {
                                    this.setState({selectedArea, chief_id: selectedArea.value, selectedVillage: {}})
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        }
                        </div>
                      </div>
                    } */}
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.pin}</label>
                        <div className="form-row form-control-pin">
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 1)}
                              value={pin1}
                              ref='pin1'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 2)}
                              value={pin2}
                              ref='pin2'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 3)}
                              value={pin3}
                              ref='pin3'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 4)}
                              value={pin4}
                              ref='pin4'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 5)}
                              value={pin5}
                              ref='pin5'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPin(e.target, 6)}
                              value={pin6}
                              ref='pin6'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          {notMatch && <p className="text-help"><i>{languages.pinSalah}</i></p>}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.konfirm}</label>
                        <div className="form-row form-control-pin">
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 1)}
                              value={pinConf1}
                              ref='pinConf1'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 2)}
                              value={pinConf2}
                              ref='pinConf2'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 3)}
                              value={pinConf3}
                              ref='pinConf3'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 4)}
                              value={pinConf4}
                              ref='pinConf4'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 5)}
                              value={pinConf5}
                              ref='pinConf5'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                          <div className="col-2">
                            <input
                              onChange={e => this.setPinConfirm(e.target.value, 6)}
                              value={pinConf6}
                              ref='pinConf6'
                              type="password" className="form-control form-control-line text-center" placeholder="0" maxLength="1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="mb-4">{languages.assignmentRole}</h6>
                  <div className="row">
                    <div className="col-12 col-lg-12">
                      <div className="form-group">
                        <label className="">{languages.role}</label>
                        <div className="custom-select-line">
                          <SelectLineComponent options={assignmentRoles} initValue={selectedAssigmentRole}
                            handleChange={(selectedAssigmentRole) => {
                              let assigmentCoverages = [{
                                regional: {value: '', label: ''},
                                branch: {value: '', label: ''},
                                area: {value: '', label: ''},
                              }]
                              this.setState({selectedAssigmentRole, assigmentCoverages})
                            } }
                          />
                        </div>
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
                          { assigmentCoverages.length >= 2 &&
                            <div className="col-12 col-lg-12 d-flex justify-content-end align-items-start">
                              <span className="btn btn-danger" onClick={() => {
                                let newAssigmentCoverage = assigmentCoverages.filter((sPos) => sPos !== assigmentCoverage)

                                this.setState({assigmentCoverages: newAssigmentCoverage})
                              }}>{languages.remove}</span>
                            </div>
                          }
                          { (selectedAssigmentRole.label === 'Kepala Tim Sales' || selectedAssigmentRole.label === 'Kepala Area Sales' || selectedAssigmentRole.label === 'Kepala Cabang') && assigmentCoverage.regional &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group">
                                <label className="">{languages.regionalCode}</label>
                                <div className="custom-select-line">
                                  <SelectLineComponent 
                                    options={regionOptions} 
                                    initValue={assigmentCoverage.regional}
                                    placeholder="Type Region"
                                    handleChange={(selectedRegion) => {
                                      let newAssigmentCoverages = assigmentCoverages
                                      let newAssigmentCoverage = assigmentCoverages[idx]
                                      newAssigmentCoverage.regional = selectedRegion
                                      if(!isEmpty(newAssigmentCoverage.branch))   { newAssigmentCoverage.branch = {value: '', label: ''} }
                                      if(!isEmpty(newAssigmentCoverage.area))     { newAssigmentCoverage.area = {value: '', label: ''} }

                                      this.setState({assigmentCoverages: newAssigmentCoverages})
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          }
                          { (selectedAssigmentRole.label === 'Kepala Tim Sales' || selectedAssigmentRole.label === 'Kepala Area Sales') && assigmentCoverage.branch &&
                            <div className="col-12 col-lg-6">
                              <div className="form-group">
                                <label className="">{languages.branchCode}</label>
                                <SelectComponentLoad
                                    initValue={assigmentCoverage.branch}
                                    options={branches}
                                    placeholder="Type Branch"
                                    onFocus={() => {
                                      searchBranch(assigmentCoverage.regional.value)
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
                                      let newAssigmentCoverages = assigmentCoverages
                                      let newAssigmentCoverage = assigmentCoverages[idx]
                                      newAssigmentCoverage.branch = selectedBranch
                                      if(!isEmpty(newAssigmentCoverage.area))     { newAssigmentCoverage.area = {value: '', label: ''} }

                                      this.setState({assigmentCoverages: newAssigmentCoverages})
                                  }}/>
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
                                  <SelectComponentLoad
                                      initValue={assigmentCoverage.area}
                                      options={areas}
                                      placeholder="Type Area"
                                      onFocus={() => {
                                        searchAreas(assigmentCoverage.branch.value)
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
                                        let newAssigmentCoverages = assigmentCoverages
                                        let newAssigmentCoverage = assigmentCoverages[idx]
                                        newAssigmentCoverage.area = selectedArea
    
                                        this.setState({assigmentCoverages: newAssigmentCoverages})
                                    }}/>
                                    {
                                      emptySubArea &&
                                      <small className="text-danger">{languages.noArea}</small>
                                    }
                                </div>
                              </div>
                          }
                        </div>
                        
                      ))}
                      <div className="row">
                        <div className="col-12 col-lg-6">
                          <div className="form-group">
                            <span className="btn btn-default" onClick={() => this.addCoverage()}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Coverage</span>
                            { isEmpty(assigmentCoverages) &&
                              <div className="upload-area d-flex flex-column align-items-center justify-content-center py-4">
                                {languages.noPosisi}

                                <span className="btn btn-danger btn-sm mt-3" onClick={() => this.addCoverage()}>{languages.add}</span>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="">{languages.setTarget}</h4>
                  <p className="my-4">{languages.makeTarget}</p>
                  <Link to="/targets/set-target" className="btn btn-rounded btn-outline-danger">{languages.setTarget}</Link>
                </div>
              </div>
            </div> */}
            <div className="col-12 col-lg-4 mb-3">
              <BulkErrorFileV21 auth={auth} title={"Admin"} actionUrl={"admin"} history={history}/>
            </div>
            { auth.authority["add_admin"] === "Full Access" &&
              <div className="col-12 text-right mb-5">
                <div className="border-top pt-3">
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/admin/manage" className="btn btn-default">{languages.cancel}</Link>
                    <button type="submit" className={`btn btn-danger ${isLoading ? 'disabled' : ''}`} disabled={(isLoading || !allFilled)}>
                      { isLoading ? <LoadingDots/> : languages.save}
                    </button>
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
  ({admins, auth, roles, regions, branches, areas, assignmentRoles }) => ({ admins, auth, roles, regions, branches, areas, assignmentRoles }),
  {createAdmin, getAdminStatuses, searchBranch, searchAreas, getRegions, getAssignmentRoles}
)(Register)
