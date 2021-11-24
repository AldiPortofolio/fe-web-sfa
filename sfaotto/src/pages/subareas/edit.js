import React from 'react';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { debounce } from 'lodash'
import { connect } from 'react-redux'
import { searchAreas } from '../../actions/area'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { getSubareaDetail, UpdateSubarea, searchVillages, findSAC } from '../../actions/subarea'
import { NotAuthorize, ModalConfirm, SelectLineComponent, SelectMultiple, SelectRequired } from '../../components'
import { ind, en } from '../../languages/subarea'

const initState = {
  regionCode: '',
  branchCode: '',
  areaCode: '',
  id: '',
  name: '',
  village_ids: [],
  branches: [],
  areas: [],
  regions: [],
  villages: [],
  salesAreaChannels: [],
  selectedVillages: [],
  selectedCountry: {value: 1, label: 'Indonesia'},
  selectedRegional: {value: '', label: 'Semua'},
  selectedBranch: {value: '', label: 'Semua'},
  selectedArea: {value: '', label: 'Semua'},
  selectedSAC: {value: '', label: 'Semua'},
  keyword: '',
  emptyBranch: false,
  emptyArea: false,
  emptyVillage: false,
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
  isLoading: false,
  languages: {},
}

class Edit extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Edit Sub Area"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    this.props.getSubareaDetail(this.props.match.params.id)
      .then((data) => {
        let sub_area = data.data.sub_area,
        newSelectedVillages = [];

        if(sub_area){
          sub_area.villages.map((village, idx) => newSelectedVillages.push({value: village.id, label: village.name}))

          let newSelectedSac = { value: sub_area.sales_area_channel.id, label: sub_area.sales_area_channel.name }
          let newSelectedRegion = {value: sub_area.region.id, label: `${sub_area.region.id} - ${sub_area.region.name}`}
          let newSelectedBranch = {value: sub_area.branch.id, label: `${sub_area.branch.id} - ${sub_area.branch.name}`}
          let newSelectedArea = {value: sub_area.area.id, label: `${sub_area.area.id} - ${sub_area.area.name}`}
          this.findVillages(sub_area.area.id);

          this.setState({
            sub_area_id: sub_area.id,
            areaCode: sub_area.code,
            name: sub_area.name,
            selectedRegion: newSelectedRegion,
            selectedBranch: newSelectedBranch,
            selectedVillages: newSelectedVillages,
            selectedArea: newSelectedArea,
            selectedSAC: newSelectedSac
          })
        }

        console.log(data)
      })

    this.filterSAC("")
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  findVillages(areaID){
    this.props.searchVillages(areaID, "")
      .then((data) => {
        let newVillages = []
        var newEmptyVillage = true;

        if(data.data.length > 0){
          data.data.map((village) => newVillages.push({value: village.id, label: village.name}))

          newEmptyVillage = false
        }

        this.setState({villages: newVillages, emptyVillage: newEmptyVillage})
      })
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
    const { auth, history, countries, UpdateSubarea } = this.props
    const {
      areaCode,
      sub_area_id,
      name,
      areas,
      villages,
      regions,
      branches,
      salesAreaChannels,
      selectedVillages,
      selectedRegion,
      selectedBranch,
      selectedCountry,
      selectedArea,
      selectedSAC,
      emptyBranch,
      emptyArea,
      emptyVillage,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      isLoading,
      languages } = this.state

      if(auth.isAuthenticated && (auth.authority["set_subarea"] === "" || auth.authority["set_subarea"] === "No Access")) {
        return <NotAuthorize />
      }

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

              let village_ids = [];
              selectedVillages.map((district) => village_ids.push(parseInt(district.value, 10)))

              this.setState({isLoading: true})

              UpdateSubarea({
                sub_area_id, 
                name, 
                village_ids, 
                code: areaCode, 
                sac_id: selectedSAC.value})
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textError: '', textSuccess: languages.sukses})
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
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.country}</label>
                        <SelectLineComponent options={countries.data} initValue={selectedCountry} isDisabled={true}/>
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
                        <SelectLineComponent initValue={selectedRegion} options={regions} placeholder="Type Region" isDisabled={true}/>
                        {
                          emptyBranch &&
                          <small className="text-danger">{languages.noCoverage}</small>
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
                        <label>{languages.branch}</label>
                        <SelectLineComponent initValue={selectedBranch} options={branches} placeholder="Type Branch" isDisabled={true}/>
                        {
                          emptyArea &&
                          <small className="text-danger">{languages.noCoverage2}</small>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card noSelect w-100 mb-5">
                <div className="card-body">
                  <h6>{languages.header5}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.area}</label>
                        <SelectLineComponent initValue={selectedArea} options={areas} placeholder="Type Branch" isDisabled={true}/>
                        {
                          emptyVillage &&
                          <small className="text-danger">{languages.noCoverage3}</small>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card noSelect w-100">
                <div className="card-body">
                  <h6>{languages.setSub}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>{languages.subId}</label>
                        <input type="text" value={areaCode} className="form-control form-control-line" readOnly="readonly"/>
                      </div>
                      <div className="form-group">
                        <label>{languages.subName}</label>
                        <input type="text" value={name} className="form-control form-control-line" onChange={(e) => { this.setState({name: e.target.value}) }}/>
                      </div>
                      <div className="form-group">
                        <label>{languages.sac}</label>
                        <SelectRequired placeholder="Type Channel" value={selectedSAC} options={salesAreaChannels} 
                          onChange={(selectedSAC) => {
                            this.setState({selectedSAC})
                          }} 
                          
                          onInputChange={debounce((value) => {
                            if(value !== ''){this.filterSAC(value)}
                          }, 500)} 
                        />
                      </div>
                      <div className="form-group">
                        <label>{languages.coverage}</label>
                        <SelectMultiple initValue={selectedVillages} options={villages} placeholder={"Type Village"} handleChange={(selectedVillage) => {
                          this.setState({selectedVillages: selectedVillage})
                        }}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { auth.authority["set_subarea"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/sub_areas" className="btn btn-default">{languages.cancel}</Link>
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
  ({auth, countries, regions, branch, areas, subareas, provinces}) => ({
    auth, countries, regions, branch, areas, subareas, provinces
  }),
  {getSubareaDetail, UpdateSubarea, searchAreas, searchVillages, findSAC, getRegions, searchBranch}
)(Edit)
