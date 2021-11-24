import React from 'react';
import { range } from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getReviews, bulkDeleteReview} from '../../actions/review'
import { getToDoList, getCountAllData, bulkDeleteAllTodo, bulkDeleteTodoIds} from '../../actions/todo_list'
import { getCategoryList } from '../../actions/category_list'
import { ModalDelete, LoadingDots, SelectComponent, SelectLineComponent, DatePickerSelect } from '../../components'
import { IconDownload } from '../../components/Icons'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '../../components/Icons'
import axios from '../../actions/config'
import { NEWAPI } from '../../actions/constants'
import { ind, en } from '../../languages/reviews'

var curr = new Date();
var firstDayWeek = curr.getDate() - curr.getDay();
var lastDayWeek = firstDayWeek + 6;

var firstday = moment(curr.setDate(firstDayWeek));
var lastday = moment(curr.setDate(lastDayWeek));

var dateNow = new Date()
var dateNow2 = moment(dateNow, 'DDMMYYYY')
dateNow2 = dateNow2.format('DDMMYYYY')

const statuses = [
  {value: 'Open', label: 'Open'},
  {value: 'Done', label: 'Done'}, 
  {value: 'Pending', label: 'Pending'}, 
  {value: 'Not Exist', label: 'Not Exist'},
  {value: 'Verified', label: 'Verified'}, 
  {value: 'Reject', label: 'Reject'},
  {value: 'Late', label: 'Late'},
]

const actions = [
  {value: 'delete', label: 'delete'},
]
  
const initState = {
  disabledStatusExport: false,
  startDate: firstday,
  endDate: lastday,
  selectedCategory: {value: '', label: 'Semua'},
  keyword: '',
  id: '',
  selectedReviews: [],
  selectedFilter: [],
  review_ids: [],
  confirmIsOpen: false,
  resultIsOpen: false,
  confirmText: '',
  resultText: '',
  type: 'success',
  id_todolist: '',
  id_category: '',
  task_date_start: '',
  task_date_end: '',
  action_date_start: '',
  action_date_end: '',
  mid: '',
  merchant_name: '',
  sales_phone: '',
  sub_area: '',
  status: '',
  page: 1,
  limit: 25,
  languages: {},
  selected: [],
  todolist_ids: [],
  action: '',
  selectThisPage: false,
  selectAll: false,
  countAll: 0,
  selectAllHeader: false
}

class Index extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - All To-do List"


    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    this.state.selected = []
    this.props.getToDoList({limit: 25, page: 1})
    this.props.getCategoryList("All")
  }

  export = (req) => {
    req.page = 1
    req.limit = 100000
    axios.post(NEWAPI + `/todolist/export`, req)
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
        a.download = 'export_data_to_do_list_' + dateNow2 + '.csv'
        a.click();
    });
  }

  search() {
    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.list})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.list})
    }

    const { id_todolist, id_category, task_date_start, task_date_end, mid, merchant_name ,sales_phone, sub_area, action_date_start, action_date_end, status} = this.state

    this.state.selected = []
    this.state.page = 1
    this.state.limit = 25

    this.props.getToDoList({id_todolist, id_category, task_date_start, task_date_end, mid, merchant_name, sales_phone, sub_area, action_date_start, action_date_end, status})
   
  }

  pageTodo(page) {
    this.props.getToDoList({
      id_todolist: '',
      id_category: '',
      task_date_start: '',
      task_date_end: '',
      mid: '',
      merchant_name :'',
      sales_phone: '',
      sub_area: '',
      action_date_start :'',
      action_date_end :'',
      status: '',
      page: page,
      limit: 25
    })
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

  render() {
    const { auth, getCountAllData, category_list, todo_list, getToDoList} = this.props
    const {
      disabledStatusExport,
      confirmIsOpen, 
      resultIsOpen, 
      confirmText,
      resultText,
      type, 
      selectedReviews, 
      selectedFilter,
      id_todolist,
      id_category,
      task_date_start,
      task_date_end,
      mid,
      merchant_name,
      sales_phone,
      sub_area,
      action_date_start,
      action_date_end,
      status,
      languages,
      selected,
      action,
      selectThisPage,
      selectAll, 
      selectAllHeader
    } = this.state

    let pages = todo_list.meta
    let column_from, column_to, prev_page, next_page, total_pages;

    if(pages !== undefined){
      column_from = (pages.current_page * 25 - 24) < 0 ? 0 : (pages.current_page * 25 - 24)
      column_to = (pages.current_page * 25) > pages.total_count ? pages.total_count : (pages.current_page * 25)
      prev_page = (pages.current_page - 4) < 0 ? 0 : (pages.current_page - 4)
      next_page = (pages.current_page + 3 > pages.total_pages) ? pages.total_pages : (pages.current_page + 3)
      total_pages = range(prev_page, next_page)
    }

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
            }}
          />

          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
            <div className="actions d-flex justify-content-end">
              { todo_list.data !== undefined &&
                <button className="btn btn-link text-danger mr-3" disabled={disabledStatusExport} onClick={() => this.setState({disabledStatusExport: true}, () => this.export(this.state))}><IconDownload/>{languages.export}</button>
              }
              { auth.authority["add_todo_list"] === "Full Access" &&
                <Link to="/reviews/new" className="btn btn-danger btn-rounded float-right">
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
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.idTodo}</label></div>
                          <div className="col-lg-9 input-filter">
                            <input type="text" name="ID" className="form-control form-control-line w-30" placeholder="Masukan ID"
                            onChange={e => {this.setState({id_todolist: e.target.value.toString()})}}
                            value={id_todolist}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline">
                          <div className="col-lg-5">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => { this.setState({page: 1}, getToDoList(this.state) )} }>{languages.search}</button>
                          </div>
                          <div className="col-lg-4 input-action">
                            <button className="btn btn-link text-danger" onClick={() => {this.setState({selectedFilter: false, id_todolist: ''}, () => getToDoList(this.state))}}>{languages.more}</button>
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
                            <input type="text" name="ID" className="form-control form-control-line w-30" placeholder="Masukan ID"
                            onChange={e => {
                              this.setState({id_todolist: e.target.value.toString()})
                            }}
                            value={id_todolist}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                        <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.noSales}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="number" name="sales_phone" className="form-control form-control-line w-30" placeholder="Masukan Nomor" 
                            onChange={e => {
                              if (isNaN(Number(e.target.value)) || e.target.value.split('').length > 16) {
                                return
                              }
                              this.setState({sales_phone: e.target.value})
                            }}
                            value={sales_phone}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.category}</label></div>
                          <div className="col-lg-9 input-filter ml-7" >
                            <SelectComponent options={category_list.data} initValue={id_category.label}
                            handleChange={(id) => this.setState({id_category: id.value.toString()}) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.sub}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="subarea" className="form-control form-control-line w-30" placeholder="Masukan Subarea" 
                            onChange={e => {
                              this.setState({sub_area: e.target.value.toString()})
                            }}
                            value={sub_area}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.taskDate}</label></div>
                          <div className="col-sm-4 input-filter">
                            <DatePickerSelect handleChange={task_date_start => this.setState({task_date_start})} value={task_date_start}/>
                          </div>
                          <div className="d-flex ml-4 mr-1"><label className="col-form-label">{languages.to}</label></div>
                          <div className="col-sm-4 input-filter">
                            <DatePickerSelect handleChange={task_date_end => this.setState({task_date_end})} value={task_date_end} required/>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.actionDate}</label></div>
                          <div className="col-sm-4 input-filter">
                            <DatePickerSelect handleChange={action_date_start => this.setState({action_date_start})} value={action_date_start}/>
                          </div>
                          <div className="d-flex ml-4 mr-1"><label className="col-form-label">{languages.to}</label></div>
                          <div className="col-sm-4 input-filter">
                            <DatePickerSelect handleChange={action_date_end => this.setState({action_date_end})} value={action_date_end} required/>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.mid}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="mid" className="form-control form-control-line w-30" placeholder="Masukan MID" 
                            onChange={e => {
                              this.setState({mid: e.target.value})
                            }}
                            value={mid}
                            />
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
                        <div className="form-inline mb-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languages.mName}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="merchant_name" className="form-control form-control-line w-20" placeholder="Masukan Nama Merchant" 
                            onChange={e => {
                              this.setState({merchant_name: e.target.value})
                            }}
                            value={merchant_name}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline mb-2">
                          <div className="col-3"></div>
                          <div className="col-lg-5">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.search()}}>{languages.search}</button>
                          </div>
                          <div className="col-lg-4 input-action my-2">
                            <button className="btn btn-link text-danger" onClick={() => {
                              this.setState({
                                selectedFilter: true,
                                id_todolist: '',
                                id_category: '',
                                task_date_start: '',
                                task_date_end: '',
                                task_datestart: '',
                                task_dateend: '',
                                mid: '',
                                merchant_name :'',
                                sales_phone: '',
                                sub_area: '',
                                action_date_start :'',
                                action_date_end :'',
                                action_datestart :'',
                                action_dateend :'',
                                status: '',
                                page: 1,
                                limit: 25
                                }, 
                                () => getToDoList(this.state))}}>{languages.hide}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }

                { selected.length > 0 &&
                  <React.Fragment>
                    <div className="card-body border-top col-12">
                      <div className="col-12 col-lg-8">
                          <div className="d-flex">
                            <button type="submit" className="btn btn-outline-danger mr-3"  onClick={() => this.setState({todolist_ids: selected, selectThisPage: true, selectAll: false})} disabled={selectThisPage} >{languages.select}</button>

                            <button type="submit" className="btn btn-danger mr-3"  onClick={() => this.setState({todolist_ids: selected, selectAll: true, selectThisPage: false}, () => {
                              getCountAllData(this.state)
                              .then((data) => {
                                this.setState({countAll: pages.total_count})
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
                }
              
                </div>
              </div>
              
              <div className="table-fixed">
                <table className="table table-header">
                  <thead>
                    <tr>
                      <th width="3%">
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
                      </th>
                      <th width="4%">{languages.id}</th>
                      <th width="13%">{ selectedReviews.length > 0 || languages.category }</th>
                      <th width="10%">{ selectedReviews.length > 0 || languages.taskDate }</th>
                      <th width="10%">{ selectedReviews.length > 0 || languages.mid }</th>
                      <th width="15%">{ selectedReviews.length > 0 || languages.mName }</th>
                      <th width="10%">{ selectedReviews.length > 0 || languages.noSales }</th>
                      <th width="15%">{ selectedReviews.length > 0 || languages.sub }</th>
                      <th width="10%">{ selectedReviews.length > 0 || languages.actionDate }</th>
                      <th width="10%">{ selectedReviews.length > 0 || languages.status }</th>
                    </tr>
                  </thead>
                  {todo_list.loading ?
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
                      {todo_list.data !== null ?
                        todo_list.data.map((todo_list, idx) => (
                          <tr key={idx} className="disabled">
                            { selectAllHeader === true ?
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
                            }
                              <td>
                                <Link to={`/reviews/${todo_list.id}`}>{todo_list.id} </Link>
                              </td>
                              <td>{todo_list.todolist_category_name}</td>
                              <td>{todo_list.task_date}</td>
                              <td>{todo_list.mid}</td>
                              <td>{todo_list.merchant_name || '-'}</td>
                              <td>{todo_list.sales_phone || '-'}</td>
                              <td>{todo_list.sub_area || '-'}</td>
                              <td>{todo_list.action_date === '01-01-0001' ? '-' : todo_list.action_date}</td>
                              <td><span className={`badge w-100 ${todo_list.status === 'Pending' ? 'badge-gray' : todo_list.status === 'Open' ? 'badge-info' : 
                                todo_list.status === 'Done' ? 'badge-status' : todo_list.status === 'Verified' ? 'badge-primary' : todo_list.status === 'Not Exist' ? 'badge-secondary' : todo_list.status === 'Reject' ? 'badge-danger' : 'badge-warning'}`}>{todo_list.status}</span></td>
                            
                          </tr>
                        ))
                        :
                        <tr>
                          <td colSpan={10} className="text-center">
                            <p>{languages.noList}</p>
                          </td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                {/* <Pagination pages={todo_list.meta} routeName="reviews" handleClick={(pageNumber) => this.fetchTodos(pageNumber)} /> */}
                <nav className="d-flex justify-content-between">
                  {pages !== undefined &&
                    <React.Fragment>
                      <div className="pagination-sm form-inline">
                        <div className={`page-item ${pages.prev_page === 0  ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => this.pageTodo(1)}><IconChevronsLeft/></button>
                        </div>
                        <div className={`page-item ${pages.prev_page === 0  ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => this.pageTodo(pages.prev_page)}><IconChevronLeft/></button>
                        </div>
                        {total_pages.map(page => (
                        <div key={page} className={`page-item ${pages.current_page === (page + 1) ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => {
                            this.state.page = page+1
                            this.state.limit = 25
                            getToDoList(this.state)
                          }}>{page + 1}</button>
                        </div>
                        ))}
                        <div className={`page-item ${pages.current_page === pages.total_pages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => this.pageTodo(pages.next_page)}><IconChevronRight/></button>
                        </div>
                        <div className={`page-item ${pages.current_page === pages.total_pages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => this.pageTodo(pages.total_pages)}><IconChevronsRight/></button>
                        </div>
                      </div>

                      <p className="m-0 d-flex align-items-center text-gray">
                        Displaying {column_from} - {column_to} of {pages.total_count} records
                      </p>
                    </React.Fragment>
                  }
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, reviews, category_list, todo_list}) => ({ auth, reviews, category_list, todo_list }),
  {getReviews, bulkDeleteReview, getCategoryList, getToDoList, getCountAllData, bulkDeleteAllTodo, bulkDeleteTodoIds}
)(Index)
