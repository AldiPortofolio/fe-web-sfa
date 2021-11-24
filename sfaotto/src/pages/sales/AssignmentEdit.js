import React from "react";
import { find, includes, debounce, intersectionWith, isEqual } from "lodash";
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
  updatePositionAssignment,
  relationCheck,
} from "../../actions/sale";
import { regenerateSpesificCallplan } from "../../actions/call_plan";
import {
  NotAuthorize,
  ModalConfirm,
  SelectLineComponent,
  SelectAsync,
  LoadingDots,
  DatePicker,
  SelectComponentLoad,
  ModalConfirmCallPlan,
  ModalDelete,
} from "../../components";
import axios from "../../actions/config";
import { IconUser } from "../../components/Icons";
import { ind, en } from "../../languages/assignment";

const svgStyle = {
  height: "18px",
  width: "18px",
};

class EditAssignment extends React.Component {
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
    salesPositionsOld: [
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
    languages: {},
    confirmIsOpenStatus: false,
    resultIsOpenStatus: false,
    confirmTextStatus: "",
    resultTextStatus: "",
    nameSales: "",

    confirmIsOpenStatus2: false,
    resultIsOpenStatus2: false,
    confirmTextStatus2: "",
    resultTextStatus2: "",
  };

  componentDidMount() {
    document.title = "SFA OTTO - Edit Assignment Sales";

    if (this.props.auth.language === "in") {
      this.setState({ languages: ind.edit });
    } else if (this.props.auth.language === "en") {
      this.setState({ languages: en.edit });
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

    this.props
      .getSalesManagementDetail(this.props.match.params.id)
      .then((data) => {
        const regionOptions = [];

        this.props.regions.data.map((region) => {
          regionOptions.push({
            value: region.id,
            label: `${region.id} - ${region.name}`,
          });
        });

        let newSalesPositions = this.state.salesPositions,
          newSalesPositionsOld = this.state.salesPositionsOld,
          newLastPosition = this.state.lastPosition;

        if (!isEmpty(data.data.positions)) {
          newSalesPositions = [];
          newSalesPositionsOld = [];
          newLastPosition = {};

          data.data.positions.map((position) => {
            let thisPosition = {};
            let lastPosition2 = {};

            thisPosition["role"] = {
              value: position.role_id,
              label: position.role,
            };

            if (position.region) {
              thisPosition["region"] = find(regionOptions, {
                label: position.region,
              }) || {
                value: position.region_id,
                label: position.region,
              };
            }

            if (position.branch) {
              thisPosition["branch"] = {
                value: position.branch_id,
                label: position.branch,
              };
            }

            if (position.area) {
              thisPosition["area"] = {
                value: position.area_id,
                label: position.area,
              };
            }

            if (position.sub_area) {
              thisPosition["sub_area"] = {
                value: position.sub_area_id,
                label: position.sub_area,
              };
            }

            newSalesPositions.push(thisPosition);
          });

          newLastPosition = isEmpty(data.data.positions)
            ? {}
            : data.data.positions[data.data.positions.length - 1];
        }

        if (!isEmpty(data.data.positions)) {
          newSalesPositionsOld = [];
          newLastPosition = {};

          data.data.positions.map((position) => {
            let thisPosition = {};
            let lastPosition2 = {};

            thisPosition["role"] = {
              value: position.role_id,
              label: position.role,
            };

            if (position.region) {
              thisPosition["region"] = {
                value: position.region_id,
                label: position.region,
              };
            }

            if (position.branch) {
              thisPosition["branch"] = {
                value: position.branch_id,
                label: position.branch,
              };
            }

            if (position.area) {
              thisPosition["area"] = {
                value: position.area_id,
                label: position.area,
              };
            }

            if (position.sub_area) {
              thisPosition["sub_area"] = {
                value: position.sub_area_id,
                label: position.sub_area,
              };
            }

            newSalesPositionsOld.push(thisPosition);
          });
        }
        const name =
          data.data.first_name +
          " " +
          data.data.last_name +
          " (ID: " +
          data.data.id +
          ")";
        this.setState({
          sales: data.data,
          salesPositions: newSalesPositions,
          salesPositionsOld: newSalesPositionsOld,
          lastPosition: newLastPosition,
          nameSales: name,
        });
      });
  }

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

  arrayCompare = (_arr1, _arr2) => {
    if (
      !Array.isArray(_arr1) ||
      !Array.isArray(_arr2) ||
      _arr1.length !== _arr2.length
    ) {
      return false;
    }

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  validateAreas = (oldArray, newArray) => {
    oldArray = oldArray.filter((e) => e.role.label === "SubArea Sales");
    newArray = newArray.filter((e) => e.role.label === "SubArea Sales");
    console.log("oldArray", oldArray);
    console.log("newArray", newArray);

    if (oldArray.length <= 0 && newArray.length > 0) return false;
    if (oldArray.length > 0 && newArray.length <= 0) return true;

    console.log("dif", isEqual(oldArray, newArray));
    return isEqual(oldArray, newArray);
  };

  render() {
    const {
      auth,
      history,
      regions,
      searchBranch,
      searchSubAreas,
      searchAreas,
      updatePositionAssignment,
      relationCheck,
    } = this.props;
    const {
      id,
      sales,
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
      lastPosition,
      sac_ids,
      languages,
      salesPositionsOld,
      confirmIsOpenStatus,
      resultIsOpenStatus,
      confirmTextStatus,
      resultTextStatus,
      nameSales,

      confirmIsOpenStatus2,
      resultIsOpenStatus2,
      confirmTextStatus2,
      resultTextStatus2,
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
      console.log("regions", regions);
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

          <ModalConfirmCallPlan
            confirmIsOpen={confirmIsOpenStatus2}
            resultIsOpen={resultIsOpenStatus2}
            type={type}
            confirmText={confirmTextStatus2}
            confirmSuccess={() => history.push("/sales/assignments")}
            confirmClose={() => history.push("/sales/assignments")}
            resultClose={() => {}}
            confirmYes={() =>
              this.setState({
                confirmIsOpenStatus2: false,
                confirmIsOpenStatus: true,
              })
            }
            resultText={resultTextStatus2}
            isAll={false}
            data={nameSales}
            afterEdit={true}
          />

          <ModalConfirmCallPlan
            confirmIsOpen={confirmIsOpenStatus}
            resultIsOpen={resultIsOpenStatus}
            type={type}
            confirmText={confirmTextStatus}
            confirmSuccess={() => history.push("/sales/assignments")}
            confirmClose={() => history.push("/sales/assignments")}
            resultClose={() => {
              this.setState({ resultIsOpenStatus: false });
            }}
            confirmYes={() => {
              this.props
                .regenerateSpesificCallplan({
                  sales_id: sales.id.toString(),
                })
                .then((data) => {
                  this.setState({
                    resultIsOpenStatus: true,
                    confirmIsOpenStatus: false,
                    type: "success",
                    resultTextStatus:
                      "Anda telah berhasil meregenerate call plan salesman" +
                      nameSales +
                      ". Mohon cek email secara berkala untuk mendapatkan update",
                  });
                })
                .catch((e) =>
                  this.setState({
                    resultIsOpenStatus: true,
                    type: "error",
                    confirmTextStatus: e,
                  })
                );
            }}
            resultText={resultTextStatus}
            isAll={false}
            data={nameSales}
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
                updatePositionAssignment(formData)
                  .then((data) => {
                    if (data.meta.status === false) {
                      this.setState({
                        confirmIsOpen: true,
                        type: "error",
                        textError: data.meta.message,
                        textReason: data.meta.message,
                      });
                    } else {
                      if (
                        !this.validateAreas(salesPositionsOld, salesPositions)
                      ) {
                        this.setState({
                          confirmIsOpenStatus2: true,
                          type: "success",
                          confirmTextStatus2: "",
                        });
                      } else {
                        this.setState({
                          confirmIsOpen: true,
                          type: "success",
                          textError: "",
                          textSuccess: data.meta.message,
                        });
                      }
                    }
                  })
                  .catch((e) => {
                    this.setState({
                      confirmIsOpen: true,
                      type: "error",
                      textError: "Edit sales assignment fail",
                      textReason: e.message,
                    });
                  });
              } else {
                this.setState({
                  confirmIsOpen: true,
                  type: "error",
                  textError: "Edit sales assignment fail",
                  textReason: "Please make sure Role and sales are filled",
                });
              }
            }}
          >
            <div className="row">
              <div className="col-12 mb-5">
                <h2>{languages.header}</h2>
              </div>
              <div className="col-12 col-lg-8 mb-3">
                <div className="card mb-5">
                  <div className="card-body">
                    <div className="col-12">
                      <h6 className="mb-0">{languages.sales}</h6>
                    </div>
                  </div>
                  {isEmpty(sales) && (
                    <div className="page-load">
                      <LoadingDots color="black" />
                    </div>
                  )}
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
                                <small>{languages.status}</small>
                              </strong>
                              <span className="badge badge-status">
                                {sales.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer border-top">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-lg-3">
                              <small>
                                <strong className="mb-0">
                                  {languages.roleSebelum}
                                </strong>
                              </small>
                            </div>
                            <div className="col-12 col-lg-9">
                              <p className="mb-2">{lastPosition.role}</p>
                              <p className="mb-2">{lastPosition.region}</p>
                              <p className="mb-2">{lastPosition.branch}</p>
                              <p className="mb-2">{lastPosition.area}</p>
                              <p className="mb-2">{lastPosition.sub_area}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
                {salesPositions.map((salesPosition, idx) => (
                  <div className="card mb-5" key={"sales-positions" + idx}>
                    <div className="card-body row m-0">
                      <div className="col-12 col-lg-6">
                        <h6>
                          {languages.header2} {salesPosition.role.label}
                        </h6>
                        <div className="form-group mt-3 mb-2">
                          <label>{languages.role}</label>
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
                                relationCheck(sales.id) // relation check between sales type and sales area channel
                                  .then((data) => {
                                    if (data.meta.status === false) {
                                      this.setState({
                                        confirmIsOpen: true,
                                        type: "error",
                                        textError: data.meta.message,
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
                          {languages.remove}
                        </span>
                      </div>
                    </div>
                    <div className="card-body border-top">
                      <div className="col-12">
                        <h6>{languages.header3}</h6>
                        <div className="row">
                          {salesPosition.region && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.regionalCode}</label>
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
                                    {languages.noRegion}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.branch && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.branchCode}</label>
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
                                    {languages.noBranch}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.area && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.areaCode}</label>
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
                                    {languages.noArea}
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                          {salesPosition.sub_area && (
                            <div className="col-12 col-lg-6">
                              <div className="form-group mt-3 mb-2">
                                <label>{languages.subCode}</label>
                                <SelectComponentLoad
                                  initValue={salesPosition.sub_area}
                                  options={subareas}
                                  placeholder="Type Sub Area"
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
                  {languages.add}
                </span>

                {isEmpty(salesPositions) && (
                  <div className="upload-area d-flex flex-column align-items-center justify-content-center py-4">
                    {languages.noPosisi}

                    <span
                      className="btn btn-danger btn-sm mt-3"
                      onClick={() => this.addCoverage()}
                    >
                      {languages.add}
                    </span>
                  </div>
                )}
              </div>

              {auth.authority["assignment_sales"] === "Full Access" && (
                <div className="col-12 mb-3">
                  <hr className="content-hr" />
                  <div className="form-group d-flex justify-content-between">
                    <Link to="/sales/assignments" className="btn btn-default">
                      {languages.cancel}
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      {languages.save}
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
    relationCheck,
    getRegions,
    searchBranch,
    searchAreas,
    searchSubAreas,
    updatePositionAssignment,
    regenerateSpesificCallplan,
  }
)(EditAssignment);
