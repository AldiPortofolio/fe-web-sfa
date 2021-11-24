import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import { getHQTarget, getRegionalTarget, getAnnualTargetHQ, getMonthlyTargetHQ,
         getAnnualTargetRegion, getMonthlyTargetRegion} from '../../actions/manage_target'
import { getTargetTypes } from '../../actions/manage_target_type'
import { NotAuthorize, SelectLineComponent, ModalConfirm, LoadingDots} from '../../components'
import { IconDownload } from '../../components/Icons'
import { ind, en } from '../../languages/target'
// import CardTable from '../../components/targets/CardTable'

const currentYear = moment().format('YYYY')

const initValue = {
  selectedPeriod: {},
  selectedLevel: {value: "headquarter", label: "Headquarter"},
  targetRegions: [],
  targetBranches: [],
  targetAreas: [],
  targetSubAreas: [],
  emptyRegions: false,
  emptyBranches: false,
  emptyAreas: false,
  emptySubAreas: false,
  year: {value: currentYear, label: currentYear},
  keyword: '',
  confirmIsOpen: false,
  type: 'success',
  textSuccess: '',
  textError: '',
  targetTypes: [],
  HqTableHeader: [],
  selectedHqType: "yearly",
  regionYear: {value: currentYear, label: currentYear},
  RegionTableHeader: [],
  selectedRegionType: "yearly",
  selectedRegionTargetType: {},
  languages: {}
}

const TargetPeriods = [
  {value: "yearly", label: "Tahunan"},
  {value: "monthly", label: "Bulanan"},
]

class List extends React.Component {
  state = initValue

  componentDidMount(){
    document.title = "SFA OTTO - Set Target"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.props.getTargetTypes()
      .then((data) => {
        let newTargets = data.data

        this.setState({targetTypes: newTargets})
      })

    this.getHQAnnual()

    this.getRegionAnnual(this.state.regionYear.value, "Region")
  }

  getHQAnnual(year){
    this.setState({HqTableHeader: []})
    this.props.getAnnualTargetHQ(year)
      .then((data) => {
        this.setState({HqTableHeader: Object.keys(data.data)})
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
        this.setState({HqTableHeader: Object.keys(data.data)})
      })
  }

  getRegionMonthly(year, regional_type, target_type){
    this.setState({RegionTableHeader: []})
    this.props.getMonthlyTargetRegion(year, regional_type, target_type)
      .then((data) => {
        this.setState({RegionTableHeader: Object.keys(data.data)})
      })
  }

  setCollapse(collapse) {
    if (this.state.collapse === collapse) {
      collapse = ''
    }
    this.setState({collapse})
  }

  render() {
    const { auth, manage_targets } = this.props
    const {
      // targetRegions,
      // targetBranches,
      // targetAreas,
      // targetSubAreas,
      // emptyRegions,
      // emptyBranches,
      // emptyAreas,
      // emptySubAreas,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      targetTypes,
      year,
      HqTableHeader,
      selectedHqType,
      regionYear,
      RegionTableHeader,
      selectedRegionType,
      selectedRegionTargetType,
      languages } = this.state

    if (auth.isAuthenticated && (auth.authority["list_all_sales"] === "" || auth.authority["list_all_sales"] === "No Access")) {
      return <NotAuthorize />
    }

    let years = []
    for (var i = 0; i < 20; i++) {
      years = years.concat({value: Number(currentYear)+i, label: Number(currentYear)+i})
    }

    let listTargetTypes = []
    for (var j = 0; j < targetTypes.length; j++) {
      listTargetTypes = listTargetTypes.concat({value: targetTypes[j].id, label: targetTypes[j].name})
    }

    // console.log(RegionTableHeader)
    // console.log(targetTypes)
    // console.log(manage_targets)

    return (
      <div className="container mb-5">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => this.setState({confirmIsOpen: false})}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12 mb-2">
            <h2>{languages.header}</h2>
            <div className="row mt-4">
              <div className="col-12">
                <div className="actions d-flex justify-content-end mb-2">
                  <div className="form-group mb-0">
                    <button className="btn btn-link text-danger"><IconDownload/>{languages.export}</button>
                      {(['IT Admin', 'HQ', 'Operator'].includes(auth.role)) &&
                        <Link to="/targets/set" className="btn btn-danger btn-rounded ml-3">{languages.setNew}</Link>
                      }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-12 mb-4">

            <div className="card mb-4">
              <div className="card-body">
                <h6 className="mb-4">{languages.targetHead}</h6>
                <div className="d-flex align-items-center" style={{height: "38px"}}>
                  <div className="mr-3">{languages.type}: </div>
                  { TargetPeriods.map((period) => (
                    <div className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="hq-period-type"
                        id={`hq-${period.value}`}
                        value={period.value}
                        checked={selectedHqType === period.value}
                        onChange={(event) => {
                          this.setState({selectedHqType: event.target.value})
                          if(event.target.value === "yearly"){
                            this.getHQAnnual(year.value)
                          }else{
                            this.getHQMonthly(year.value)
                          }
                        }} />
                      <label className="form-check-label" htmlFor={`hq-${period.value}`}>{period.label}</label>
                    </div>
                    ))
                  }
                  { selectedHqType === "monthly" &&
                    <div className="form-group d-flex mb-0 d-flex align-items-center col-md-4 ml-4">
                      <label className="mr-3 mb-0">{languages.tahun}:</label>
                      <SelectLineComponent initValue={year} options={years} handleChange={(year) => {
                        this.setState({year: year}, () => this.getHQMonthly(year.value))
                      }}></SelectLineComponent>
                    </div>
                  }
                </div>
              </div>
              <div className="section-table">
                <div className="row m-0 section-table-header d-flex align-items-center">
                  <div className="col-md-2 p-3">
                    {languages.target}
                  </div>
                  <div className="col-10">
                    <div className="row m-0">
                      {
                        targetTypes.map((target) => (
                          <div className="col-md-2 py-2" key={target.id}>
                            {target.name}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                { manage_targets.loading ?
                  <div className="col-12 d-flex justify-content-center p-4">
                    <LoadingDots black="true"/>
                  </div>
                  :
                  HqTableHeader.map((header) => (
                    <div className="row m-0 table-item">
                      <div className="col-md-2 p-3">
                        <div className="" key={header}>
                          {header}
                        </div>
                      </div>
                      <div className="col-10">
                        <div className="row m-0">
                          {
                            targetTypes.map((target) => (
                              <div className="col-md-2 p-3" key={target.value}>
                                {manage_targets.data[header][target.name]}
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

            {/* Regional Cards */}

            <div className="card mb-4">
              <div className="card-body">
                <h6 className="mb-4">{languages.region}</h6>
                <div className="d-flex align-items-center" style={{height: "38px"}}>
                  <div className="mr-3">{languages.type}: </div>
                  { TargetPeriods.map((period) => (
                    <div className="form-check form-check-inline">
                      <input className="form-check-input"
                        type="radio"
                        name="region-period-type"
                        id={`region-${period.value}`}
                        value={period.value}
                        checked={selectedRegionType === period.value}
                        onChange={(event) => {
                          this.setState({selectedRegionType: event.target.value})
                          if(event.target.value === "yearly"){
                            this.getRegionAnnual(regionYear.value, "Region")
                          }else{
                            this.getRegionMonthly(regionYear.value, "Region", selectedRegionTargetType.value)
                          }
                        }} />
                      <label className="form-check-label" htmlFor={`region-${period.value}`}>{period.label}</label>
                    </div>
                    ))
                  }
                  { selectedRegionType === "monthly" &&
                    <div className="form-group d-flex mb-0 d-flex align-items-center col-md-4 ml-4">
                      <label className="mr-3 mb-0">{languages.tahun}:</label>
                      <SelectLineComponent initValue={regionYear} options={years} handleChange={(regionYear) => {
                        this.setState({regionYear: regionYear}, () => {
                          this.getRegionMonthly(regionYear.value, "Region", selectedRegionTargetType.value)
                        })
                      }}></SelectLineComponent>
                    </div>
                  }
                  { selectedRegionType === "monthly" &&
                    <div className="form-group d-flex mb-0 d-flex align-items-center col-md-4 ml-4">
                      <label className="mr-3 mb-0">{languages.jenis}:</label>
                      <SelectLineComponent initValue={selectedRegionTargetType} options={listTargetTypes} handleChange={(targetType) => {
                        this.setState({selectedRegionTargetType: targetType}, () => {
                          this.getRegionMonthly(regionYear.value, "Region", targetType.value)
                        })
                      }}></SelectLineComponent>
                    </div>
                  }
                </div>
              </div>
              <div className="section-table">
                <div className="row m-0 section-table-header d-flex align-items-center">
                  <div className="col-md-1 p-3">
                    {languages.regCode}
                  </div>
                  <div className="col-md-2 p-0">
                    {languages.regName}
                  </div>

                  <div className="col-9">
                    <div className="row m-0">
                      { selectedRegionType === "yearly" ?
                        targetTypes.map((target) => (
                          <div className="col-md-2 py-2" key={target.id}>
                            {target.name}
                          </div>
                        ))
                        :
                        RegionTableHeader.map((header, idx) => (
                          <div className="col-md-2 py-2" key={idx}>
                            {header}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                { manage_targets.loading &&
                  <div className="col-12 d-flex justify-content-center p-4">
                    <LoadingDots black="true"/>
                  </div>
                }
                { selectedRegionType === "yearly" ?
                  RegionTableHeader.map((header) => (
                    <div className="row m-0">
                      <div className="col-md-1 p-3">
                        {header.split(",")[0]}
                      </div>
                      <div className="col-md-2 p-3">
                        {header.split(",")[1]}
                      </div>
                      <div className="col-9">
                        <div className="row m-0">
                          {
                            targetTypes.map((target) => (
                              <div className="col-md-2 p-3" key={target.value}>
                                {manage_targets.region_data[header][target.name]}
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  ))
                  :
                  RegionTableHeader.map((header) => (
                    <div className="row m-0">
                      {
                        targetTypes.map((target) => {
                          return(
                            <div className="col-md-2 p-3" key={target.value}>
                              {manage_targets.region_data[header][target.name]}
                            </div>
                          )
                        })
                      }
                    </div>
                  ))
                }
              </div>
            </div>

            { /*
            <CardTable name="Region" detailName="Branch" targetTypes={manage_target_types} targets={targetRegions} year={year.value} handleClick={(year, regional, parent_id) => {
              this.getRegionalTargets(year, regional, parent_id)
            }}/>

            { emptyRegions &&
              <div className="card card-placeholder text-center p-5 mb-4">
                <h5 className="text-placeholder mb-0">No target region</h5>
              </div>
            }

            { targetBranches.length > 0 &&
              <CardTable name="Branch" detailName="Area" targetTypes={manage_target_types} targets={targetBranches} year={year.value} handleClick={(year, regional, parent_id) => {
                this.getRegionalTargets(year, regional, parent_id)
              }}/>
            }
            { emptyBranches &&
              <div className="card card-placeholder text-center p-5 mb-4">
                <h5 className="text-placeholder mb-0">No target branches for this region</h5>
              </div>
            }

            { targetAreas.length > 0 &&
              <CardTable name="Area" detailName="SubArea" targetTypes={manage_target_types} targets={targetAreas} year={year.value} handleClick={(year, regional, parent_id) => {
                this.getRegionalTargets(year, regional, parent_id)
              }}/>
            }
            { emptyAreas &&
              <div className="card card-placeholder text-center p-5 mb-4">
                <h5 className="text-placeholder mb-0">No target areas for this branch</h5>
              </div>
            }

            { targetSubAreas.length > 0 &&
              <CardTable name="SubArea" detailName="null" targetTypes={manage_target_types} targets={targetSubAreas} year={year.value} handleClick={(year, regional, parent_id) => {}}/>
            }
            { emptySubAreas &&
              <div className="card card-placeholder text-center p-5 mb-4">
                <h5 className="text-placeholder mb-0">No target sub areas for this area</h5>
              </div>
            }
            */}

          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, manage_targets, manage_target_types}) => ({ auth, manage_targets, manage_target_types }),
  {getTargetTypes, getHQTarget, getRegionalTarget, getAnnualTargetHQ, getMonthlyTargetHQ, getAnnualTargetRegion, getMonthlyTargetRegion}
)(List)
