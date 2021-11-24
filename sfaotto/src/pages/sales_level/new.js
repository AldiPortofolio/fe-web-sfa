import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSalesLevel } from '../../actions/sales_level';
import { NotAuthorize, ModalConfirm } from '../../components';
import axios from '../../actions/config';
import Translator from '../../languages/Translator';


class New extends React.Component {
  state = {
    name: '',
    total_merchant_visit: '',
    description: '',
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    tPages: {},
    tGeneral: {},
  }

  componentWillMount() {
    const { auth: {access_token} } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
  }

  componentDidMount(){
    document.title = "SFA OTTO - Add Sales Level"

    if (this.props.auth.language === 'in'){
      this.setState({tPages: Translator('In').pages.salesLevel, tGeneral: Translator('In').general})
    } else if (this.props.auth.language === 'en'){
      this.setState({tPages: Translator('En').pages.salesLevel, tGeneral: Translator('En').general})
    }
  }

  dateValidation = (inputDate, event_date) => {

    if (inputDate < event_date) {
      this.setState({dateValidate: 1})
    } else {
      this.setState({dateValidate: 0})
    }
  }

  render() {
    const { auth, createSalesLevel, history } = this.props
    const {
      name,
      total_merchant_visit,
      description,

      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      tPages, 
      tGeneral } = this.state

    if (auth.isAuthenticated && (auth.authority["sales_level"] === "" || auth.authority["sales_level"] === "No Access")) {
      return <NotAuthorize />
    }

    const style = {
      minHeight: "100px"
    }

    return (
      <div className="container mb-5">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/system-configuration/sales-level')}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault()

            createSalesLevel({
              name,
              total_merchant_visit: parseInt(total_merchant_visit),
              description
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

            <div className="col-12 col-lg-8 mb-4">
              <div className="card mb-4">
                <div className="card-body">
                    <h6>{tPages.detail}</h6>
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{tPages.levelName}</label>
                        <input 
                        onChange={e => this.setState({name: e.target.value})} 
                        value={name} type="text" name="name" 
                        className="form-control form-control-line" 
                        placeholder={tGeneral.input+ ' ' + tPages.levelName}
                        maxLength="25"
                        required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{tPages.totalMerchantVisit}</label>
                        <input 
                        onChange={e => {
                          if (isNaN(Number(e.target.value))) {
                            return
                          }
                          this.setState({total_merchant_visit: e.target.value})
                        }} 
                        value={total_merchant_visit} type="text" name="total" 
                        className="form-control form-control-line" 
                        placeholder="Masukan Total Merchant Visit"
                        maxLength="2"
                        required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group w-50">
                        <label>{tGeneral.desc}</label>
                        <textarea className="form-control form-control-line" style={style} value={description} placeholder='Enter Description' onChange={e => {
                            this.setState({description: e.target.value})
                          }}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mb-3">
              <hr className="content-hr"/>
              <div className="form-group d-flex justify-content-between">
                <Link to="/system-configuration/sales-level" className="btn btn-outline-danger">{tGeneral.cancel}</Link>
                {(auth.authority["sales_level"] === "Full Access") &&
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
  {createSalesLevel}
)(New)
