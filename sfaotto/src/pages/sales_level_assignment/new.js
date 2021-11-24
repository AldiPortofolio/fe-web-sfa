import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { findSalesLevel } from '../../actions/sales_level';
import { createSalesLevelAssignment, findSalesLevelAssignmentByPhone } from '../../actions/sales_level_assignment';
import { findSalesByPhone } from '../../actions/sale';
import { NotAuthorize, ModalConfirm, SelectRequired, BulkErrorFile } from '../../components';
import axios from '../../actions/config';
import Translator from '../../languages/Translator';
import { debounce } from 'lodash';

class New extends React.Component {
  state = {
    sales_number_phone: '',
    sales_level: [],
    sales_level_list: [],
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    tPages: {},
    tGeneral: {},
    salesman: [],
    selectedPhone: '',
    sales: ''
  }

  componentWillMount() {
    const { auth: {access_token, language} } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (language === 'in'){
      this.setState({tPages: Translator('In').pages.salesLevelAssignment, tGeneral: Translator('In').general})
    } else if (language === 'en'){
      this.setState({tPages: Translator('En').pages.salesLevelAssignment, tGeneral: Translator('En').general})
    }

    this.filterSalesLevel('')
    this.filterSalesman('')
  }

  componentDidMount(){
    document.title = "SFA OTTO - Add Sales Level Assignment"
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

  filterSalesman = debounce((inputValue) => {
    this.props.findSalesLevelAssignmentByPhone(inputValue)
    .then((data) => {
      let newSales = []
      if (data.data !== null) {
        data.data.forEach((sales) => {
          newSales.push({value: sales.id, label: `${sales.sales}`})
        })
      }

      this.setState({salesman: newSales})
    })
  });

  render() {
    const { auth, history, createSalesLevelAssignment } = this.props
    const {
      salesman,
      sales,
      sales_level,
      sales_level_list,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      tPages, 
      tGeneral } = this.state

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

            createSalesLevelAssignment({
              sales_id: sales.value,
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
              <h2>{tPages.titleAdd}</h2>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-8 mb-4">
                  <div className="card mb-4">
                    <div className="card-body">
                      <h6>{tPages.detail}</h6>
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="form-group w-50">
                            <label>{tPages.salesNumberPhone}</label>
                            <SelectRequired placeholder="Type sales phone" value={sales} options={salesman} 
                              onChange={(sales) => {
                                this.setState({sales})
                              }} 
                              onInputChange={debounce((value) => {
                                if(value !== ''){this.filterSalesman(value)}
                              }, 500)} 
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-12">
                          <div className="form-group w-50">
                            <label>{tPages.salesLevel}</label>
                            <div className="custom-select-line">
                              <SelectRequired placeholder="Type sales level" value={sales_level} options={sales_level_list} 
                                onChange={(sales_level) => {
                                  this.setState({sales_level})
                                }} 
                                onInputChange={debounce((value) => {
                                  if(value !== ''){this.filterSalesLevel(value)}
                                }, 500)} 
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <BulkErrorFile title={"Sales Level Assignment"} actionUrl={"sales_level_assignment"} history={history} path={"/sales"}/>
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
  ({auth}) => ({ auth }),
  {createSalesLevelAssignment, findSalesLevel, findSalesByPhone, findSalesLevelAssignmentByPhone}
)(New)
