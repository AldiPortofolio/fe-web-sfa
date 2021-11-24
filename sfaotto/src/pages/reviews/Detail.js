import React from 'react';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getReview } from '../../actions/review'
import { getToDoDetail,getToDoDetailV2, updateStatusTodoList } from '../../actions/todo_list'
import { ModalConfirm,  Lightbox, LoadingDots} from '../../components'
import axios from '../../actions/config'
import moment from 'moment'
import { IconDownload, IconChevronDown, IconChevronUp} from '../../components/Icons'
import { ind, en } from '../../languages/reviews'

// import Lightbox from "react-image-lightbox";
// import "react-image-lightbox/style.css";

class Detail extends React.Component {
  state = {
    review: [],
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    messages: [],
    issues: [],
    images: [],
    all: [],
    id: 0,
    action_date: '',
    created_at: '',
    mid: '',
    task_date: '',
    todolist_category_id: '',
    possible_sales: [],
    merchant_detail: {},
    tasks: [],
    type_1: ["Image", "Signature", "Document"],
    type_2: ["Text", "Yes/No", "CheckBox", "MAP", "Dropdown", "Numeric", "Upload"],
    status_history: ["Pending", "Done", "Not Exist", "Late", "Verified", "Reject"],
    histories: [],
    follow_ups: [],
    statusDetail: [],
    status: {
      todolist_id: "",
      status: ""
    },
    location: "",
    languages: [],
    loading: false,

    isOpen: false,
    isOpen1: false,
    isOpen2: false,
    isOpen3: false,
    isOpen4: false,
    imgIndex: 0,
    imgIndex2: 0,
  }

  componentWillMount() {
    const { auth: {access_token}, getToDoDetail, match, getToDoDetailV2} = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    this.setState({loading: true})
    
    getToDoDetailV2(match.params.id)
      .then((data) => {
        this.setState({loading: false})
        if(data.meta.status === false){
          this.setState({confirmIsOpen: true, type: 'error', textError: data.meta.messages, textReason: data.meta.message})
        }else{
          this.setState({
            all: data.data, 
            merchant_detail: data.data.merchant_detail, 
            possible_sales: data.data.possible_sales,
            tasks: data.data.tasks, 
            histories: data.data.histories,
          })

          if (this.state.histories != null) {
            this.state.histories.forEach((his, i) => {
              this.state.statusDetail[i] = false
            })
          }

          if (data.data.tasks.follow_ups !== []) {
            this.setState({follow_ups: data.data.tasks.follow_ups})
          }
        }
      })
  }

  componentDidMount(){
    document.title = "SFA OTTO - Todo Detail"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.detail})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.detail})
    }
  }

  downloadImage = (url, sub_cat_name) => {
    var catName = this.state.all.category_name.split(' ').join('')
    var sub_cat_name2 = sub_cat_name.split(' ').join('')

    fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let url2 = window.URL.createObjectURL(blob)
        let a = document.createElement('a');
        a.href = url2;
        a.download = "tdl" + catName + "_" + this.state.all.id + "_" + sub_cat_name2 + ".jpg"
        a.click();
    });
  }

  downloadPdf = (url, sub_cat_name) => {
    var catName = this.state.all.category_name.split(' ').join('')
    var sub_cat_name2 = sub_cat_name.split(' ').join('')

    fetch(url)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let url2 = window.URL.createObjectURL(blob)
        let a = document.createElement('a');
        a.href = url2;
        a.download = "tdl" + catName + "_" + this.state.all.id + "_" + sub_cat_name2 + ".pdf"
        a.click();
    });
  }

  statusVerified = (todo_id, status) => {
    let status2 = this.state.status
    status2["todolist_id"] = todo_id.toString()
    status2["status"] = status

    this.props.updateStatusTodoList(status2)
    .then((data) => {
      if(data.meta.status === false){
        this.setState({confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: data.meta.message})
      }else{
        this.setState({confirmIsOpen: true, type: 'success', textSuccess: data.meta.messages, textError: ''})
      }
    })
  }

  detailChange = (status, i) => {
    this.state.statusDetail[i] = status
  }

  render() {
    const { auth, history } = this.props
    const { 
      confirmIsOpen, 
      type, 
      textSuccess, 
      textError, 
      textReason, 
      all,
      merchant_detail,
      possible_sales,
      tasks,
      type_1,
      type_2,
      status_history,
      histories,
      loading,

      isOpen,
      isOpen1,
      isOpen2,
      isOpen3,
      isOpen4,
      imgIndex,
      imgIndex2,
      languages
    } = this.state

    return (
      <div className="container mb-5">
        {loading ? 
        <div className="d-flex justify-content-center align-items-center" style={{height: '91vh'}}>
          <LoadingDots color="black" />
        </div>
        :
        <React.Fragment>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({confirmIsOpen: false})}
          confirmSuccess={() => history.push('/reviews')}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />

        <div className="row">

          { all &&
            <React.Fragment>
              <div className="col-12 mb-4">
                <h2>{all.category_name} (ID - {all.id})</h2>
              </div>

              <div className="col-12 mb-2">
                <div className="row">
                  <div className="col-12 col-lg-8 mb-2">
                    <div className="card mb-3">
                      <div className="card-body row mb-0">
                        <div className="col-12 col-lg-9 d-flex flex-column">
                          <p className="mb-0">{languages.create} {moment(all.created_at, "YYYY-MM-DD").format("DD MMMM YYYY")}</p>
                        </div>
                        <div className="col-12 col-lg-1 d-flex flex-column align-items-center">
                          <strong className="mb-0 text-primary"><p className="mb-1">{languages.status}</p></strong>
                        </div>
                        <div className="ml-3">
                          <span className={`badge w-100 ${all.status === 'Pending' ? 'badge-gray' : all.status === 'Open' ? 'badge-info' : 
                              all.status === 'Done' ? 'badge-status' : all.status === 'Verified' ? 'badge-primary' : all.status === 'Not Exist' ? 'badge-secondary' : all.status === 'Reject' ? 'badge-danger' : 'badge-warning' }`}>{all.status}</span>
                        </div>
                      </div>
                      <div className="card-footer border-top pt-4">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-2 col-lg-2 ">
                              <img onClick={() => this.setState({isOpen1: true})} src={merchant_detail.merchant_image} className="avatar-circle pointerYes" alt=""/>
                              <Lightbox isOpen={isOpen1} images={merchant_detail.merchant_image} confirmClose={() => this.setState({isOpen1: false})}/>
                            </div>
                            <div className="col-12 col-lg-5 d-flex flex-column">
                              <h6 className="mb-2">{merchant_detail.merchant_name}</h6>
                              <p className="mb-2">MID {merchant_detail.merchant_id || "-"}</p>
                              <p className="mb-2">{merchant_detail.owner_name} - {merchant_detail.merchant_phone}</p>
                              <p className="mb-2">{merchant_detail.sub_area || "-"}</p><br/>
                              <p className="mb-2">Catatan:</p>
                              <p className="mb-2">{all.notes || "-"}</p>
                            </div>

                            <div className="col-12 col-lg-5 d-flex flex-column">
                              <p>{merchant_detail.address || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    { all.status === "Open" &&
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>{languages.possibleSales}</h6>
                        <div className="col-12 mt-3">
                          <div className="row">
                            <div className="col-12 p-lg-0 text-left">
                              { possible_sales !== null ? possible_sales.map((sales, idx) => {
                                return(
                                  <React.Fragment key={idx}>
                                    <p className="mb-2" key={sales}>{idx + 1}. &ensp;
                                    <Link to={`/sales/detail/${sales.id}`}>
                                      {!isEmpty(sales) ? `${sales.label_sales}` : "-"}
                                    </Link></p>
                                  </React.Fragment>
                                )
                              }) : '-'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    }

                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>{languages.taskDetail}</h6>
                        <div className="col-12">
                          <div className="row ">
                            <div className="col-12 col-lg-3 p-lg-0 text-left mt-2">
                              {languages.taskDate}
                            </div>
                            <div className="col-12 col-lg-5 p-lg-0 text-left mt-2">
                              {all.task_date ? moment(all.task_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "-"}
                            </div>
                          </div>
                          { all.status !== "Open" &&
                          <div className="row ">
                            <div className="col-12 col-lg-3 p-lg-0 text-left mt-2">
                              {languages.location}
                            </div>
                            <div className="col-12 col-lg-6 p-lg-0 text-left mt-2">
                              { all.longitude !== "" && all.latitude !== "" ? all.latitude + ", " + all.longitude : "-"}
                            </div>
                            <div className="col-12 col-lg-3 p-lg-0 text-right">
                                  <a href={'https://www.google.com/maps/search/?api=1&query='+ all.latitude + ',' + all.longitude} target="_blank" rel="noopener noreferrer" className="btn btn-link text-right btn-sm">Map </a>
                                </div>
                          </div>
                          }


                          { all.status === "Not Exist" && all.action_by !== "" &&
                            <div className="row">
                              <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                {languages.actionBy}
                              </div>
                              <div className="col-12 col-lg-5 p-lg-0 text-left mt-2 text-primary">
                                {all.action_by}
                              </div>
                            </div>
                          }
                          { all.status === "Not Exist" && all.action_date !== "0001-01-01T00:00:00Z" &&
                            <div className="row">
                              <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                {languages.actionDate}
                              </div>
                              <div className="col-12 col-lg-5 p-lg-0 text-left mt-2 text-primary">
                                {all.action_date ? moment(all.action_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "-"}
                              </div>
                            </div>
                          }
                          { histories !== null &&
                            histories.map((history, i) => {
                              return (
                                history.status === "Not Exist" &&
                                <React.Fragment>
                                  <div className="row">
                                    <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                      {languages.desc}
                                    </div>
                                    <div className="col-12 col-lg-8 p-lg-0 text-left mt-2 text-danger">
                                      { history.description}
                                    </div>
                                  </div>
                                  <div className="row my-2">
                                    <div className="col-12 col-lg-3 p-lg-0 text-left" >
                                    {languages.fotoLokasi}
                                    </div>
                                    <div className="col-12 col-lg-5 p-lg-0 text-left text-primary">
                                      <img onClick={() => this.setState({isOpen2: true})} src={history.foto_location} className="image-task pointerYes" alt=""/>
                                      <Lightbox isOpen={isOpen2} images={history.foto_location} confirmClose={() => this.setState({isOpen2: false})}/>
                                    </div>
                                    <div className="col-12 col-lg-3 p-lg-0 text-primary">
                                      <button className="btn btn-link text-danger" onClick={() => this.downloadImage(history.foto_location, 'Foto Lokasi')} ><IconDownload/></button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            })
                          }
                        </div>

                        { tasks !== null && 
                          tasks.map((task, idx) => {
                          return (
                          <React.Fragment key={[idx]} >
                            <div className={`col-12 mt-2 ${idx > 0 ? 'border-top' : ''}`}>
                              <div className="row">
                                <div className={`col-12 col-lg-3 p-lg-0 text-left ${all.status === 'Not Exist' ? 'text-danger' : 'text-primary'} mt-2`} >
                                {languages.task} {idx+1}
                                </div>
                                <div className={`col-12 col-lg-5 p-lg-0 text-left ${all.status === 'Not Exist' ? 'text-danger' : 'text-primary'} mt-2`}>
                                {task.sub_category_name}
                                </div>
                              </div>

                              <div>
                              { task.follow_ups !== null &&
                              task.follow_ups.map((follow_up, i) => {
                                return (
                                  <React.Fragment key={i}>
                                    { type_1.some(item => follow_up.content_type === item) &&
                                      <React.Fragment>
                                        { tasks.length > 0 && task.follow_ups.length === 1 ?
                                          <div className="row">
                                            <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                            {follow_up.label}
                                            </div>
                                            <div className="col-12 col-lg-5 p-lg-0 text-left text-primary mt-2">
                                              <img onClick={() => this.setState({isOpen: true, imgIndex: idx})} src={follow_up.body} className="image-task pointerYes" alt=""/>
                                              {imgIndex === idx && isOpen === true &&
                                                <Lightbox isOpen={isOpen} images={task.follow_ups[0].body} confirmClose={() => this.setState({isOpen: false})}/>
                                              }
                                            </div>
                                            <div className="col-12 col-lg-4 p-lg-0 text-primary mt-2">
                                              <button className="btn btn-link text-danger" onClick={() => this.downloadImage(follow_up.body, task.sub_category_name)} ><IconDownload/></button>
                                            </div>
                                          </div>
                                          :
                                          <div className="row">
                                            <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                            {follow_up.label}
                                            </div>
                                            <div className="col-12 col-lg-5 p-lg-0 text-left text-primary mt-2">
                                              <img onClick={() => this.setState({isOpen: true, imgIndex: i})} src={follow_up.body} className="image-task pointerYes" alt=""/>
                                              {imgIndex === i && isOpen === true &&
                                                <Lightbox isOpen={isOpen} images={follow_up.body} confirmClose={() => this.setState({isOpen: false})}/>
                                              }
                                            </div>
                                            <div className="col-12 col-lg-4 p-lg-0 text-primary mt-2">
                                              <button className="btn btn-link text-danger" onClick={() => this.downloadImage(follow_up.body, task.sub_category_name)} ><IconDownload/></button>
                                            </div>
                                          </div>
                                        }
                                      </React.Fragment>
                                    }
                                    { type_2.some(item => follow_up.content_type === item) &&
                                    <div className="row">
                                      <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                      {follow_up.label}
                                      </div>
                                      <div className="col-12 col-lg-8 p-lg-0 text-left text-primary mt-2">
                                      {follow_up.body}
                                      </div>
                                    </div>
                                    }
                                  </React.Fragment>
                                )
                              })
                              }
                              </div>

                              { all.status !== "Open" && task.action_by !== ""  && task.action_by !== " " &&
                                <div className="row">
                                  <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                  {languages.actionBy}
                                  </div>
                                  <div className="col-12 col-lg-5 p-lg-0 text-left mt-2 text-primary">
                                  {task.action_by}
                                  </div>
                                </div>
                              }
                              { all.status !== "Open" && task.action_date !== "0001-01-01T00:00:00Z" &&
                                <div className="row">
                                  <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                  {languages.actionDate}
                                  </div>
                                  <div className="col-12 col-lg-5 p-lg-0 text-left mt-2 text-primary">
                                    {task.action_date ? moment(task.action_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "-"}
                                  </div>
                                </div>
                              }
                            </div>
                          </React.Fragment>
                          )
                        })}

                      </div>
                    </div>

                    { status_history.some(item => all.status === item) && histories !== null && histories[0].foto_location === "" &&
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>{languages.history}</h6>
                        { histories.map((history, i) => {
                          return(
                          <React.Fragment key={[i]} >
                          { history.foto_location === "" &&
                          <React.Fragment>
                            <div className="col-12 mt-2">
                              <div className={`row ${i > 0 ? 'border-top' : ''}`}>
                                <div className="col-12 col-lg-3 p-lg-0 text-left mt-2">
                                  {languages.pendingTask}
                                </div>
                                <div className="col-12 col-lg-6 p-lg-0 text-left mt-2" >
                                  {history.new_task_date ? moment(history.new_task_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "-"}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12 col-lg-3 p-lg-0 text-left mt-2">
                                  {languages.location}
                                </div>
                                <div className="col-12 col-lg-6 p-lg-0 text-left mt-2" >
                                { history.longitude !== "" && history.latitude !== "" ? history.latitude + ", " + history.longitude : "-"}
                                </div>
                                <div className="col-12 col-lg-3 p-lg-0 text-right mb-2">
                                  <a href={'https://www.google.com/maps/search/?api=1&query='+ history.latitude + ',' + history.longitude} target="_blank" rel="noopener noreferrer" className="btn btn-link text-right btn-sm">Map </a>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-12 col-lg-3 p-lg-0 text-left">
                                {languages.desc}
                                </div>
                                <div className="col-12 col-lg-6 p-lg-0 text-left text-danger">
                                  {history.description}
                                </div>
                                <div className="col-12 col-lg-3 p-lg-0 text-right mb-2">
                                  { this.state.statusDetail[i] === false ?
                                  <button className="btn btn-link text-right btn-sm" onClick={() => this.detailChange(true, i)}>{languages.more}<IconChevronDown/></button>
                                  :
                                  <button className="btn btn-link text-right btn-sm" onClick={() => this.detailChange(false, i)}>{languages.hide}<IconChevronUp/></button>
                                  }
                                </div>
                              </div>
                            </div>
                            
                            { this.state.statusDetail[i] === true &&
                            <React.Fragment>
                              { history.foto_location !== "" &&
                              <div className="col-12 mt-2">
                                <div className="row my-2">
                                  <div className="col-12 col-lg-3 p-lg-0 text-left" >
                                  {languages.fotoLokasi}
                                  </div>
                                  <div className="col-12 col-lg-5 p-lg-0 text-left text-primary">
                                    <img onClick={() => this.setState({isOpen3: true, imgIndex: i})} src={history.foto_location} className="image-task pointerYes" alt=""/>
                                    <Lightbox isOpen={isOpen3} images={history.foto_location} confirmClose={() => this.setState({isOpen3: false})}/>
                                  </div>
                                  <div className="col-12 col-lg-3 p-lg-0">
                                    <button className="btn btn-link text-danger" onClick={() => this.downloadImage(history.foto_location, 'Foto Lokasi')} ><IconDownload/></button>
                                  </div>
                                </div>
                              </div>
                              }
                              <div className="card-footer">
                              {tasks !== null && tasks.map((task, idx) => {
                                return (
                                  <React.Fragment key={[idx]} >
                                      <div className={`row ${idx > 0 ? 'border-top my-2' : ''}`}>
                                        <div className={`col-12 col-lg-3 p-lg-0 text-left mt-2 ${all.status === 'Not Exist' ? 'text-danger' : 'text-primary'}`} >
                                        {languages.task} {idx+1}
                                        </div>
                                        <div className={`col-12 col-lg-6 p-lg-0 text-left mt-2 ${all.status === 'Not Exist' ? 'text-danger' : 'text-primary'}`}>
                                        {task.sub_category_name}
                                        </div>
                                      </div>
                                
                                      { task.follow_ups.length > 0 &&
                                      task.follow_ups.map((follow_up, i) => {
                                        return (
                                          <React.Fragment key={i}>
                                            { type_1.some(item => follow_up.content_type === item) &&
                                              <div className="row">
                                                <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                                {follow_up.label}
                                                </div>
                                                <div className="col-12 col-lg-5 p-lg-0 text-left text-primary mt-2">
                                                  <img onClick={() => this.setState({isOpen4: true, imgIndex2: idx})} src={follow_up.body} className="image-task pointerYes" alt="" />
                                                  {imgIndex2 === idx && isOpen4 === true &&
                                                    <Lightbox isOpen={isOpen4} images={task.follow_ups[0].body} confirmClose={() => this.setState({isOpen4: false})}/>
                                                  }
                                                </div>
                                                <div className="col-12 col-lg-4 p-lg-0 text-primary mt-2">
                                                  <button className="btn btn-link text-danger" onClick={() => this.downloadImage(follow_up.body, task.sub_category_name)} ><IconDownload/></button>
                                                </div>
                                              </div>
                                            }
                                            { type_2.some(item => follow_up.content_type === item) &&
                                            <div className="row">
                                              <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                              {follow_up.label}
                                              </div>
                                              <div className="col-12 col-lg-8 p-lg-0 text-left text-primary mt-2">
                                              {follow_up.body}
                                              </div>
                                            </div>
                                            }
                                          </React.Fragment>
                                        )
                                      })
                                      }
        
                                      { all.status !== "Open" && task.action_by !== ""  && task.action_by !== " " &&
                                        <div className="row">
                                          <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                          {languages.actionBy}
                                          </div>
                                          <div className="col-12 col-lg-6 p-lg-0 text-left mt-2 text-primary">
                                          {task.action_by}
                                          </div>
                                        </div>
                                      }
                                      { all.status !== "Open" && task.action_date !== "0001-01-01T00:00:00Z" &&
                                        <div className="row">
                                          <div className="col-12 col-lg-3 p-lg-0 text-left mt-2" >
                                          {languages.actionDate}
                                          </div>
                                          <div className="col-12 col-lg-6 p-lg-0 text-left mt-2 text-primary">
                                            {task.action_date ? moment(task.action_date, "YYYY-MM-DD").format("DD MMMM YYYY") : "-"}
                                          </div>
                                        </div>
                                      }
                                  </React.Fragment>
                                )
                              })}
                              </div>
                            </React.Fragment>
                            }
                            
                          </React.Fragment>
                          }
                          </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                    }

                  </div>
                </div>
                <hr className="content-hr"/>
                <div className="col-12 mb-0">
                  <div className="col-12 form-inline">
                    <div className="col-lg-10">
                      <Link to="/reviews" className="btn btn-default w-20">Back</Link>
                    </div>
                    { all.status === 'Open' && auth.authority["add_todo_list"] === "Full Access" &&
                    <div className="col-2">
                        <Link to={`/reviews/edit/${all.id}`} className="btn btn-danger w-50">Edit
                        </Link>
                    </div>
                    }
                    { all.status === 'Done' && auth.authority["add_todo_list"] === "Full Access" &&
                    <div className="col-1">
                        <button className="btn btn-primary" onClick={() => this.statusVerified(all.id, 'Verified')}>Verified
                        </button>
                    </div>
                    }
                    { all.status === 'Done' && auth.authority["add_todo_list"] === "Full Access" &&
                    <div className="col-1">
                      <button className="btn btn-danger" onClick={() => this.statusVerified(all.id, 'Reject')}>Reject
                      </button>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
        </div>
      
        </React.Fragment>
        }
      </div>
    );
  }
}

export default connect(
  ({auth, reviews, todo_list}) => ({ auth, reviews, todo_list}),
  { getReview, getToDoDetail, updateStatusTodoList, getToDoDetailV2}
)(Detail)
