import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
// import moment from 'moment'
import { connect } from 'react-redux'
import { getSubareas, deleteSubArea, bulkDeleteSubArea } from '../../actions/subarea'
import { NotAuthorize, ModalDelete, Pagination, LoadingDots } from '../../components'
import { IconSearch, IconTrash } from '../../components/Icons'
import { ind, en } from '../../languages/subarea'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedGender: {value: '', label: 'Semua'},
  selectedRegional: {value: '', label: 'Semua'},
  selectedSubAreas: [],
  keyword: '',
  params: '',
  id: '',
  sub_area_ids: [],
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
    document.title = "SFA OTTO - List Sub-Area"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }


    this.setState({selectedSubAreas: [], sub_area_ids: []})

    this.fetchSubAreas(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSubAreas(this.props.location.search);
    }
  }

  fetchSubAreas = (params) => {
    let newParams = params || this.props.location.search
    // let page = "?page=1";

    // if(params){
    //   page = params.includes("page") ? params : "?page=1"
    // }

    this.props.getSubareas(newParams)
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

  filterSubArea = debounce(() => {
    const { keyword } = this.state
    let newParams = keyword ? `/sub_areas?keyword=${keyword}` : '/sub_areas'

    this.props.history.push(newParams)
  }, 350)

  render() {
    const { auth, subareas, bulkDeleteSubArea, deleteSubArea } = this.props
    const { id,
      sub_area_ids,
      selectedSubAreas,
      confirmIsOpen,
      resultIsOpen,
      type,
      keyword,
      confirmText,
      resultText,
      languages } = this.state

    if(auth.isAuthenticated && (auth.authority["list_subarea"] === "" || auth.authority["list_subarea"] === "No Access")) {
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
                if(sub_area_ids.length > 0){
                    bulkDeleteSubArea({sub_area_ids: sub_area_ids})
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', sub_area_ids: [], selectedSubAreas: []}, () => this.fetchSubAreas())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }else{
                    deleteSubArea(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success'}, () => this.fetchSubAreas())
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
            { auth.authority["set_subarea"] === "Full Access" &&
              <Link to="/sub_areas/new" className="btn btn-danger btn-rounded float-right">
                {languages.setNew}
              </Link>
            }
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-end">
                      <div className="form-group input-action ml-3 w-30">
                        <IconSearch />
                        <input placeholder={languages.search} className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterSubArea())} />
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
                          let subAreaIds = subareas.data.map(subarea => subarea.id)
                          let newSelectedSubAreas = e.target.checked ? subAreaIds : []

                          this.setState({selectedSubAreas: newSelectedSubAreas})
                        }}/>
                      </th>
                      <th width="10%">{ selectedSubAreas.length > 0 ?
                        <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                          onClick={() => this.setState({sub_area_ids: selectedSubAreas, confirmText: `${languages.hapusData} ${selectedSubAreas.length} sub area?`, confirmIsOpen: true})}>
                          <IconTrash/>
                          <span className="ml-2">{languages.delete}</span>
                        </span>
                        :
                        <span>SubArea ID</span>
                      }</th>
                      <th width="15%">{ selectedSubAreas.length > 0 || languages.area}</th>
                      <th width="15%">{ selectedSubAreas.length > 0 || languages.subName}</th>
                      <th width="15%">{ selectedSubAreas.length > 0 || languages.sac}</th>
                      <th width="50%">{ selectedSubAreas.length > 0 || languages.coverage}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {subareas.loading ?
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
                      {subareas.data.map(subarea => (
                        <tr key={subarea.id}>
                          <td>
                            <input type="checkbox" checked={selectedSubAreas.includes(subarea.id)} onChange={(e) => {
                              let newSelectedSubAreas = selectedSubAreas

                              if(e.target.checked){
                                newSelectedSubAreas.push(subarea.id)
                              }else{
                                newSelectedSubAreas = selectedSubAreas.filter(areaID => areaID !== subarea.id)
                              }

                              this.setState({selectedSubAreas: newSelectedSubAreas})
                            }}/>
                          </td>
                          <td>{subarea.id}</td>
                          <td>{subarea.area}</td>
                          <td>{subarea.name}</td>
                          <td>{subarea.sales_area_channel}</td>
                          <td>{subarea.villages.join(", ")}</td>
                          <td>
                            { auth.authority["set_subarea"] === "Full Access" &&
                              <div className="dropdown">
                                <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                  onClick={() => this.toggleDropdown(`show${subarea.id}`)}
                                  onBlur={(e) => this.hide(e,`show${subarea.id}`)}
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${subarea.id}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                  <Link to={`/sub_areas/${subarea.id}/edit`} className="dropdown-item" style={style.link}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                    {languages.ubah}
                                  </Link>
                                  <span onClick={() => this.setState({id: subarea.id, confirmIsOpen: true, sub_area_ids: [], selectedSubAreas: []})} className="dropdown-item" style={style.link}>
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
                  {(!subareas.loading && isEmpty(subareas.data)) &&
                      <tbody>
                        <tr>
                          <td colSpan={5} className="text-center">{languages.noData}</td>
                        </tr>
                      </tbody>
                    }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={subareas.meta} routeName="sub_areas" parameter={`&keyword=${keyword}`} handleClick={(pageNumber) => this.fetchSubAreas(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, subareas}) => ({ auth, subareas }),
  {getSubareas, deleteSubArea, bulkDeleteSubArea}
)(Index)
