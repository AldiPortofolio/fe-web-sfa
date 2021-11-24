import React from 'react';
import { debounce, isEmpty } from 'lodash';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAttendCategory, deleteAttendCategory } from '../../actions/attendance_category'
import { NotAuthorize, SelectComponent, ModalDelete, LoadingDots, Pagination, TimeSelectComponent } from '../../components'
import { IconEdit, IconTrash } from '../../components/Icons'
import { ind, en } from '../../languages/attendance_category'

const style = {
  link: {
    cursor: 'pointer'
  }
}

const types = [
  { value: '0', label: 'All'},
  { value: '1', label: 'In'}, 
  { value: '2', label: 'Out'}
]

const initState = {
  category_id: '',
  category_name: '',
  type: '',
	time_in_from: '',
	time_in_to: '',
	time_out_from: '',
  time_out_to: '',
  type_modal: 'success',
  confirmText: 'Apakah Anda yakin untuk menghapus data ini?',
  resultText: 'Berhasil menghapus data.',
  selectedFilter: true,
  confirmIsOpen: false,
  resultIsOpen: false,
  languagesFilter: {},
  languagesTable: {},
}

class Manage extends React.Component {
  state = initState

  componentDidMount(){
    document.title = "SFA OTTO - Sales Attendance"
    if (this.props.auth.language === 'in'){
      this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    } else if (this.props.auth.language === 'en'){
      this.setState({languagesFilter: en.filter, languagesTable: en.table})
    }
    
    this.fetchAttendance(window.location.search)
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):

    if (this.props.location.search !== prevProps.location.search) {
      this.fetchAttendance(this.props.location.search);
    }
  }

  fetchAttendance = (pageNumber) => {
    if (this.props.auth.language === 'in'){
      this.setState({languagesFilter: ind.filter, languagesTable: ind.table})
    } else if (this.props.auth.language === 'en'){
      this.setState({languagesFilter: en.filter, languagesTable: en.table})
    }
    
    let page = "?page=1";

    if(pageNumber){
      page = pageNumber.includes("page") ? pageNumber : "?page=1"
    }

    this.props.getAttendCategory({}, page)
  }

  filterAttendcategory = debounce(() => {
    const { category_id, category_name, type, time_in_from, time_in_to, time_out_from, time_out_to} = this.state

    this.props.getAttendCategory({category_id, category_name, type, time_in_from, time_in_to, time_out_from, time_out_to})
  }, 350)

  render() {
    const { auth, attendance_category, getAttendCategory, deleteAttendCategory} = this.props
    const { category_id,
      category_name,
      time_in_from,
      time_in_to,
      time_out_from,
      time_out_to,
      selectedFilter,
      confirmIsOpen,
      resultIsOpen,
      type_modal,
      confirmText,
      resultText,
      languagesFilter,
      languagesTable,
    } = this.state

    if (auth.isAuthenticated && (auth.authority["attendance_category"] === "" || auth.authority["attendance_category"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type_modal}
            confirmText={confirmText}
            resultText={resultText}
            confirmClose={() => this.setState({confirmIsOpen: false})}
            resultClose={() => this.setState({resultIsOpen: false})}
            confirmYes={() => {
              this.setState({confirmIsOpen: false}, () => {
                deleteAttendCategory(category_id)
                  .then((data) => this.setState({resultIsOpen: true}, () => this.fetchAttendance()))
                  .catch(e => this.setState({resultIsOpen: true, type: 'error'}))
              })
            }}
          />
          <div className="col-12">
            <h2>{languagesFilter.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              {(auth.authority["attendance_category"] === "Full Access") &&
                <Link to="/attendance/category/new" className="btn btn-danger btn-rounded ml-3">{languagesFilter.add}</Link>
              }
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row"> 
                  { selectedFilter ?
                  <div className="col-12 my-3">
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <div className="form-inline">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.id}</label></div>
                          <div className="col-lg-9 input-filter">
                            <input type="text" name="category_id" className="form-control form-control-line w-30" placeholder={languagesFilter.pId}
                            onChange={e => {this.setState({category_id: e.target.value})}}
                            value={category_id}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline">
                          <div className="col-lg-5">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.filterAttendcategory()}}>{languagesFilter.search}</button>
                          </div>
                          <div className="col-lg-4 input-action">
                            <button className="btn btn-link text-danger" onClick={() => {this.setState({selectedFilter: false, category_id: ''})}}>{languagesFilter.more}</button>
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
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.id}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="category_id" className="form-control form-control-line w-30" placeholder={languagesFilter.pId}
                            onChange={e => {
                              this.setState({category_id: e.target.value})
                            }}
                            value={category_id}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.in}</label></div>
                          <div className="col-sm-4 input-filter">
                          <TimeSelectComponent handleChange={time => this.setState({time_in_from: time})} value={time_in_from} />
                          </div>
                          <div className="d-flex ml-4 mr-1"><label className="col-form-label">{languagesFilter.to}</label></div>
                          <div className="col-sm-4 input-filter">
                            <TimeSelectComponent handleChange={time => this.setState({time_in_to: time})} value={time_in_to} />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.categoryName}</label></div>
                          <div className="col-lg-9 input-filter ml-7">
                            <input type="text" name="category_name" className="form-control form-control-line w-30" placeholder={languagesFilter.pCategoryName}
                            onChange={e => {
                              this.setState({category_name: e.target.value.toString()})
                            }}
                            value={category_name}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.out}</label></div>
                          <div className="col-sm-4 input-filter">
                            <TimeSelectComponent handleChange={time => this.setState({time_out_from: time})} value={time_out_from} />
                          </div>
                          <div className="d-flex ml-4 mr-1"><label className="col-form-label">{languagesFilter.to}</label></div>
                          <div className="col-sm-4 input-filter">
                            <TimeSelectComponent handleChange={time => this.setState({time_out_to: time})} value={time_out_to} />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-sm-3 d-flex"><label className="col-form-label">{languagesFilter.type}</label></div>
                          <div className="col-lg-9 input-filter ml-7" >
                            <SelectComponent 
                            options={types} initValue={types.label}
                            handleChange={(type) => this.setState({type: type.value}) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="form-inline my-2">
                          <div className="col-3"></div>
                          <div className="col-lg-5">
                            <button type="submit" className="btn btn-danger w-100" onClick={() => {this.filterAttendcategory()}}>{languagesFilter.search}</button>
                          </div>
                          <div className="col-lg-4 input-action my-2">
                            <button className="btn btn-link text-danger" onClick={() => {this.setState({
                              selectedFilter: true, 
                              category_id: '',
                              category_name: '',
                              type: '',
                              time_in_from: '',
                              time_in_to: '',
                              time_out_from: '',
                              time_out_to: '',}, 
                              () => getAttendCategory(this.state))}}>{languagesFilter.hide}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                }
                </div>
              
              </div>
              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      {/* <th width="2%"><input type="checkbox" /></th> */}
                      <th width="2%"></th>
                      <th width="10%">{languagesTable.Id}</th>
                      <th width="23%">{languagesTable.CategoryName}</th>
                      <th width="15%">{languagesTable.Type}</th>
                      <th width="10%">{languagesTable.In}</th>
                      <th width="10%">{languagesTable.Out}</th>
                      <th width="10%"></th>
                      
                    </tr>
                  </thead>
                  {attendance_category.loading ?
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
                      {attendance_category.data && attendance_category.data.map((category, idx) => {
                        // let salesStatus

                        return(
                          <tr key={idx}>
                            {/* <td>
                              <input type="checkbox" />
                            </td> */}
                            {/* <td className="text-capitalize">{category.id}</td> */}
                            <td></td>
                            <td><Link to={`/attendance/category/${category.category_id}`} style={style.link}>{category.category_id}</Link></td>
                            <td>{category.category_name}</td>
                            <td>{category.type === '0' ? 'All' : category.type === '1' ? 'In' : category.type === '2' ? 'Out' : category.type }</td>
                            <td>{category.time_in}</td>
                            <td>{category.time_out}</td>
                            {(auth.authority["attendance_category"] === "Full Access") ?
                             <td className="d-flex align-items-center justify-content-center">
                                <Link to={`/attendance/category/edit/${category.category_id}`} className="px-2 btn-circle">
                                  <IconEdit/>
                                </Link>
                                <button className="px-2 btn-circle text-danger"
                                  style={{cursor: 'pointer', color: '#007bff', background: 'transparent'}}
                                  onClick={() => this.setState({category_id: category.category_id, confirmIsOpen: true})}>
                                  <IconTrash/>
                                </button>
                              </td>
                              :
                              <td></td>
                            }
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                  {(!attendance_category.loading && isEmpty(attendance_category.data)) &&
                    <tbody>
                      <tr>
                        <td colSpan={8} className="text-center">There is no category</td>
                      </tr>
                    </tbody>
                  }
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination pages={attendance_category.meta} routeName="attendance/category" handleClick={(pageNumber) => this.fetchAttendance(pageNumber)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, attendance_category }) => ({ auth, attendance_category }),
  { getAttendCategory, deleteAttendCategory }
)(Manage)
