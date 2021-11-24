import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions, getRegionDetail, UpdateRegion } from '../../actions/region'
import { getCountries } from '../../actions/country'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import { ind, en } from '../../languages/region'

const initState = {
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedProvinces: [],
  regionCode: '',
  region_id: '',
  name: '',
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  isLoading: false,
  languages: {}
}

class New extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Edit Region"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    const { getRegions, getRegionDetail } = this.props
    getRegions()

    getRegionDetail(this.props.match.params.id)
      .then((data) => {
        let region = data.data;
        let newSelectedProvices = [];

        if(data.data){

          data.data.provinces.map((prov, idx) => (
            newSelectedProvices.push({value: prov.id, label: prov.name})
          ))

          this.setState({
            region_id: region.id,
            regionCode: region.code,
            name: region.name,
            selectedProvinces: newSelectedProvices
          })
        }
      })
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  render() {
    const { auth, history, countries, provinces, UpdateRegion } = this.props
    const {
      region_id,
      confirmIsOpen,
      // resultIsOpen,
      type,
      name,
      regionCode,
      // region,
      selectedCountry,
      // selectedCompCode,
      // selectedRegional,
      selectedProvinces,
      textSuccess,
      textError,
      isLoading,
      languages } = this.state

    if(auth.isAuthenticated && (auth.authority["set_region"] === "" || auth.authority["set_region"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/regions')}
            textSuccess={textSuccess}
            textError={textError}
          />
          <form className="w-100" onSubmit={(e) => {
            e.preventDefault()
            let province_ids = [];

            selectedProvinces.map((province) => (
              province_ids.push(province.value)
            ))

            this.setState({isLoading: true})

            UpdateRegion({region_id, name, code: regionCode, province_ids})
              .then(data => {
                if(data.meta.status === false){
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                }else{
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: data.meta.message})
                }
              })
              .catch(e => {
                this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: e})
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
              <div className="card noSelect w-100">
                <div className="card-body">
                  <h6>{languages.header3}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.regId}</label>
                        <input type="text" className="form-control form-control-line" value={regionCode} readOnly="readonly"/>
                      </div>
                      <div className="form-group">
                        <label>{languages.regName}</label>
                        <input type="text" value={name} className="form-control form-control-line" placeholder="Set Name" onChange={(e) => { this.setState({name: e.target.value})}}/>
                      </div>
                      <div className="form-group">
                        <label>{languages.coverage}</label>
                        <SelectMultiple options={provinces.data} initValue={selectedProvinces} placeholder={"Type Province"} handleChange={(selectedProvince) => {
                          this.setState({selectedProvinces: selectedProvince})
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { auth.authority["set_region"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/regions" className="btn btn-default">{languages.cancel}</Link>
                  <button type="submit" className="btn btn-danger" disabled={isLoading}>
                    {isLoading ? "Saving..." : languages.save}
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
  ({auth, regions, countries, provinces}) => ({ auth, regions, countries, provinces }),
  {getRegions, getRegionDetail, getCountries, UpdateRegion}
)(New)
