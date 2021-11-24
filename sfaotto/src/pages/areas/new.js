import React from 'react';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { getBranches, searchBranch } from '../../actions/branch'
import { getCountries } from '../../actions/country'
import { getAreas, getAreaCode, CreateArea, searchDistricts } from '../../actions/area'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import BulkCreate from '../../components/components/BulkCreate'
import { ind, en } from '../../languages/areas'

const initState = {
  regionCode: '',
  branchCode: '',
  areaCode: '',
  id: '',
  name: '',
  district_ids: [],
  branches: [],
  districts: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedRegional: {value: '', label: 'All'},
  selectedBranch: {value: '', label: 'All'},
  keyword: '',
  emptyBranch: false,
  emptyArea: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  languages: {}
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Set Area"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    this.props.getCountries()
    this.props.getRegions()
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

  render() {
    const { auth, history, countries, regions, searchBranch,
            searchDistricts, getAreaCode, CreateArea } = this.props
    const {
      // regionCode,
      // branchCode,
      areaCode,
      // id,
      name,
      district_ids,
      branches,
      districts,
      selectedCountry,
      selectedBranch,
      emptyBranch,
      emptyArea,
      confirmIsOpen,
      // resultIsOpen,
      type,
      // keyword,
      // selectedGender,
      // selectedCompCode,
      selectedRegion,
      textSuccess,
      textError ,
      languages} = this.state

      const regionOptions = []

      regions.data.map((region) => regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`}))

      if (auth.isAuthenticated && (auth.authority["set_area"] === "" || auth.authority["set_area"] === "No Access")) {
        return <NotAuthorize />
      }

    return (
      <div className="container">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/areas')}
            textSuccess={textSuccess}
            textError={textError}
          />
          <form className="w-100" onSubmit={(e) => {
              e.preventDefault()

              CreateArea({name, district_ids,
                  code: areaCode,
                  region_id: selectedRegion.value,
                  branch_id: selectedBranch.value
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
                      <div className="row">
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
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.region}</label>
                            <SelectLineComponent options={regionOptions} initValue={selectedRegion} placeholder="Type Region" handleChange={(selectedRegion) => {
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
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.branch}</label>
                            <SelectLineComponent options={branches} initValue={selectedBranch} placeholder="Type Branch" handleChange={(selectedBranch) => {
                              searchDistricts(selectedBranch.value)
                                .then((data) => {
                                  let newDistricts = []

                                  if(data.data.length > 0){
                                    data.data.map((district) => newDistricts.push({value: district.id, label: district.name}))
                                    this.setState({districts: newDistricts, emptyArea: false})
                                  }else{
                                    this.setState({districts: [], emptyArea: true})
                                  }
                                })

                              getAreaCode(selectedRegion.value, selectedBranch.value)
                                .then((data) => {
                                  this.setState({areaCode: data.data.code})
                                })
                              this.setState({selectedBranch})
                            }}/>
                            {
                              emptyArea &&
                              <small className="text-danger">{languages.noArea}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100">
                    <div className="card-body">
                      <h6>{languages.header}</h6>
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.areaId}</label>
                            <input type="text" value={areaCode} className="form-control form-control-line" readOnly="readonly"/>
                          </div>
                          <div className="form-group">
                            <label>{languages.areaName}</label>
                            <input type="text" value={name} className="form-control form-control-line" onChange={(e) => { this.setState({name: e.target.value}) }}/>
                          </div>
                          <div className="form-group">
                            <label>{languages.coverage}</label>
                            <SelectMultiple options={districts} placeholder="Type City" handleChange={(selectedDistrict) => {
                              let districtIds = [];

                              selectedDistrict.map((district) => districtIds.push(district.value))

                              this.setState({selectedCities: selectedDistrict, district_ids: districtIds})
                            }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <BulkCreate title={"Area"} actionUrl={"areas"} history={history}/>
                </div>
              </div>
            </div>
            { auth.authority["set_area"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/areas" className="btn btn-default">{languages.cancel}</Link>
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
  ({auth, countries, regions, branch, areas, provinces}) => ({ auth, countries, regions, branch, areas, provinces }),
  {getCountries, getRegions, getBranches, searchBranch, getAreas, getAreaCode, CreateArea, searchDistricts}
)(New)
