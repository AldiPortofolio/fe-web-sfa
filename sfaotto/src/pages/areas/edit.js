import React from 'react';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { getBranches, searchBranch } from '../../actions/branch'
import { getCountries } from '../../actions/country'
import { getAreas, getAreaDetail, UpdateArea, searchDistricts } from '../../actions/area'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import { ind, en } from '../../languages/areas'

const initState = {
  regionCode: '',
  branchCode: '',
  areaCode: '',
  area_id: '',
  name: '',
  branches: [],
  districts: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedRegional: {value: '', label: 'All'},
  selectedBranch: {value: '', label: 'All'},
  selectedDistricts: [],
  keyword: '',
  emptyBranch: false,
  emptyArea: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  isLoading: false,
  languages: {}
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Edit Area"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    this.props.getAreaDetail(this.props.match.params.id)
      .then((data) => {
        let area = data.data.area,
        newSelectedDistricts = [];

        if(area){
          area.districts.map((district, idx) => newSelectedDistricts.push({value: district.id, label: district.name}))

          let newSelectedRegion = {value: area.region.id, label: `${area.region.id} - ${area.region.name}`}
          let newSelectedBranch = {value: area.branch.id, label: `${area.branch.id} - ${area.branch.name}`}
          this.findDistricts(area.branch.id);

          this.setState({
            area_id: area.id,
            areaCode: area.code,
            name: area.name,
            selectedRegion: newSelectedRegion,
            selectedBranch: newSelectedBranch,
            selectedDistricts: newSelectedDistricts
          })
        }

        console.log(data)
      })
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  findDistricts(districtID){
    this.props.searchDistricts(districtID)
      .then((data) => {
        let newDistricts = []

        if(data.data.length > 0){
          data.data.map((district) => newDistricts.push({value: district.id, label: district.name}))
        }

        this.setState({districts: newDistricts})
      })
  }

  filterRegions = () => {
    const { selectedGender, selectedCompCode, selectedRegional, keyword } = this.state
    this.props.getRegions({gender: selectedGender.value, company_code: selectedCompCode.value, province_id: selectedRegional.value, keyword})
  }

  render() {
    const { auth, history, countries, regions, UpdateArea } = this.props
    const {
      // regionCode,
      // branchCode,
      areaCode,
      area_id,
      name,
      branches,
      districts,
      selectedCountry,
      selectedBranch,
      selectedDistricts,
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
      textError,
      isLoading,
      languages } = this.state

      if (auth.isAuthenticated && (auth.authority["set_area"] === "" || auth.authority["set_area"] === "No Access")) {
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
            confirmSuccess={() => history.push('/areas')}
            textSuccess={textSuccess}
            textError={textError}
          />
          <form className="w-100" onSubmit={(e) => {
              e.preventDefault()
              this.setState({isLoading: true})

              let district_ids = [];

              selectedDistricts.map((district) => district_ids.push(district.value))

              UpdateArea({area_id, name, district_ids,
                  code: areaCode,
                  region_id: selectedRegion.value,
                  branch_id: selectedBranch.value
                })
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: languages.sukses})
                  }
                })
                .catch(e => {
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: languages.gagal})
                })
            }}>
            <div className="col-12 mb-3">
              <h2>{languages.header} {name}</h2>
            </div>
            <div className="col-12 col-lg-8 mb-4">
              <div className="card noSelect w-100 mb-5">
                <div className="card-body">
                  <h6>{languages.header2}</h6>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.country}</label>
                        <SelectLineComponent options={countries.data} initValue={selectedCountry} isDisabled={true} handleChange={(selectedCountry) => this.setState({selectedCountry})}/>
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
                        <SelectLineComponent options={regionOptions} initValue={selectedRegion} placeholder="Type Region" isDisabled={true} handleChange={(selectedRegion) => {
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
                        <SelectLineComponent options={branches} initValue={selectedBranch} placeholder="Type Branch" isDisabled={true} handleChange={(selectedBranch) => {
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
                  <h6>{languages.setArea}</h6>
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
                        <SelectMultiple initValue={selectedDistricts} options={districts} placeholder={"Type City"} handleChange={(selectedDistrict) => {
                          this.setState({selectedDistricts: selectedDistrict})
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { auth.authority["set_area"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/areas" className="btn btn-default">{languages.cancel}</Link>
                  <button type="submit" className="btn btn-danger" disabled={isLoading}>
                    {isLoading ? languages.save2 : languages.save}
                  </button>
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
  {getCountries, getRegions, getBranches, searchBranch, getAreas, getAreaDetail, UpdateArea, searchDistricts}
)(New)
