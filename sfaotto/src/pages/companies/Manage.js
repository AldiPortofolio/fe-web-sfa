import React from 'react';
// import { Link } from 'react-router-dom';
// import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { createCompany, getCompanies, updateCompany, deleteCompany } from '../../actions/company';
import { NotAuthorize, ModalConfirm, ModalDelete, LoadingSpinner, LoadingDots } from '../../components'
// import { formatNumber, unformatNumber } from '../../formatter';
import { ind, en } from '../../languages/companies'

const initValue = {
  id: '',
  company_name: '',
  company_code: '',
  email_verification: false,
  type: '',
  editCompany: false,
  confirmIsOpen: false,
  modalDeleteIsOpen: false,
  resultIsOpen: false,
  isLoading: false,
  textSuccess: '',
  textError: '',
  textReason: '',
  languages: {}
}

class Manage extends React.Component {
  state = initValue

  componentDidMount(){
    document.title = "SFA OTTO - Manage Company"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.manage})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.manage})
    }

    this.props.getCompanies();
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
      company_name,
      company_code,
      email_verification,
      type,
      editCompany,
      confirmIsOpen,
      modalDeleteIsOpen,
      resultIsOpen,
      textSuccess,
      textError,
      textReason,
      isLoading,
      languages } = this.state
    const { auth, companies, createCompany, getCompanies, updateCompany, deleteCompany } = this.props

    if (auth.isAuthenticated && (auth.authority["manage_company"] === "" || auth.authority["manage_company"] === "No Access")) {
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
                deleteCompany(id)
                  .then((data) => this.setState({resultIsOpen: true, type: 'success'}, () => getCompanies()))
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

                if(company_name && (company_code !== '')){
                  this.setState({isLoading: true})

                  if(editCompany){
                    updateCompany(id, {name: company_name, code: company_code, email_verification: email_verification})
                      .then(data => {
                        if(data.meta.status === false){
                          this.setState({isLoading: false, company_name: '', company_code: '', email_verification: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                        }else{
                          this.setState({id: '', editCompany: false, company_name: '', company_code: '', isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: languages.sukses}, () => getCompanies())
                        }
                      })
                      .catch(e => {
                        this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: languages.gagal})
                      })
                  }else{
                    createCompany({name: company_name, code: company_code, email_verification: email_verification})
                      .then(data => {
                        if(data.meta.status === false){
                          this.setState({isLoading: false, company_name: '', company_code: '', email_verification: false, confirmIsOpen: true, type: 'error', textError: data.meta.message})
                        }else{
                          this.setState({id: '', editCompany: false, company_name: '', company_code: '', isLoading: false, confirmIsOpen: true, type: 'success', textSuccess: languages.sukses}, () => getCompanies())
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
                  <h6>{editCompany ? "Edit" : "Create"} Company</h6>
                  <div className="row mt-4">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.id}</label>
                        <input onChange={e => this.setState({company_code: e.target.value})} value={company_code} type="text" name="company_name" className="form-control form-control-line" placeholder="ID Company" />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label>{languages.name}</label>
                        <input onChange={e => this.setState({company_name: e.target.value})} value={company_name} type="text" name="company_code" className="form-control form-control-line" placeholder="Company Name" />
                      </div>
                    </div>
                  </div>
                </div>
                { auth.authority["manage_company"] === "Full Access" &&
                  <div className="card-body border-top d-flex justify-content-between">
                    <div className="form-group form-check d-flex align-items-center mb-0">
                      <input type="checkbox" className="form-check-input mt-0" id="emailVerification" checked={email_verification} onChange={(e) => {
                        this.setState({ email_verification: e.target.checked })
                        console.log(e.target.checked)
                      }}/>
                      <label className="form-check-label" htmlFor="emailVerification">{languages.email}</label>
                    </div>
                    <div className="button-actions">
                      {editCompany && <button className={`btn btn-outline-danger btn-rounded mr-3 `} onClick={() => {
                        this.setState({id: '', company_name: '', company_code: '', editCompany: false})
                      }}>{languages.cancel}</button>}
                      <button className={`btn btn-danger btn-rounded ${(isLoading) ? 'disabled' : ''}`} disabled={(isLoading)}>
                        { isLoading ? <LoadingDots/> : languages.save}
                      </button>
                    </div>
                  </div>
                }
              </form>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h6>{languages.header2}</h6>
              </div>

              <div className="table-fixed">
                <table className="table table-header table-striped">
                  <thead>
                    <tr>
                      <th width="10%">
                        <input type="checkbox"/>
                      </th>
                      <th width="40%">{languages.id}</th>
                      <th width="40%">{languages.name}</th>
                      <th width="10%"></th>
                    </tr>
                  </thead>
                  {companies.loading ?
                    <tbody>
                      <tr>
                        <td colSpan={4}><LoadingSpinner /></td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                    { companies.data.length > 0 ? (
                      companies.data.map((company, idx) => (
                        <tr key={idx}>
                          <td>
                            <input type="checkbox"/>
                          </td>
                          <td>{company.code}</td>
                          <td>{company.name}</td>
                          { auth.authority["manage_company"] === "Full Access" ?
                            <td className="d-flex align-items-center justify-content-center">
                              <button className="px-2 btn-circle"
                                style={{cursor: 'pointer', color: '#007bff'}}
                                onClick={() => this.setState({id: company.id, company_code: company.code, company_name: company.name, editCompany: true}, () => this.scrollToTop())}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                              </button>
                              <button className="px-2 btn-circle"
                                style={{cursor: 'pointer', color: '#007bff'}}
                                onClick={() => this.setState({id: company.id, modalDeleteIsOpen: true})}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </button>
                            </td>
                            :
                            <td></td>
                          }
                        </tr>
                      )))
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
    );
  }
}

export default connect(
  ({auth, companies}) => ({ auth, companies }),
  {createCompany, getCompanies, updateCompany, deleteCompany}
)(Manage)
