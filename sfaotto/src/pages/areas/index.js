import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAreas, deleteArea, bulkDeleteArea } from '../../actions/area'
import { NotAuthorize, ModalDelete, Pagination, LoadingDots } from '../../components'
import { IconSearch, IconTrash, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/areas'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedGender: {value: '', label: 'All'},
  selectedCompCode: {value: '', label: 'All'},
  selectedRegional: {value: '', label: 'All'},
  selectedAreas: [],
  keyword: '',
  id: '',
  area_ids: [],
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  type: 'success',
  languages: {},
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - List Area"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.setState({selectedAreas: [], area_ids: []})

    this.fetchAreas(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchAreas(this.props.location.search);
    }
  }

  fetchAreas = (params) => {
    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }
    let newParams = params || this.props.location.search

    this.props.getAreas(newParams)
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

  filterAreas = debounce(() => {
    const { keyword } = this.state
    let newParams = keyword ? `/areas?keyword=${keyword}` : '/areas'

    this.props.history.push(newParams)
  }, 350)

  render() {
    const { auth, areas, bulkDeleteArea, deleteArea } = this.props
    const { id,
      area_ids,
      confirmIsOpen,
      resultIsOpen,
      type,
      keyword,
      selectedAreas,
      confirmText,
      resultText,
      languages } = this.state


    if (auth.isAuthenticated && (auth.authority["list_area"] === "" || auth.authority["list_area"] === "No Access")) {
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
                if(area_ids.length > 0){
                    bulkDeleteArea({area_ids: area_ids})
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', area_ids: [], selectedAreas: []}, () => this.fetchAreas())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }else{
                    deleteArea(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success'}, () => this.fetchAreas())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }
              })
            }}
          />

          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            { auth.authority["set_area"] === "Full Access" &&
              <Link to="/areas/new" className="btn btn-danger btn-rounded float-right">
                {languages.setNew}
              </Link>
            }
          </div>
          <div className="col-12 mb-5">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-end">
                      <div className="form-group input-action ml-3 w-30">
                        <IconSearch />
                        <input placeholder={languages.search} className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterAreas())} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header table-fixed mb-0">
                  <thead>
                    <tr>
                      <th width="5%">
                        <input type="checkbox" onChange={(e) => {
                          let areaIds = areas.data.map(region => region.id)
                          let newSelectedAreas = e.target.checked ? areaIds : []

                          this.setState({selectedAreas: newSelectedAreas})
                        }}/>
                      </th>
                      <th width="10%">{ selectedAreas.length > 0 ?
                        <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                          onClick={() => this.setState({area_ids: selectedAreas, confirmText: `${languages.hapusData} ${selectedAreas.length} area?`, confirmIsOpen: true})}>
                          <IconTrash/>
                          <span className="ml-2">{languages.delete}</span>
                        </span>
                        :
                        <span>{languages.areaId}</span>
                      }</th>
                      <th width="15%">{ selectedAreas.length > 0 || languages.branch}</th>
                      <th width="20%">{ selectedAreas.length > 0 || languages.areaName}</th>
                      <th width="55%">{ selectedAreas.length > 0 || languages.coverage}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {areas.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={6}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {areas.data.map((area, idx) => (
                        <tr key={area.id}>
                          <td>
                            <input type="checkbox" checked={selectedAreas.includes(area.id)} onChange={(e) => {
                              let newSelectedAreas = selectedAreas

                              if(e.target.checked){
                                newSelectedAreas.push(area.id)
                              }else{
                                newSelectedAreas = selectedAreas.filter(areaID => areaID !== area.id)
                              }

                              this.setState({selectedAreas: newSelectedAreas})
                            }}/>
                          </td>
                          <td>{area.id}</td>
                          <td>{area.branch}</td>
                          <td>{area.name}</td>
                          <td>{area.districts.length > 0 ? area.districts.join(", ") : languages.noCoverage}</td>
                          <td>
                            { auth.authority["set_area"] === "Full Access" &&
                              <div className="dropdown">
                                <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                  onClick={() => this.toggleDropdown(`show${area.id}${idx}`)}
                                  onBlur={(e) => this.hide(e,`show${area.id}${idx}`)}
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${area.id}${idx}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                  <Link to={`/areas/${area.id}/edit`} className="dropdown-item" style={style.link}>
                                    <IconEdit/>
                                    {languages.ubah}
                                  </Link>
                                  <span onClick={() => this.setState({id: area.id, confirmIsOpen: true, area_ids: [], selectedAreas: []})} className="dropdown-item" style={style.link}>
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
                  {(!areas.loading && isEmpty(areas.data)) &&
                    <tbody>
                      <tr>
                        <td colSpan={5} className="text-center">{languages.noData}</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={areas.meta} routeName="areas" parameter={`&keyword=${keyword}`} handleClick={(pageNumber) => this.fetchAreas(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, areas}) => ({ auth, areas }),
  {getAreas, deleteArea, bulkDeleteArea}
)(Index)
