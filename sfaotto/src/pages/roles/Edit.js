import React from 'react';
import { connect } from 'react-redux'
import { capitalize, isEmpty } from 'lodash'
import { createAdmin, getAdminStatuses } from '../../actions/admin'
import { updateRole, getRole } from '../../actions/role'
import { NotAuthorize, ModalConfirm, LoadingDots } from '../../components'
import { ind, en } from '../../languages/role'

class Edit extends React.Component {
  state = {
    id: '',
    name: '',
    authority_attributes: {},
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    isLoading: false,
    languages: {}
  }

  componentDidMount(){
    document.title = "SFA OTTO - Define Role"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.edit})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.edit})
    }

    const { match, getAdminStatuses, getRole } = this.props

    getAdminStatuses()

    getRole(match.params.id)
    .then((data) => {
      let role = data.data.role
      let authority_attributes = role.authority
      this.setState({
        id: role.id,
        name: role.name,
        authority_attributes
      })
    })
  }

  convertToDash = ( str ) => {
    return str.replace(/\s+/g, '-').toLowerCase();
  }

  titleCase(str){
    str = str.replace(/_/g, ' ').toLowerCase().split(' ');

    let final = [ ];

      for(let word of str){
        final.push(word.charAt(0).toUpperCase()+ word.slice(1));
      }

    return final.join(' ')
  }

  render() {
    const { history, auth, admins, updateRole } = this.props

    if (auth.isAuthenticated && (auth.authority["define_role"] === "" || auth.authority["define_role"] === "No Access")) {
      return <NotAuthorize />
    }

    const { id,
      name,
      authority_attributes,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      isLoading,
      languages
     } = this.state

    return (
      <div className="container mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            this.setState({isLoading: true})
            if(name !== ''){
              updateRole({name, authority_attributes, role_id: id})
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textError: '', textSuccess: languages.sukses})
                  }
                })
                .catch(e => this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textSuccess: languages.gagal}))
            }
          }}
          className="">
          <div className="row">
            <ModalConfirm
              confirmIsOpen={confirmIsOpen}
              type={type}
              confirmClose={() => this.setState({confirmIsOpen: false})}
              confirmSuccess={() => history.push('/admin/roles')}
              textSuccess={textSuccess}
              textError={textError}
            />
            <div className="col-12 mb-5">
              <h2>{languages.header}</h2>
            </div>

            <div className="col-12 col-lg-8 mb-5">
              <div className="card mb-5">
                <div className="card-body">
                  <h6 className="mb-4">{languages.header2}</h6>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label className="">{languages.role}</label>
                        <input
                          onChange={e => this.setState({name: capitalize(e.target.value)})}
                          value={name} type="text" className="form-control form-control-line" placeholder="Type role name" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="mb-0">{languages.authority}</h6>
                </div>

                { (!isEmpty(authority_attributes) && admins.labels) && Object.keys(admins.labels).map((authority, index) =>{
                  return(
                    <div className="card-body section-group border-top" key={index}>
                      <label className="text-bold">{this.titleCase(authority)}</label>
                      { Object.values(admins.labels[authority]).map((item, idx) =>{
                        let itemExcept = item === "list_assignment_position" ? "list_assign_position" : item
                        return(
                          <div className="row" key={idx}>
                            <div className="col-6">
                              <label>{this.titleCase(itemExcept)}</label>
                            </div>
                            <div className="col-6">
                              <div className="form-group mb-0">
                              { admins.statuses.length && admins.statuses.map((status, s_idx) => {
                                let itemName = this.convertToDash(`${item} ${status}`)
                                let thisStatus = Object.keys(authority_attributes).filter(stat => stat === item)

                                return(
                                  <div className="form-check form-check-inline" key={s_idx}>
                                    <input className="form-check-input" type="radio" name={item} id={itemName} value={status} defaultChecked={authority_attributes[thisStatus] === status} onChange={(e) => {
                                      let newAuthorityAttributes = authority_attributes
                                      newAuthorityAttributes[item] = e.target.value

                                      this.setState({authority_attributes: newAuthorityAttributes})
                                    }}/>
                                    <label className="form-check-label text-gray" htmlFor={itemName}>
                                      {status}
                                    </label>
                                  </div>
                                )
                              })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                { isEmpty(admins.labels) &&
                  <div className="card p-5 d-flex align-items-center justify-content-center">
                    <LoadingDots black="true" />
                  </div>
                }

              </div>
            </div>

            { auth.authority["add_admin"] === "Full Access" &&
              <div className="col-12 text-right">
                <div className="border-top pt-3">
                  <button type="submit" className={`btn btn-danger ${isLoading ? 'disabled' : ''}`} disabled={(isLoading || isEmpty(name))}>
                    { isLoading ? <LoadingDots/> : languages.save}
                  </button>
                </div>
              </div>
            }
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({admins, auth, roles }) => ({ admins, auth, roles }),
  {createAdmin, getAdminStatuses, updateRole, getRole}
)(Edit)
