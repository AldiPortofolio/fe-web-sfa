import React from 'react';
// import { find, includes } from 'lodash'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import { isEmpty } from 'lodash'
import { getPositionSaleDetail, verifySale } from '../../actions/sale'
// import { getCities } from '../../actions/city'
// import { getDistricts } from '../../actions/district'
// import { getVillages } from '../../actions/village'
import { ModalConfirm } from '../../components'
import axios from '../../actions/config'
// import moment from 'moment';

// import { IconCollapse } from '../../components/Icons'

class Detail extends React.Component {
  state = {
    id: null,
    salesman: {},
    positions: {},
    upload: null,
    check: false,
    confirmIsOpen: false,
    expandCard: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    status: '',
    regionalProvince: '',
    regionalCity: ''
  }

  componentWillMount() {
    const { auth: {access_token}, getPositionSaleDetail } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    getPositionSaleDetail(this.props.match.params.id)
      .then(({data: {salesmen}}) => {
        this.setState({salesman: salesmen, positions: salesmen.area_positions})
      })
  }

  getData = async () => {
    try {
      await this.props.getCountries()
      await this.props.getCities()
      await this.props.getProvinces()
    } catch(e) {
      console.log(e)
    }
  }

  componentDidMount(){
    document.title = "SFA OTTO - Detail Sales"
  }

  render() {
    // const { auth, sales, history, verifySale } = this.props
    const { history } = this.props
    const {
      // upload,
      salesman,
      // positions,
      confirmIsOpen,
      type,
      // check,
      textSuccess,
      textError
    } = this.state
    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            confirmSuccess={() => history.push('/sales/verifications')}
            textSuccess={textSuccess}
            textError={textError}
          />

          <div className="col-12 mb-5">
            <h2>Sales Position Detail</h2>
          </div>

          <div className="col-12 mb-3">
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                          <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </div>
                          <div className="d-flex flex-column align-items-start">
                            <p className="mb-0"><strong>{salesman.sales_name}</strong></p>
                            <p className="mb-0 text-gray">ID SFA {salesman.sfa_id}</p>
                          </div>
                        </div>
                        {/*<div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                          <strong className="mb-0 text-primary"><small>Status</small></strong>
                          <span className={`badge ${status === 'Unregistered' ? 'badge-gray' : 'badge-status'}`}>{status}</span>
                        </div>*/}
                      </div>
                    </div>
                  </div>
                  <div className="card-body mb-0 border-top">
                    <div className="row">
                      <div className="col-6">
                        <label>
                          <small>Jabatan Fungsional</small>
                        </label>
                        <p className="mb-0">{salesman.functional_position}</p>
                      </div>
                      <div className="col-6">
                        <label>
                          <small>Jabatan Title</small>
                        </label>
                        <p className="mb-0">{salesman.occupation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, sales}) => ({ auth, sales }),
  {verifySale, getPositionSaleDetail}
)(Detail)
