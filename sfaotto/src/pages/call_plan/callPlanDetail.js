import React from 'react';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCallPlanResult, getCallPlanDetail, getMerchants, getCallPlanDetailV2 } from '../../actions/call_plan'
import { Lightbox, Pagination, LoadingDots, NotAuthorize } from '../../components'
import axios from '../../actions/config'
import moment from 'moment';
import { ind, en } from '../../languages/call_plan'

// const svgStyle = {
// height: '18px',
// width: '18px'
// }

const style = {
link: {
	cursor: 'pointer'
}
}

class Detail extends React.Component {
state = {
	detail: {},
	sales_id: null,
	sales_name: '',
	sales_phone: '',
	sales_status: '',
	sales_dob: '',
	id_card_pic: '',
	leader_name: '',
	leader_phone: '',
	branch_manager: '',
	branch_office: '',
	sub_area: '',
	cluster: '',
	cluster_coverage_area: '',
	total_merchant: '',
	complete_action: '',
	incomplete_action: '',
	visited_action: '',
	call_plan_date: '',
	success_call: '',
	effective_call: '',
	amount: '',

	photo: '',
	confirmIsOpen: false,
	expandCard: false,
	type: 'success',
	textSuccess: '',
	textError: '',
	languages: {},
	isOpen: false,
	isOpen2: false,
}

componentWillMount() {
	const { auth: {access_token}, getCallPlanDetail, getCallPlanDetailV2 } = this.props

	if (this.props.auth.language === 'in'){
	this.setState({languages: ind.detail})
	} else if (this.props.auth.language === 'en'){
	this.setState({languages: en.detail})
	}

	axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

	getCallPlanDetailV2(this.props.match.params.id)
	.then((data) => {
		this.setState({
			detail: data.data
		})
	})

	this.fetchMerchant(window.location.search)
}

componentDidMount(){
	document.title = "SFA OTTO - Detail Sales"
}

componentDidUpdate(prevProps) {
	// Typical usage (don't forget to compare props):
	if (this.props.location.search !== prevProps.location.search) {
	this.fetchMerchant(this.props.location.search);
	}
}

fetchMerchant = (pageNumber) => {
	let page = "?page=1";

	if(pageNumber){
	page = pageNumber.includes("page") ? pageNumber : "?page=1"
	}

	this.props.getMerchants(page, this.props.match.params.id)
}

render() {
	const { auth, call_plan_merchants } = this.props
	const { 
	detail,
	languages,
	isOpen,
	isOpen2,
	} = this.state

	if (auth.isAuthenticated && (auth.authority["call_plan"] === "" || auth.authority["call_plan"] === "No Access")) {
	return <NotAuthorize />
	}

	return (
	<div className="container mb-5 noSelect">
		<div className="row">

			<div className="col-12 mb-5">
			<h2>{languages.header} (ID - {detail.call_plan_id})</h2>
			</div>

			<div className="col-12 mb-1">
			<div className="row">
				<div className="col-12 mb-3">
					<div className="card mb-4">
					<div className="card-body">
						<div className="col-12">
							<div className="row">
							<div className="col-12 col-lg-9 p-0 text-center d-flex flex-row align-items-center">
								<div className="avatar mr-3 d-flex justify-content-center align-items-center">
									{ detail.photo === '' ?
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
									:
									<img onClick={() => this.setState({isOpen: true})} src={detail.photo} className="avatar justify-content-center align-items-center pointerYes" alt=""/>
									}
									<Lightbox isOpen={isOpen} images={detail.photo} confirmClose={() => this.setState({isOpen: false})}/>
								</div>
								<div className="d-flex flex-column align-items-start">
									<p className="mb-0"><strong>{detail.sales_name}</strong></p>
									<p className="mb-0 text-gray">{languages.idSfa} {detail.sales_id}</p>
								</div>
							</div>
							<div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
								<strong className="mb-0 text-primary"><small>{languages.status}</small></strong>
								<span className={`badge ${detail.sales_status === 'Unregistered' ? 'badge-gray' : 'badge-status'}`}>{detail.sales_status}</span>
							</div>
							</div>
						</div>
					</div>
					<div className="card-footer border-top">
						<div className="col-12">
							<div className="row">
							<div className="col-12 col-lg-6 d-flex flex-column">
								<small><strong className="mb-0">{languages.dob}</strong></small>
								{detail.sales_dob !== "" ? moment(detail.sales_dob, "YYYY-MM-DD").format("DD MMM YYYY") : "-"}
							</div>
							<div className="col-12 col-lg-6 d-flex flex-column">
								<small><strong className="mb-0" >{languages.idCard}</strong></small>
								<div className="d-flex flex-row align-items-center">
									<i onClick={() => this.setState({isOpen2: true})} className="la la-image text-gray mr-2 pointerYes"></i>
									{ detail.id_card_pic === '' ?
									<small className="text-gray mb-0">{languages.didNot}</small>
									:
									<small onClick={() => this.setState({isOpen2: true})} className="text-gray mt-1 pointerYes">Uploaded</small>
									}
									<Lightbox isOpen={isOpen2} images={detail.id_card_pic} confirmClose={() => this.setState({isOpen2: false})}/>
								</div>
							</div>
							</div>
						</div>
					</div>

					</div>

					<div className="card mb-4">
					<div className="card-body">
						<h6>{languages.header2}</h6>
						<div className="col-12 mt-3">
							<div className="row">
							<div className="col-12 col-lg-5 p-lg-0 text-left d-flex flex-column">
								<strong className="mb-0 text-gray"><small>{languages.nameTl}</small></strong>
								<p className="mb-0 canSelect">{detail.leader_name}</p>
							</div>
							<div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
								<strong className="mb-0 text-gray"><small>{languages.hpTl}</small></strong>
								<p className="mb-0">{detail.leader_phone}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<strong className="mb-0 text-gray"><small>{languages.branchMaster}</small></strong>
								<p className="mb-0 canSelect">{detail.branch_manager !== "" ? detail.branch_manager : "-"}</p>
							</div>
							</div>
						</div>
					</div>
					</div>

					<div className="card mb-4">
					<div className="card-body">
						<h6>{languages.header3}</h6>
						<div className="col-12 mt-3">
							<div className="row">
							<div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{languages.kantorCabang}</p>
							</div>
							<div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{detail.branch_office? detail.branch_office : "-"}</p>
							</div>
							</div>
							<div className="row mt-2">
							<div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 ">{languages.subArea}</p>
							</div>
							<div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{detail.sub_area ? detail.sub_area : "-"}</p>
							</div>
							</div>
							<div className="row mt-2">
							<div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{languages.cluster}</p>
							</div>
							<div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{detail.cluster ? detail.cluster : "-"}</p>
							</div>
							</div>
							<div className="row mt-2">
							<div className="col-12 col-lg-4 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{languages.clusterCA}</p>
							</div>
							<div className="col-12 col-lg-8 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0">{detail.cluster_coverage_area ? detail.cluster_coverage_area : "-"}</p>
							</div>
							</div>
						</div>
					</div>
					</div>

					<div className="card mb-2">
					<div className="card-body">
						<h6>{languages.header4}</h6>
						<div className="col-12 mt-3">
							<div className="row mb-3">
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.total}</p>
								<p className="mb-0 text-primary canSelect">{detail.total_merchant}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.completed}</p>
								<p className="mb-0 text-primary canSelect">{detail.complete_action}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.incompleted}</p>
								<p className="mb-0 text-primary canSelect">{detail.incomplete_action}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.visited}</p>
								<p className="mb-0 text-primary canSelect">{detail.visited_action}</p>
							</div>
							</div>
							<div className="row">
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.callPlan}</p>
								<p className="mb-0 text-primary canSelect">{detail.call_plan_date !== "" ? moment(detail.call_plan_date, "YYYY-MM-DD").format("DD MMM YYYY") : "-"}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.successCall}</p>
								<p className="mb-0 text-primary canSelect">{detail.success_call ? detail.success_call : "-"}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.effective}</p>
								<p className="mb-0 text-primary canSelect">{detail.effective_call ? detail.effective_call : "-"}</p>
							</div>
							<div className="col-12 col-lg-3 p-lg-0 text-left d-flex flex-column">
								<p className="mb-0 mb-1">{languages.amount}</p>
								<p className="mb-0 text-primary canSelect">{detail.amount}</p>
							</div>
							</div>
						</div>
					</div>

					<div className="table-fixed">
						<table className="table table-header table-striped">
							<thead>
								<tr>
									<th width="3%">ID</th>
									<th width="10%">{languages.noMerchant}</th>
									<th width="15%">{languages.merchantName}</th>
									<th width="12%">{languages.merchantType}</th>
									<th width="10%">{languages.priority}</th>
									<th width="8%">{languages.status}</th>
									<th width="12%">{languages.merchantStatus}</th>
									<th width="10%">{languages.effective}</th>
									<th width="10%">{languages.amount}</th>
									<th width="10%">{languages.actionDate}</th>
								</tr>
							</thead>
							{call_plan_merchants.loading ?
								<tbody>
									<tr>
									<td colSpan={9}>
										<div className="d-flex justify-content-center align-items-center">
											<LoadingDots color="black" />
										</div>
									</td>
									</tr>
								</tbody>
								:
								<tbody>
									{call_plan_merchants.data && call_plan_merchants.data.map((merchant, idx) => {
									// let merchantStatus

									// if(merchant.status === "Inactive"){
									//   merchantStatus = "badge-gray"
									// }else{
									//   merchantStatus = "badge-status"
									// }

									return(
										<tr key={idx}>
											{merchant.status !== "Incompleted" 
											?<td><Link to={`/call-plan/${detail.call_plan_id}/merchant/${merchant.id}`} style={style.link}>{merchant.id}</Link></td>
											:<td className="text-capitalize">{merchant.id}</td>
											}
											<td className="text-capitalize">{merchant.merchant_phone}</td>
											<td className="text-capitalize">{merchant.merchant_name}</td>
											<td className="text-capitalize">{merchant.merchant_type}</td>
											<td className="text-capitalize">{merchant.priority}</td>
											<td className="text-capitalize">{merchant.status}</td>
											<td className="text-capitalize">{merchant.merchant_status}</td>
											<td className="text-capitalize">{merchant.effective_call}</td>
											<td className="text-capitalize">{merchant.amount}</td>
											<td className="text-capitalize">{merchant.action_date} </td>
										</tr>
									)
									})}
								</tbody>
							}
							{(!call_plan_merchants.loading && isEmpty(call_plan_merchants.data)) &&
									<tbody>
									<tr>
										<td colSpan={9} className="text-center">{languages.tNoDate}</td>
									</tr>
									</tbody>
							}
						</table>
					</div>

					<div className="card-body border-top">
						<Pagination pages={call_plan_merchants.meta} routeName={`call-plan/${detail.call_plan_id}`} maxRaw='10' handleClick={(pageNumber) => this.fetchMerchant(pageNumber)} />
					</div>

					</div>
				</div>

				<div className="col-12 mb-0">
					<hr className="content-hr"/>
					<div className="col-12">
						<div className="col-12 form-inline">
							<div className="col-lg-10">
							<Link to="/call-plan" className="btn btn-default w-20">{languages.back}</Link>
							</div>
						</div>
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
({auth, call_plan_merchants }) => ({ auth, call_plan_merchants }),
{getCallPlanResult, getCallPlanDetail, getCallPlanDetailV2, getMerchants}
)(Detail)
