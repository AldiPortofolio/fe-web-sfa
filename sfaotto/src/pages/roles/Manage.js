import React from 'react';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRoles, deleteRole } from '../../actions/role'
import { ModalDelete, LoadingDots, NotAuthorize } from '../../components'
import { IconSearch, IconTrash, IconEdit } from '../../components/Icons'
import { ind, en } from '../../languages/role'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const initState = {
  selectedRoles: [],
  keyword: '',
  id: '',
  role_ids: [],
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
    document.title = "SFA OTTO - List Role"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.manage})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.manage})
    }

    this.setState({selectedRoles: [], role_ids: []})

    this.props.getRoles()
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

  render() {
    const { auth, roles, getRoles, deleteRole } = this.props
    const { id,
      confirmIsOpen,
      resultIsOpen,
      confirmText,
      resultText,
      role_ids,
      type,
      keyword,
      selectedRoles,
      languages } = this.state

    let filterRoles
    if(!isEmpty(roles)){
      filterRoles = roles.data.filter(role => role.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (auth.isAuthenticated && (auth.authority["define_role"] === "" || auth.authority["define_role"] === "No Access")) {
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
            resultClose={() => this.setState({resultIsOpen: false}, () => getRoles())}
            confirmYes={() => {
              this.setState({confirmIsOpen: false, confirmText: confirmText}, () => {
                if(role_ids.length > 0){
                  }else{
                    deleteRole(id)
                      .then((data) => {
                        if(data.meta.status === false){
                          this.setState({resultIsOpen: true, type: 'error', resultText: data.meta.message})
                        }else{
                          this.setState({resultIsOpen: true, type: 'success'}, () => getRoles())
                        }
                      })
                      .catch(e => {
                        this.setState({resultIsOpen: true, type: 'error'})
                      })
                  }
              })
            }}
          />

          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            { (auth.authority["define_role"] === "Full Access") &&
              <Link to="/admin/roles/new" className="btn btn-danger btn-rounded float-right">
                {languages.new}
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
                        <input placeholder='Search Role' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value})} />
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
                          let roleIds = filterRoles.map(role => role.id)
                          let newSelectedRoles = e.target.checked ? roleIds : []

                          this.setState({selectedRoles: newSelectedRoles})
                        }}/>
                      </th>
                      <th width="25%">
                      { selectedRoles.length > 0 ?
                        <span className="text-gray-danger d-flex align-items-center" style={{cursor: "pointer"}}
                          onClick={() => this.setState({role_ids: selectedRoles, confirmText: `Apakah Anda ingin menghapus ${selectedRoles.length} regional?`, confirmIsOpen: true})}>
                          <IconTrash/>
                          <span className="ml-2">{languages.delete}</span>
                        </span>
                        :
                        <span>{languages.id}</span>
                      }
                      </th>
                      <th width="55%">{ selectedRoles.length > 0 || languages.name }</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {roles.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={4}><LoadingDots /></td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {filterRoles.map(role => (
                        <tr key={role.id}>
                          <td>
                            <input type="checkbox" checked={selectedRoles.includes(role.id)} onChange={(e) => {
                              let newSelectedRoles = selectedRoles

                              if(e.target.checked){
                                newSelectedRoles.push(role.id)
                              }else{
                                newSelectedRoles = selectedRoles.filter(roleID => roleID !== role.id)
                              }

                              this.setState({selectedRoles: newSelectedRoles})
                            }}/>
                          </td>
                          <td>{role.id}</td>
                          <td>{role.name}</td>
                          { (auth.authority["define_role"] === "Full Access") ?
                            <td className="d-flex">
                              <Link to={`/admin/roles/${role.id}/edit`} className="px-2 btn-circle" style={style.link}>
                                <IconEdit/>
                              </Link>
                              <span onClick={() => this.setState({id: role.id, confirmIsOpen: true, role_ids: [], selectedRoles: []})} className="px-2 btn-circle text-danger" style={style.link}>
                                <IconTrash/>
                              </span>
                            </td>
                            :
                            <td></td>
                          }
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, roles}) => ({ auth, roles }),
  {getRoles, deleteRole}
)(Index)
