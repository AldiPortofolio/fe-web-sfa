import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions, getRegionCode, CreateRegion } from '../../actions/region'
import { getCountries } from '../../actions/country'
import { getProvinces } from '../../actions/province'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple } from '../../components'
import BulkCreate from '../../components/components/BulkCreate'
import { ind, en } from '../../languages/region'

const initState = {
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedProvinces: [],
  regionCode: '',
  id: '',
  name: '',
  province_ids: [],
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
    document.title = "SFA OTTO - Set Region"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    this.props.getCountries()
    this.props.getRegions()
    this.props.getRegionCode()
      .then((data) => {
        this.setState({regionCode: data.data.code})
      })

    this.props.getProvinces(this.state.selectedCountry.value)
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  render() {
    const { auth, history, countries, provinces, CreateRegion } = this.props
    const {
      confirmIsOpen,
      type,
      name,
      province_ids,
      regionCode,
      selectedCountry,
      selectedProvinces,
      textSuccess,
      textError,
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
            CreateRegion({name, code: regionCode, province_ids})
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
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 mb-4">
              <div className="row">
                <div className="col-12 col-lg-8">
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
                  <div className="card noSelect w-100">
                    <div className="card-body">
                      <h6>{languages.header3}</h6>
                      <div className="row mt-4">
                        <div className="col-12 col-md-6">
                          <div className="form-group">
                            <label>{languages.regId}</label>
                            <input type="text" className="form-control form-control-line" value={regionCode} readonly="readonly"/>
                          </div>
                          <div className="form-group">
                            <label>{languages.regName}</label>
                            <input type="text" className="form-control form-control-line" placeholder="Set Name" onChange={(e) => { this.setState({name: e.target.value})}}/>
                          </div>
                          <div className="form-group">
                            <label>{languages.coverage}</label>
                            <SelectMultiple options={provinces.data} initValue={selectedProvinces} placeholder={"Type Province"} handleChange={(selectedProvince) => {
                              let proviceIds = [];

                              selectedProvince.map((province) => proviceIds.push(province.value))

                              this.setState({selectedProvinces: selectedProvince, province_ids: proviceIds})
                            }}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <BulkCreate title={"Region"} actionUrl={"regions"} history={history}/>
                </div>
              </div>
            </div>

            { auth.authority["set_region"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/regions" className="btn btn-default">{languages.cancel}</Link>
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
  ({auth, regions, countries, provinces}) => ({ auth, regions, countries, provinces }),
  {getRegions, getCountries, getRegionCode, CreateRegion, getProvinces}
)(New)
