import React from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import { Link, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import routes from "../routes";
import { signOut, checkAuthToken } from "../actions/auth";
import { ModalOffline } from "../components";
import { getCountries } from "../actions/country";
import { getProvinces } from "../actions/province";
import { getRoles } from "../actions/role";
import { getGenders } from "../actions/gender";
import { getCompanyCodes } from "../actions/company_code";
import {
  getNotifications,
  changeStatus,
  DeleteAdminSubArea,
} from "../actions/notification";
import { getSalesTypeList } from "../actions/sales_type";
import { LoadingDots } from "../components";
import { Offline, Online } from "react-detect-offline";
import { ind, en } from "../languages/profile";

const style = {
  link: {
    cursor: "pointer",
  },
};

class DefaultLayout extends React.Component {
  state = {
    showNotif: false,
    showSetting: false,
    showNav: false,
    sidenavHide: false,
    userRole: "maker",
    menu_management: false,
    menu_planning: false,
    menu_acquisition: false,
    menu_ottopay: false,
    menu_structure: false,
    menu_components: false,
    menu_admins: false,
    menu_daily_acquisition: false,
    menu_reviews: false,
    menu_list_request: false,
    menu_sfa_team_leader: false,
    menu_notifications: false,
    menu_user_ottocash: false,
    menu_system_configuration: false,
    modalOpen: true,
    languages: {},
  };

  componentDidMount() {
    const {
      auth,
      history,
      location: { pathname },
    } = this.props;
    var isMenuOpen = "";

    if (auth.language === "in") {
      this.setState({ languages: ind.manage });
    } else if (auth.language === "en") {
      this.setState({ languages: en.manage });
    }

    if (!auth.isAuthenticated) {
      return history.replace("/login");
    } else {
      let userRole;

      if (!isEmpty(auth.position)) {
        userRole =
          auth.position.toLowerCase() === "checker" ? "checker" : "maker";
      } else {
        userRole = auth.role.toLowerCase() === "checker" ? "checker" : "maker";
      }

      this.setState({ userRole: userRole });

      this.getNotification();

      if (userRole === "maker") {
        this.props.getCountries();
        this.props.getProvinces();
        this.props.getRoles();
        this.props.getGenders();
        this.props.getCompanyCodes();
        this.props.getSalesTypeList();
      }

      this.props.checkAuthToken().then((data) => {
        if (data.meta.status === false) {
          this.props.signOut();
          return history.replace("/login");
        }
      });
      // this.getData()
    }

    if (pathname.includes("/sales")) {
      isMenuOpen = "management";
    } else if (pathname.includes("/targets")) {
      isMenuOpen = "planning";
    } else if (["/targets/manage", "/companies/manage"].includes(pathname)) {
      isMenuOpen = "components";
    } else if (
      [
        "/regions",
        "/regions/new",
        "/branches",
        "/branches/new",
        "/areas",
        "/areas/new",
        "/sub_areas",
        "/sub_areas/new",
      ].includes(pathname)
    ) {
      isMenuOpen = "structure";
    } else if (pathname.includes("/admin")) {
      isMenuOpen = "admins";
    } else if (["/acquisition"].includes(pathname)) {
      isMenuOpen = "daily_acquisition";
    } else if (pathname.includes("/reviews")) {
      isMenuOpen = "reviews";
    } else if (pathname.includes("/requests")) {
      isMenuOpen = "list_request";
    } else if (["/notifications", "/notifications/new"].includes(pathname)) {
      isMenuOpen = "notifications";
    }

    this.openMenu(isMenuOpen);
  }

  getNotification() {
    const { auth } = this.props;
    let userRole;

    if (!isEmpty(auth.position)) {
      userRole =
        auth.position.toLowerCase() === "checker" ? "checker" : "maker";
    } else {
      userRole = auth.role.toLowerCase() === "checker" ? "checker" : "maker";
    }

    this.props.getNotifications(userRole);
  }

  getData = async () => {
    try {
      await this.props.getCountries();
      await this.props.getProvinces();
    } catch (e) {
      console.log(e);
    }
  };

  signOut = () => {
    this.props.DeleteAdminSubArea();
    this.props.signOut().then(() => this.props.history.push("/login"));
  };

  openMenu = (menu) => {
    this.setState({
      menu_management: false,
      menu_planning: false,
      menu_attendance: false,
      menu_acquisition: false,
      menu_ottopay: false,
      menu_structure: false,
      menu_components: false,
      menu_admins: false,
      menu_daily_acquisition: false,
      menu_reviews: false,
      menu_list_request: false,
      menu_notifications: false,
      menu_user_ottocash: false,
      menu_system_configuration: false,
      menu_sfa_team_leader: false,
    });

    let activeMenu = { [`menu_${menu}`]: !this.state[`menu_${menu}`] };

    this.setState(activeMenu);
  };

  activeState(name) {
    const {
      location: { pathname },
    } = this.props;
    return pathname === name ? "active" : "";
  }

  render() {
    const {
      location: { pathname },
      auth,
      notifications,
    } = this.props;
    const {
      showNotif,
      showSetting,
      showNav,
      menu_management,
      menu_attendance,
      menu_planning,
      menu_acquisition,
      menu_structure,
      menu_components,
      menu_admins,
      menu_daily_acquisition,
      menu_sfa_team_leader,
      menu_ottopay,
      menu_reviews,
      menu_list_request,
      menu_user_ottocash,
      menu_system_configuration,
      menu_notifications,
      sidenavHide,
      userRole,
      modalOpen,
      languages,
    } = this.state;
    let pagename = "";
    if (pathname === "/") {
      pagename = "Dashboard";
    } else if (pathname === "/sales/register") {
      pagename = "Pendaftaran Sales";
    } else if (pathname.includes("/sales/edit/")) {
      pagename = "Edit Sales";
    } else if (pathname.includes("/sales/detail/")) {
      pagename = "Profile Sales";
    } else if (pathname.includes("/sales/verify/")) {
      pagename = "Profile Sales";
    } else if (pathname === "/sales/") {
      pagename = "Manage Sales";
    } else if (pathname === "/sales/verifications") {
      pagename = "Verifikasi Sales";
    } else if (pathname === "/admin/manage") {
      pagename = "Pengaturan Admin";
    } else if (pathname.includes("/admin/edit/")) {
      pagename = "Edit Admin";
    } else if (pathname === "/admin/register") {
      pagename = "Pendaftaran Admin";
    } else if (pathname.includes("/targets/detail")) {
      pagename = "Detail Target";
    } else if (pathname === "/targets/set-target") {
      pagename = "Set Target";
    } else if (pathname === "/todos/") {
      pagename = "Manage To-do List";
    } else if (pathname === "/todos/new") {
      pagename = "Set To-do List";
    } else if (pathname.includes("/todos/edit")) {
      pagename = "Edit To-do";
    } else if (pathname.includes("/cluster/")) {
      pagename = "Cluster";
    } else if (pathname.includes("/calendar/")) {
      pagename = "Calendar Setup";
    } else if (pathname.includes("/sfa-team-leader/salesmen-location")) {
      pagename = "Salesmen Location";
    } else if (pathname.includes("/activities")) {
      pagename = "Salesmen Activities";
    }

    console.log(
      "No Access",
      auth.authority["list_all_sales"] !== "No Access" ||
        auth.authority["recruitment_sales"] !== "No Access" ||
        auth.authority["list_assignment_sales"] !== "No Access" ||
        auth.authority["assignment_sales"] !== "No Access" ||
        auth.authority["list_assignment_position"] !== "No Access" ||
        auth.authority["assign_position"] !== "No Access" ||
        auth.authority["unassignment_sales"] !== "No Access" ||
        auth.authority["promotion_or_transfer"] !== "No Access"
    );

    let groupNotification = [];
    let notReadNotification = [];
    if (!notifications.loading) {
      const list = notifications.data.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.created_at) - new Date(a.created_at);
      });

      notReadNotification = notifications.data.filter((x) => x.read == false);
      const groups = list.reduce((groups, obj) => {
        const date = moment(obj.created_at, "YYYY-MM-DD").format("DD-MMM-YYYY");
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(obj);
        return groups;
      }, {});

      groupNotification = Object.keys(groups).map((date) => {
        return {
          date,
          data: groups[date],
        };
      });
    }

    const { history } = this.props;

    return (
      <div className="auth">
        <div className={`wrapper ${sidenavHide ? "sidenav-hide" : ""}`}>
          <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div
              onClick={() => this.setState({ showSetting: false })}
              className="navbar-logo"
            >
              {/*<Link className="navbar-brand" to="/">
                <img src="/img/logo.png" alt="logo" />
              </Link>
              <h4>{pagename}</h4>
            */}
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarText"
                aria-controls="navbarText"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => this.setState({ showNav: !showNav })}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="container-fluid">
              <div
                className={`collapse navbar-collapse ${showNav ? "show" : ""}`}
                id="navbarText"
              >
                <ul className="navbar-nav ml-auto">
                  <li
                    onClick={() => this.setState({ showSetting: false })}
                    className="nav-item nav-item-icon dropdown"
                    id="navbarDropdownNotif"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <a
                      className="dropdown-toggle"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() =>
                        this.setState({
                          showNotif: !showNotif,
                          showSetting: false,
                        })
                      }
                      c
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
                        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      {notReadNotification &&
                        notReadNotification.length > 0 && (
                          <span className="badge badge-danger">
                            {notReadNotification.length}
                          </span>
                        )}
                    </a>
                    <div
                      style={{
                        display: showNotif ? "block" : "none",
                        width: "430px",
                      }}
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="navbarDropdownNotif"
                    >
                      <span className="dropdown-item border-bottom d-flex justify-content-between">
                        <span className="text-bold">Notifications</span>
                        <span
                          onClick={() => this.getNotification()}
                          className="text-blue"
                          style={style.link}
                        >
                          <i className="la la-refresh"></i> Refresh
                        </span>
                      </span>
                      {notifications.loading ? (
                        <div className="notification-group">
                          <div className="notification-list">
                            <small className="notif-head d-flex justify-content-center py-3">
                              <LoadingDots color="black" />
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div className="notification-group">
                          {!isEmpty(groupNotification) &&
                            groupNotification.map((groupNotif, index) => (
                              <div
                                className="notification-list"
                                key={
                                  moment(groupNotif.date).format(
                                    "DD-MMM-YYYY"
                                  ) + `-${index}`
                                }
                              >
                                <small className="notif-head">
                                  {moment(groupNotif.date).format(
                                    "dddd | DD MMM YYYY"
                                  )}
                                </small>
                                {groupNotif.data.map((notification, idx) => {
                                  return notification.read ? (
                                    <Link
                                      to={`/task-management/detail/${notification.object_id}`}
                                      className="notification-item"
                                      key={notification + idx}
                                      onClick={() => {
                                        this.props
                                          .changeStatus(notification.id)
                                          .then((data) => {
                                            this.props.getNotifications();
                                          });
                                      }}
                                      style={{ backgroundColor: "#f5f6f7" }}
                                    >
                                      <small>{notification.message}</small>
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/task-management/detail/${notification.object_id}`}
                                      className="notification-item"
                                      key={notification + idx}
                                      onClick={() => {
                                        this.props
                                          .changeStatus(notification.id)
                                          .then((data) => {
                                            this.props.getNotifications();
                                          });
                                      }}
                                    >
                                      <small>{notification.message}</small>
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                        </div>
                      )}
                      {isEmpty(notifications.data) && (
                        <div className="p-5 text-center">
                          <p className="mb-0 text-gray">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      style={style.link}
                      onClick={() =>
                        this.setState({
                          showSetting: !showSetting,
                          showNotif: false,
                        })
                      }
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <div className="nav-item-photo d-flex justify-content-center align-items-center">
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
                    </a>
                    <div
                      style={{ display: showSetting ? "block" : "none" }}
                      className="dropdown-menu dropdown-menu-right"
                    >
                      <div className="nav-item-detail-info py-3 px-4">
                        <div className="nav-item-photo d-flex justify-content-center align-items-center">
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
                        <div className="info">
                          <span className="name">
                            {auth.first_name} {auth.last_name}
                          </span>
                          <small className="mb-2">{auth.email}</small>
                          <small>{auth.role ? auth.role : auth.position}</small>
                        </div>
                      </div>
                      <Link
                        className="dropdown-item"
                        to="/admin/manage"
                        onClick={() => this.setState({ showSetting: false })}
                      >
                        {languages.pengaturan}
                      </Link>
                      <span
                        style={style.link}
                        className="dropdown-item"
                        onClick={this.signOut}
                      >
                        {languages.logout}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <nav className="sidenav">
            <div className="sidenav-logo-wrapper">
              <Link className="sidenav-brand" to="/">
                <img src="/img/logo.png" alt="logo" />
              </Link>
              <span
                className="sidenav-toggle"
                onClick={() => {
                  this.setState({ sidenavHide: !sidenavHide });
                }}
              >
                <i className="la la-bars"></i>
              </span>
            </div>
            <div className="sidenav-menu">
              {userRole && userRole === "maker" && (
                <div className="sidenav-menu-item">
                  <Link
                    to="/"
                    className={`sidenav-menu-link ${this.activeState("/")} `}
                  >
                    <i className="la la-area-chart"></i>
                    <span className="sidenav-menu-link-label">
                      {languages.dashboard}
                    </span>
                  </Link>
                </div>
              )}
              <div className="sidenav-menu-label">
                <span className="sidenav-menu-link-label">
                  {languages.component}
                </span>
              </div>
              {userRole && userRole === "maker" && (
                <React.Fragment>
                  {(auth.authority["list_all_sales"] !== "No Access" ||
                    auth.authority["recruitment_sales"] !== "No Access" ||
                    auth.authority["list_assignment_sales"] !== "No Access" ||
                    auth.authority["assignment_sales"] !== "No Access" ||
                    auth.authority["list_assignment_position"] !==
                      "No Access" ||
                    auth.authority["assign_position"] !== "No Access" ||
                    auth.authority["unassignment_sales"] !== "No Access" ||
                    auth.authority["promotion_or_transfer"] !== "No Access" ||
                    auth.authority["sales_level"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_management && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("management");
                        }}
                      >
                        <i className="la la-users"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.sales}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_management && "active"
                        }`}
                      >
                        {auth.authority["list_all_sales"] !== "No Access" && (
                          <li>
                            <Link
                              to="/sales"
                              className={this.activeState("/sales")}
                            >
                              {languages.salesList}
                            </Link>
                          </li>
                        )}
                        {auth.authority["recruitment_sales"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/recruit"
                              className={this.activeState("/sales/recruit")}
                            >
                              {languages.salesRecruit}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_assignment_sales"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/assignments"
                              className={this.activeState("/sales/assignments")}
                            >
                              {languages.assignList}
                            </Link>
                          </li>
                        )}
                        {auth.authority["assignment_sales"] !== "No Access" && (
                          <li>
                            <Link
                              to="/sales/assignments/new"
                              className={this.activeState(
                                "/sales/assignments/new"
                              )}
                            >
                              {languages.assign}
                            </Link>
                          </li>
                        )}
                        {auth.authority["sales_level_assignment"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/sales_level_assignment"
                              className={this.activeState(
                                "/sales/sales_level_assignment"
                              )}
                            >
                              {languages.salesLevelAssignment}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_assignment_position"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/positions"
                              className={this.activeState("/sales/positions")}
                            >
                              {languages.positionList}
                            </Link>
                          </li>
                        )}
                        {auth.authority["assign_position"] !== "No Access" && (
                          <li>
                            <Link
                              to="/sales/positions/new"
                              className={this.activeState(
                                "/sales/positions/new"
                              )}
                            >
                              {languages.position}
                            </Link>
                          </li>
                        )}
                        {auth.authority["unassignment_sales"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/unassignment"
                              className={this.activeState(
                                "/sales/unassignment"
                              )}
                            >
                              {languages.unAssign}
                            </Link>
                          </li>
                        )}
                        {auth.authority["promotion_or_transfer"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/sales/promotion"
                              className={this.activeState("/sales/promotion")}
                            >
                              {languages.promotion}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {(auth.authority["list_all_target"] !== "No Access" ||
                    auth.authority["set_target"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_planning && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("planning");
                        }}
                      >
                        <i className="la la-calendar-check-o"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.salesPlanning}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_planning && "active"
                        }`}
                      >
                        {auth.authority["list_all_target"] !== "No Access" && (
                          <li>
                            <Link
                              to="/targets/list"
                              className={this.activeState("/targets/list")}
                            >
                              {languages.listTarget}
                            </Link>
                          </li>
                        )}
                        {auth.authority["set_target"] !== "No Access" && (
                          <li>
                            <Link
                              to="/targets/set"
                              className={this.activeState("/targets/set")}
                            >
                              {languages.setTarget}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {(auth.authority["attendance_history"] !== "No Access" ||
                    auth.authority["attendance_category"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_attendance && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("attendance");
                        }}
                      >
                        <i className="la la-clock-o"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.attend}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_attendance && "active"
                        }`}
                      >
                        {auth.authority["attendance_history"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/attendance/history"
                              className={this.activeState(
                                "/attendance/history"
                              )}
                            >
                              {languages.history}
                            </Link>
                          </li>
                        )}
                        {auth.authority["attendance_category"] !==
                          "No Access" && (
                          <li>
                            <Link
                              to="/attendance/category"
                              className={this.activeState(
                                "/attendance/category"
                              )}
                            >
                              {languages.category}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="sidenav-menu-item">
                    <span
                      className={`sidenav-menu-link ${
                        menu_acquisition && "active"
                      }`}
                      onClick={() => {
                        this.openMenu("acquisition");
                      }}
                    >
                      <i className="la la-file-archive-o"></i>
                      <span className="sidenav-menu-link-label">
                        {languages.report}
                      </span>
                    </span>
                    <ul
                      className={`sidenav-menu-dropdown ${
                        menu_acquisition && "active"
                      }`}
                    >
                      <li>
                        <Link
                          to="/reports"
                          className={this.activeState("/reports")}
                        >
                          {languages.akuisisi}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* <div className="sidenav-menu-item">
                    <span className={`sidenav-menu-link ${menu_ottopay && 'active'}`} onClick={() => {this.openMenu('ottopay')}}>
                      <i className="la la-exchange"></i>
                      <span className="sidenav-menu-link-label">Toko Ottopay</span>
                    </span>
                    <ul className={`sidenav-menu-dropdown ${menu_ottopay && 'active'}`}>
                      <li>
                        <Link to="/ottopay/orders" className={this.activeState('/ottopay/orders') }>List Order</Link>
                      </li>
                      <li>
                        <Link to="/ottopay/orders/create" className={this.activeState('/ottopay/orders/create') }>Create Order</Link>
                      </li>
                      <li>
                        <Link to="/ottopay/merchants/register" className={this.activeState('/ottopay/merchants/register') }>Regist Merchant</Link>
                      </li>
                    </ul>
                  </div> */}
                  {(auth.authority["list_region"] !== "No Access" ||
                    auth.authority["list_branch"] !== "No Access" ||
                    auth.authority["list_area"] !== "No Access" ||
                    auth.authority["list_subarea"] !== "No Access" ||
                    auth.authority["list_cluster"] !== "No Access" ||
                    auth.authority["set_region"] !== "No Access" ||
                    auth.authority["set_branch"] !== "No Access" ||
                    auth.authority["set_area"] !== "No Access" ||
                    auth.authority["set_subarea"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_structure && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("structure");
                        }}
                      >
                        <i className="la la-cog"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.structure}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_structure && "active"
                        }`}
                      >
                        {auth.authority["list_region"] !== "No Access" && (
                          <li>
                            <Link
                              to="/regions"
                              className={this.activeState("/regions")}
                            >
                              {languages.region}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_branch"] !== "No Access" && (
                          <li>
                            <Link
                              to="/branches"
                              className={this.activeState("/branches")}
                            >
                              {languages.branch}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_are"] !== "No Access" && (
                          <li>
                            <Link
                              to="/areas"
                              className={this.activeState("/areas")}
                            >
                              {languages.area}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_subarea"] !== "No Access" && (
                          <li>
                            <Link
                              to="/sub_areas"
                              className={this.activeState("/sub_areas")}
                            >
                              {languages.subArea}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_cluster"] !== "No Access" && (
                          <li>
                            <Link
                              to="/cluster"
                              className={this.activeState("/cluster")}
                            >
                              {languages.cluster}
                            </Link>
                          </li>
                        )}
                        {auth.authority["set_region"] !== "No Access" && (
                          <li>
                            <Link
                              to="/regions/new"
                              className={this.activeState("/regions/new")}
                            >
                              {languages.setRegion}
                            </Link>
                          </li>
                        )}
                        {auth.authority["set_branch"] !== "No Access" && (
                          <li>
                            <Link
                              to="/branches/new"
                              className={this.activeState("/branches/new")}
                            >
                              {languages.setBranch}
                            </Link>
                          </li>
                        )}
                        {auth.authority["set_area"] !== "No Access" && (
                          <li>
                            <Link
                              to="/areas/new"
                              className={this.activeState("/areas/new")}
                            >
                              {languages.setArea}
                            </Link>
                          </li>
                        )}
                        {auth.authority["set_subarea"] !== "No Access" && (
                          <li>
                            <Link
                              to="/sub_areas/new"
                              className={this.activeState("/sub_areas/new")}
                            >
                              {languages.setSub}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {(auth.authority["manage_target"] !== "No Access" ||
                    auth.authority["manage_company"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_components && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("components");
                        }}
                      >
                        <i className="la la-cog"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.manageComp}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_components && "active"
                        }`}
                      >
                        {auth.authority["manage_target"] !== "No Access" && (
                          <li>
                            <Link
                              to="/targets/manage"
                              className={this.activeState("/targets/manage")}
                            >
                              {languages.manageTarget}
                            </Link>
                          </li>
                        )}
                        {auth.authority["manage_company"] !== "No Access" && (
                          <li>
                            <Link
                              to="/companies/manage"
                              className={this.activeState("/companies/manage")}
                            >
                              {languages.manageCompany}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="sidenav-menu-item">
                    <span
                      className={`sidenav-menu-link ${
                        menu_daily_acquisition && "active"
                      }`}
                      onClick={() => {
                        this.openMenu("daily_acquisition");
                      }}
                    >
                      <i className="la la-user-plus"></i>
                      <span className="sidenav-menu-link-label">
                        {languages.daily}
                      </span>
                    </span>
                  </div>

                  {
                    (auth.authority["all_todo_list"] !== "No Access" ||
                      auth.authority["add_todo_list"] !== "No Access") && (
                      <div className="sidenav-menu-item">
                        <Link
                          to="/reviews"
                          className={`sidenav-menu-link ${this.activeState(
                            "/reviews"
                          )}`}
                        >
                          <i className="la la-list-alt"></i>
                          <span className="sidenav-menu-link-label">
                            {languages.todo}
                          </span>
                        </Link>
                      </div>
                    )
                    // <div className="sidenav-menu-item">
                    //   <span className={`sidenav-menu-link ${menu_reviews && 'active'}`} onClick={() => {this.openMenu('reviews')}}>
                    //     <i className="la la-clipboard"></i>
                    //     <span className="sidenav-menu-link-label">Manage To-do List</span>
                    //   </span>
                    //   <ul className={`sidenav-menu-dropdown ${menu_reviews && 'active'}`}>
                    //     { auth.authority["all_todo_list"] !== "No Access" &&
                    //       <li>
                    //         <Link to="/reviews" className={this.activeState('/reviews') }>All To-do List</Link>
                    //       </li>
                    //     }
                    //     { auth.authority["add_todo_list"] !== "No Access" &&
                    //       <li>
                    //         <Link to="/reviews/new" className={this.activeState('/reviews/new') }>Add To-do List</Link>
                    //       </li>
                    //     }
                    //   </ul>
                    // </div>
                  }

                  {(auth.authority["recruitment"] !== "No Access" ||
                    auth.authority["recruitment"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <Link
                        to="/recruitment"
                        className={`sidenav-menu-link ${this.activeState(
                          "/recruitment"
                        )}`}
                      >
                        <i className="la la-user-plus"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.recruit}
                        </span>
                      </Link>
                    </div>
                  )}

                  {(auth.authority["list_all_admin"] !== "No Access" ||
                    auth.authority["add_admin"] !== "No Access" ||
                    auth.authority["list_role"] !== "No Access" ||
                    auth.authority["define_role"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_admins && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("admins");
                        }}
                      >
                        <i className="la la-cog"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.admin}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_admins && "active"
                        }`}
                      >
                        {auth.authority["list_all_admin"] !== "No Access" && (
                          <li>
                            <Link
                              to="/admin/manage"
                              className={this.activeState("/admin/manage")}
                            >
                              {languages.adminList}
                            </Link>
                          </li>
                        )}
                        {auth.authority["add_admin"] !== "No Access" && (
                          <li>
                            <Link
                              to="/admin/register"
                              className={this.activeState("/admin/register")}
                            >
                              {languages.addAdmin}
                            </Link>
                          </li>
                        )}
                        {auth.authority["list_role"] !== "No Access" && (
                          <li>
                            <Link
                              to="/admin/roles"
                              className={this.activeState("/admin/roles")}
                            >
                              {languages.roleList}
                            </Link>
                          </li>
                        )}
                        {auth.authority["define_role"] !== "No Access" && (
                          <li>
                            <Link
                              to="/admin/roles/new"
                              className={this.activeState("/admin/roles/new")}
                            >
                              {languages.role}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {auth.authority["merchant_recruit"] !== "No Access" && (
                    <div className="sidenav-menu-item">
                      <Link
                        to="/admin/merchant-dashboard"
                        className={`sidenav-menu-link ${this.activeState(
                          "/admin/merchant-dashboard"
                        )}`}
                      >
                        <i className="la la-area-chart"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.merchant}
                        </span>
                      </Link>
                    </div>
                  )}

                  {auth.authority["pencatatan_user_ottocash"] !==
                    "No Access" && (
                    <div className="sidenav-menu-item">
                      <Link
                        to="/ottocash/users"
                        className={`sidenav-menu-link ${this.activeState(
                          "/ottocash/users"
                        )}`}
                      >
                        <i className="la la-user"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.ottocash}
                        </span>
                      </Link>
                    </div>
                  )}

                  {(auth.authority["calendar_setup"] !== "No Access" ||
                    auth.authority["calendar_setup"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <span
                        className={`sidenav-menu-link ${
                          menu_system_configuration && "active"
                        }`}
                        onClick={() => {
                          this.openMenu("system_configuration");
                        }}
                      >
                        <i className="la la-cog"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.systemConf}
                        </span>
                      </span>
                      <ul
                        className={`sidenav-menu-dropdown ${
                          menu_system_configuration && "active"
                        }`}
                      >
                        {auth.authority["calendar_setup"] !== "No Access" && (
                          <li>
                            <Link
                              to="/system-configuration/calendar"
                              className={this.activeState(
                                "/system-configuration/calendar"
                              )}
                            >
                              {languages.calendar}
                            </Link>
                          </li>
                        )}
                        {auth.authority["sales_level"] !== "No Access" && (
                          <li>
                            <Link
                              to="/system-configuration/sales-level"
                              className={this.activeState(
                                "/system-configuration/sales-level"
                              )}
                            >
                              {languages.salesLevel}
                            </Link>
                          </li>
                        )}

                        {"" !== "No Access" && (
                          <li>
                            <Link
                              to="/system-configuration/acquisition/"
                              className={this.activeState(
                                "/system-configuration/acquisition"
                              )}
                            >
                              {languages.acquisitionList}
                            </Link>
                          </li>
                        )}

                        {"" !== "No Access" && (
                          <li>
                            <Link
                              to="/system-configuration/task-category/"
                              className={this.activeState(
                                "/system-configuration/task-category"
                              )}
                            >
                              {languages.taskCategory}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {(auth.authority["merchant_list"] !== "No Access" ||
                    auth.authority["merchant_list"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <Link
                        to="/merchant"
                        className={`sidenav-menu-link ${this.activeState(
                          "/merchant"
                        )}`}
                      >
                        <i className="la la-list"></i>
                        <span className="sidenav-menu-link-label">
                          {languages.merchantList}
                        </span>
                      </Link>
                    </div>
                  )}

                  {(auth.authority["call_plan"] !== "No Access" ||
                    auth.authority["call_plan"] !== "No Access") && (
                    <div className="sidenav-menu-item">
                      <Link
                        to="/call-plan"
                        className={`sidenav-menu-link ${this.activeState(
                          "/call-plan"
                        )}`}
                      >
                        <i className="la la-file-text"></i>
                        <span className="sidenav-menu-link-label">
                          Call Plan
                        </span>
                      </Link>
                    </div>
                  )}
                </React.Fragment>
              )}

              <div className="sidenav-menu-item">
                <span
                  className={`sidenav-menu-link ${
                    menu_list_request && "active"
                  }`}
                  onClick={() => {
                    this.openMenu("list_request");
                  }}
                >
                  <i className="la la-bullhorn"></i>
                  <span className="sidenav-menu-link-label">
                    {languages.request}
                  </span>
                </span>
                <ul
                  className={`sidenav-menu-dropdown ${
                    menu_list_request && "active"
                  }`}
                >
                  <li>
                    <Link
                      to="/requests"
                      className={this.activeState("/requests")}
                    >
                      {languages.allRequest}
                    </Link>
                  </li>
                </ul>
              </div>

              {(auth.authority["lokasi_salesman"] !== "No Access" ||
                auth.authority["aktivitas_salesman"] !== "No Access" ||
                auth.authority["manajement_tugas"] !== "No Access") &&
                auth.position == "Maker" && (
                  <div className="sidenav-menu-item">
                    <span
                      className={`sidenav-menu-link ${
                        menu_sfa_team_leader && "active"
                      }`}
                      onClick={() => {
                        this.openMenu("sfa_team_leader");
                      }}
                    >
                      <i className="la la-map-marker"></i>
                      <span className="sidenav-menu-link-label">
                        {languages.sfaTeamLeader}
                      </span>
                    </span>
                    <ul
                      className={`sidenav-menu-dropdown ${
                        menu_sfa_team_leader && "active"
                      }`}
                    >
                      {auth.authority["lokasi_salesman"] !== "No Access" && (
                        <li>
                          <Link
                            to="/sfa-team-leader/salesmen-location"
                            className={this.activeState(
                              "/sfa-team-leader/salesmen-location"
                            )}
                          >
                            {languages.sfaTeamLeaderLocationSalesmen}
                          </Link>
                        </li>
                      )}
                      {auth.authority["aktivitas_salesman"] !== "No Access" && (
                        <li>
                          <Link
                            to="/activities"
                            className={this.activeState("/activities")}
                          >
                            {languages.sfaTeamLeaderAktivitasSalesmen}
                          </Link>
                        </li>
                      )}
                      {auth.authority["manajement_tugas"] !== "No Access" && (
                        <li>
                          <Link
                            to="/task-management/"
                            className={this.activeState("/task-management")}
                          >
                            {languages.sfaTeamLeaderTaskManagement}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </nav>
          <div
            className="content-body"
            onClick={() =>
              this.setState({ showSetting: false, showNotif: false })
            }
          >
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
            </Switch>
          </div>
          <Offline>
            <ModalOffline
              isOpen={modalOpen}
              handleClose={() => (window.location = "/")}
            />
          </Offline>
        </div>
      </div>
    );
  }
}

export default connect(({ auth, notifications }) => ({ auth, notifications }), {
  signOut,
  checkAuthToken,
  getCountries,
  getProvinces,
  getRoles,
  getGenders,
  getCompanyCodes,
  getNotifications,
  getSalesTypeList,
  changeStatus,
  DeleteAdminSubArea,
})(DefaultLayout);
