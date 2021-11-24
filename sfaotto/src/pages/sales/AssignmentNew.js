import React from "react";
import { find, includes, debounce } from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isNaN, isEmpty } from "lodash";
import { getRegions } from "../../actions/region";
import { searchBranch } from "../../actions/branch";
import { searchAreas } from "../../actions/area";
import { searchSubAreas } from "../../actions/subarea";
import {
  getSale,
  getSalesRoles,
  findSales,
  getSalesManagementDetail,
  positionAssignment,
  relationCheck,
} from "../../actions/sale";
import {
  NotAuthorize,
  ModalConfirm,
  SelectLineComponent,
  SelectAsync,
  LoadingDots,
  DatePicker,
  SelectComponentLoad,
} from "../../components";
import BulkAssignment from "../../components/sales/BulkAssignment";
import BulkErrorFile from "../../components/BulkErrorFile";
import axios from "../../actions/config";
import { IconUser } from "../../components/Icons";
import { ind, en } from "../../languages/assignment";

const svgStyle = {
  height: "18px",
  width: "18px",
};

class AssignmentNew extends React.Component {
  state = {
    id: null,
    selectedSales: "",
    selectedRole: "",
    salesDetail: "",
    sales: "",
    listSales: [],
    listSubareas: [1],
    roles: [],
    confirmIsOpen: false,
    expandCard: false,
    type: "success",
    textSuccess: "",
    textError: "",
    textReason: "",
    status: "",
    regionalProvince: "",
    regionalCity: "",
    branches: [],
    areas: [],
    subareas: [],
    emptyBranch: false,
    emptyArea: false,
    emptySubArea: false,
    salesPositions: [
      {
        role: { value: "", label: "" },
        region: { value: "", label: "" },
        branch: { value: "", label: "" },
        area: { value: "", label: "" },
        sub_area: { value: "", label: "" },
      },
    ],
    lastPosition: "",
    sac_ids: "",

    selectedRegional: { value: "", label: "Semua" },
    selectedBranch: { value: "", label: "Semua" },
    selectedArea: { value: "", label: "Semua" },
    selectedSubArea: { value: "", label: "Semua" },
    selectedAssignment: {},
    language: {},
  };

  componentDidMount() {
    document.title = "SFA OTTO - Assignment Sales";
    if (this.props.auth.language === "in") {
      this.setState({ language: ind.recruit });
    } else if (this.props.auth.language === "en") {
      this.setState({ language: en.recruit });
    }

    this.props.getRegions();

    this.props.getSalesRoles().then((data) => {
      let newRoles = [];

      data.data.map((role) => {
        newRoles.push({
          value: role.id,
          label: role.name,
          section: role.section,
        });
      });

      this.setState({ roles: newRoles });
    });

    this.props.findSales(null).then((data) => {
      let newSales = [];
      data.data.map((sales) => {
        newSales.push({
          value: sales.id,
          label: `${sales.sfa_id} - ${sales.name}`,
        });
      });

      this.setState({ listSales: newSales });
    });
  }

  filterSales = debounce((inputValue) => {
    if (inputValue.length > 0) {
      let newSales = [];
      this.props.findSales(inputValue).then((data) => {
        let newSales = [];
        data.data.map((sales) => {
          newSales.push({
            value: sales.id,
            label: `${sales.sfa_id} - ${sales.name}`,
          });
        });

        this.setState({ listSales: newSales });
      });
    }
  });

  addCoverage() {
    let newSalesPositions = this.state.salesPositions;

    let newPosition = {
      role: { value: "", label: "" },
      region: { value: "", label: "" },
      branch: { value: "", label: "" },
      area: { value: "", label: "" },
      sub_area: { value: "", label: "" },
    };

    newSalesPositions.push(newPosition);

    this.setState({ salesPositions: newSalesPositions });
  }

  render() {
    const {
      auth,
      history,
      regions,
      searchBranch,
      searchSubAreas,
      searchAreas,
      relationCheck,
      getSalesManagementDetail,
      positionAssignment,
    } = this.props;
    const {
      sales,
      listSales,
      roles,
      confirmIsOpen,
      type,
      textSuccess,
      textError,
      textReason,
      selectedSales,
      branches,
      areas,
      subareas,
      emptyBranch,
      emptyArea,
      emptySubArea,
      salesPositions,
      sac_ids,
      language,
    } = this.state;

    if (
      auth.authority["assignment_sales"] === "" ||
      auth.authority["assignment_sales"] === "No Access"
    ) {
      return <NotAuthorize />;
    }

    const regionOptions = [];

    regions.data.map((region) => {
      regionOptions.push({
        value: region.id,
        label: `${region.id} - ${region.name}`,
      });
    });

    return (
      <div className="container mb-5 noSelect">
        <div className="row">
          <ModalConfirm
            confirmIsOpen={confirmIsOpen}
            type={type}
            confirmClose={() => this.setState({ confirmIsOpen: false })}
            confirmSuccess={() => history.push("/sales/assignments")}
            textSuccess={textSuccess}
            textError={textError}
            textReason={textReason}
          />
          <form
            className="col-12"
            onSubmit={(e) => {
              e.preventDefault();
              let newPositions = [];

              salesPositions.map((position) => {
                let lastPosition = {};
                let lastPosition2 = {};

                if (position.region) {
                  lastPosition = {
                    role_id: position.role.value,
                    regional_id: position.region.value,
                  };
                }

                if (position.branch) {
                  lastPosition = {
                    role_id: position.role.value,
                    regional_id: position.branch.value,
                  };
                }

                if (position.area) {
                  lastPosition = {
                    role_id: position.role.value,
                    regional_id: position.area.value,
                  };
                }

                if (position.sub_area) {
                  lastPosition = {
                    role_id: position.role.value,
                    regional_id: position.sub_area.value,
                  };
                }

                lastPosition2 = {
                  role_id: lastPosition.role_id.toString(),
                  regional_id: lastPosition.regional_id.toString(),
                };

                newPositions.push(lastPosition2);
              });

              let formData = {
                sales_id: sales.id,
                positions: newPositions,
              };

              if (sales.id) {
                positionAssignment(formData)
                  .then((data) => {
                    if (data.meta.status === false) {
                      this.setState({
                        confirmIsOpen: true,
                        type: "error",
                        textError: "Ups!",
                        textReason: data.meta.message,
                      });
                    } else {
                      this.setState({
                        confirmIsOpen: true,
                        type: "success",
                        textSuccess: data.meta.message,
                        textError: "",
                      });
                    }
                  })
                  .catch((e) => {
                    this.setState({
                      confirmIsOpen: true,
                      type: "error",
                      textError: "Assignment sales fail",
                      textReason: e.message,
                    });
                  });
              } else {
                this.setState({
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Assignment sales fail",
                  textReason: "Please make sure Role and sales are filled",
                });
              }
            }}
          >
            <div className="row">
              <div className="col-12 mb-5">
                <h2>{language.header}</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6>{language.header1}</h6>
                      <div className="form-group mt-3 mb-2">
                        <label>{language.sales}</label>
                        <div className="form-row">
                          <div className="col-6">
                            <SelectAsync
                              initValue={selectedSales}
                              options={listSales}
                              handleChange={(selectedSales) => {
                                getSalesManagementDetail(
                                  selectedSales.value
                                ).then((data) => {
                                  this.setState({
                                    selectedSales: selectedSales,
                                    sales: data.data,
                                  });
                                });

                                this.props.getRegions(1);

                                this.setState({ selectedSales: selectedSales });
                              }}
                              onInputChange={(value) => {
                                this.filterSales(value);
                              }}
                              placeholder="Type sales name or NIP"
                            ></SelectAsync>
                          </div>
                          <div className="col-3">
                            {/* <a href="" className="btn btn-danger btn-block">Search</a> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {sales && (
                    <React.Fragment>
                      <div className="card-footer border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-3 text-center d-flex">
                              <div className="avatar  d-flex justify-content-center align-items-center">
                                <IconUser />
                              </div>
                            </div>
                            <div className="col-12 col-lg-6">
                              <p>
                                {sales.first_name} {sales.last_name}
                              </p>
                            </div>
                            <div className="col-12 col-lg-3 text-center d-flex flex-column align-items-center justify-content-center">
                              <strong className="mb-0">
                                <small>{language.status}</small>
                              </strong>
                              <span className="badge badge-status">
                                {sales.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!isEmpty(sales.positions) && (
                        <div className="card-footer border-top">
                          <div className="col-12">
                            {sales.positions.map((position) => (
                              <div className="row">
                                <div className="col-12 col-lg-3">
                                  <small>
                                    <strong className="mb-0">
                                      {language.roleSebelum}
                                    </strong>
                                  </small>
                                </div>
                                <div className="col-12 col-lg-9">
                                  <p className="mb-2">{position.role}</p>
                                  <p className="mb-2">{position.region}</p>
                                  <p className="mb-2">{position.branch}</p>
                                  <p className="mb-2">{position.area}</p>
                                  <p className="mb-2">{position.sub_area}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
                {salesPositions.map((salesPosition, idx) => (
                  <div className="card mb-5" key={"sales-positions" + idx}>
                    <div className="card-body row m-0">
                      <div className="col-12 col-lg-6">
                        <h6>{language.header2}</h6>
                        <div className="form-group mt-3 mb-2">
                          <label>{language.role}</label>
                          <SelectLineComponent
                            initValue={salesPosition.role}
                            options={roles}
                            handleChange={(selectedRole) => {
                              // this.props.getRegions()
                              let newSalesPositions = salesPositions;
                              let newSalesPosition = newSalesPositions[idx];
                              newSalesPosition.role = selectedRole;

                              if (selectedRole.label === "Region Sales") {
                                delete newSalesPosition.branch;
                                delete newSalesPosition.area;
                                delete newSalesPosition.sub_area;
                              }

                              if (selectedRole.label === "Branch sales") {
                                if (isEmpty(newSalesPosition.branch)) {
                                  newSalesPosition.branch = {
                                    value: "",
                                    label: "",
                                  };
                                }
                                delete newSalesPosition.area;
                                delete newSalesPosition.sub_area;
                              }

                              if (selectedRole.label === "Area Sales") {
                                if (isEmpty(newSalesPosition.branch)) {
                                  newSalesPosition.branch = {
                                    value: "",
                                    label: "",
                                  };
                                }
                                if (isEmpty(newSalesPosition.area)) {
                                  newSalesPosition.area = {
                                    value: "",
                                    label: "",
                                  };
                                }
                                delete newSalesPosition.sub_area;
                              }

                              if (selectedRole.label === "SubArea Sales") {
                                relationCheck(selectedSales.value) // relation check between sales type and sales area channel
                                  .then((data) => {
                                    if (data.meta.status === false) {
                                      this.setState({
                                        confirmIsOpen: true,
                                        type: "error",
                                        textError: "Ups!",
                                        textReason: data.meta.message,
                                      });
                                    } else {
                                      this.setState({ sac_ids: data.data });
                                    }
                                  })
                                  .catch((e) => {
                                    this.setState({
                                      confirmIsOpen: true,
                                      type: "error",
                                      textError: "Internal Service Error",
                                      textReason: e.message,
                                    });
                                  });

                                if (isEmpty(newSalesPosition.branch)) {
                                  newSalesPosition.branch = {
                                    value: "",
                                    label: "",
                                  };
                                }
                                if (isEmpty(newSalesPosition.area)) {
                                  newSalesPosition.area = {
                                    value: "",
                                    label: "",
                                  };
                                }
                                if (isEmpty(newSalesPosition.sub_area)) {
                                  newSalesPosition.sub_area = {
                                    value: "",
                                    label: "",
                                  };
                                }
                              }

                              this.setState({
                                salesPositions: newSalesPositions,
                              });
                            }}
                            placeholder="Type Role"
                          ></SelectLineComponent>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 d-flex justify-content-end align-items-start">
                        {salesPositions.length >= 2 && (
                          <span
                            className="btn btn-danger"
                            onClick={() => {
                              let newSalesPositions = salesPositions.filter(
                                (sPos) => sPos !== salesPosition
                              );

                              this.setState({
                                salesPositions: newSalesPositions,
                              });
                            }}
                          >
                            {language.remove}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="card-body border-top">
                      <div className="col-12">
                        <h6>{language.header3}</h6>
                        <div className="row">
                          {salesPosition.region && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{language.regionalCode}</label>
                                <SelectLineComponent
                                  initValue={salesPosition.region}
                                  options={regionOptions}
                                  placeholder="Type Region"
                                  handleChange={(selectedRegion) => {
                                    let newSalesPositions = salesPositions;
                                    let newSalesPosition = salesPositions[idx];
                                    newSalesPosition.region = selectedRegion;
                                    if (!isEmpty(newSalesPosition.branch)) {
                                      newSalesPosition.branch = {
                                        value: "",
                                        label: "",
                                      };
                                    }
                                    if (!isEmpty(newSalesPosition.area)) {
                                      newSalesPosition.area = {
                                        value: "",
                                        label: "",
                                      };
                                    }
                                    if (!isEmpty(newSalesPosition.sub_area)) {
                                      newSalesPosition.sub_area = {
                                        value: "",
                                        label: "",
                                      };
                                    }

                                    this.setState({
                                      salesPositions: newSalesPositions,
                                    });
                                  }}
                                />
                                {emptyBranch && (
                                  <small className="text-danger">
                                    {language.noRegion}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.branch && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{language.branchCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.branch}
                                  options={branches}
                                  placeholder="Type Branch"
                                  onFocus={() => {
                                    searchBranch(
                                      salesPosition.region.value
                                    ).then((data) => {
                                      let newBranches = [];

                                      if (data.data.length > 0) {
                                        data.data.map((branch) => {
                                          newBranches.push({
                                            value: branch.id,
                                            label: `${branch.id} - ${branch.name}`,
                                          });
                                        });
                                        this.setState({
                                          branches: newBranches,
                                          emptyBranch: false,
                                        });
                                      } else {
                                        this.setState({
                                          branches: [],
                                          emptyBranch: true,
                                        });
                                      }
                                    });
                                  }}
                                  handleChange={(selectedBranch) => {
                                    let newSalesPositions = salesPositions;
                                    let newSalesPosition = salesPositions[idx];
                                    newSalesPosition.branch = selectedBranch;
                                    if (!isEmpty(newSalesPosition.area)) {
                                      newSalesPosition.area = {
                                        value: "",
                                        label: "",
                                      };
                                    }
                                    if (!isEmpty(newSalesPosition.sub_area)) {
                                      newSalesPosition.sub_area = {
                                        value: "",
                                        label: "",
                                      };
                                    }

                                    this.setState({
                                      salesPositions: newSalesPositions,
                                    });
                                  }}
                                />
                                {emptyArea && (
                                  <small className="text-danger">
                                    {language.noBranch}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.area && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{language.areaCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.area}
                                  options={areas}
                                  placeholder="Type Area"
                                  onFocus={() => {
                                    searchAreas(
                                      salesPosition.branch.value
                                    ).then((data) => {
                                      let newAreas = [];

                                      if (data.data.length > 0) {
                                        data.data.map((area) => {
                                          newAreas.push({
                                            value: area.id,
                                            label: `${area.id} - ${area.name}`,
                                          });
                                        });
                                        this.setState({
                                          areas: newAreas,
                                          emptyArea: false,
                                        });
                                      } else {
                                        this.setState({
                                          areas: [],
                                          emptyArea: true,
                                        });
                                      }
                                    });
                                  }}
                                  handleChange={(selectedArea) => {
                                    let newSalesPositions = salesPositions;
                                    let newSalesPosition = salesPositions[idx];
                                    newSalesPosition.area = selectedArea;
                                    if (!isEmpty(newSalesPosition.sub_area)) {
                                      newSalesPosition.sub_area = {
                                        value: "",
                                        label: "",
                                      };
                                    }

                                    this.setState({
                                      salesPositions: newSalesPositions,
                                    });
                                  }}
                                />
                                {emptySubArea && (
                                  <small className="text-danger">
                                    {language.noArea}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.sub_area && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{language.subCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.sub_area}
                                  options={subareas}
                                  placeholder="Select"
                                  onFocus={() => {
                                    searchSubAreas(
                                      salesPosition.area.value,
                                      sac_ids
                                    ).then((data) => {
                                      let newSubAreas = [];

                                      if (data.data.length > 0) {
                                        data.data.map((subarea) => {
                                          newSubAreas.push({
                                            value: subarea.id,
                                            label: `${subarea.id} - ${subarea.name}`,
                                          });
                                        });
                                        this.setState({
                                          subareas: newSubAreas,
                                          emptySubArea: false,
                                        });
                                      } else {
                                        this.setState({
                                          subareas: [],
                                          emptySubArea: true,
                                        });
                                      }
                                    });
                                  }}
                                  handleChange={(selectedSubArea) => {
                                    let newSalesPositions = salesPositions;
                                    let newSalesPosition = salesPositions[idx];
                                    newSalesPosition.sub_area = selectedSubArea;

                                    this.setState({
                                      salesPositions: newSalesPositions,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <span
                  className="btn btn-danger btn-sm"
                  onClick={() => this.addCoverage()}
                >
                  Add Coverage
                </span>

                {isEmpty(salesPositions) && (
                  <div className="upload-area d-flex flex-column align-items-center justify-content-center py-4">
                    {language.noPosisi}

                    <span
                      className="btn btn-danger btn-sm mt-3"
                      onClick={() => this.addCoverage()}
                    >
                      {language.add}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-12 col-lg-4 mb-3">
                <BulkErrorFile
                  title={"Assignment Sales"}
                  actionUrl={"assignment_sales"}
                  history={history}
                  toRoute={"sales/assignments"}
                />
              </div>

              {auth.authority["assignment_sales"] === "Full Access" && (
                <div className="col-12 mb-3">
                  <hr className="content-hr" />
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/sales/assignments" className="btn btn-default">
                      {language.cancel}
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      {language.save}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth, sales, regions, branches, areas }) => ({
    auth,
    sales,
    regions,
    branches,
    areas,
  }),
  {
    getSale,
    getSalesRoles,
    findSales,
    getSalesManagementDetail,
    getRegions,
    searchBranch,
    searchAreas,
    searchSubAreas,
    positionAssignment,
    relationCheck,
  }
)(AssignmentNew);
