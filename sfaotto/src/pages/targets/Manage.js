import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createTargetType, getTargetTypes, updateTargetType, deleteTargetType } from '../../actions/manage_target_type';
import { NotAuthorize, ModalConfirm, ModalDelete, LoadingSpinner, LoadingDots } from '../../components'
// import { formatNumber, unformatNumber } from '../../formatter';
import { ind, en } from '../../languages/target'

const initValue = {
  id: '',
  target_type: '',
  target_parameter: '',
  type: '',
  editTarget: false,
  confirmIsOpen: false,
  modalDeleteIsOpen: false,
  resultIsOpen: false,
  isLoading: false,
  textSuccess: '',
  textError: '',
  textReason: '',
  intervalId: 0,
  languages: {}
}

class Manage extends React.Component {
  state = initValue

  componentDidMount(){
    document.title = "SFA OTTO - Set Target"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.manage})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.manage})
    }

    this.props.getTargetTypes();
  }

  setCollapse = (collapse) => {
    if (this.state.collapse === collapse) {
      collapse = ''
    }
    this.setState({collapse})
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
        clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }
  
  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }

  render() {
    const {
      id,
      target_type,
      target_parameter,
      type,
      editTarget,
      confirmIsOpen,
      modalDeleteIsOpen,
      resultIsOpen,
      textSuccess,
      textError,
      textReason,
      isLoading,
      languages } = this.state
    const { auth, manage_target_types, createTargetType, getTargetTypes, updateTargetType, deleteTargetType } = this.props

    if (auth.isAuthenticated && (auth.authority["manage_target"] === "" || auth.authority["manage_target"] === "No Access")) {
      return <NotAuthorize />
    }

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
            textReason={textReason}
          />

          <ModalDelete
            confirmIsOpen={modalDeleteIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmClose={() => this.setState({modalDeleteIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({modalDeleteIsOpen: false}, () => {
                deleteTargetType({target_type_id: id})
                  .then((data) => this.setState({resultIsOpen: true, type: 'success'}, () => getTargetTypes()))
                  .catch(e => this.setState({resultIsOpen: true, type: 'error'}))
              })
            }}
          />

          <div className="col-12 mb-4">
            <h2>{languages.header}</h2>
          </div>

          <div className="col-12 col-lg-8 mb-4">
            <div className="card mb-4">
              <form className="w-100" onSubmit={(e) => {
                e.preventDefault()
                if(target_type && target_parameter){
                  this.setState({isLoading: true})

                  if(editTarget){
                    updateTargetType({name: target_type, parameter: target_parameter, target_type_id: id})
                      .then(data => {
                        if(data.meta.status === false){
                          this.setState({isLoading: false, target_type: '', target_parameter: '', confirmIsOpen: true, type: 'error', textError: data.meta.message})
                        }else{
                          this.setState({id: '', target_type: '', target_parameter: '', editTarget: false, isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: languages.sukses}, () => getTargetTypes())
                        }
                      })
                      .catch(e => {
                        this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: languages.gagal})
                      })
                  }else{
                    createTargetType({name: target_type, parameter: target_parameter, target_type_id: id})
                      .then(data => {
                        if(data.meta.status === false){
                          this.setState({isLoading: false, target_type: '', target_parameter: '', confirmIsOpen: true, type: 'error', textError: data.meta.message})
                        }else{
                          this.setState({id: '', target_type: '', target_parameter: '', editTarget: false, isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: languages.sukses}, () => getTargetTypes())
                        }
                      })
                      .catch(e => {
                        this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: languages.gagal})
                      })
                  }
                }else{
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: languages.gagal, textReason: languages.tidakTerisi})
                }
              }}>
                <div className="card-body">
                  <h6>{editTarget ? "Edit" : "Create"} {languages.target}</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.jenis}</label>
                        <input onChange={e => this.setState({target_type: e.target.value})} value={target_type} type="text" name="target_type" className="form-control form-control-line" placeholder="Masukan Jenis Target (ex: akuisisi, penjualan)" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.parameter}</label>
                        <input onChange={e => this.setState({target_parameter: e.target.value})} value={target_parameter} type="text" name="target_parameter" className="form-control form-control-line" placeholder="Masukan Parameter Target (ex: buah, rupiah)" />
                      </div>
                    </div>
                  </div>
                </div>
                { auth.authority["manage_target"] === "Full Access" &&
                  <div className="card-body border-top d-flex justify-content-end">
                    {editTarget && <button className={`btn btn-outline-danger btn-rounded mr-3 `} onClick={() => {
                      this.setState({id: '', target_type: '', target_parameter: '', editTarget: false})
                    }}>{languages.cancel}</button>}
                    <button className={`btn btn-danger btn-rounded ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                      { isLoading ? <LoadingDots/> : languages.save}
                    </button>
                  </div>
                }
              </form>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h6>{languages.header2}</h6>
              </div>

              <div className="table-fixed">
                <div className="table-body">
                  <table className="table table-header table-striped">
                    <thead>
                      <tr>
                        <th width="10%">
                          <input type="checkbox"/>
                        </th>
                        <th width="40%">{languages.jenis}</th>
                        <th width="40%">{languages.parameter}</th>
                        <th width="10%"></th>
                      </tr>
                    </thead>
                    {manage_target_types.loading ?
                      <tbody>
                        <tr>
                          <td colSpan={4}><LoadingSpinner /></td>
                        </tr>
                      </tbody>
                      :
                      <tbody>
                      { manage_target_types.data.length > 0 ? (
                        manage_target_types.data.map((target, idx) => {
                          let target_type = target.name.split("(")
                          let target_name = target_type[0]
                          let target_parameter = target_type[1].replace(/[^a-zA-Z 0-9]/g, "")

                          return(
                            <tr key={idx}>
                              <td>
                                <input type="checkbox"/>
                              </td>
                              <td>{target_name}</td>
                              <td>{target_parameter}</td>
                              { auth.authority["manage_target"] === "Full Access" &&
                                <td className="d-flex align-items-center justify-content-center">
                                  <button className="px-2 btn-circle"
                                    style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                    onClick={() => this.setState({id: target.id, target_type: target_name, target_parameter: target_parameter, editTarget: true}, () => this.scrollToTop())}
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                  </button>
                                  <button className="px-2 btn-circle text-danger"
                                    style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                    onClick={() => this.setState({id: target.id, modalDeleteIsOpen: true})}
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                  </button>
                                </td>
                              }
                            </tr>
                          )
                        }))
                        :
                        (
                          <tr>
                            <td colSpan={4} className="text-center">{languages.no}</td>
                          </tr>
                        )
                      }
                      </tbody>
                    }
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, manage_target_types}) => ({ auth, manage_target_types }),
  {createTargetType, getTargetTypes, updateTargetType, deleteTargetType}
)(Manage)
