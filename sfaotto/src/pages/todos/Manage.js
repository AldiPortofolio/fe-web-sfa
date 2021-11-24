import React from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { connect } from 'react-redux'
import { getTodos, deleteTodo } from '../../actions/todos'
import { ModalDelete, SelectComponent, LoadingDots, DatePickerRange } from '../../components'

const style = {
  link: {
    cursor: 'pointer'
  }
}

var curr = new Date();
var firstDayWeek = curr.getDate() - curr.getDay();
var lastDayWeek = firstDayWeek + 6;

var firstday = moment(curr.setDate(firstDayWeek));
var lastday = moment(curr.setDate(lastDayWeek));

const initState = {
  startDate: firstday,
  endDate: lastday,
  selectedCategory: {value: '', label: 'Semua'},
  keyword: '',
  id: '',
  todoCategories: [
    {value: '', label: "Semua"},
    {value: 0, label: "Akuisisi"},
    {value: 1, label: "Edit Foto"},
    {value: 2, label: "Message"}
  ],
  confirmIsOpen: false,
  resultIsOpen: false,
  type: 'success',
}

class Manage extends React.Component {
  state = initState

  componentWillMount() {
    this.props.getTodos()
  }

  componentDidMount(){
    document.title = "SFA OTTO - Manage To-do List"
  }

  toggleDropdown(toggle) {
    let obj = {}
    obj[toggle] = !this.state[toggle]
    this.setState(obj)
  }

  hide(e, toggle) {
    // if(e && e.relatedTarget){
    //   e.relatedTarget.click();
    // }

    setTimeout(() => {
      let obj = {}
      obj[toggle] = false
      this.setState(obj)
    }, 175)
  }

  filterTodos = () => {
    const { startDate, endDate, selectedCategory, keyword } = this.state
    this.props.getTodos({from_date: startDate, to_date: endDate, category: selectedCategory.value, keyword})
  }

  render() {
    const { auth, deleteTodo, todos } = this.props
    const { id, confirmIsOpen, resultIsOpen, type, keyword, startDate, endDate, selectedCategory, todoCategories } = this.state
    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false}, () => {
                deleteTodo(id)
                  .then((data) => {
                    let updateState = {
                      ...initState,
                      resultIsOpen: true
                    }
                    this.setState(updateState, () => this.filterTodos() )
                  })
                  .catch(e => this.setState({resultIsOpen: true, type: 'error'}))
              })
            }}
          />
          <div className="col-12">
            <nav className="d-flex justify-content-end" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Daftar To-do list</li>
              </ol>
            </nav>
          </div>
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h4 className="text-uppercase float-left">Daftar To-do List</h4>
                  </div>
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-between">
                      <div className="form-group mr-3">
                        <small className="text-gray">Tanggal</small>
                        <div style={{zIndex: '100'}} className="ml-2">
                          <DatePickerRange
                            type="selectsStart"
                            startDate={startDate}
                            endDate={endDate}
                            handleChange={startDate => this.setState({startDate}, () => this.filterTodos())}
                            value={startDate} />
                        </div>
                        <small className="text-gray ml-2">Sampai:</small>
                        <div style={{zIndex: '100'}} className="ml-2">
                          <DatePickerRange
                            type="selectsEnd"
                            startDate={startDate}
                            endDate={endDate}
                            handleChange={endDate => this.setState({endDate}, () => this.filterTodos())}
                            value={endDate} />
                        </div>
                      </div>
                      <div className="form-group mr-3">
                        <small className="text-gray">Kategori</small>
                        <div style={{zIndex: '100'}} className="ml-2">
                          <SelectComponent options={todoCategories} initValue={selectedCategory}
                            handleChange={(selectedCategory) => this.setState({selectedCategory}, () => this.filterTodos()) }
                          />
                        </div>
                      </div>
                      <div className="form-group mr-3 ml-auto">
                        <input placeholder='Cari di sini...' className='form-control form-control-line' value={keyword} onChange={e => this.setState({keyword: e.target.value}, () => this.filterTodos() )} />
                      </div>
                      <div className="form-group mr-3">
                        {(['IT Admin', 'Operator'].includes(auth.role)) &&
                          <Link to="/todos/new" className="btn btn-danger btn-rounded">Tambah To-do List</Link>
                        }
                      </div>
                    </form>
                  </div>
                  <div className="col-12 pb-3">
                    <div className="table-fixed">
                      <table className="table table-header">
                        <thead>
                          <tr>
                            <th width="12%">No Handphone</th>
                            <th width="10%">Tanggal</th>
                            <th width="10%">Kategori</th>
                            <th width="10%">ID Merchant</th>
                            <th width="15%">Nama Merchant</th>
                            <th width="10%">No Handphone Merchant</th>
                            <th width="20%">Message</th>
                            <th width="5%"></th>
                          </tr>
                        </thead>
                      </table>
                      <div className="table-body">
                        <table className="table mb-5">
                          <thead>
                            <tr>
                              <th width="12%">No Handphone</th>
                              <th width="10%">Tanggal</th>
                              <th width="10%">Kategori</th>
                              <th width="10%">ID Merchant</th>
                              <th width="15%">Nama Merchant</th>
                              <th width="10%">No Handphone Merchant</th>
                              <th width="20%">Message</th>
                              <td width="5%"></td>
                            </tr>
                          </thead>
                          {todos.loading ?
                            <tbody>
                              <tr>
                                <td colSpan={8}>
                                  <div className="d-flex justify-content-center align-items-center">
                                    <LoadingDots color="black" />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                            :
                            <tbody>
                              {todos.data.length > 0 ?
                                todos.data.map(todo => (
                                  <tr key={todo.id}>
                                    <td>{todo.sales_phone} </td>
                                    <td>{todo.date}</td>
                                    <td>{todo.category}</td>
                                    <td>{(todo.merchant_id === null ? "-" : todo.merchant_id)}</td>
                                    <td>{(todo.merchant_name === null ? "-" : todo.merchant_name)}</td>
                                    <td>{(todo.merchant_phone === null ? "-" : todo.merchant_phone)}</td>
                                    <td>{todo.message}</td>
                                    <td>
                                      {(['IT Admin', 'Operator'].includes(auth.role)) &&
                                        <div className="dropdown">
                                          <button className="btn btn-circle btn-more dropdown-toggle" type="button"
                                            onClick={() => this.toggleDropdown(`show${todo.id}`)}
                                            onBlur={(e) => this.hide(e,`show${todo.id}`)}
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                          </button>
                                          <div className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${this.state[`show${todo.id}`] ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                                            <Link to={`/todos/edit/${todo.id}`} className="dropdown-item" style={style.link}>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22"></line></svg>
                                              Ubah
                                            </Link>
                                            <button className="dropdown-item" style={style.link}
                                              onClick={() => this.setState({id: todo.id, confirmIsOpen: true})}
                                              >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                              Hapus
                                            </button>
                                          </div>
                                        </div>
                                      }
                                    </td>
                                  </tr>
                                ))
                                :
                                <tr>
                                  <td colSpan={7} className="text-center">
                                    { (startDate !== null &&  keyword !== null) ?
                                      <div>
                                        <p>Data tidak tersedia untuk filter:</p>
                                        <p className="mb-0">{"Dari Tanggal: " + moment(startDate, 'DD-MM-YYYY').format("DD-MM-YYYY").toString()}</p>
                                        <p className="mb-0">{"Sampai Tanggal: " + moment(endDate, 'DD-MM-YYYY').format("DD-MM-YYYY").toString()}</p>
                                        <p className="mb-0">{"Kategori: " + selectedCategory.label}</p>
                                        <p className="mb-0">{"Pencarian: " + keyword}</p>
                                      </div>
                                      :
                                      <p>Data tidak tersedia</p>
                                    }
                                  </td>
                                </tr>
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
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, todos}) => ({ auth, todos }),
  {getTodos, deleteTodo}
)(Manage)
