import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions, deleteRegion, bulkDeleteRegion } from '../../actions/region'
import { NotAuthorize, ModalDelete, Pagination, LoadingDots } from '../../components'
import { IconSearch, IconTrash, IconDots, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/region'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedGender: {value: '', label: 'Semua'},
  selectedCompCode: {value: '', label: 'Semua'},
  selectedRegional: {value: '', label: 'Semua'},
  selectedRegions: [],
  keyword: '',
  id: '',
  region_ids: [],
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  type: 'success',
  filterBy: false,
  languages: {}
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - List Region"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.setState({selectedRegions: [], region_ids: []})

    this.fetchRegions(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchRegions(this.props.location.search);
    }
  }

  fetchRegions = (params) => {
    this.props.getRegions(params)
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {}
      obj[toggle] = !this.state[toggle]
      this.setState(obj)
    }, 175)
  }

  filterRegions = debounce(() => {
    const { keyword } = this.state
    let newParams = keyword ? `/regions?keyword=${keyword}` : '/regions'

    this.props.history.push(newParams)
  }, 350)

  render() {
    const { auth, regions, deleteRegion, bulkDeleteRegion, getRegions } = this.props
    const { id,
      confirmIsOpen,
      resultIsOpen,
      confirmText,
      resultText,
      region_ids,
      type,
      keyword,
      selectedRegions,
      languages } = this.state

    if(auth.isAuthenticated && (auth.authority["list_region"] === "" || auth.authority["list_region"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false, confirmText: confirmText}, () => {
                if(region_ids.length > 0){
                    bulkDeleteRegion({region_ids: region_ids})
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', region_ids: [], selectedRegions: []}, () => getRegions())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }else{
                    deleteRegion(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', resultText: data.meta.message}, () => getRegions())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response})
                      })
                  }
              })
            }}
          />

          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            { auth.authority["set_region"] === "Full Access" &&
              <Link to="/regions/new" className="btn btn-danger btn-rounded float-right">
                {languages.setNew}
              </Link>
            }
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-inline d-flex justify-content-end">
                      <div className="form-group">
                        
                      </div>
                      <div className="form-group input-action ml-3 w-30">
                        <IconSearch/>
                        <input placeholder={languages.search} className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterRegions() )} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                      <th width="5%">
                        <input type="checkbox" onChange={(e) => {
                          let regionIds = regions.map(region => region.id)
                          let newSelectedRegions = e.target.checked ? regionIds : []

                          this.setState({selectedRegions: newSelectedRegions})
                        }}/>
                      </th>
                      <th width="10%">
                      { selectedRegions.length > 0 ?
                        <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                          onClick={() => this.setState({region_ids: selectedRegions, confirmText: `Apakah Anda ingin menghapus ${selectedRegions.length} regional?`, confirmIsOpen: true})}>
                          <IconTrash/>
                          <span className="ml-2">{languages.delete}</span>
                        </span>
                        :
                        <span>{languages.regId}</span>
                      }
                      </th>
                      <th width="20%">{ selectedRegions.length > 0 || languages.regName }</th>
                      <th width="30%">{ selectedRegions.length > 0 || languages.branch }</th>
                      <th width="30%">{ selectedRegions.length > 0 || languages.coverage }</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {regions.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={4}><LoadingDots /></td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {regions.data.map(region => (
                        <tr key={region.id}>
                          <td>
                            <input type="checkbox" checked={selectedRegions.includes(region.id)} onChange={(e) => {
                              let newSelectedRegions = selectedRegions

                              if(e.target.checked){
                                newSelectedRegions.push(region.id)
                              }else{
                                newSelectedRegions = selectedRegions.filter(regionID => regionID !== region.id)
                              }

                              this.setState({selectedRegions: newSelectedRegions})
                            }}/>
                          </td>
                          <td>{region.id}</td>
                          <td>{region.name}</td>
                          <td>{region.branches.join(", ")}</td>
                          <td>{region.provinces.join(", ")}</td>
                          <td>
                            { auth.authority["set_region"] === "Full Access" &&
                              <div className="dropdown">
                                <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                  onClick={() => this.toggleDropdown(`show${region.id}`)}
                                  onBlur={(e) => this.hide(e,`show${region.id}`)}
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                  <IconDots/>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${region.id}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                  <Link to={`/regions/${region.id}/edit`} className="dropdown-item" style={style.link}>
                                    <IconEdit/>
                                    {languages.ubah}
                                  </Link>
                                  <span onClick={() => this.setState({id: region.id, confirmIsOpen: true, region_ids: [], selectedRegions: []})} className="dropdown-item" style={style.link}>
                                    <IconTrash/>
                                    {languages.delete}
                                  </span>
                                </div>
                              </div>
                            }
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    }
                    {(!regions.loading && isEmpty(regions.data)) &&
                      <tbody>
                        <tr>
                          <td colSpan={5} className="text-center">There is no Data</td>
                        </tr>
                      </tbody>
                    }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={regions.meta} routeName="regions" parameter={`&keyword=${keyword}`} handleClick={(pageNumber) => this.fetchRegions(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, regions}) => ({ auth, regions }),
  {getRegions, deleteRegion, bulkDeleteRegion}
)(Index)
