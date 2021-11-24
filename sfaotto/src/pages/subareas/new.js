import React from 'react';
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import { getCountries } from '../../actions/country'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { searchAreas } from '../../actions/area'
import { getSubareaCode, CreateSubarea, searchVillages, findSAC } from '../../actions/subarea'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple, SelectRequired } from '../../components'
import { BulkErrorFile } from '../../components'
import { ind, en } from '../../languages/subarea'

const initState = {
  regionCode: '',
  branchCode: '',
  areaCode: '',
  id: '',
  name: '',
  village_ids: [],
  sac_ids: [],
  branches: [],
  areas: [],
  villages: [],
  salesAreaChannels: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedRegional: '',
  selectedBranch: '',
  selectedArea: '',
  selectedSAC: '',
  keyword: '',
  emptyBranch: false,
  emptyArea: false,
  emptyVillage: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  languages: {},
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Set Subarea"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    this.props.getCountries()
    this.props.getRegions()

    this.filterSAC("")
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  filterRegions = () => {
    const { selectedGender, selectedCompCode, selectedRegional, keyword } = this.state
    this.props.getRegions({gender: selectedGender.value, company_code: selectedCompCode.value, province_id: selectedRegional.value, keyword})
  }

  filterSAC = (inputValue) => {
    let newSac = []
      newSac.push({value: '', label: 'Searching...', disabled: true})

      this.props.findSAC(inputValue)
      .then((data) => {
        let newSac = []
        if (data.data !== null) {
          data.data.forEach((sac) => {
            newSac.push({value: sac.id, label: `${sac.name}`})
          })
        }

        this.setState({salesAreaChannels: newSac})
      })
  };

  render() {
    const { auth, history, countries, regions, searchBranch,
            getSubareaCode, CreateSubarea,
            searchVillages, searchAreas } = this.props
    const {
      areaCode,
      name,
      village_ids,
      branches,
      areas,
      villages,
      salesAreaChannels,
      selectedCountry,
      selectedBranch,
      selectedArea,
      selectedSAC,
      emptyBranch,
      emptyArea,
      emptyVillage,
      confirmIsOpen,
      type,
      selectedRegion,
      textSuccess,
      textError,
      languages } = this.state

      if(auth.isAuthenticated && (auth.authority["set_subarea"] === "" || auth.authority["set_subarea"] === "No Access")) {
        return <NotAuthorize />
      }

      const regionOptions = []

      regions.data.map((region) => regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`}))


    return (
      <div className="container">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sub_areas')}
            textSuccess={textSuccess}
            textError={textError}
          />
          <form className="w-100" onSubmit={(e) => {
              e.preventDefault()

              CreateSubarea({
                name, 
                village_ids,
                code: areaCode,
                region_id: selectedRegion.value,
                branch_id: selectedBranch.value,
                area_id: selectedArea.value,
                sac_id: selectedSAC.value
              })
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: languages.sukses})
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: languages.gagal})
              })
            }}>
            <div className="col-12 mb-3">
              <h2>{languages.header}</h2>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-8 mb-4">
                  <div className="card noSelect w-100 mb-5">
                    <div className="card-body">
                      <h6>{languages.header2}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.country}</label>
                            <SelectLineComponent options={countries.data} initValue={selectedCountry} handleChange={(selectedCountry) => this.setState({selectedCountry})}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100 mb-5">
                    <div className="card-body">
                      <h6>{languages.header3}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.region}</label>
                            <SelectLineComponent initValue={selectedRegion} options={regionOptions} placeholder="Select" handleChange={(selectedRegion) => {
                              // console.log("Selected region:", selectedRegion)
                              searchBranch(selectedRegion.value)
                                .then((data) => {
                                  let newBranches = []

                                  if(data.data.length > 0){
                                    data.data.map((branch) => newBranches.push({value: branch.id, label: `${branch.id} - ${branch.name}`}))
                                    this.setState({branches: newBranches, emptyBranch: false})
                                  }else{
                                    this.setState({branches: [], emptyBranch: true})
                                  }
                                })
                              this.setState({selectedRegion})
                            }}/>
                            {
                              emptyBranch &&
                              <small className="text-danger">{languages.noRegion}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100 mb-5">
                    <div className="card-body">
                      <h6>{languages.header4}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>Branch</label>
                            <SelectLineComponent options={branches} initValue={selectedBranch} placeholder="Select" handleChange={(selectedBranch) => {
                              searchAreas(selectedBranch.value)
                                .then((data) => {
                                  let newAreas = []

                                  if(data.data.length > 0){
                                    data.data.map((district) => newAreas.push({value: district.id, label: district.name}))
                                    this.setState({areas: newAreas, emptyArea: false})
                                  }else{
                                    this.setState({areas: [], emptyArea: true})
                                  }
                                })
                              this.setState({selectedBranch})
                            }}/>
                            {
                              emptyArea &&
                              <small className="text-danger">{languages.noCoverage}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100 mb-5">
                    <div className="card-body">
                      <h6>Choose Area</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>Area</label>
                            <SelectLineComponent options={areas} initValue={selectedArea} placeholder="Select" handleChange={(selectedArea) => {
                              searchVillages(selectedArea.value, "")
                                .then((data) => {
                                  let newVillages = []
                                  var newEmptyVillage = true;

                                  if(data.data.length > 0){
                                    data.data.map((village) => newVillages.push({value: village.id, label: village.name}))
                                    
                                    newEmptyVillage = false;
                                  }

                                  this.setState({villages: newVillages, emptyVillage: newEmptyVillage})
                                })

                              getSubareaCode(selectedRegion.value, selectedBranch.value, selectedArea.value)
                                .then((data) => {
                                  this.setState({areaCode: data.data})
                                })
                              this.setState({selectedArea})
                            }}/>
                            {
                              emptyVillage &&
                              <small className="text-danger">{languages.noCoverage2}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100">
                    <div className="card-body">
                      <h6>{languages.header}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.subId}</label>
                            <input type="text" value={areaCode} className="form-control form-control-line" readOnly="readonly"/>
                          </div>
                          <div className="form-group">
                            <label>{languages.subName}</label>
                            <input type="text" value={name} className="form-control form-control-line" placeholder="Masukan nama subarea" onChange={(e) => { this.setState({name: e.target.value}) }}/>
                          </div>
                          {/* <div className="form-group">
                            <label>{languages.sac}</label>
                            <SelectMultiple options={villages} placeholder={"Choose SAC"} handleChange={(selectedSAC) => {
                              let sacIds = [];

                              selectedSAC.map((sac) => sacIds.push(sac.value))

                              this.setState({sac_ids: sacIds})
                            }}/>
                          </div> */}
                          <div className="form-group">
                            <label>{languages.sac}</label>
                            <SelectRequired placeholder="Select" value={selectedSAC} options={salesAreaChannels} 
                              onChange={(selectedSAC) => {
                                this.setState({selectedSAC})
                              }} 
                              
                              onInputChange={debounce((value) => {
                                // if(value !== ''){this.filterSAC(value)}
                                this.filterSAC(value)
                              }, 500)} 
                            />
                          </div>
                          <div className="form-group">
                            <label>{languages.coverage}</label>
                            <SelectMultiple options={villages} placeholder={"Select"} handleChange={(selectedVillage) => {
                              let villageIds = [];

                              selectedVillage.map((district) => villageIds.push(district.value))

                              this.setState({selectedVillage: selectedVillage, village_ids: villageIds})
                            }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <BulkErrorFile title={"Sub Area"} actionUrl={"sub_areas"} history={history}/>
                </div>
              </div>
            </div>
            { auth.authority["set_subarea"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/sub_areas" className="btn btn-default">{languages.cancel}</Link>
                  <button type="submit" className="btn btn-danger">{languages.save}</button>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, countries, regions, branch, areas, subareas, provinces}) => ({
    auth, countries, regions, branch, areas, subareas, provinces
  }),
  {getCountries, getRegions, searchBranch, getSubareaCode, CreateSubarea, searchAreas, searchVillages, findSAC}
)(New)
