import React from 'react';
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getBranches, deleteBranch, bulkDeleteBranch } from '../../actions/branch'
import { NotAuthorize, ModalDelete, LoadingDots, Pagination } from '../../components'
import { IconSearch, IconTrash, IconDots, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/branch'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedGender: {value: '', label: 'Semua'},
  selectedCompCode: {value: '', label: 'Semua'},
  selectedRegional: {value: '', label: 'Semua'},
  selectedBranches: [],
  keyword: '',
  id: '',
  branch_ids: [],
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  type: 'success',
  languages: {}
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - List Branch"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.setState({selectedBranches: [], branch_ids: []})

    this.fetchBranches(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchBranches(this.props.location.search);
    }
  }

  fetchBranches = (params) => {
    // let page = "?page=1";

    // if(params){
    //   page = params.includes("page") ? params : "?page=1"
    // }

    this.props.getBranches(params)
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

  filterBranches = debounce(() => {
    const { keyword } = this.state
    let newParams = keyword ? `/branches?keyword=${keyword}` : '/branches'

    this.props.history.push(newParams)
  }, 350)

  render() {
    const { auth, branches, getBranches, deleteBranch, bulkDeleteBranch } = this.props
    const { id,
      branch_ids,
      confirmIsOpen,
      resultIsOpen,
      confirmText,
      resultText,
      type,
      keyword,
      selectedBranches,
      languages } = this.state

    if(auth.isAuthenticated && (auth.authority["list_branch"] === "" || auth.authority["list_branch"] === "No Access")) {
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
                if(branch_ids.length > 0){
                    bulkDeleteBranch({branch_ids: branch_ids})
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', branch_ids: [], selectedBranches: [], resultText: languages.hapusSukses}, () => getBranches())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error', resultText: e.response.statusText})
                      })
                  }else{
                    deleteBranch(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success', resultText: languages.hapusSukses}, () => getBranches())
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
            { auth.authority["set_branch"] === "Full Access" &&
              <Link to="/branches/new" className="btn btn-danger btn-rounded float-right">
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
                        <input placeholder={languages.search} className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterBranches())} />
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
                          let branchIds = branches.data.map(branch => branch.id)
                          let newSelectedBranches = e.target.checked ? branchIds : []

                          this.setState({selectedBranches: newSelectedBranches})
                        }}/>
                      </th>
                      <th width="10%">
                        { selectedBranches.length > 0 ?
                          <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                            onClick={() => this.setState({branch_ids: selectedBranches, confirmText: `${languages.hapusData} ${selectedBranches.length} branch?`, confirmIsOpen: true})}>
                            <IconTrash width={20}/>
                            <span className="ml-2">{languages.delete}</span>
                          </span>
                          :
                          <span>Branch ID</span>
                        }
                      </th>
                      <th width="15%">{ selectedBranches.length > 0 || languages.region}</th>
                      <th width="20%">{ selectedBranches.length > 0 || languages.branchName}</th>
                      <th width="45%">{ selectedBranches.length > 0 || languages.coverage}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {branches.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={5}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                    { branches.data !== null ?
                      branches.data.map(branch => (
                        <tr key={branch.id}>
                          <td>
                            <input type="checkbox" checked={selectedBranches.includes(branch.id)} onChange={(e) => {
                              let newSelectedBranches = selectedBranches

                              if(e.target.checked){
                                newSelectedBranches.push(branch.id)
                              }else{
                                newSelectedBranches = selectedBranches.filter(branchID => branchID !== branch.id)
                              }

                              this.setState({selectedBranches: newSelectedBranches})
                            }}/>
                          </td>
                          <td>{branch.id}</td>
                          <td>{branch.region}</td>
                          <td>{branch.name}</td>
                          <td>{branch.cities.join(", ")}</td>
                          <td>
                            { auth.authority["set_branch"] === "Full Access" &&
                              <div className="dropdown">
                                <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                  onClick={() => this.toggleDropdown(`show${branch.id}`)}
                                  onBlur={(e) => this.hide(e,`show${branch.id}`)}
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                  <IconDots/>
                                </button>
                                <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${branch.id}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                  <Link to={`/branches/${branch.id}/edit`} className="dropdown-item" style={style.link}>
                                    <IconEdit/>
                                    {languages.ubah}
                                  </Link>
                                  <span onClick={() => this.setState({id: branch.id, confirmIsOpen: true, branch_ids: [], selectedBranches: [], confirmText: `'${languages.hapusData}''${branch.name}'?`})} className="dropdown-item" style={style.link}>
                                    <IconTrash/>
                                    {languages.delete}
                                  </span>
                                </div>
                              </div>
                            }
                          </td>
                        </tr>
                      )):
                        <tr>
                          <td colSpan={5} className="text-center">{languages.noData}</td>
                        </tr>
                    }
                      
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={branches.meta} routeName="branches" parameter={`&keyword=${keyword}`} handleClick={(pageNumber) => this.fetchBranches(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, branches}) => ({ auth, branches }),
  {getBranches, deleteBranch, bulkDeleteBranch}
)(Index)
