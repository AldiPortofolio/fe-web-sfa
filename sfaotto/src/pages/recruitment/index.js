import React from 'react';
// import { range } from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getRecruitments, findInstitution } from '../../actions/recruitment'
import { findSAC, getSubareas } from '../../actions/subarea'
import { ModalDelete, LoadingDots, SelectComponent, Pagination, SelectAsync } from '../../components'
import { IconDownload } from '../../components/Icons'
import axios from '../../actions/config'
import { NEWAPI_V2 } from '../../actions/constants'
import { ind, en } from '../../languages/recruitment'

var dateNow = new Date()
var dateNow2 = moment(dateNow, 'DDMMYYYY')
dateNow2 = dateNow2.format('DDMMYYYY')

const statuses = [
    {value: 'Activated', label: 'Activated'},
    {value: 'Registered', label: 'Registered'}, 
    {value: 'Pending', label: 'Pending'}, 
    {value: 'Failed', label: 'Failed'}
]

const initState = {
    disabledStatusExport: false,
    id: '',
    name: '',
    phone_number: '',
    customer_code: '',
    institution_code: '',
    sub_area_channel_name: '',
    status: '',
    selectedReviews: [],
    selectedFilter: [],
    review_ids: [],
    confirmIsOpen: false,
    resultIsOpen: false,
    confirmText: '',
    resultText: '',
    type: 'success',
    page: 1,
    limit: 25,
    languages: {},
    action: '',
    selectThisPage: false,
    selectAll: false,
    countAll: 0,
    selectAllHeader: false,
    subAreaChannels: [],
    institutions: [],
}

class Index extends React.Component {
    state = initState

    componentWillMount(){
        document.title = "SFA OTTO - New Recruitments List"

        if (this.props.auth.language === 'in'){
            this.setState({languages: ind.list})
        } else if (this.props.auth.language === 'en'){
            this.setState({languages: en.list})
        }

        this.fetchRecruitment(window.location.search)
        this.props.getRecruitments()
        this.filterSubAreaChannel("")
        this.filterInstitusi("")
    }

    componentDidUpdate(prevProps) {

        // Typical usage (don't forget to compare props):
        if (this.props.location.search !== prevProps.location.search) {
          this.fetchRecruitment(this.props.location.search);
        }
      }

    export = (req) => {
        const { id, phone_number, customer_code, name, status, sub_area_channel_name, institution_code} = this.state

        axios.post(NEWAPI_V2 + `/merchants-new-recruitment/export`, {id: id.toString(), phone_number, customer_code , sub_area_channel_name, name, status, institution_code})
            .then(response => {
                this.setState({disabledStatusExport: false})
                const bstr = atob(response.data.data)
                const byteNumbers = new Array(bstr.length);
                for (let i = 0; i < bstr.length; i++) {
                    byteNumbers[i] = bstr.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                
                const blob = new Blob([byteArray], {type: 'file/csv'});

                let url = window.URL.createObjectURL(blob)
                let a = document.createElement('a');
                a.href = url;
                a.download = 'export_data_new_recruitments_list_' + dateNow2 + '.csv'
                a.click();
        });
    }

    actionType() {
        if (this.state.selectThisPage === true) {
            this.setState({confirmText: `${this.state.languages.confirmText} ${this.state.selected.length} data ${this.state.languages.thisPage}?`, confirmIsOpen: true})
        } else if (this.state.selectAll === true) {
            this.setState({confirmText: `${this.state.languages.confirmText} ${this.state.countAll} data?`, confirmIsOpen: true})
        }
    }

    actionService() {
        if (this.state.selectThisPage === true) {
            this.props.bulkDeleteTodoIds({todolist_ids: this.state.todolist_ids})
            .then((data) => {
                let updateState = {
                    ...initState,
                    resultIsOpen: true,
                    resultText: data.meta.message,
                    selected: []
                }
                this.setState(updateState, () => this.search() )
            })
            .catch(e => this.setState({resultIsOpen: true, type: 'error', resultText: e.meta.message}))
        } else if (this.state.selectAll === true) {
            const {id_todolist, id_category, task_date_start, task_date_end, mid, merchant_name, sales_phone, sub_area,action_date_start, action_date_end, status} = this.state

            this.props.bulkDeleteAllTodo({id_todolist, id_category, task_date_start, task_date_end, mid, merchant_name, sales_phone, sub_area,action_date_start, action_date_end, status})
            .then((data) => {
                let updateState = {
                    ...initState,
                    resultIsOpen: true,
                    resultText: data.meta.message,
                    selected: []
                }
                this.setState(updateState, () => this.search() )
            })
            .catch(e => this.setState({resultIsOpen: true, type: 'error', resultText: e.meta.message}))
        }
    }

    fetchRecruitment = (pageNumber) => {
        if (this.props.auth.language === 'in'){
            this.setState({languages: ind.list})
        } else if (this.props.auth.language === 'en'){
            this.setState({languages: en.list})
        }

        const { id, phone_number, customer_code, name, status, sub_area_channel_name, institution_code} = this.state
        let page = "?page=1";

        if(pageNumber){
            page = pageNumber.includes("page") ? pageNumber : "?page=1"
        }

        this.props.getRecruitments({id: id.toString(), phone_number, customer_code , sub_area_channel_name, name, status, institution_code}, page)
    }

    filterSubAreaChannel = (inputValue) => {
        let newSac = []
        newSac.push({value: '', label: 'Searching...', disabled: true})

        this.props.getSubareas(`?keyword=${inputValue}`)
        .then((data) => {
            let newSac = []
            if (data.data.sub_areas !== null) {
                data.data.sub_areas.map(sac =>
                    newSac.push({value: sac.id, label: `${sac.name}`})
                )
            }
            this.setState({subAreaChannels: newSac})
        })
    };

    filterInstitusi = (inputValue) => {
        let institutions = []
        institutions.push({value: '', label: 'Searching...', disabled: true})

        this.props.findInstitution({keyword: inputValue})
        .then((data) => {
            let institutions = []
            if (data.data !== null) {
                data.data.map(ins => 
                    institutions.push({value: ins.code, label: `${ins.name}`})
                )
            }

            this.setState({institutions: institutions})
        })
    };

    render() {
        const { auth, recruitments } = this.props
        const {
            disabledStatusExport,
            confirmIsOpen, 
            resultIsOpen, 
            confirmText,
            resultText,
            type, 
            id,
            name,
            phone_number,
            customer_code,
            institution_code,
            sub_area_channel_name,
            status,
            selectedReviews, 
            selectedFilter,
            languages,
            subAreaChannels,
            institutions
        } = this.state

        // let pages = recruitments.meta
        // let column_from, column_to, prev_page, next_page, total_pages;

        // if(pages !== undefined){
        //     column_from = (pages.current_page * 25 - 24) < 0 ? 0 : (pages.current_page * 25 - 24)
        //     column_to = (pages.current_page * 25) > pages.total_count ? pages.total_count : (pages.current_page * 25)
        //     prev_page = (pages.current_page - 4) < 0 ? 0 : (pages.current_page - 4)
        //     next_page = (pages.current_page + 3 > pages.total_pages) ? pages.total_pages : (pages.current_page + 3)
        //     total_pages = range(prev_page, next_page)
        // }

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
                    resultClose={() => this.setState({resultIsOpen: false})}
                    confirmYes={() => {
                    this.setState({confirmIsOpen: false}, () => this.actionService())
                    }}/>

                <div className="col-12 mb-3">
                    <h2>{languages.header}</h2>
                    <div className="actions d-flex justify-content-end">
                        { recruitments.data.length !== 0 &&
                            <button className="btn btn-link text-danger mr-3" disabled={disabledStatusExport} onClick={() => this.setState({disabledStatusExport: true}, () => this.export(this.state))}><IconDownload/>{languages.export}</button>
                        }
                        { auth.authority["recruitment"] === "Full Access" &&
                            <Link to="/recruitment/new" className="btn btn-danger btn-rounded float-right">
                                {languages.new}
                            </Link>
                        }
                    </div>
                </div>

                <div className="col-12 mb-4">
                    {/* <div className="card noSelect"> */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row"> 
                            { selectedFilter ?
                            <div className="col-12 my-3">
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="form-inline">
                                            <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.id}</label></div>
                                            <div className="col-lg-9 input-filter">
                                                <input type="text" name="ID" className="form-control form-control-line w-30" 
                                                onChange={e => {this.setState({id: e.target.value.toString()})}}
                                                value={id} placeholder="Masukan ID"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="form-inline">
                                            <div className="col-lg-5">
                                                <button type="submit" className="btn btn-danger w-100" onClick={() => this.fetchRecruitment()}>{languages.search}</button>
                                            </div>
                                            <div className="col-lg-4 input-action">
                                                <button className="btn btn-link text-danger" onClick={() => {this.setState({selectedFilter: false, id: ''}, () => this.fetchRecruitment())}}>{languages.more}</button>
                                            </div>
                                            <div className="col-3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-12">
                                <div className="row mt-2">
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.id}</label></div>
                                        <div className="col-lg-9 input-filter ml-7">
                                            <input type="text" name="ID" className="form-control form-control-line w-30" 
                                            onChange={e => { this.setState( { id: e.target.value.toString() } ) }}
                                            value={id} placeholder="Masukan ID"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.institusi}</label></div>
                                        <div className="col-lg-9 input-filter ml-7" >
                                            <SelectAsync initValue={institution_code.label} options={institutions} 
                                                handleChange={(ins) => { this.setState({institution_code: ins.value}) }} 
                                                onInputChange={(value) => { 
                                                    if (value !== "") {
                                                        this.filterInstitusi(value) 
                                                    }
                                                }} 
                                                className="select-circle flex-fill" classNamePrefix="select-circle-inner">
                                            </SelectAsync>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.mName}</label></div>
                                        <div className="col-lg-9 input-filter ml-7">
                                            <input type="text" name="name" className="form-control form-control-line w-30" 
                                            onChange={e => { this.setState({ name: e.target.value.toString() }) }}
                                            value={name} placeholder="Masukan Nama Merchant" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.SAC}</label></div>
                                        <div className="col-lg-9 input-filter ml-7" >
                                            <SelectAsync initValue={sub_area_channel_name.label} options={subAreaChannels} 
                                                handleChange={(sac) => { this.setState({sub_area_channel_name: sac.label}) }} 
                                                onInputChange={(value) => { 
                                                    if (value !== "") {
                                                        this.filterSubAreaChannel(value)
                                                    }
                                                }} 
                                                className="select-circle flex-fill" classNamePrefix="select-circle-inner">
                                            </SelectAsync>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline">
                                    <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.noPhone}</label></div>
                                        <div className="col-lg-9 input-filter ml-7">
                                            <input type="number" name="phone_number" className="form-control form-control-line w-30" 
                                            onChange={e => {
                                                if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                                                    return
                                                }
                                                this.setState({phone_number: e.target.value})
                                            }}
                                            value={phone_number} placeholder="Masukan Nomor" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.status}</label></div>
                                        <div className="col-lg-9 input-filter ml-7">
                                            <SelectComponent 
                                            options={statuses} initValue={status.label}
                                            handleChange={(status) => this.setState({status: status.value},
                                            )}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.noCustomer}</label></div>
                                        <div className="col-lg-9 input-filter ml-7">
                                            <input type="text" name="customer_code" className="form-control form-control-line w-30" placeholder="Masukan No Pelanggan" 
                                            onChange={e => {
                                            this.setState({customer_code: e.target.value})
                                            }}
                                            value={customer_code}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="form-inline my-2">
                                        <div className="col-3"></div>
                                        <div className="col-lg-5">
                                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.fetchRecruitment()}}>{languages.search}</button>
                                        </div>
                                        <div className="col-lg-4 input-action my-2">
                                            <button className="btn btn-link text-danger" onClick={() => {
                                            this.setState({
                                                selectedFilter: true,
                                                id: '',
                                                name: '',
                                                phone_number: '',
                                                customer_code: '',
                                                institution_code: '',
                                                sub_area_channel_name: '',
                                                status: '',
                                                page: 1,
                                                limit: 25
                                                }, 
                                                () => this.fetchRecruitment())}}>{languages.hide}</button>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            }

                            {/* { selected.length > 0 &&
                            <React.Fragment>
                                <div className="card-body border-top col-12">
                                <div className="col-12 col-lg-8">
                                    <div className="d-flex">
                                        <button type="submit" className="btn btn-outline-danger mr-3"  onClick={() => this.setState({todolist_ids: selected, selectThisPage: true, selectAll: false})} disabled={selectThisPage} >{languages.select}</button>

                                        <button type="submit" className="btn btn-danger mr-3"  onClick={() => this.setState({todolist_ids: selected, selectAll: true, selectThisPage: false}, () => {
                                        getCountAllData(this.state)
                                        .then((data) => {
                                            this.setState({countAll: data.data})
                                        })
                                        .catch(e => this.setState({resultIsOpen: true, type: 'error', resultText: e.meta.message}))
                                        })} disabled={selectAll}>{languages.selectAll}</button>

                                        <label className="col-form-label mr-3">{languages.action}</label>

                                        <SelectLineComponent className="w-50"
                                        options={actions} initValue={action.label}
                                        handleChange={(action) => this.setState({action: action.value}, () => this.actionType()
                                        )}/>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4"></div>
                                </div>
                            </React.Fragment>
                            } */}
                        
                            </div>
                        </div>
                        
                        <div className="table-fixed">
                            <table className="table table-header">
                            <thead>
                                <tr>
                                {/* <th width="3%">
                                    <input type="checkbox" onChange={(e) => {
                                    let todolist_ids = todo_list.data.map(data => data.id)
                                    let newSelected = e.target.checked ? todolist_ids : []

                                    if (selectAllHeader) {
                                        this.setState({selectAllHeader: false})
                                    } else {
                                        this.setState({selectAllHeader: true})
                                    }

                                    this.setState({selected: newSelected, selectAll: false, selectThisPage: false})
                                    }}/>
                                </th> */}
                                <th width="4%">{languages.id}</th>
                                <th width="18%">{ selectedReviews.length > 0 || languages.mName }</th>
                                <th width="17%">{ selectedReviews.length > 0 || languages.noCustomer }</th>
                                <th width="17%">{ selectedReviews.length > 0 || languages.noPhone }</th>
                                <th width="17%">{ selectedReviews.length > 0 || languages.institusi }</th>
                                <th width="17%">{ selectedReviews.length > 0 || languages.SAC }</th>
                                <th width="10%">{ selectedReviews.length > 0 || languages.status }</th>
                                </tr>
                            </thead>
                            {recruitments.loading ?
                                <tbody>
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <LoadingDots color="black" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                :
                                <tbody>
                                {recruitments.data.length !== 0 ?
                                    recruitments.data.map(recruitment => (
                                    <tr key={recruitment.id} className="disabled">
                                        {/* { selectAllHeader === true ?
                                        <React.Fragment>
                                        {todo_list.status === 'Open' || todo_list.status === 'Late' ?
                                            <td>
                                            <input type="checkbox" checked={selected.includes(todo_list.id)} onChange={(e) => {
                                                let newSelected = selected

                                                if(e.target.checked){
                                                newSelected.push(todo_list.id)
                                                }else{
                                                newSelected = selected.filter(id => id !== todo_list.id)
                                                }

                                                this.setState({selected: newSelected, selectAll: false, selectThisPage: false})

                                            }}/>
                                            </td>
                                            :
                                            <td></td>
                                        }
                                        </React.Fragment>
                                        :
                                        <td>
                                            <input type="checkbox" checked={selected.includes(todo_list.id)} onChange={(e) => {
                                                let newSelected = selected

                                                if(e.target.checked){
                                                newSelected.push(todo_list.id)
                                                }else{
                                                newSelected = selected.filter(id => id !== todo_list.id)
                                                }

                                                this.setState({selected: newSelected, selectAll: false, selectThisPage: false})

                                            }}/>
                                            </td>
                                        } */}
                                        <td>
                                            <Link to={`/recruitment/${recruitment.id}`}>{recruitment.id} </Link>
                                        </td>
                                        <td>{recruitment.name || '-'}</td>
                                        <td>{recruitment.customer_code}</td>
                                        <td>{recruitment.phone_number || '-'}</td>
                                        <td>{recruitment.institution_code || '-'}</td>
                                        <td>{recruitment.sub_area_channel_name || '-'}</td>
                                        <td><span className={`badge w-100 ${recruitment.status === 'Pending' ? 'badge-gray' : 
                                            recruitment.status === 'Activated' ? 'badge-status' : recruitment.status === 'Registered' ? 'badge-primary' : 'badge-danger'}`}>{recruitment.status}</span></td>
                                        
                                    </tr>
                                    ))
                                    :
                                    <tr>
                                    <td colSpan={7} className="text-center">
                                        {languages.noList}
                                    </td>
                                    </tr>
                                }
                                </tbody>
                            }
                            </table>
                        </div>
                        <div className="card-body border-top">
                            <Pagination pages={recruitments.meta} routeName="recruitment" handleClick={(pageNumber) => this.fetchRecruitment(pageNumber)} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default connect(
    ({auth, recruitments}) => ({ auth, recruitments }),
    {getRecruitments, findSAC, findInstitution, getSubareas }
)(Index)
