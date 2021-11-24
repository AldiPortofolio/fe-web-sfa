import React from 'react';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { getBranches, getBranchCode, CreateBranch, searchCity } from '../../actions/branch'
import { getCountries } from '../../actions/country'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import BulkCreate from '../../components/components/BulkCreate'
import { ind, en } from '../../languages/branch'

// const style = {
//   link: {
//     cursor: 'pointer'
//   }
// }

const initState = {
  regionCode: '',
  branchCode: '',
  id: '',
  name: '',
  branch_office: '',
  city_ids: [],
  regions: [],
  cities: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedProvinces: [],
  selectedRegion: {},
  confirmIsOpen: false,
  resultIsOpen: false,
  emptyCity: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  textReason: '',
  languages: {}
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Set Branch";

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    const { getRegions } = this.props;

    getRegions()
    .then((data) => {
      let newRegions = []

      data.data.regions.map((region) => (
        newRegions.push({value: region.id, label: `${region.id} - ${region.name}`})
      ))

      this.setState({regions: newRegions})
    })
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  render() {
    const { auth, history, countries, searchCity, CreateBranch, getBranchCode } = this.props
    const {
      // id,
      confirmIsOpen,
      // resultIsOpen,
      type,
      name,
      branch_office,
      city_ids,
      regions,
      cities,
      // regionCode,
      branchCode,
      emptyCity,
      selectedCountry,
      // selectedCompCode,
      selectedRegion,
      // selectedProvinces,
      textSuccess,
      textError,
      textReason,
      languages } = this.state

    if(auth.isAuthenticated && (auth.authority["set_branch"] === "" || auth.authority["set_branch"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/branches')}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
          />
          <form className="w-100" onSubmit={(e) => {
            e.preventDefault()
            CreateBranch({name, city_ids, code: branchCode, region_id: selectedRegion.value, branch_office})
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textSuccess: languages.sukses})
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: languages.gagal, textReason: e.message})
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
                            <SelectLineComponent initValue={selectedRegion} options={regions} placeholder="Type Region" handleChange={(selectedRegion) => {
                              searchCity(selectedRegion.value)
                                .then((data) => {
                                  let newCities = []

                                  if(data.data.length > 0){
                                    data.data.map((city) => newCities.push({value: city.id, label: city.name}))
                                    
                                    this.setState({cities: newCities, emptyCity: false})
                                  }else{

                                  this.setState({cities: [], emptyCity: true})
                                  }
                                })

                              getBranchCode(selectedRegion.value)
                                .then((data) => {
                                  this.setState({branchCode: data.data.code})
                                })
                              this.setState({selectedRegion})
                            }}/>
                            {
                              emptyCity &&
                              <small className="text-danger">{languages.regionKosong}</small>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card noSelect w-100 mb-5">
                    <div className="card-body">
                      <h6>{languages.setbranch}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.branchId}</label>
                            <input type="text" className="form-control form-control-line" value={branchCode} readonly="readonly"/>
                          </div>
                          <div className="form-group">
                            <label>{languages.branchName}</label>
                            <input type="text" className="form-control form-control-line" placeholder="Set Name" onChange={(e) => { this.setState({name: e.target.value})}}/>
                          </div>
                          <div className="form-group">
                            <label>{languages.branchOffice}</label>
                            <input type="text" className="form-control form-control-line" placeholder="Set Branch Office" onChange={(e) => { this.setState({branch_office: e.target.value})}}/>
                          </div>
                          <div className="form-group">
                            <label>{languages.coverage}</label>
                            <SelectMultiple options={cities} placeholder={"Type City"} handleChange={(selectedCity) => {
                              let cityIds = [];

                              selectedCity.map((city) => cityIds.push(city.value))

                              this.setState({selectedCities: selectedCity, city_ids: cityIds})
                            }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <BulkCreate title={"Branch"} actionUrl={"branches"} history={history}/>
                </div>
              </div>
            </div>
            { auth.authority["set_branch"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/branches" className="btn btn-outline-danger">{languages.cancel}</Link>
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
  ({auth, countries, regions, provinces}) => ({ auth, countries, regions, provinces }),
  {getCountries, getRegions, searchCity, getBranches, getBranchCode, CreateBranch}
)(New)
