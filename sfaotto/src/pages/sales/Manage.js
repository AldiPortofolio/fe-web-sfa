import React from "react";
import { debounce, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { getRegions } from "../../actions/region";
import { getSales, deleteSale, getSalesV2 } from "../../actions/sale";
import {
  NotAuthorize,
  SelectLineComponent,
  ModalDelete,
  LoadingDots,
  Pagination,
} from "../../components";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { IconDownload, IconUpload, IconSearch } from "../../components/Icons";
import { ind, en } from "../../languages/sales";

const style = {
  link: {
    cursor: "pointer",
  },
};

const statuses = ["Verified", "Registered", "Unregistered", "Inactive"];

// const req = {
//     region_id: null,
//     keyword: "",
//     status: ""
// }

const initState = {
  selectedGender: { value: "", label: "Semua" },
  selectedCompCode: { value: "", label: "Semua" },
  selectedRegion: { value: "", label: "Semua" },
  selectedStatus: [],
  keyword: "",
  id: "",
  // params: '',
  confirmIsOpen: false,
  resultIsOpen: false,
  type: "success",
  languagesFilter: {},
  languagesTable: {},
};

class Manage extends React.Component {
  state = initState;

  componentDidMount() {
    document.title = "SFA OTTO - Manage Sales";

    if (this.props.auth.language === "in") {
      this.setState({ languagesFilter: ind.filter, languagesTable: ind.table });
    } else if (this.props.auth.language === "en") {
      this.setState({ languagesFilter: en.filter, languagesTable: en.table });
    }

    this.fetchSales(window.location.search);
    this.props.getRegions();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchSales(this.props.location.search);
    }
  }

  toggleDropdown(toggle) {
    let obj = {};
    obj[toggle] = !this.state[toggle];
    this.setState(obj);
  }

  hide(e, toggle) {
    setTimeout(() => {
      let obj = {};
      obj[toggle] = !this.state[toggle];
      this.setState(obj);
    }, 200);
  }

  getLastPostion = (sales) => {
    if (!isEmpty(sales.position.sub_area)) {
      return sales.position.sub_area;
    } else if (!isEmpty(sales.position.area)) {
      return sales.position.area;
    } else if (!isEmpty(sales.position.branch)) {
      return sales.position.branch;
    } else if (!isEmpty(sales.position.region)) {
      return sales.position.region;
    }
  };

  filterSales = debounce(() => {
    if (this.props.auth.language === "in") {
      this.setState({ languagesFilter: ind.filter, languagesTable: ind.table });
    } else if (this.props.auth.language === "en") {
      this.setState({ languagesFilter: en.filter, languagesTable: en.table });
    }

    const { selectedRegion, keyword, selectedStatus } = this.state;
    let newParams = "";
    // let status_code =  []

    if (selectedRegion.value) {
      newParams = newParams + `region_id=${selectedRegion.value}`;
    }

    if (selectedStatus.length > 0) {
      newParams = newParams + `status=${selectedStatus.join()}`;
    }

    this.props.getSales({
      status: selectedStatus.join(),
      region_id: selectedRegion.value.toString(),
      keyword,
      params: newParams,
    });
  }, 350);

  fetchSales = (pageNumber) => {
    const { selectedRegion, keyword, selectedStatus } = this.state;
    let page = "?page=1";

    let pages = 0;
    if (pageNumber) {
      page = pageNumber.includes("page") ? pageNumber : "?page=1";
      pages = pageNumber.includes("page")
        ? pageNumber.replace("?page=", "")
        : "1";
    }

    this.props.getSalesV2(
      {
        status: selectedStatus.join(),
        region_id: selectedRegion.value.toString(),
        keyword,
        page: parseInt(pages),
      },
      page
    );
  };

  render() {
    const { auth, deleteSale, regions, sales } = this.props;
    const {
      id,
      confirmIsOpen,
      resultIsOpen,
      type,
      keyword,
      selectedRegion,
      selectedStatus,
      languagesFilter,
      languagesTable,
    } = this.state;

    this.state.selectedRegion = {
      value: "",
      label: this.state.languagesFilter.all,
    };

    if (
      auth.isAuthenticated &&
      (auth.authority["list_all_sales"] === "" ||
        auth.authority["list_all_sales"] === "No Access")
    ) {
      return <NotAuthorize />;
    }

    let newRegions = [];
    regions.data.map((region) =>
      newRegions.push({ value: region.id, label: region.name })
    );

    let newParams = "";

    if (selectedRegion.value) {
      newParams = newParams + `&region_id=${selectedRegion.value}`;
    }

    if (selectedStatus.length > 0) {
      newParams = newParams + `&status=${selectedStatus.join()}`;
    }

    return (
      <div className="container">
        <div className="row">
          <ModalDelete
            confirmIsOpen={confirmIsOpen}
            resultIsOpen={resultIsOpen}
            type={type}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            resultClose={() => this.setState({ resultIsOpen: false })}
            confirmYes={() => {
              this.setState({ confirmIsOpen: false }, () => {
                deleteSale(id)
                  .then((data) => {
                    let updateState = {
                      ...initState,
                      resultIsOpen: true,
                    };
                    this.setState(updateState, () => this.filterSales());
                  })
                  .catch((e) =>
                    this.setState({ resultIsOpen: true, type: "error" })
                  );
              });
            }}
          />
          <div className="col-12">
            <h2>{languagesFilter.header}</h2>
            <div className="actions d-flex justify-content-end mb-3">
              <button className="btn btn-link text-danger">
                <IconDownload />
                {languagesFilter.export}
              </button>
              <button className="btn btn-link text-danger">
                <IconUpload />
                {languagesFilter.import}
              </button>
              {auth.authority["recruitment_sales"] === "Full Access" && (
                <Link
                  to="/sales/recruit"
                  className="btn btn-danger btn-rounded ml-3"
                >
                  {languagesFilter.add}
                </Link>
              )}
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card noSelect">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <form className="form-inline my-3 d-flex justify-content-between">
                      <div className="form-group mr-3">
                        <small className="text-gray">
                          {languagesFilter.filterby}
                        </small>
                        <div
                          style={{ zIndex: "100" }}
                          className="ml-2 dropdown-filter"
                        >
                          <UncontrolledDropdown>
                            <DropdownToggle
                              caret
                              className="select-circle-inner__control"
                            >
                              {selectedRegion.value === "" &&
                                isEmpty(selectedStatus) &&
                                languagesFilter.all}
                              {selectedStatus !== "" &&
                                selectedStatus.length <= 3 &&
                                selectedStatus.join(", ")}
                              {selectedStatus !== "" &&
                                selectedStatus.length > 3 &&
                                "Status: All"}
                              {selectedRegion.value !== "" &&
                                ` - ${selectedRegion.label}`}
                            </DropdownToggle>
                            <DropdownMenu>
                              <div className="py-2 px-3">
                                <small className="text-gray">
                                  <strong>{languagesFilter.status}</strong>
                                </small>
                                {statuses.map((status) => (
                                  <div className="form-group my-1" key={status}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={status}
                                        id={`checkbox-${status}`}
                                        checked={selectedStatus.includes(
                                          status
                                        )}
                                        onChange={(e) => {
                                          let newStatuses = selectedStatus;

                                          if (e.target.checked) {
                                            newStatuses.push(status);
                                          } else {
                                            newStatuses = newStatuses.filter(
                                              (stat) => stat !== status
                                            );
                                          }

                                          this.setState({
                                            selectedStatus: newStatuses,
                                          });
                                        }}
                                      />
                                      <label
                                        className="form-check-label ml-2"
                                        htmlFor={`checkbox-${status}`}
                                      >
                                        {status}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <DropdownItem divider />
                              <div className="py-2 px-3">
                                <small className="text-gray">
                                  <strong>{languagesFilter.regional}</strong>
                                </small>
                                <SelectLineComponent
                                  initValue={selectedRegion}
                                  options={newRegions}
                                  handleChange={(selectedRegion) => {
                                    this.setState({
                                      selectedRegion: selectedRegion,
                                    });
                                  }}
                                ></SelectLineComponent>
                              </div>
                              <DropdownItem divider />
                              <div className="p-3 d-flex justify-content-end">
                                <span
                                  className="btn btn-danger cursor-pointer"
                                  onClick={() => {
                                    this.filterSales();
                                  }}
                                >
                                  {languagesFilter.apply}
                                </span>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        {(selectedRegion.value !== "" ||
                          !isEmpty(selectedStatus)) && (
                          <span
                            className="text-danger ml-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              this.setState(
                                {
                                  selectedRegion: { value: "", label: "All" },
                                  selectedStatus: [],
                                },
                                () => this.filterSales()
                              );
                            }}
                          >
                            {languagesFilter.reset}
                          </span>
                        )}
                      </div>
                      <div className="form-group input-action mr-3 w-30">
                        <IconSearch />
                        <input
                          placeholder={languagesFilter.search}
                          className="form-control form-control-line"
                          value={keyword}
                          onChange={(e) =>
                            this.setState({ keyword: e.target.value }, () =>
                              this.filterSales()
                            )
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="table-fixed">
                <table className="table table-header table-striped mb-0">
                  <thead>
                    <tr>
                      <th width="2%">
                        <input type="checkbox" />
                      </th>
                      <th width="15%">{languagesTable.phone}</th>
                      <th width="20%">{languagesTable.sales}</th>
                      <th width="15%">{languagesTable.tanggallahir}</th>
                      <th width="5%">{languagesTable.status}</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  {sales.loading ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="d-flex justify-content-center align-items-center">
                            <LoadingDots color="black" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {sales.data &&
                        sales.data.map((sale, idx) => {
                          let salesStatus;

                          if (sale.status === "Inactive") {
                            salesStatus = "badge-danger";
                          } else if (sale.status === "Verified") {
                            salesStatus = "badge-status";
                          } else if (sale.status === "Registered") {
                            salesStatus = "badge-status";
                          } else {
                            salesStatus = "badge-gray";
                          }

                          return (
                            <tr key={sale.id + sale.first_name + idx}>
                              <td>
                                <input type="checkbox" />
                              </td>
                              <td className="text-capitalize">{sale.phone}</td>
                              <td>
                                <Link
                                  to={`/sales/detail/${sale.id}`}
                                  style={style.link}
                                >
                                  {sale.first_name} {sale.last_name}
                                </Link>
                              </td>
                              <td>
                                {moment(sale.dob, "YYYY-MM-DD").format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td>
                                <span className={`badge w-100 ${salesStatus}`}>
                                  {sale.status}
                                </span>
                              </td>
                              {auth.authority["recruitment_sales"] ===
                              "Full Access" ? (
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-circle btn-more dropdown-toggle"
                                      type="button"
                                      onClick={() =>
                                        this.toggleDropdown(`show${sale.id}`)
                                      }
                                      onBlur={(e) =>
                                        this.hide(e, `show${sale.id}`)
                                      }
                                      data-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                      </svg>
                                    </button>
                                    <div
                                      className={`dropdown-menu dropdown-menu-icon dropdown-menu-right ${
                                        this.state[`show${sale.id}`]
                                          ? "show"
                                          : ""
                                      }`}
                                      aria-labelledby="dropdownMenuButton"
                                    >
                                      <Link
                                        to={`/sales/edit/${sale.id}`}
                                        className="dropdown-item"
                                        style={style.link}
                                      >
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                                          <line
                                            x1="3"
                                            y1="22"
                                            x2="21"
                                            y2="22"
                                          ></line>
                                        </svg>
                                        {languagesTable.ubah}
                                      </Link>
                                      <span
                                        className="dropdown-item"
                                        style={style.link}
                                        onClick={() =>
                                          this.setState({
                                            id: sale.id,
                                            confirmIsOpen: true,
                                          })
                                        }
                                      >
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                                          <line
                                            x1="12"
                                            y1="2"
                                            x2="12"
                                            y2="12"
                                          ></line>
                                        </svg>
                                        {languagesTable.nonAktif}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              ) : (
                                <td></td>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  )}
                  {!sales.loading && isEmpty(sales.data) && (
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center">
                          There is no Sales
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <div className="card-body border-top">
                <Pagination
                  pages={sales.meta}
                  routeName="sales"
                  parameter={newParams}
                  handleClick={(pageNumber) => this.fetchSales(pageNumber)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, sales, regions }) => ({ auth, sales, regions }),
  { getSales, deleteSale, getRegions, getSalesV2 }
)(Manage);
