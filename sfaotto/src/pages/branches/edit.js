import React from 'react';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { getBranches, getBranchDetail, UpdateBranch, searchCity } from '../../actions/branch'
import { getCountries } from '../../actions/country'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import { ind, en } from '../../languages/branch'

// const style = {
//   link: {
//     cursor: 'pointer'
//   }
// }

const initState = {
  regionCode: '',
  branchCode: '',
  branch_id: '',
  name: '',
  branch_office: '',
  regions: [],
  cities: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedProvinces: [],
  selectedRegion: {},
  selectedCities: [],
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  languages: {}
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Edit Branch";

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    const { getBranchDetail } = this.props;

    getBranchDetail(this.props.match.params.id)
      .then((data) => {
        // let branch = data.data.branch,
        let branch = data.data,
        newSelectedCities = [];

        if(branch){
          branch.cities.map((city, idx) => newSelectedCities.push({value: parseInt(city.id, 10), label: city.name}))

          let newSelectedRegion = {value: branch.region.id, label: `${branch.region.id} - ${branch.region.name}`}
          this.findCity(branch.region.id);

          this.setState({
            branch_id: branch.ID,
            branchCode: branch.code,
            name: branch.name,
            branch_office: branch.branch_office,
            selectedRegion: newSelectedRegion,
            selectedCities: newSelectedCities
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

  findCity(regionID) {
    if(regionID){
      let newCities = []

      this.props.searchCity(regionID)
        .then((data) => {
          data.data.map((city) => newCities.push({value: city.id, label: city.name}))
        })

      this.setState({cities: newCities})
    }
  }

  render() {
    const { auth, history, countries, UpdateBranch } = this.props
    const {
      branch_id,
      confirmIsOpen,
      // resultIsOpen,
      type,
      name,
      branch_office,
      regions,
      cities,
      // regionCode,
      branchCode,
      selectedCountry,
      // selectedCompCode,
      selectedRegion,
      // selectedProvinces,
      selectedCities,
      textSuccess,
      textError,
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
          />
          <form className="w-100" onSubmit={(e) => {
            e.preventDefault()

            let city_ids = []

            selectedCities.map((city) => city_ids.push(city.value))

            UpdateBranch({branch_id, name, city_ids, code: branchCode, branch_office})
              .then(data => {
                if(data.meta.status === false){
                  this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.message})
                }else{
                  this.setState({confirmIsOpen: true, type: 'success', textSuccess: languages.sukses})
                }
              })
              .catch(e => {
                this.setState({confirmIsOpen: true, type: 'error', textError: languages.gagal})
              })
          }}>
            <div className="col-12 mb-3">
              <h2>{languages.header} {name}</h2>
            </div>
            <div className="col-12 col-lg-8 mb-4">
              <div className="card noSelect w-100 mb-5">
                <div className="card-body">
                  <h6>{languages.header2}</h6>
                  <div className="row mt-4">
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
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.region}</label>
                        <SelectLineComponent initValue={selectedRegion} options={regions} placeholder="Type Region" isDisabled={true} handleChange={(selectedRegion) => {
                          this.findCity(selectedRegion.value);

                          this.setState({selectedRegion})
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card noSelect w-100 mb-5">
                <div className="card-body">
                  <h6>{languages.setBranch}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.branchId}</label>
                        <input type="text" className="form-control form-control-line" value={branchCode} readOnly="readonly"/>
                      </div>
                      <div className="form-group">
                        <label>{languages.branchName}</label>
                        <input type="text" value={name} className="form-control form-control-line" placeholder="Set Name" onChange={(e) => { this.setState({name: e.target.value})}}/>
                      </div>
                      <div className="form-group">
                        <label>{languages.branchOffice}</label>
                        <input type="text" value={branch_office} className="form-control form-control-line" placeholder="Set Name" onChange={(e) => { this.setState({branch_office: e.target.value})}}/>
                      </div>
                      <div className="form-group">
                        <label>{languages.coverage}</label>
                        <SelectMultiple initValue={selectedCities} options={cities} placeholder={"Type City"} handleChange={(selectedCity) => {
                          this.setState({selectedCities: selectedCity})
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { auth.authority["set_branch"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/branches" className="btn btn-default">{languages.cancel}</Link>
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
  {getCountries, getRegions, searchCity, getBranches, getBranchDetail, UpdateBranch}
)(New)
