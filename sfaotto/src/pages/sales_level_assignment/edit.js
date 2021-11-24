import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { findSalesLevel } from '../../actions/sales_level';
import { detailSalesLevelAssignment, editSalesLevelAssignment } from '../../actions/sales_level_assignment';
import { findSalesByPhone, getSale } from '../../actions/sale';
import { NotAuthorize, ModalConfirm, SelectRequired, Lightbox } from '../../components';
import axios from '../../actions/config';
import Translator from '../../languages/Translator';
import { debounce, find } from 'lodash';

class Edit extends React.Component {
  state = {
    salesman: {},
    sales_level: '',
    sales_level_list: [],
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    tPages: {},
    tGeneral: {},
    isOpen: false,
  }

  componentWillMount() {
    const { auth: {access_token, language}, match, detailSalesLevelAssignment, findSalesLevel, getSale } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (language === 'in'){
        this.setState({tPages: Translator('In').pages.salesLevelAssignment, tGeneral: Translator('In').general})
    } else if (language === 'en'){
        this.setState({tPages: Translator('En').pages.salesLevelAssignment, tGeneral: Translator('En').general})
    }
  
    detailSalesLevelAssignment(match.params.id)
    .then((data) => {
      if(data.meta.status === false){
				this.setState({confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: data.meta.message})
			}else{
        let all = data.data.sales_level_assignment

        getSale(all.sales_id) // get sales detail
        .then((data) => {
          this.setState({salesman: data.data})
        })

        findSalesLevel('')
        .then((data) => {
            let new_sales_level = []
            data.data.forEach((level) => {
              new_sales_level.push({value: level.id, label: `${level.name}`})
            })

            this.setState({sales_level: find(new_sales_level, {value: all.sales_level_id})})
        })

      }
        
    })
  }

  componentDidMount(){
    document.title = "SFA OTTO - Edit Sales Level Assignment"
    this.filterSalesLevel('')
  }

  filterSalesLevel = debounce((inputValue) => {
    this.props.findSalesLevel(inputValue)
    .then((data) => {
      let new_sales_level = []
      data.data.forEach((level) => {
        new_sales_level.push({value: level.id, label: `${level.name}`})
      })

      this.setState({sales_level_list: new_sales_level})
    })
  });

  render() {
    const { auth, history, match, editSalesLevelAssignment } = this.props
    const {
      salesman,
      sales_level,
      sales_level_list,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      tPages, 
      tGeneral,
      isOpen } = this.state

    if (auth.isAuthenticated && (auth.authority["sales_level_assignment"] === "" || auth.authority["sales_level_assignment"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container mb-5">

        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/sales/sales_level_assignment')}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault()

            editSalesLevelAssignment({
              sales_id: salesman.id,
              sales_level_id: sales_level.value
            })
            .then(data => {
              if(data.meta.status === false){
                this.setState({confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: data.meta.message})
              }else{
                this.setState({confirmIsOpen: true, type: 'success', textError: '', textSuccess: data.meta.message})
              }
            })
            .catch(e => {
              this.setState({confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: e.message})
            })
          }}>
          <div className="row">

            <div className="col-12 mb-4">
              <h2>{tPages.titleEdit} (ID-{match.params.id})</h2>
            </div>

            <div className="col-12 col-lg-8 mb-4">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 col-lg-9 text-center d-flex flex-row align-items-center">
                        <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                          { salesman.photo === '' ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            :
                            <img onClick={() => this.setState({isOpen: true})} src={salesman.photo} className="avatar justify-content-center align-items-center pointerYes" alt=""/>
                          }
                          <Lightbox isOpen={isOpen} images={salesman.photo} confirmClose={() => this.setState({isOpen: false})}/>
                        </div>
                        <div className="d-flex flex-column align-items-start">
                          <p className="mb-0"><strong>{salesman.first_name} {salesman.last_name}</strong></p>
                          <p className="mb-0 text-gray">ID SFA {salesman.sfa_id}</p>
                        </div>
                      </div>
                      <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                        <strong className="mb-0 text-primary"><small>Status</small></strong>
                        <span className={`badge ${salesman.status === 'Unregistered' ? 'badge-gray' : 'badge-status'}`}>{salesman.status}</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="card-body border-top">
                  <div className="col-12">
                    <div className="w-50">
                      <label>{tPages.salesLevel}</label>
                      <div className="custom-select-line">
                        <SelectRequired placeholder="Type sales level" value={sales_level} options={sales_level_list} 
                          onChange={(sales_level) => {
                            this.setState({sales_level})
                          }} 
                          onInputChange={debounce((value) => {
                            this.filterSalesLevel(value);
                          }, 500)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-12 mb-3">
              <hr className="content-hr"/>
              <div className="form-group d-flex justify-content-between">
                <Link to="/sales/sales_level_assignment" className="btn btn-outline-danger">{tGeneral.cancel}</Link>
                {(auth.authority["sales_level_assignment"] === "Full Access") &&
                  <button type="submit" className="btn btn-danger">{tGeneral.save}</button>
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  ({auth, sales_level_assignment, sales}) => ({ auth, sales_level_assignment, sales }),
  {detailSalesLevelAssignment, findSalesLevel, findSalesByPhone, getSale, editSalesLevelAssignment}
)(Edit)
