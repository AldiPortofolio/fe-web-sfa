import React from "react";
import { find, debounce, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getReview,
  createReview,
  searchMerchants,
  searchMerchantsV2,
  getMerchant,
  getMerchantV2,
  getMerchantRecruit,
  searchMerchantsRecruit,
} from "../../actions/review";
import { updateTodoList, updateTodoListV2, getToDoDetail } from "../../actions/todo_list";
import {
  ReviewBulk,
  ModalConfirm,
  LoadingDots,
  NotAuthorize,
  SelectLineComponent,
  DatePickerSelect,
  SelectRequired,
} from "../../components";
import { IconPlus, IconTrash } from "../../components/Icons";
import { getCategoryList } from "../../actions/category_list";
import axios from "../../actions/config";
import moment from "moment";
import { getSubCategory } from "../../actions/sub_category";
import { findSalesByPhone, getSale } from "../../actions/sale";
import { ind, en } from "../../languages/reviews";

const categoryMerchants = [
  { value: "Existing", label: "Existing" },
  { value: "New Recruitment", label: "New Recruitment" },
];

class New extends React.Component {
  state = {
    review: [],
    keyword: "",
    selectedMerchant: {},
    selectCategory: "",
    selectedPhone: "",
    sub_category: [],
    sub_category_list: [],
    sub_category_data: "",
    selectSubCategory: [{ value: "", label: "" }],
    category_merchant: {},
    merchants: [],
    merchantsRecruit: [],
    merchant: {},
    taskDate: "",
    dateStatus: 0,
    task: "",
    confirmIsOpen: false,
    type: "success",
    textSuccess: "",
    textError: "",
    textReason: "",
    isLoading: false,
    notes: "",
    all: {},
    salesman: [],
    sales: {},
    messages: [],
    task_attributes: [],
    languages: {},
  };

  componentWillMount() {
    const {
      auth: { access_token },
      match,
      getToDoDetail,
      getSale,
      getCategoryList,
    } = this.props;
    axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.edit });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.edit });
    }

    getToDoDetail(match.params.id).then((data) => {
      if (data.meta.status === false) {
        this.setState({
          confirmIsOpen: true,
          type: "error",
          textError: data.meta.message,
          textReason: data.meta.message,
        });
      } else {
        let taskDate = data.data.task_date;
        let taskDateformat = moment(taskDate, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        let merchant_detail = data.data.merchant_detail;
        let selectedMerchant = {
          value: data.data.mid,
          label: merchant_detail.merchant_name,
        };

        if (data.data.category_name === "New Recruitment") {
          getCategoryList("New Recruitment").then((category) => {
            this.setState({
              selectCategory: find(category, {
                value: this.state.all.todolist_category_id,
              })
                ? find(category, { value: this.state.all.todolist_category_id })
                : {},
              category_merchant: {
                value: "New Recruitment",
                label: "New Recruitment",
              },
            });
          });
        } else {
          getCategoryList("Existing").then((category) => {
            this.setState({
              selectCategory: find(category, {
                value: this.state.all.todolist_category_id,
              })
                ? find(category, { value: this.state.all.todolist_category_id })
                : {},
              category_merchant: { value: "Existing", label: "Existing" },
            });
          });
        }

        // getSubCategory(selectCategory.value)
        // 	.then((data) => {
        // 		let subCategory2 = []
        // 		if(data.length > 0){
        // 			data.forEach((subcategory) => {
        // 				subCategory2.push({value: subcategory.value, label: subcategory.label})
        // 			})
        // 			this.setState({sub_category_list: subCategory2})
        // 		}else{
        // 			this.setState({sub_category_list: []})
        // 		}
        // 	})

        if (data.data.possible_sales) {
          let possSales = data.data.possible_sales[0];
          getSale(possSales.id).then((data) => {
            let phone = data.data.phone;
            let phoneSales = phone.substring(1, phone.length);
            let selectedPhone = {
              value: data.data.id,
              label:
                phoneSales +
                " - " +
                data.data.first_name +
                " " +
                data.data.last_name,
            };
            this.setState({ sales: data.data, selectedPhone: selectedPhone });
          });
        }

        this.setState({
          all: data.data,
          merchant: merchant_detail,
          possible_sales: data.data.possible_sales,
          tasks: data.data.tasks,
          taskDate: taskDateformat,
          sub_category_data: data.data.tasks,
          selectedMerchant: selectedMerchant,
          notes: data.data.notes,
          selectedPhone: data.data.sales_phone,
        });

        let messages2 = this.state.messages;
        let tasks = this.state.task_attributes;

        this.state.sub_category_data.map((task) =>
          tasks.push({
            sub_category_id: task.todolist_sub_category_id.toString(),
            supplier_name: task.supplier_name,
            file_edukasi: task.file_edukasi,
          })
        );
        this.setState({ task_attributes: tasks });

        this.state.sub_category_data.map((sub) =>
          messages2.push({
            value: sub.todolist_sub_category_id,
            label: sub.sub_category_name,
          })
        );
        this.setState({ messages: messages2 });
      }
    });
  }

  componentDidMount() {
    document.title = "SFA OTTO - Edit To-do List";
  }

  filterMerchants = (inputValue) => {
    let newMerchants = [];
    let keyword = inputValue.toString();

    if (keyword.length > 0) {
      newMerchants.push({ value: "", label: "Searching...", disabled: true });
      this.setState({ merchants: newMerchants });

      this.props.searchMerchantsV2({ keyword: keyword }).then((data) => {
        let newMerchants = [];
        data.data.forEach((merchant) => {
          newMerchants.push({
            value: merchant.merchant_id,
            label: merchant.name,
          });
        });
        this.setState({ merchants: newMerchants });
      });
    } else {
      newMerchants.push({ value: "", label: "No Options", disabled: true });
      this.setState({ merchants: newMerchants });
    }
  };

  filterMerchantsRecruit = (inputValue) => {
    let newMerchants = [];
    let keyword = inputValue.toString();

    if (keyword.length > 0) {
      newMerchants.push({
        value: "",
        label: "Searching...",
        customer_code: "",
        disabled: true,
      });
      this.setState({ merchantsRecruit: newMerchants });

      this.props.searchMerchantsRecruit({ keyword: keyword }).then((data) => {
        let newMerchants = [];
        data.data.map((merchant) => {
          return newMerchants.push({
            value: merchant.phone_number,
            label: merchant.name,
            customer_code: merchant.customer_code,
          });
        });

        this.setState({ merchantsRecruit: newMerchants });
      });
    } else {
      newMerchants.push({
        value: "",
        label: "No Options",
        customer_code: "",
        disabled: true,
      });
      this.setState({ merchantsRecruit: newMerchants });
    }
  };

  filterSalesman = (inputValue) => {
    let newSales = [];
    let keyword = inputValue.toString();

    if (keyword.length > 0) {
      newSales.push({ value: "", label: "Searching...", disabled: true });
      this.setState({ salesman: newSales });

      this.props.findSalesByPhone(inputValue).then((data) => {
        let newSales = [];
        if (data.data !== null) {
          data.data.forEach((sales) => {
            newSales.push({ value: sales.id, label: `${sales.sales}` });
          });
        }
        this.setState({ salesman: newSales });
      });
    } else {
      newSales.push({ value: "", label: "No Options", disabled: true });
      this.setState({ salesman: newSales });
    }
  };

  filterMessages(messages) {
    let task = [];

    messages.forEach((message) => {
      if (!isEmpty(message.task)) {
        let thisValue;
        let lastValue = messages[messages.length - 1] === message;

        if (message.check) {
          thisValue = lastValue ? `(i)${message.task}` : `(i)${message.task}$ `;
        } else {
          thisValue = lastValue ? `${message.task}` : `${message.task}$ `;
        }
        task.push(thisValue);
      }
    });

    return task.join(" ");
  }

  dateValidation = (inputDate) => {
    var dateNow = new Date();
    var dateNow2 = moment(dateNow, "DD-MM-YYYY");
    dateNow2 = moment(dateNow2, "DD-MM-YYYY").format("YYYY-MM-DD");

    // var last = new Date(dateNow.getTime() + (6 * 24 * 60 * 60 * 1000));
    // var day = last.getDate();
    // var month = last.getMonth()+1;
    // var year = last.getFullYear();
    // var finalDate = day + '-' + month + '-' + year
    // finalDate = moment(finalDate, 'DD-MM-YYYY')

    if (inputDate < dateNow2) {
      this.setState({ dateStatus: 1 });
    } else {
      this.setState({ dateStatus: 0 });
    }
  };

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {};
  }

  render() {
    const {
      auth,
      getMerchant,
      getMerchantV2,
      history,
      category_list,
      getSubCategory,
      updateTodoList,
	  updateTodoListV2,
      getSale,
      getMerchantRecruit,
    } = this.props;
    const {
      merchants,
      merchantsRecruit,
      selectedMerchant,
      selectCategory,
      sub_category,
      sub_category_list,
      salesman,
      sales,
      selectedPhone,
      merchant,
      taskDate,
      dateStatus,
      messages,
      task_attributes,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      isLoading,
      notes,
      all,
      category_merchant,
      languages,
    } = this.state;

    if (
      auth.isAuthenticated &&
      (auth.authority["add_todo_list"] === "" ||
        auth.authority["add_todo_list"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    return (
      <div className="container mb-5 noSelect">
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() => history.push("/reviews")}
          textSuccess={textSuccess}
          textError={textError}
          textReason={textReason}
        />

        <div className="row">
          <div className="col-12 mb-3">
            <h2>
              {languages.header} (ID-{all.id})
            </h2>
          </div>

          <form
            className="col-12"
            onSubmit={(e) => {
              e.preventDefault();

              if (selectCategory && sub_category) {
                this.setState({ isLoading: true });
                var salesphone = "";
                if (selectedPhone !== "") {
                  var phone = sales.phone;
                  salesphone = phone.substring(1, phone.length);
                }

                updateTodoListV2({
                  id: all.id.toString(),
                  merchant_id: merchant.merchant_id,
                  sales_phone: salesphone,
                  category_id: selectCategory.value.toString(),
                  task_date: taskDate,
                  notes: notes,
                  task_attributes: task_attributes,
				  sales_type_id: merchant.sales_type_id
                })
                  .then((data) => {
                    if (data.meta.status === false) {
                      this.setState({
                        isLoading: false,
                        confirmIsOpen: true,
                        type: "error",
                        textError: "Update To-do List fail!",
                        textReason: data.meta.message,
                      });
                    } else {
                      this.setState({
                        isLoading: false,
                        confirmIsOpen: true,
                        type: "success",
                        textError: "",
                        textSuccess: "Update To-do List success!",
                        textReason: "",
                      });
                    }
                  })
                  .catch((e) => {
                    this.setState({
                      isLoading: false,
                      confirmIsOpen: true,
                      type: "error",
                      textError: `Update To-do List fail!`,
                      textReason: e.message,
                    });
                  });
              } else if (selectCategory === "") {
                this.setState({
                  isLoading: false,
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Update To-do List fail!",
                  textReason: "Please select category",
                });
              } else if (sub_category === "") {
                this.setState({
                  isLoading: false,
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Update To-do List fail!",
                  textReason: "Please select sub category",
                });
              } else {
                this.setState({
                  isLoading: false,
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Update To-do List fail!",
                  textReason: "Please check all field",
                });
              }
            }}
          >
            <div className="row">
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header2}</h6>

                    <div className="form-group mb-2 mt-3 w-50">
                      <label>{languages.categoryMerchant}</label>
                      <div className="form-group custom-select-line">
                        <SelectRequired
                          options={categoryMerchants}
                          onChange={(category_merchant) => {
                            this.setState({ category_merchant });
                          }}
                          value={category_merchant}
                          isDisabled
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3 mb-2 w-50">
                      <label>{languages.merchant}</label>
                      {/* <SelectAsync placeholder="Type merchant name or MID" initValue={selectedMerchant} options={merchants} handleChange={(selectedMerchant) => {

								getMerchant({merchant_id: selectedMerchant.value})
									.then((data) => {
									this.setState({merchant: data.data, selectedMerchant: selectedMerchant})
									})
								}} 
								onInputChange={debounce((value) => {
									if(value !== ''){
										this.filterMerchants(value)}
									}, 500)
								}  
								></SelectAsync> */}
                      {category_merchant.value === "Existing" ? (
                        <SelectRequired
                          placeholder="Type merchant name or phone"
                          value={selectedMerchant}
                          options={merchants}
                          onChange={(selectedMerchant) => {
                            getMerchantV2({
                              merchant_id: selectedMerchant.value,
                            }).then((data) => {
                              this.setState({
                                merchant: data.data,
                                selectedMerchant,
                              });
                            });
                          }}
                          onInputChange={debounce((value) => {
                            if (value !== "") {
                              this.filterMerchants(value);
                            }
                          }, 500)}
                          required
                        />
                      ) : (
                        <SelectRequired
                          placeholder="Type merchant name or phone"
                          value={selectedMerchant}
                          options={merchantsRecruit}
                          onChange={(selectedMerchant) => {
                            getMerchantRecruit({
                              phone_number: selectedMerchant.value,
                              customer_code: selectedMerchant.customer_code,
                            }).then((data) => {
                              this.setState({
                                merchant: data.data,
                                selectedMerchant,
                              });
                            });
                          }}
                          onInputChange={debounce((value) => {
                            if (value !== "") {
                              this.filterMerchantsRecruit(value);
                            }
                          }, 500)}
                          required
                        />
                      )}
                    </div>
                  </div>
                  {isEmpty(merchant) || (
                    <div className="card-footer border-top pt-4">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-2">
                            {/* <img src={process.env.REACT_APP_IMAGE_URL + merchant.image} className="avatar-circle" /> */}
                            <img
                              src={merchant.merchant_image}
                              className="avatar-circle"
                              alt=""
                            />
                          </div>
                          <div className="col-5">
                            <h6 className="mb-2">{merchant.merchant_name}</h6>
                            <p className="mb-2">
                              MID {merchant.merchant_id || "-"}
                            </p>
                            <p className="mb-2">
                              {merchant.owner_name} - {merchant.merchant_phone}
                            </p>
                            <p className="mb-2">{merchant.sub_area || "-"}</p>
                            <br />
                            <p className="mb-2">Catatan:</p>
                            <p className="mb-2">{merchant.notes || "-"}</p>
                          </div>
                          <div className="col-5">
                            <p>{merchant.address || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="card-body">
                    <div className="form-group mb-2 w-50">
                      <label>{languages.notes}</label>
                      <input
                        onChange={(e) =>
                          this.setState({ notes: e.target.value })
                        }
                        value={notes}
                        type="text"
                        className="form-control form-control-line"
                        placeholder="Type notes"
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h6>{languages.header3}</h6>
                    <div className="form-group mt-3 mb-0 w-50">
                      <label>{languages.specific}</label>
                      <SelectRequired
                        type="number"
                        placeholder="Type sales phone"
                        value={selectedPhone}
                        options={salesman}
                        onChange={(input) => {
                          getSale(input.value).then((data) => {
                            this.setState({
                              sales: data.data,
                              selectedPhone: input,
                            });
                          });
                        }}
                        onInputChange={debounce((value) => {
                          if (value !== "") {
                            this.filterSalesman(value);
                          }
                        }, 500)}
                      />
                    </div>
                  </div>
                  {isEmpty(sales) || (
                    <div className="card-footer border-top">
                      <div className="col-12">
                        <div className="row">
                          <div className="avatar mr-3 d-flex justify-content-center align-items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-user"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div className="col-6 d-flex flex-column ">
                            <label className="mt-3">
                              {sales.first_name} {sales.last_name}
                            </label>
                          </div>
                          <div className="col-4 text-center d-flex flex-column align-items-center justify-content-center">
                            <strong className="mb-0">
                              <small>Status</small>
                            </strong>
                            <span
                              className={`badge ${
                                sales.status === "Unregistered"
                                  ? "badge-gray"
                                  : "badge-status"
                              }`}
                            >
                              {sales.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="card-body">
                    <div className="form-group mt-0 w-50">
                      <label>{languages.category}</label>
                      <div className="custom-select-line">
                        <SelectLineComponent
                          options={category_list.data}
                          initValue={selectCategory}
                          handleChange={(selectCategory) =>
                            this.setState({
                              selectCategory,
                              messages: [""],
                              task_attributes: [
                                { sub_category_id: "", supplier_name: "" },
                              ],
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group mt-3 w-50">
                      <label>{languages.taskDate}</label>
                      <div className="custom-select-line">
                        <DatePickerSelect
                          handleChange={(taskDate) =>
                            this.setState({ taskDate }, () =>
                              this.dateValidation(taskDate)
                            )
                          }
                          value={taskDate}
                          required
                        />
                      </div>
                      {dateStatus === 1 && (
                        <small className="text-danger">
                          Can't back dated from today.
                        </small>
                      )}
                    </div>
                    {messages.map((message, idx) => (
                      <div className={idx > 0 ? "border-top" : ""} key={idx}>
                        <div className="form-group mt-3 w-50">
                          <div className="form-inline">
                            <div className="form-group mb-3">
                              <label className="text-primary">
                                {languages.task} {idx + 1}
                              </label>
                            </div>
                            <div className="col-7"></div>
                            <div className="ml-5 mb-3">
                              {idx > 0 && idx === messages.length - 1 && (
                                <span
                                  className="text-gray-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    let newMessages = messages;
                                    let tasks = task_attributes;
                                    newMessages.splice(idx, 1);
                                    tasks.splice(idx, 1);

                                    this.setState({
                                      messages: newMessages,
                                      task_attributes: tasks,
                                    });
                                  }}
                                >
                                  <IconTrash />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label>{languages.sub}</label>
                            <SelectRequired
                              value={message}
                              options={sub_category_list}
                              placeholder="Type Sub Category"
                              onFocus={() => {
                                getSubCategory(selectCategory.value).then(
                                  (data) => {
                                    let subCategory2 = [];

                                    if (data.length > 0) {
                                      data.forEach((subcategory) => {
                                        subCategory2.push({
                                          value: subcategory.value,
                                          label: subcategory.label,
                                        });
                                      });
                                      this.setState({
                                        sub_category_list: subCategory2,
                                      });
                                    } else {
                                      this.setState({ sub_category_list: [] });
                                    }
                                  }
                                );
                              }}
                              onChange={(selectSubCategory) => {
                                let newTask = task_attributes;
                                let message = messages;
                                newTask[idx]["sub_category_id"] =
                                  selectSubCategory.value.toString();
                                message[idx] = selectSubCategory;

                                this.setState({
                                  task_attributes: newTask,
                                  messages: message,
                                });
                              }}
                              required
                            />
                          </div>

                          {messages[idx]["value"] === 15 && (
                            <div className="mb-3">
                              <label>{languages.supplier}</label>
                              <input
                                onChange={(e) => {
                                  let newTask = task_attributes;
                                  newTask[idx]["supplier_name"] =
                                    e.target.value;

                                  this.setState({ task_attributes: newTask });
                                }}
                                value={task_attributes[idx]["supplier_name"]}
                                type="text"
                                className="form-control form-control-line"
                                placeholder="Input Supplier name"
                              />
                            </div>
                          )}
                          {messages[idx]["value"] === 18 && (
                            <div className="mb-3">
                              <label>{languages.edukasi}</label>
                              <div className="form-group mb-2">
                                <input
                                  type="file"
                                  ref="file"
                                  onChange={(e) => {
                                    let newTask = task_attributes;
                                    let file = e.target.files[0];

                                    this.getBase64(file, (result) => {
                                      newTask[idx]["file_edukasi"] = result;
                                      this.setState({
                                        task_attributes: newTask,
                                      });
                                    });
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          )}
                          {idx === messages.length - 1 &&
                            idx < sub_category_list.length - 1 && (
                              <div className="form-inline">
                                <span
                                  className="btn btn-danger btn-circle ml-3"
                                  onClick={() => {
                                    let newMessages = task_attributes;
                                    let message = messages;
                                    newMessages.push({
                                      sub_category_id: "",
                                      supplier_name: "",
                                    });
                                    message.push("");

                                    this.setState({
                                      task_attributes: newMessages,
                                      messages: message,
                                    });
                                  }}
                                >
                                  <IconPlus />
                                </span>
                                <span
                                  className="btn btn-link text-danger"
                                  onClick={() => {
                                    let newMessages = task_attributes;
                                    let message = messages;
                                    newMessages.push({
                                      sub_category_id: "",
                                      supplier_name: "",
                                    });
                                    message.push("");

                                    this.setState({
                                      task_attributes: newMessages,
                                      messages: message,
                                    });
                                  }}
                                >
                                  {languages.addTask}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <ReviewBulk browserHistory={history} />
              </div>
            </div>

            {auth.authority["add_todo_list"] === "Full Access" && (
              <div className="col-12 mb-3">
                <hr className="content-hr" />
                <div className="form-group d-flex justify-content-between">
                  <Link to="/reviews" className="btn btn-default">
                    {languages.cancel}
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-danger ${isLoading ? "disabled" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingDots /> : languages.save}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, reviews, category_list, sub_category }) => ({
    auth,
    reviews,
    category_list,
    sub_category,
  }),
  {
    getReview,
    createReview,
    searchMerchants,
    searchMerchantsV2,
    getMerchant,
    getMerchantV2,
    getCategoryList,
    getSubCategory,
    getToDoDetail,
    updateTodoList,
    findSalesByPhone,
    getSale,
    getMerchantRecruit,
    searchMerchantsRecruit,
	updateTodoListV2
  }
)(New);
