import React from 'react';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAdmins, deleteAdmin, getAdminsV2_1, changeStatusAdmin } from '../../actions/admin'
import { getRoles } from '../../actions/role'
import { ModalDelete, NotAuthorize, SelectComponent, LoadingDots, Pagination } from '../../components'
import { IconTrash, IconEdit, IconSearch } from '../../components/Icons'
import { ind, en } from '../../languages/admin'

const style = {
  link: {
    cursor: 'pointer'
  }
}

class Manage extends React.Component {
  state = {
    selectedRole: {value: '', label: 'Semua'},
    id: '',
    confirmIsOpen: false,
    confirmIsOpenStatus: false,
    status: '',
    confirmText: '',
    confirmTextStatus: '',
    resultTextStatus: '',
    resultIsOpen: false,
    resultIsOpenStatus: false,
    type: 'success',
    keyword: '',
    languages: {}
  }

  componentWillMount() {
    // this.props.getAdmins()
    this.fetchAdmins(window.location.search)
  }

  componentDidMount(){
    document.title = "SFA OTTO - Manage Admin"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.manage})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.manage})
    }
    this.fetchAdmins(window.location.search)
  }

  componentDidUpdate(prevProps) {

    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchAdmins(this.props.location.search);
    }
  }


  getData = async () => {
    try {
      // await this.props.getAdmins()
      await this.props.getAdminsV2_1()
    } catch(e) {
      console.log(e)
    }
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
    }, 200)
  }

  fetchAdmins = (pageNumber) => {
    const { selectedRole, keyword } = this.state
    let page = "1";
    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber.replace("?page=", "") : "1"
    }

    this.props.getAdminsV2_1({keyword, region_id: selectedRole.value.toString(), page})
  }

  render() {
    let { auth, getAdmins, deleteAdmin, admins, roles, getAdminsV2_1, changeStatusAdmin } = this.props
    const { id, confirmIsOpen, resultIsOpen, type, selectedRole, confirmText, keyword, languages, confirmIsOpenStatus, status, resultIsOpenStatus, confirmTextStatus, resultTextStatus} = this.state

    if (auth.isAuthenticated && (auth.authority["list_all_admin"] === "" || auth.authority["list_all_admin"] === "No Access")) {
      return <NotAuthorize />
    }

    let newRoles
    newRoles = roles.data.map(c => ({value: c.id, label: c.name}))

    let filterAdmins = admins.data.admins

    let newParams = ""

    if(selectedRole.value){
      newParams = newParams + `&role=${selectedRole.value}`
    }

    if(keyword.length > 0){
      newParams = newParams + `&keyword=${keyword.toLowerCase()}`
    }

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmText={confirmText}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false}, () => {
                deleteAdmin(id)
                  .then((data) => this.setState({resultIsOpen: true}, () => getAdminsV2_1()))
                  .catch(e => this.setState({resultIsOpen: true, type: 'error'}))
              })
            }}
          />
          <ModalDelete
            confirmIsOpen={confirmIsOpenStatus}
            resultIsOpen={resultIsOpenStatus}
            type={type}
            confirmText={confirmTextStatus}
            confirmClose={() => this.setState({confirmIsOpenStatus: false})}
            resultClose={() => this.setState({resultIsOpenStatus: false})}
            confirmYes={() => {
              this.setState({confirmIsOpenStatus: false}, () => {
                let data = {admin_id: id, status: status}
                changeStatusAdmin(id, data)
                  .then((data) => this.setState({resultIsOpenStatus: true}, () => getAdminsV2_1()))
                  .catch(e => this.setState({resultIsOpenStatus: true, type: 'error'}))
              })
            }}
            resultText={resultTextStatus}
          />
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            { ((auth.authority["list_all_admin"] === "Full Access") || (auth.authority["add_admin"] === "Full Access")) &&
              <Link to="/admin/register" className="btn btn-danger btn-rounded d-flex align-items-center float-right">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                {languages.new}
              </Link>
            }
          </div>
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-row form-inline my-3">
                      <div className="form-group col-6 col-lg-6">
                        <small className="text-gray">{languages.role}</small>
                        <div style={{zIndex: '100'}} className="ml-2">
                          <SelectComponent options={newRoles} initValue={selectedRole}
                            handleChange={(selectedRole) => this.setState({selectedRole}, () => getAdminsV2_1({role:selectedRole.value})) }
                          />
                        </div>
                      </div>
                      <div className="form-group col-6 col-lg-6 justify-content-end">
                        <div className="form-group input-action ml-3 w-50">
                          <IconSearch />
                          <input placeholder='Search Admin' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => getAdminsV2_1({keyword}))} />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header mb-0">
                  <thead>
                    <tr>
                      <th width="5%">#</th>
                      <th width="10%">{languages.nik}</th>
                      <th width="20%">{languages.admin}</th>
                      <th width="20%">{languages.email}</th>
                      <th width="15%">{languages.role}</th>
                      <th width="10%">{languages.last}</th>
                      <th width="10%">{languages.status}</th>
                      <th width="10%">Action</th>
                    </tr>
                  </thead>
                  {admins.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      { (filterAdmins != null && filterAdmins.length > 0) && filterAdmins.map((a, index) => (
                        <tr key={a.id}>
                          <td>{index+1}</td>
                          <td>{a.id}</td>
                          <td>
                            <Link to={`/admin/detail/${a.id}`} style={style.link}>
                              {a.first_name} {a.last_name}
                            </Link>
                          </td>
                          <td>{a.email}</td>
                          <td>{a.role}</td>
                          <td>-</td>
                          <td>
                              <span className={`badge w-500 ${a.status == "Active" ? "badge-success" : "badge-danger"}`}>{a.status}</span>
                          </td>
                          { auth.authority["add_admin"] === "Full Access" ?
                            <td className="d-flex">
                              <div className="dropdown">
                                  <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                    onClick={() => this.toggleDropdown(`show${a.id}`)}
                                    onBlur={(e) => this.hide(e,`show${a.id}`)}
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                    <svg enable-background="new 0 0 512 512" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                  </button>
                                  <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${a.id}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                    <Link to={`/admin/edit/${a.id}`} className="dropdown-item" style={style.link}>
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                      {languages.edit}
                                    </Link>
                                    <span className="dropdown-item" style={style.link}
                                      onClick={() => this.setState({id: a.id, confirmIsOpenStatus: true, status: a.status == 'Active' ? 'Inactive' : 'Active', confirmTextStatus: a.status == "Active" ? languages.confirmTextNonActive : languages.confirmTextActive, resultTextStatus: a.status == "Active" ? languages.resultTextStatusNonActive : languages.resultTextStatusActive })}
                                      >
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                      {a.status == 'Active' ? languages.nonActive : languages.active}
                                    </span>
                                    {/* <span className="dropdown-item" style={style.link}
                                      onClick={() => this.setState({id: a.id, confirmIsOpen: true})}
                                      >
                                        <IconTrash/>
                                      {languages.remove}
                                    </span> */}
                                  </div>
                                </div>
                            </td>
                            :
                            <td></td>
                          }
                        </tr>
                      ))}
                      {isEmpty(filterAdmins) &&
                        <tr>
                          <td colSpan={6} className="text-center">
                            {languages.canNot} '<strong>{keyword}</strong>'
                          </td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={admins.data.meta} routeName="admin/manage" parameter={newParams} handleClick={(pageNumber) => this.fetchAdmins(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({admins, auth, roles}) => ({ admins, auth, roles }),
  {getAdmins, deleteAdmin, getRoles, getAdminsV2_1, changeStatusAdmin}
)(Manage)
