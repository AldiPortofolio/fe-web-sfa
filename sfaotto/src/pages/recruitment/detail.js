import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getRegions } from '../../actions/region'
import { searchBranch } from '../../actions/branch'
import { searchAreas, } from '../../actions/area'
import { searchSubAreas } from '../../actions/subarea'
import { getSale, getSalesRoles, findSales, getSalesManagementDetail, positionAssignment, relationCheck } from '../../actions/sale'
import { findInstitution, createNewRecruitment, getRecruitment } from '../../actions/recruitment'
import { findSAC } from '../../actions/subarea'
import { findProvince } from '../../actions/province'
import { findCity } from '../../actions/city'
import { findDistrict } from '../../actions/district'
import { findVillage } from '../../actions/village'
import { NotAuthorize, Lightbox } from '../../components'
import { ind, en } from '../../languages/recruitment'

class AssignmentNew extends React.Component {
	state = {
		confirmIsOpen: false,
		expandCard: false,
		type: 'success',
		textSuccess: '',
		textError: '',
		textReason: '',
        language: {},
        id: '',
        name: '',
        photo: '',
		owner_name: '',
		institution_code: '',
		customer_code: '',
        phone_number: '',
        status: '',
		address: '',
		longitude: '',
		latitude: '',
        sub_area_channel_name: '',
        province_name: '',
        city_name: '',
        district_name: '',
        village_name: '',
        lightboxIsOpen: false,
	}

	componentDidMount(){
		document.title = "SFA OTTO - New Recruitment"
		if (this.props.auth.language === 'in'){
			this.setState({language: ind.new})
		} else if (this.props.auth.language === 'en'){
			this.setState({language: en.new})
        }
        
        this.getDataDetail(this.props.match.params.id);
    }

    getDataDetail(id) {
        this.props.getRecruitment(id)
		.then((data) => {
             let datas = data.data
             
             this.setState({
                ...datas,
              })
		})
    }

	render() {
		const { auth, } = this.props
		const { 
            id,
			name,
            owner_name,
            photo,
			institution_code,
            customer_code,
            status,
			phone_number,
			address,
			longitude,
            latitude,
            sub_area_channel_name,
            province_name,
            city_name,
            district_name,
            village_name,
            lightboxIsOpen,
			language } = this.state

		if (auth.authority["recruitment"] === "" || auth.authority["recruitment"] === "No Access") {
			return <NotAuthorize />
		}

		return (
            // <div className="container mb-5 noSelect">
            <div className="container mb-5">
              <div className="row">
                {/* <ModalConfirm
                  confirmIsOpen={confirmIsOpen}
                  type={type}
                  confirmClose={() => this.setState({confirmIsOpen: false})}
                  confirmSuccess={() => history.push('/sales/verifications')}
                  textSuccess={textSuccess}
                  textError={textError}
                /> */}
      
                <div className="col-12 mb-5">
                  <h2>{language.headerDetail} (ID - {id})</h2>
                </div>
      
                <div className="col-12 mb-3">
                  <div className="row">
                    <div className="card mb-4" style={{minWidth: '50rem'}}>
                        <div className="card-body">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
                                    <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                                        { photo === '' ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        :
                                        <img onClick={() => this.setState({lightboxIsOpen: true})} src={photo} className="avatar justify-content-center align-items-center pointerYes" alt=""/>
                                        }
                                        <Lightbox isOpen={lightboxIsOpen} images={photo} confirmClose={() => this.setState({lightboxIsOpen: false})}/>
                                    </div>
                                    <div className="d-flex flex-column align-items-start">
                                        <p className="mb-0"><strong>{name || '-'}</strong></p>
                                        <p className="mb-0 text-gray">{language.noCustomer}: {customer_code  || '-'}</p>
                                    </div>
                                    </div>
                                    <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                                    <strong className="mb-0 text-primary"><small>Status</small></strong>
                                    <span className={`badge ${status === 'Pending' ? 'badge-gray' : 
                                        status === 'Activated' ? 'badge-status' : status === 'Registered' ? 'badge-primary' : 'badge-danger'}`}>{status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer border-top" style={{padding: '0.75rem 0.2rem'}}>
                            <div className="col-12">
                                <div className="row mt-3">
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.ownerName}</p>
                                        <strong className="mb-0">{owner_name || '-'}</strong>
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.noHp}</p>
                                        <strong className="mb-0">{phone_number || '-'}</strong>
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.institusi}</p>
                                        <strong className="mb-0">{institution_code || '-'}</strong>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.province}</p>
                                        <strong className="mb-0">{province_name || '-'}</strong>
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.city}</p>
                                        <strong className="mb-0">{city_name || '-'}</strong>
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.district}</p>
                                        <strong className="mb-0">{district_name || '-'}</strong>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.village}</p>
                                        <strong className="mb-0">{village_name || '-'}</strong>
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
										<p className="mb-0 text-gray mb-1">Longlat</p>
										{latitude && longitude ?
											<strong className="mt-0"><a href={'https://www.google.com/maps/search/?api=1&query='+ latitude + ',' + longitude} target="_blank" className="btn btn-link text-right btn-sm" rel="noopener noreferrer"
												style={{fontWeight: 'bold', border: 'none', padding: '0 0'}}>{latitude}, {longitude}</a>
											</strong>
										:
											<strong className="mt-0">-</strong>
										}
                                    </div>
                                    <div className="col-12 col-lg-4 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.sac}</p>
                                        <strong className="mb-0">{sub_area_channel_name || '-'}</strong>
                                    </div>
                                </div>
                                <div className="row mt-3 mb-3">
                                    <div className="col-12 col-lg-12 d-flex flex-column">
                                        <p className="mb-0 text-gray mb-1">{language.address}</p>
                                        <strong className="mb-0">{address || '-'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              
                <hr className="content-hr"/>
                <div className="col-12 mb-0">
                  <div className="col-12 form-inline">
                    <div className="col-lg-10">
                      <Link to="/recruitment" className="btn btn-default w-20">Back</Link>
                    </div>
                  </div>
                </div>
              
              
              </div>
            </div>
        );
	}
}

export default connect(
	({auth, sales, regions, branches, areas}) => ({ auth, sales, regions, branches, areas }),
	{ 	createNewRecruitment, findInstitution, findSAC, findProvince, findCity, findDistrict, findVillage, 
		getSale, getSalesRoles, findSales, getSalesManagementDetail, getRecruitment,
		getRegions, searchBranch, searchAreas, searchSubAreas, positionAssignment, relationCheck
	}
)(AssignmentNew)
