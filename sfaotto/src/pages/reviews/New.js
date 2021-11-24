import React from 'react';
import { debounce, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getReview, createReview, searchMerchants, searchMerchantsV2, getMerchantV2, getMerchant, searchMerchantsRecruit, getMerchantRecruit} from '../../actions/review'
import { findSalesByPhone, getSale } from '../../actions/sale'
import { createTodoList, createTodoListV2 } from '../../actions/todo_list'
import { ReviewBulk, 
        ModalConfirm, LoadingDots, 
        NotAuthorize, DatePickerSelect, SelectRequired } from '../../components'
import { IconPlus, IconTrash } from '../../components/Icons'
import { getCategoryList } from '../../actions/category_list'
import axios from '../../actions/config'
import moment from 'moment'
import { getSubCategory } from '../../actions/sub_category'
import { ind, en } from '../../languages/reviews'

const categoryMerchants = [
  {value: 'Existing', label: 'Existing'},
  {value: 'New Recruitment', label: 'New Recruitment'}, 
]


class New extends React.Component {
  state = {
    review: [],
    keyword: '',
    selectedMerchant: '',
    selectCategory: '',
    selectedPhone: '',
    sub_category: [],
    selectSubCategory: [],
    merchants: [],
    merchantsRecruit: [],
    category_merchant: {value: 'Existing', label: 'Existing'},
    salesman: [],
    sales: {},
    merchant: {},
    taskDate: '',
    dateStatus: 0,
    pdfStatus: 0,
    task: '',
    confirmIsOpen: false,
    type: 'success',
    textSuccess: '',
    textError: '',
    textReason: '',
    isLoading: false,
    notes: '',
    uploadEdukasi: '',
    sales_phone: '',
    messages: [
      {sub_category_id: '', supplier_name: '', file_edukasi: ''},
    ],
    languages: {},
  }

  componentWillMount() {
    const { auth: {access_token} } = this.props
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

  }

  componentDidMount(){
    document.title = "SFA OTTO - Create To-do List"

    if (this.props.auth.language === 'in'){
      this.setState({languages: ind.new})
    } else if (this.props.auth.language === 'en'){
      this.setState({languages: en.new})
    }
  }

  filterMerchants = async (inputValue) => {
    let newMerchants = []
    let keyword = inputValue.toString()

    if(keyword.length > 0){
      newMerchants.push({value: '', label: 'Searching...', disabled: true})
      this.setState({merchants: newMerchants})

      this.props.searchMerchantsV2({keyword: keyword})
      .then((data) => {
        let newMerchants = []
        if(data.data != null){
          data.data.map((merchant) => {
            return newMerchants.push({value: merchant.merchant_id, label: merchant.phone_number + " - " + merchant.name})
          })
        }
        this.setState({merchants: newMerchants})
      })
    }else{
      newMerchants.push({value: '', label: 'No Options', disabled: true})
      this.setState({merchants: newMerchants})
    }
  };

  filterMerchantsRecruit = (inputValue) => {
    let newMerchants = []
    let keyword = inputValue.toString()

    if(keyword.length > 0){
      newMerchants.push({value: '', label: 'Searching...', customer_code: '', disabled: true})
      this.setState({merchantsRecruit: newMerchants})

      this.props.searchMerchantsRecruit({keyword: keyword})
      .then((data) => {
        let newMerchants = []
        data.data.map((merchant) => {
          return newMerchants.push({value: merchant.phone_number, label: merchant.name, customer_code: merchant.customer_code})
        })

        this.setState({merchantsRecruit: newMerchants})
      })
    }else{
      newMerchants.push({value: '', label: 'No Options', customer_code: '', disabled: true})
      this.setState({merchantsRecruit: newMerchants})
    }
  };

  filterSalesman = (inputValue) => {
    let newSales = []
    let keyword = inputValue.toString()

    if(keyword.length > 0){
      newSales.push({value: '', label: 'Searching...', disabled: true})
      this.setState({salesman: newSales})

      this.props.findSalesByPhone(inputValue)
      .then((data) => {
        let newSales = []
        if (data.data !== null) {
          data.data.forEach((sales) => {
            newSales.push({value: sales.id, label: `${sales.sales}`})
          })
        }

        this.setState({salesman: newSales})
      })
    }else{
      newSales.push({value: '', label: 'No Options', disabled: true})
      this.setState({salesman: newSales})
    }
  };

  filterMessages(messages){
    let task = []

    messages.map((message) =>{
      let thisValue = ''
      if(!isEmpty(message.task)){
        let lastValue = messages[messages.length - 1] === message

        if(message.check){
          thisValue = lastValue ? `(i)${message.task}` : `(i)${message.task}$ `
        }else{
          thisValue = lastValue ? `${message.task}` : `${message.task}$ `
        }

        task.push(thisValue)
      }
      return task.push(thisValue)
    })

    return task.join(" ")
  }

  dateValidation = (inputDate) => {
    
    var dateNow = new Date()
    var dateNow2 = moment(dateNow, 'DD-MM-YYYY')
    dateNow2 = moment(dateNow2, 'DD-MM-YYYY').format('YYYY-MM-DD')

    if (inputDate < dateNow2) {
      this.setState({dateStatus: 1})
    } else {
      this.setState({dateStatus: 0})
    }
  }

  pdfValidation = (file, idx) => {
    let newMessages = this.state.messages
    let pdfCheck = ""
    if (file.name !== undefined) {
      pdfCheck = file.name.substring(file.name.length, file.name.length-4)
    }

    if (pdfCheck === ".pdf") {
      this.setState({pdfStatus: 0})
      this.getBase64(file, (result) => {
        newMessages[idx]["file_edukasi"] = result
        this.setState({messages: newMessages})
      });
    }else{
      this.setState({pdfStatus: 1})
    }
  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
    };
  }

  render() {

    const { auth, getMerchantRecruit, history, category_list, getSubCategory, createTodoList, getSale, getCategoryList, getMerchantV2, createTodoListV2 } = this.props
    const { 
      merchants,
      merchantsRecruit,
      salesman,
      sales,
      selectedMerchant,
      selectCategory,
      selectSubCategory,
      selectedPhone,
      category_merchant,
      sub_category,
      merchant,
      taskDate,
      dateStatus,
      pdfStatus,
      messages,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      isLoading,
      notes,
      languages
     } = this.state

    if (auth.isAuthenticated && (auth.authority["add_todo_list"] === "" || auth.authority["add_todo_list"] === "No Access")) {
      return <NotAuthorize />
    }

    return (
      <div className="container mb-5 noSelect">
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
          <div className="col-12 mb-3">
            <h2>{languages.header}</h2>
          </div>

          <form className="col-12" onSubmit={(e) => {
            e.preventDefault()

            if(dateStatus !== 1){
              if (pdfStatus === 1) {
                this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Create To-do List fail! Please check upload file edukasi.', textReason: ''})
              }else{
                this.setState({isLoading: true})
                var salesphone = ''
                if (selectedPhone !== '' ) {
                  var phone = sales.phone
                  salesphone = phone.substring(1,phone.length)
                }

                createTodoListV2({
                  address: merchant.address,
                  address_benchmark: merchant.address_benchmark,
                  owner_name: merchant.owner_name,
                  mid: `${merchant.merchant_id ? merchant.merchant_id : ''}`,
                  merchant_id: merchant.id,
                  merchant_phone: merchant.merchant_phone,
                  merchant_name: merchant.merchant_name,
                  customer_code: `${merchant.customer_code ? merchant.customer_code : ''}`,
                  todolist_category_id: selectCategory,
                  village_id: parseInt(merchant.village_id),
                  sales_phone: salesphone,
                  task_date: taskDate,
                  notes: notes,
                  task_attributes: messages,
                  sales_type_id: merchant.sales_type_id
                })
                .then(data => {
                  if(data.meta.status === false){
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: data.meta.message,})
                  }else{
                    this.setState({isLoading: false, confirmIsOpen: true, type: 'success', textError: '', textSuccess: languages.sukses, textReason: ''})
                  }
                })
                .catch(e => {
                  this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: `${languages.gagal} merchant ${e.message}`})
                })
              }

            }else{
              this.setState({isLoading: false, confirmIsOpen: true, type: 'error', textError: 'Ups!', textReason: languages.textErr})
            }

          }}>
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header2}</h6>

                    <div className="form-group mb-2 mt-3 w-50">
                      <label>{languages.categoryMerchant}</label>
                      <div className="form-group custom-select-line">
                          <SelectRequired options={categoryMerchants} 
                          onChange={(category_merchant) => {
                            this.setState({category_merchant})
                          }} value={category_merchant} required />
                      </div>
                    </div>

                    <div className="form-group mt-3 mb-2 w-50">
                      <label>{languages.merchant}</label>
                      {category_merchant.value === 'Existing' 
                        ?<SelectRequired placeholder="Type merchant name or phone" value={selectedMerchant} options={merchants} 
                          onChange={(selectedMerchant) => {
                            getMerchantV2({merchant_id: selectedMerchant.value})
                              .then((data) => {
                                this.setState({merchant: data.data, selectedMerchant: selectedMerchant})

                              })
                            getCategoryList(category_merchant.value)
                          }} 
                          
                          onInputChange={debounce( async (value) => {
                            if(value !== ''){await this.filterMerchants(value)}
                          }, 500)} 
                          required
                        />
                        :
                        <SelectRequired placeholder="Type merchant name or phone" value={selectedMerchant} options={merchantsRecruit} 
                          onChange={(selectedMerchant) => {
                            getMerchantRecruit({phone_number: selectedMerchant.value, customer_code: selectedMerchant.customer_code})
                              .then((data) => {
                                this.setState({merchant: data.data, selectedMerchant: selectedMerchant})
                              })
                            getCategoryList(category_merchant.value)
                          }} 
                          
                          onInputChange={debounce((value) => {
                            if(value !== ''){this.filterMerchantsRecruit(value)}
                          }, 500)} 
                          required
                        />
                      }
                      
                    </div>
                  </div>
                  { isEmpty(merchant) ||
                    <div className="card-footer border-top pt-4">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2">
                            { merchant.merchant_image ?
                              <img src={merchant.merchant_image} className="avatar-circle" alt=""/>
                              :
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="avatar-circle feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            }
                            
                          </div>
                          <div className="col-5">
                            <h6 className="mb-2">{merchant.merchant_name}</h6>
                            <p className="mb-2">MID {merchant.merchant_id || "-"}</p>
                            <p className="mb-2">{merchant.owner_name} - {merchant.merchant_phone}</p>
                            <p className="mb-2">{merchant.sub_area || "-"}</p><br/>
                            <p className="mb-2">Catatan:</p>
                            <p className="mb-2">{merchant.notes || "-"}</p>
                          </div>
                          <div className="col-5">
                            <p>{merchant.address || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="card-body">
                    <div className="form-group mb-2 w-50">
                      <label>{languages.notes}</label>
                      <input onChange={e => this.setState({notes: e.target.value})} value={notes} type="text" className="form-control form-control-line" placeholder="Type notes" />
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header3}</h6>
                    <div className="form-group mt-3 mb-0 w-50">
                      <label>{languages.specific}</label>
                      <SelectRequired placeholder="Type sales phone" value={selectedPhone} options={salesman} 
                      
                      onChange={(input) => {

                        getSale(input.value)
                          .then((data) => {
                            this.setState({sales: data.data, selectedPhone: input})

                          })
                      }} 
                      
                      onInputChange={debounce((value) => {
                        if(value !== ''){this.filterSalesman(value)}
                      }, 500)} 

                      />
                    </div>
                  </div>
                  { isEmpty(sales) ||
                    <div className="card-footer border-top">
                      <div className="col-12">
                        <div className="row">
                        <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </div>
                          <div className="col-6 d-flex flex-column ">
                            <label className="mt-3">{sales.first_name} {sales.last_name}</label>
                          </div>
                          <div className="col-4 text-center d-flex flex-column align-items-center justify-content-center">
                            <strong className="mb-0"><small>Status</small></strong>
                            <span className={`badge ${sales.status === 'Unregistered' ? 'badge-gray' : 'badge-status'}`}>{sales.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="card-body">
                    <div className="form-group w-50">
                      <label>{languages.category}</label>
                      <div className="form-group custom-select-line">
                          <SelectRequired options={category_list.data} onChange={(selectCategory) => {

                            this.setState({selectCategory: selectCategory.value, 
                              messages: [{sub_category_id: "", supplier_name: ""}], 
                              selectSubCategory: [""]})
                          }} value={selectCategory.value} required />
                      </div>
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.taskDate}</label>
                      <div className="custom-select-line">
                        <DatePickerSelect handleChange={taskDate => this.setState({taskDate}, () => this.dateValidation(taskDate))} value={taskDate} required/>
                      </div>
                      { dateStatus === 1 && <small className="text-danger">{languages.err1}</small>
                      }
                    </div>
                    { messages.map((message, idx) => (
                      <div className={idx > 0 ? "border-top" : ""} key={idx}>
                        <div className="form-group mt-3 w-50">
                          <div className="form-inline">
                            <div className="form-group mb-3">
                              <label className="text-primary">{languages.task} {idx+1}</label>
                            </div>
                            <div className="col-7"> </div>
                            <div className="ml-5 mb-3">
                              { idx > 0 && idx === (messages.length - 1) && idx < sub_category.length &&
                                <span className="text-gray-danger" style={{cursor: "pointer"}}
                                  onClick={() => {
                                    let newMessages = messages
                                    newMessages.splice(idx, 1 )
        
                                    this.setState({messages: newMessages})
                                  }}>
                                  <IconTrash/>
                                </span>
                              }
                            </div>
                          </div>
                          <div className="mb-3">
                            <label>{languages.sub}</label>
                            <SelectRequired
                              value={selectSubCategory[idx]}
                              options={sub_category}
                              placeholder="Type Sub Category"
                              onFocus={() => {
                                
                                getSubCategory(selectCategory).then((data) => {
                                  let subCategory2 = []

                                  if(data.length > 0){
                                    data.map((subcategory) => {
                                      return subCategory2.push({value: subcategory.value, label: subcategory.label})
                                    })
                                    this.setState({sub_category: subCategory2})
                                  }else{
                                    this.setState({sub_category: []})
                                  }
                                })
                                
                              }}
                              onChange={(subCategory) => {
                                let newMessages = messages
                                let selectSub = selectSubCategory
                                newMessages[idx]["sub_category_id"] = subCategory.value.toString()
                                selectSub[idx] = subCategory

                                this.setState({messages: newMessages, selectSubCategory: selectSub})
                              }}
                              required/>
                          </div>
                          { messages[idx]["sub_category_id"] === '15' &&
                          <div className="mb-3">
                            <label>{languages.supplier}</label>
                            <input onChange={e => {

                              let newMessages = messages
                              newMessages[idx]["supplier_name"] = e.target.value

                              this.setState({messages: newMessages})
                              }}  value={messages[idx]["supplier_name"]} type="text" className="form-control form-control-line" placeholder="Input Supplier name" required/>
                          </div>
                          }
                          { messages[idx]["sub_category_id"] === '18' &&
                          <div className="mb-3">
                            <label>{languages.edukasi}</label>
                            <div className="form-group mb-2">
                                <input type='file' ref='file' onChange={e => {
                                let file = e.target.files[0]
                                this.pdfValidation(file, idx)
                                }} required/>
                            </div>
                            { pdfStatus === 1 && <small className="text-danger">{languages.uploadFailed}</small>}
                            {/* <div className="d-flex justify-content-between">
                              <a href="#" className={`btn btn-block ${upload === '' ? 'btn-danger disabled' : 'btn-danger'}`} onClick={() =>{
                                // this.uploadEdukasi()
                                let newMessages = messages
                                newMessages[idx]["file_edukasi"] = this.refs.file.files
                              }}>Upload</a>
                            </div> */}
                          </div>
                          }

                          { idx === (messages.length - 1) && idx < sub_category.length-1 &&
                          <div className="form-inline">
                            <span className="btn btn-danger btn-circle ml-3" onClick={() => {
                              let newMessages = messages
                              newMessages.push({sub_category_id: "", supplier_name: ""})

                              this.setState({messages: newMessages})
                            }}>
                              <IconPlus />
                            </span>
                            <span className="btn btn-link text-danger" onClick={() => {
                              let newMessages = messages
                              newMessages.push({sub_category_id: "", supplier_name: ""})

                              this.setState({messages: newMessages})
                            }}>{languages.addTask}</span>
                          </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <ReviewBulk browserHistory={history}/>
              </div>
            </div>

            { auth.authority["add_todo_list"] === "Full Access" &&
              <div className="col-12 mb-3">
                <hr className="content-hr"/>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/reviews" className="btn btn-default">{languages.cancel}</Link>
                  <button type="submit" className={`btn btn-danger ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                    { isLoading ? <LoadingDots/> : languages.save}
                  </button>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({auth, reviews, category_list, sub_category}) => ({ auth, reviews, category_list, sub_category }),
  { getReview, createReview, searchMerchants, searchMerchantsV2, searchMerchantsRecruit, getMerchantRecruit, getMerchant, getMerchantV2, getCategoryList, getSubCategory, createTodoList, findSalesByPhone, getSale, createTodoListV2 }
)(New)
