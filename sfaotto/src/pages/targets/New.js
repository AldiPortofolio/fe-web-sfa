import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { searchAreas } from '../../actions/area'
import { searchSubAreas } from '../../actions/subarea'
import { getTargetTypes } from '../../actions/manage_target_type'
import { setTargetHQAnnual, setTargetHQMonthly, createTargetRegion, getHQTarget, getAnnualTargetHQ,
         getMonthlyTargetHQ, getAnnualTargetRegion, getMonthlyTargetRegion } from '../../actions/manage_target'
import { NotAuthorize, SelectLineComponent, ModalConfirm, LoadingDots } from '../../components'
import { ind, en } from '../../languages/target'
// import { formatNumber, unformatNumber } from '../../formatter'
import moment from 'moment'

const currentYear = moment().subtract(1, 'years').format("YYYY")

const initialTargetLevels = [
  {value: "headquarter", label: "Headquarter"},
  {value: "Region", label: "Regional"}
]

const TargetPeriods = [
  {value: "Annual", label: "Tahunan"},
  {value: "Monthly", label: "Bulanan"},
]

const TargetMonths = [
  {value: "1", label: "January"},
  {value: "2", label: "February"},
  {value: "3", label: "March"},
  {value: "4", label: "April"},
  {value: "5", label: "May"},
  {value: "6", label: "June"},
  {value: "7", label: "July"},
  {value: "8", label: "August"},
  {value: "9", label: "September"},
  {value: "10", label: "October"},
  {value: "11", label: "November"},
  {value: "12", label: "December"},
]

const initValue = {
  targetLevels: initialTargetLevels,
  selectedTargetYear: {value: currentYear, label: currentYear},
  HQTargets: [],
  selectedPeriod: {value: "Annual", label: "Tahunan"},
  selectedLevel: {value: "headquarter", label: "Headquarter"},
  selectedRegion: {},
  selectedBranch: {},
  selectedArea: {},
  selectedSubArea: {},
  selectedRegional: {},
  regionID: '',
  period_type: '',
  regionalType: '',
  branches: [],
  areas: [],
  subareas: [],
  month: {value: 1, label: 'January'},
  targets: [],
  year: {value: currentYear, label: currentYear},
  HqTableHeader: [],
  confirmIsOpen: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  isLoading: false,
  hq_targets: [],
  hq_targets_monthly: [],
  list_all_target: [],
  languages: {}
}

class NewTarget extends React.Component {
  state = initValue

  componentDidMount(){
    document.title = "SFA OTTO - Set Target"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }

    let { auth } = this.props

    this.props.getTargetTypes()
    .then((data) => {
      let newTargets = data.data

      this.setState({targets: newTargets})
    })

    this.settingRegional(auth.role)

    // this.props.getHQTarget(this.state.selectedTargetYear.value)
    this.getHQAnnual(currentYear)
    // this.props.getRegions()
  }

  getHQAnnual(year){
    this.setState({HqTableHeader: []})
    this.props.getAnnualTargetHQ(year)
      .then((data) => {
        this.setState({HqTableHeader: Object.keys(data.data), list_all_target: data.data})
      })
  }

  getRegionAnnual(year, region){
    this.setState({RegionTableHeader: []})
    this.props.getAnnualTargetRegion(year, region)
      .then((data) => {
        this.setState({RegionTableHeader: Object.keys(data.data)})
      })
  }

  getHQMonthly(year){
    this.setState({HqTableHeader: []})
    this.props.getMonthlyTargetHQ(year)
      .then((data) => {
        this.setState({HqTableHeader: Object.keys(data.data), list_all_target: data.data})
      })
  }

  getRegionMonthly(year, regional_type, target_type){
    this.setState({RegionTableHeader: []})
    this.props.getMonthlyTargetRegion(year, regional_type, target_type)
      .then((data) => {
        this.setState({RegionTableHeader: Object.keys(data.data)})
      })
  }

  settingRegional(role){
    let { auth } = this.props

    let newRegionalType = ''
    let chief_id = auth.chief_division ? auth.chief_division.id : null

    if(role === "RSM"){
      this.props.searchBranch(chief_id).then((data) => {
        this.setState({branches: data.data})
      })
      newRegionalType = "Branch"
    }else if(role === "BSM"){
      this.props.searchAreas(chief_id).then((data) => {
        this.setState({areas: data.data})
      })
      newRegionalType = "Area"
    }else if(role === "ASM"){
      this.props.searchSubAreas(chief_id).then((data) => {
        this.setState({subareas: data.data})
      })
      newRegionalType = "SubArea"
    }

    if(role === "RSM" || role === "BSM" || role === "ASM"){
      this.setState({
        targetLevels: [{value: newRegionalType, label: newRegionalType}],
        selectedLevel: {value: newRegionalType, label: newRegionalType}
      })
    }

    this.setState({
      regionalType: newRegionalType,
    })
  }

  setHQTargetYearly(year, paramTarget){
    let hqTargets = this.state.hq_targets

    let newTarget = {year: year, targets: [paramTarget]}

    if(hqTargets.length === 0){
      hqTargets.push(newTarget)
    }else{
      let findTarget = hqTargets.filter((target) => target.year === year)

      if(findTarget.length === 0){
        hqTargets.push(newTarget)
      }else{
        hqTargets.map((target) => {
          if(target.year === year){
            target.targets.push(paramTarget)
          }
        })
      }
    }

    console.log(hqTargets)

    this.setState({hq_targets: hqTargets})
  }

  setHQTargetMonthly(targetType, dataPerMonth){
    let hqTargetMonthly = this.state.hq_targets_monthly

    let newTarget = {target: targetType, months: [dataPerMonth]}

    if(hqTargetMonthly.length === 0){
      hqTargetMonthly.push(newTarget)
    }else{
      let findTarget = hqTargetMonthly.filter((target) => target.target === targetType)

      if(findTarget.length === 0){
        hqTargetMonthly.push(newTarget)
      }else{
        hqTargetMonthly.map((target) => {
          if(target.target === targetType){
            target.months.push(dataPerMonth)
          }
        })
      }
    }

    console.log(hqTargetMonthly)

    this.setState({hq_targets_monthly: hqTargetMonthly})
  }

  setCollapse = (collapse) => {
    if (this.state.collapse === collapse) {
      collapse = ''
    }
    this.setState({collapse})
  }

  render() {
  const { auth, setTargetHQAnnual, setTargetHQMonthly, regions, manage_targets } = this.props
  const {
    targetLevels,
    selectedTargetYear,
    HQTargets,
    collapse,
    selectedPeriod,
    selectedLevel,
    selectedRegion,
    selectedBranch,
    selectedArea,
    selectedSubArea,
    period_type,
    regionalType,
    regionID,
    year,
    HqTableHeader,
    month,
    targets,
    confirmIsOpen,
    type,
    textSuccess,
    textError,
    branches,
    areas,
    subareas,
    isLoading,
    list_all_target,
    hq_targets,
    hq_targets_monthly,
    languages, } = this.state

    if (auth.isAuthenticated && (auth.authority["set_target"] === "" || auth.authority["set_target"] === "No Access")) {
      return <NotAuthorize />
    }

    let years = []
    for (var i = 0; i < 5; i++) {
      years = years.concat({value: parseInt(currentYear)+i, label: parseInt(currentYear)+i})
    }

    const regionOptions = []
    const branchOptions = []
    const areaOptions = []
    const subAreaOptions = []

    regions.data.map((region) => {
      regionOptions.push({value: region.id, label: `${region.id} - ${region.name}`})
    })

    if(auth.role === "RSM" && branches.length > 0){
      branches.map((branch) => {
        branchOptions.push({value: branch.id, label: `${branch.id} - ${branch.name}`})
      })
    }

    if(auth.role === "BSM" && areas.length > 0){
      areas.map((area) => {
        areaOptions.push({value: area.id, label: `${area.id} - ${area.name}`})
      })
    }

    if(auth.role === "ASM" && subareas.length > 0){
      subareas.map((subarea) => {
        subAreaOptions.push({value: subarea.id, label: `${subarea.id} - ${subarea.name}`})
      })
    }

    // console.log(list_all_target)

    return (
      <div className="container mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            this.setState({isLoading: true})
            if (selectedPeriod.label) {
              if(selectedLevel.value === "headquarter" && selectedPeriod.value === "Annual"){
                setTargetHQAnnual({
                  hq_targets: hq_targets
                })
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'})
                  }
                })
                .catch(e => {
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Set Target gagal'})
                })
              }else{
                setTargetHQMonthly({
                  year: year.value,
                  data: hq_targets_monthly
                })
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: 'Set Target sukses'})
                  }
                })
                .catch(e => {
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Set Target gagal'})
                })
              }
            }else{
              this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Set Target gagal'})
            }
          }}>
          <div className="row">
            <ModalConfirm
              confirmIsOpen={confirmIsOpen}
              type={type}
              confirmClose={() => this.setState({confirmIsOpen: false})}
              confirmSuccess={() => this.setState({confirmIsOpen: false})}
              textSuccess={textSuccess}
              textError={textError}
            />

            <div className="col-12 mb-4">
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-4">
              <div className="card card-blue mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-lg-7 d-flex align-items-center">
                      <p className="mb-0">{languages.header2}</p>
                    </div>
                    <div className="col-12 col-lg-5 d-flex justify-content-end">
                      <SelectLineComponent initValue={selectedLevel} options={targetLevels} handleChange={(selectedLevel) => {
                        if( selectedLevel.value === "headquarter" ){
                          if(auth.role === "RSM" || auth.role === "BSM" || auth.role === "ASM"){
                            this.setState({confirmIsOpen: true, type: 'error', textError: "Maaf role anda tidak bisa set target untuk headquarter"})

                            return false
                          }
                        }

                        this.setState({selectedLevel: selectedLevel, regionalType: selectedLevel.value})
                      }}></SelectLineComponent>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h6>{languages.header3}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-lg-6">
                      <div className="form-group mb-0">
                        <label>{languages.periode}</label>
                        <SelectLineComponent initValue={selectedPeriod} options={TargetPeriods} handleChange={(selectedPeriod) => {
                          this.setState({selectedPeriod: selectedPeriod})
                          if(selectedPeriod.value === "Monthly"){
                            this.getHQMonthly(year.value)
                          }else{
                            this.getHQAnnual(year.value)
                          }
                        }}></SelectLineComponent>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      { selectedPeriod.value === "Monthly" &&
                        <div className="form-group mb-0">
                          <label>Tahun</label>
                          <SelectLineComponent initValue={year} options={years} handleChange={(year) => {
                            this.setState({year: year})
                            if(selectedPeriod.value === "Monthly"){
                              this.getHQMonthly(year.value)
                            }else{
                              this.getHQAnnual(year.value)
                            }
                          }}></SelectLineComponent>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            { selectedLevel.value === "headquarter" && selectedPeriod.value === "Annual" &&
              <div className="col-12 mb-4">
                <div className="card mb-4">
                  <div className="section-table">
                    <div className="row m-0 section-table-header d-flex align-items-center">
                      <div className="col-md-2 p-3">
                        {languages.target}
                      </div>
                      <div className="col-10">
                        <div className="row m-0">
                          {
                            HqTableHeader.map((year) => (
                              <div className="col-md-2 p-3" key={year}>
                                {year}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    {
                      targets.map((target) => (
                        <div className="row table-item m-0 d-flex align-items-center">
                          <div className="col-md-2 p-3">
                            <div className="" key={target.id}>
                              {target.name}
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="row m-0">
                              {
                                HqTableHeader.map((year) => (
                                  <div className="col-md-2 px-1 py-2" key={year}>
                                    <input type="text" className="form-control form-control-invisible" value={list_all_target[year][target.name]}
                                      onChange={(e) => {
                                        let newListAllTarget = list_all_target
                                        newListAllTarget[year][target.name] = e.target.value

                                        this.setState({list_all_target: newListAllTarget})
                                      }}
                                      onBlur={() => {
                                        let inputVal = list_all_target[year][target.name]

                                        // debugger

                                        if(inputVal !== "-" && inputVal !== ""){
                                          let newTarget = {"target_type": target.name, value: inputVal}
                                          this.setHQTargetYearly(year, newTarget)
                                        }
                                      }} />
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>

                      ))
                    }
                  </div>
                </div>
              </div>
            }

            { selectedLevel.value === "headquarter" && selectedPeriod.value === "Monthly" &&
              <div className="col-12 mb-4">
                <div className="card mb-4 d-flex flex-row">
                  <div className="section-table" style={{width: "30%"}}>
                    <div className="row m-0 section-table-header d-flex align-items-center">
                      <div className="col-md-7 p-3">
                        {languages.target}
                      </div>
                      <div className="col-md-5 p-3 bg-dark-blue">
                        {languages.total} {year.value}
                      </div>
                    </div>
                    {
                      targets.map((target) => (
                        <div className="row table-item m-0 d-flex align-items-center align-items-stretch">
                          <div className="col-md-7 p-3">
                            <div className="" key={target.id}>
                              {target.name}
                            </div>
                          </div>
                          <div className="col-md-5 bg-blue">
                          </div>
                        </div>

                      ))
                    }
                  </div>
                  <div className="section-table d-flex flex-column" style={{width: "70%", overflow: "scroll"}}>
                    <div className="m-0 section-table-header d-flex align-items-center">
                      {
                        HqTableHeader.map((header) => (
                          <div className="p-3 table-header" key={header} style={{ minWidth: "130px"}}>
                            {header}
                          </div>
                        ))
                      }
                    </div>
                    <div className="m-0 d-flex align-items-center">
                      {
                        HqTableHeader.map((header) => (
                          <div className="m-0 ">
                            {
                              targets.map((target) => (
                                <div className="p-3" style={{ minWidth: "130px", height: "74px"}}>
                                  <input type="text" className="form-control form-control-invisible" value={list_all_target[header][target.name]}
                                      onChange={(e) => {
                                        let newListAllTarget = list_all_target
                                        newListAllTarget[header][target.name] = e.target.value

                                        this.setState({list_all_target: newListAllTarget})
                                      }}
                                      onBlur={() => {
                                        let inputVal = list_all_target[header][target.name]
                                        let inputMonth = TargetMonths.filter((month) => month.label === header)[0]

                                        if(inputVal !== "-" && inputVal !== ""){
                                          let newTarget = {"month": inputMonth.value, value: inputVal}
                                          this.setHQTargetMonthly(target.name, newTarget)
                                        }
                                      }} />
                                </div>
                              ))
                            }
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

            <div className="col-12 mb-3">
              <hr className="content-hr"/>
              <div className="form-group d-flex justify-content-between">
                <Link to="/targets/list" className="btn btn-outline-danger">{languages.cancel}</Link>
                { auth.authority["set_target"] === "Full Access" &&
                  <button type="submit" className={`btn btn-danger ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                    { isLoading ? <LoadingDots/> : languages.save}
                  </button>
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({auth, manage_targets, manage_target_types, regions, branches, areas, subareas}) => (
    { auth, manage_targets, manage_target_types, regions, branches, areas, subareas }),
    {
      getTargetTypes, setTargetHQAnnual, setTargetHQMonthly, createTargetRegion, getHQTarget, getAnnualTargetHQ,
      getMonthlyTargetHQ, getAnnualTargetRegion, getMonthlyTargetRegion, getRegions,
      searchBranch, searchAreas, searchSubAreas
    }
)(NewTarget)
