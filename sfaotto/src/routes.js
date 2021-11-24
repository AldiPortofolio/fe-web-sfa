import React from "react";
import Loadable from "react-loadable";
import { LoadingDots } from "./components";

function Loading() {
  return (
    <div className="page-load">
      <LoadingDots color="black" />
    </div>
  );
}

const Dashboard = Loadable({
  loader: () => import("./pages/Dashboard"),
  loading: Loading,
});

const AdminManage = Loadable({
  loader: () => import("./pages/admin/Manage"),
  loading: Loading,
});

const AdminRegister = Loadable({
  loader: () => import("./pages/admin/Register"),
  loading: Loading,
});

const AdminEdit = Loadable({
  loader: () => import("./pages/admin/Edit"),
  loading: Loading,
});

const AdminDetail = Loadable({
  loader: () => import("./pages/admin/Detail"),
  loading: Loading,
});

const MerchantDashboard = Loadable({
  loader: () => import("./pages/admin/MerchantDashboard"),
  loading: Loading,
});

const RoleManage = Loadable({
  loader: () => import("./pages/roles/Manage"),
  loading: Loading,
});

const RoleNew = Loadable({
  loader: () => import("./pages/roles/New"),
  loading: Loading,
});

const RoleEdit = Loadable({
  loader: () => import("./pages/roles/Edit"),
  loading: Loading,
});

const SalesRegister = Loadable({
  loader: () => import("./pages/sales/Register"),
  loading: Loading,
});

const SalesRecruit = Loadable({
  loader: () => import("./pages/sales/Recruit"),
  loading: Loading,
});

const SalesEdit = Loadable({
  loader: () => import("./pages/sales/Edit"),
  loading: Loading,
});

const SalesDetail = Loadable({
  loader: () => import("./pages/sales/Detail"),
  loading: Loading,
});

const SalesManage = Loadable({
  loader: () => import("./pages/sales/Manage"),
  loading: Loading,
});

const SalesVerifications = Loadable({
  loader: () => import("./pages/sales/Verifications"),
  loading: Loading,
});

const SalesVerify = Loadable({
  loader: () => import("./pages/sales/Verify"),
  loading: Loading,
});

const SalesAssignment = Loadable({
  loader: () => import("./pages/sales/Assignment"),
  loading: Loading,
});

const NewSalesAssignment = Loadable({
  loader: () => import("./pages/sales/AssignmentNew"),
  loading: Loading,
});

const EditSalesAssignment = Loadable({
  loader: () => import("./pages/sales/AssignmentEdit"),
  loading: Loading,
});

const ListSalesPosition = Loadable({
  loader: () => import("./pages/sales/Positions"),
  loading: Loading,
});

const NewSalesPosition = Loadable({
  loader: () => import("./pages/sales/PositionNew"),
  loading: Loading,
});

const DetailSalesPosition = Loadable({
  loader: () => import("./pages/sales/PositionDetail"),
  loading: Loading,
});

const EditSalesPosition = Loadable({
  loader: () => import("./pages/sales/PositionEdit"),
  loading: Loading,
});

const SalesUnassignment = Loadable({
  loader: () => import("./pages/sales/Unassignment"),
  loading: Loading,
});

const SalesPromotion = Loadable({
  loader: () => import("./pages/sales/Promotion"),
  loading: Loading,
});

const TodosNew = Loadable({
  loader: () => import("./pages/todos/New"),
  loading: Loading,
});

const TodosEdit = Loadable({
  loader: () => import("./pages/todos/Edit"),
  loading: Loading,
});

const TodosManage = Loadable({
  loader: () => import("./pages/todos/Manage"),
  loading: Loading,
});

const RequestsManage = Loadable({
  loader: () => import("./pages/requests"),
  loading: Loading,
});

const RequestsDetail = Loadable({
  loader: () => import("./pages/requests/Detail"),
  loading: Loading,
});

const ReviewNew = Loadable({
  loader: () => import("./pages/reviews/New"),
  loading: Loading,
});

const ReviewEdit = Loadable({
  loader: () => import("./pages/reviews/Edit"),
  loading: Loading,
});

const ReviewDetail = Loadable({
  loader: () => import("./pages/reviews/Detail"),
  loading: Loading,
});

const ReviewManage = Loadable({
  loader: () => import("./pages/reviews/"),
  loading: Loading,
});

const CompaniesManage = Loadable({
  loader: () => import("./pages/companies/Manage"),
  loading: Loading,
});

const TargetsDetail = Loadable({
  loader: () => import("./pages/targets/Detail"),
  loading: Loading,
});

const TargetsSetTarget = Loadable({
  loader: () => import("./pages/targets/SetTarget"),
  loading: Loading,
});

const TargetsSet = Loadable({
  loader: () => import("./pages/targets/New"),
  loading: Loading,
});

const TargetsList = Loadable({
  loader: () => import("./pages/targets/List"),
  loading: Loading,
});

const TargetsManage = Loadable({
  loader: () => import("./pages/targets/Manage"),
  loading: Loading,
});

const ListRegion = Loadable({
  loader: () => import("./pages/regions/index"),
  loading: Loading,
});

const NewRegion = Loadable({
  loader: () => import("./pages/regions/new"),
  loading: Loading,
});

const EditRegion = Loadable({
  loader: () => import("./pages/regions/edit"),
  loading: Loading,
});

const ListBranch = Loadable({
  loader: () => import("./pages/branches/index"),
  loading: Loading,
});

const NewBranch = Loadable({
  loader: () => import("./pages/branches/new"),
  loading: Loading,
});

const EditBranch = Loadable({
  loader: () => import("./pages/branches/edit"),
  loading: Loading,
});

const ListArea = Loadable({
  loader: () => import("./pages/areas/index"),
  loading: Loading,
});

const NewArea = Loadable({
  loader: () => import("./pages/areas/new"),
  loading: Loading,
});

const EditArea = Loadable({
  loader: () => import("./pages/areas/edit"),
  loading: Loading,
});

const ListSubarea = Loadable({
  loader: () => import("./pages/subareas/index"),
  loading: Loading,
});

const NewSubarea = Loadable({
  loader: () => import("./pages/subareas/new"),
  loading: Loading,
});

const EditSubarea = Loadable({
  loader: () => import("./pages/subareas/edit"),
  loading: Loading,
});

const Reports = Loadable({
  loader: () => import("./pages/reports"),
  loading: Loading,
});

const OttopayOrder = Loadable({
  loader: () => import("./pages/ottopay_orders"),
  loading: Loading,
});

const OttocashUser = Loadable({
  loader: () => import("./pages/ottocash_users"),
  loading: Loading,
});

const AttendanceHistory = Loadable({
  loader: () => import("./pages/attendances/History"),
  loading: Loading,
});

const AttendanceHistoryDetail = Loadable({
  loader: () => import("./pages/attendances/Detail"),
  loading: Loading,
});

const AttendanceCategory = Loadable({
  loader: () => import("./pages/attendances/Category"),
  loading: Loading,
});

const AttendanceCategoryNew = Loadable({
  loader: () => import("./pages/attendances/CategoryNew"),
  loading: Loading,
});

const AttendanceCategoryEdit = Loadable({
  loader: () => import("./pages/attendances/CategoryEdit"),
  loading: Loading,
});

const AttendanceCategoryDetail = Loadable({
  loader: () => import("./pages/attendances/CategoryDetail"),
  loading: Loading,
});

const Cluster = Loadable({
  loader: () => import("./pages/cluster/index"),
  loading: Loading,
});

const ClusterDetail = Loadable({
  loader: () => import("./pages/cluster/detail"),
  loading: Loading,
});

const Calendar = Loadable({
  loader: () => import("./pages/calendar/index"),
  loading: Loading,
});

const CalendarEdit = Loadable({
  loader: () => import("./pages/calendar/edit"),
  loading: Loading,
});

const CaledarNew = Loadable({
  loader: () => import("./pages/calendar/new"),
  loading: Loading,
});

const Merchant = Loadable({
  loader: () => import("./pages/merchant/index"),
  loading: Loading,
});

const CallPlan = Loadable({
  loader: () => import("./pages/call_plan/index"),
  loading: Loading,
});

const CallPlanDetail = Loadable({
  loader: () => import("./pages/call_plan/callPlanDetail"),
  loading: Loading,
});

const CallPlanMerchantDetail = Loadable({
  loader: () => import("./pages/call_plan/merchantDetail"),
  loading: Loading,
});

const Recruitment = Loadable({
  loader: () => import("./pages/recruitment/index"),
  loading: Loading,
});

const NewRecruitment = Loadable({
  loader: () => import("./pages/recruitment/new"),
  loading: Loading,
});

const DetailRecruitment = Loadable({
  loader: () => import("./pages/recruitment/detail"),
  loading: Loading,
});

const SalesLevel = Loadable({
  loader: () => import("./pages/sales_level/index"),
  loading: Loading,
});

const SalesLevelNew = Loadable({
  loader: () => import("./pages/sales_level/new"),
  loading: Loading,
});

const SalesLevelEdit = Loadable({
  loader: () => import("./pages/sales_level/edit"),
  loading: Loading,
});

const SalesLevelAssignment = Loadable({
  loader: () => import("./pages/sales_level_assignment/index"),
  loading: Loading,
});

const SalesLevelAssignmentNew = Loadable({
  loader: () => import("./pages/sales_level_assignment/new"),
  loading: Loading,
});

const SalesLevelAssignmentEdit = Loadable({
  loader: () => import("./pages/sales_level_assignment/edit"),
  loading: Loading,
});

const Acquisition = Loadable({
  loader: () => import("./pages/acquisition/Manage"),
  loading: Loading,
});

const AcquisitionAdd = Loadable({
  loader: () => import("./pages/acquisition/Add"),
  loading: Loading,
});

const Acquisitionedit = Loadable({
  loader: () => import("./pages/acquisition/Edit"),
  loading: Loading,
});

const AcquisitionDetail = Loadable({
  loader: () => import("./pages/acquisition/Detail"),
  loading: Loading,
});

const Activities = Loadable({
  loader: () => import("./pages/salesman_activity/index"),
  loading: Loading,
});

const ActivitiesDetail = Loadable({
  loader: () => import("./pages/salesman_activity/detail"),
  loading: Loading,
});

const ActivitiesDetailTodo = Loadable({
  loader: () => import("./pages/salesman_activity/detail_todolist"),
  loading: Loading,
});

const ActivitiesDetailCallPlan = Loadable({
  loader: () => import("./pages/salesman_activity/detail_callplan"),
  loading: Loading,
});

const SalesmenLocation = Loadable({
  loader: () => import("./pages/salesmen_location/index"),
  loading: Loading,
});

const SalesmenLocationList = Loadable({
  loader: () => import("./pages/salesmen_location/list"),
  loading: Loading,
});

const SalesmenLocationDetail = Loadable({
  loader: () => import("./pages/salesmen_location/detail"),
  loading: Loading,
});

const TaskManagement = Loadable({
  loader: () => import("./pages/task_management/index"),
  loading: Loading,
});

const TaskManagementAdd = Loadable({
  loader: () => import("./pages/task_management/add"),
  loading: Loading,
});

const TaskManagementDraft = Loadable({
  loader: () => import("./pages/task_management/draft"),
  loading: Loading,
});

const TaskManagementEdit = Loadable({
  loader: () => import("./pages/task_management/edit"),
  loading: Loading,
});

const TaskManagementDetail = Loadable({
  loader: () => import("./pages/task_management/detail"),
  loading: Loading,
});

const TaskManagementDetailSubmit = Loadable({
  loader: () => import("./pages/task_management/detail_submit"),
  loading: Loading,
});

const TaskManagementDetailReAssign = Loadable({
  loader: () => import("./pages/task_management/tugas_ulang"),
  loading: Loading,
});

const TaskCategory = Loadable({
  loader: () => import("./pages/task_category/index"),
  loading: Loading,
});

const TaskCategoryAdd = Loadable({
  loader: () => import("./pages/task_category/add"),
  loading: Loading,
});

const TaskCategoryEdit = Loadable({
  loader: () => import("./pages/task_category/edit"),
  loading: Loading,
});

const Page404 = Loadable({
  loader: () => import("./pages/Page404"),
  loading: Loading,
});

const routes = [
  { path: "/", exact: true, name: "Dashboard", component: Dashboard },
  { path: "/sales/edit/:id", component: SalesEdit },
  { path: "/sales/detail/:id/", component: SalesDetail },
  { path: "/sales/register", exact: true, component: SalesRegister },
  { path: "/sales/recruit", exact: true, component: SalesRecruit },
  { path: "/sales", exact: true, component: SalesManage },
  { path: "/sales/verifications", exact: true, component: SalesVerifications },
  { path: "/sales/verify/:id", exact: true, component: SalesVerify },
  { path: "/sales/assignments", exact: true, component: SalesAssignment },
  {
    path: "/sales/assignments/new",
    exact: true,
    component: NewSalesAssignment,
  },
  {
    path: "/sales/assignments/:id/edit",
    exact: true,
    component: EditSalesAssignment,
  },
  { path: "/sales/positions", exact: true, component: ListSalesPosition },
  { path: "/sales/positions/new", exact: true, component: NewSalesPosition },
  {
    path: "/sales/positions/:id/edit",
    exact: true,
    component: EditSalesPosition,
  },
  { path: "/sales/positions/:id", exact: true, component: DetailSalesPosition },
  { path: "/sales/unassignment", exact: true, component: SalesUnassignment },
  { path: "/sales/promotion", exact: true, component: SalesPromotion },
  {
    path: "/sales/sales_level_assignment",
    exact: true,
    component: SalesLevelAssignment,
  },
  {
    path: "/sales/sales_level_assignment/new",
    exact: true,
    component: SalesLevelAssignmentNew,
  },
  {
    path: "/sales/sales_level_assignment/:id/edit",
    exact: true,
    component: SalesLevelAssignmentEdit,
  },
  { path: "/todos/new", exact: true, component: TodosNew },
  { path: "/todos/edit/:id", exact: true, component: TodosEdit },
  { path: "/todos", exact: true, component: TodosManage },
  { path: "/requests", exact: true, component: RequestsManage },
  { path: "/requests/:id", exact: true, component: RequestsDetail },
  { path: "/reviews/new", exact: true, component: ReviewNew },
  { path: "/reviews/edit/:id", exact: true, component: ReviewEdit },
  { path: "/reviews/:id", exact: true, component: ReviewDetail },
  { path: "/reviews", exact: true, component: ReviewManage },
  { path: "/companies/manage", exact: true, component: CompaniesManage },
  { path: "/admin/manage", exact: true, component: AdminManage },
  {
    path: "/admin/merchant-dashboard",
    exact: true,
    component: MerchantDashboard,
  },
  { path: "/admin/edit/:id", component: AdminEdit },
  { path: "/admin/detail/:id", component: AdminDetail },
  { path: "/admin/register", exact: true, component: AdminRegister },
  { path: "/admin/roles/", exact: true, component: RoleManage },
  { path: "/admin/roles/new", exact: true, component: RoleNew },
  { path: "/admin/roles/:id/edit", exact: true, component: RoleEdit },
  { path: "/targets/detail/:id", component: TargetsDetail },
  { path: "/targets/set-target", exact: true, component: TargetsSetTarget },
  { path: "/targets/set", exact: true, component: TargetsSet },
  { path: "/targets/list", exact: true, component: TargetsList },
  { path: "/targets/manage", exact: true, component: TargetsManage },
  { path: "/regions", exact: true, component: ListRegion },
  { path: "/regions/new", exact: true, component: NewRegion },
  { path: "/regions/:id/edit", exact: true, component: EditRegion },
  { path: "/branches", exact: true, component: ListBranch },
  { path: "/branches/new", exact: true, component: NewBranch },
  { path: "/branches/:id/edit", exact: true, component: EditBranch },
  { path: "/areas", exact: true, component: ListArea },
  { path: "/areas/new", exact: true, component: NewArea },
  { path: "/areas/:id/edit", exact: true, component: EditArea },
  { path: "/sub_areas", exact: true, component: ListSubarea },
  { path: "/sub_areas/new", exact: true, component: NewSubarea },
  { path: "/sub_areas/:id/edit", exact: true, component: EditSubarea },
  { path: "/reports", exact: true, component: Reports },
  { path: "/ottopay/orders", exact: true, component: OttopayOrder },
  { path: "/ottocash/users", exact: true, component: OttocashUser },
  { path: "/attendance/history", exact: true, component: AttendanceHistory },
  {
    path: "/attendance/history/:id",
    exact: true,
    component: AttendanceHistoryDetail,
  },
  { path: "/attendance/category", exact: true, component: AttendanceCategory },
  {
    path: "/attendance/category/new",
    exact: true,
    component: AttendanceCategoryNew,
  },
  {
    path: "/attendance/category/edit/:id",
    exact: true,
    component: AttendanceCategoryEdit,
  },
  {
    path: "/attendance/category/:id",
    exact: true,
    component: AttendanceCategoryDetail,
  },
  { path: "/cluster", exact: true, component: Cluster },
  { path: "/cluster/:id", exact: true, component: ClusterDetail },
  { path: "/system-configuration/calendar", exact: true, component: Calendar },
  {
    path: "/system-configuration/calendar/edit/:id",
    exact: true,
    component: CalendarEdit,
  },
  {
    path: "/system-configuration/calendar/new",
    exact: true,
    component: CaledarNew,
  },
  { path: "/merchant", exact: true, component: Merchant },
  { path: "/call-plan", exact: true, component: CallPlan },
  { path: "/call-plan/:id", exact: true, component: CallPlanDetail },
  {
    path: "/call-plan/:id/merchant/:id",
    exact: true,
    component: CallPlanMerchantDetail,
  },
  { path: "/recruitment", exact: true, component: Recruitment },
  { path: "/recruitment/new", exact: true, component: NewRecruitment },
  { path: "/recruitment/:id", exact: true, component: DetailRecruitment },
  {
    path: "/system-configuration/sales-level",
    exact: true,
    component: SalesLevel,
  },
  {
    path: "/system-configuration/sales-level/new",
    exact: true,
    component: SalesLevelNew,
  },
  {
    path: "/system-configuration/sales-level/edit/:id",
    exact: true,
    component: SalesLevelEdit,
  },
  {
    path: "/system-configuration/acquisition",
    exact: true,
    component: Acquisition,
  },
  {
    path: "/system-configuration/acquisition/add",
    exact: true,
    component: AcquisitionAdd,
  },
  {
    path: "/system-configuration/acquisition/edit/:id",
    exact: true,
    component: Acquisitionedit,
  },
  {
    path: "/system-configuration/acquisition/detail/:id",
    exact: true,
    component: AcquisitionDetail,
  },
  { path: "/activities", exact: true, component: Activities },
  {
    path: "/activities/:id/date/:callPlanDate",
    exact: true,
    component: ActivitiesDetail,
  },
  {
    path: "/activities/:id/todo-list/:todoListId",
    exact: true,
    component: ActivitiesDetailTodo,
  },
  {
    path: "/activities/:id/call-plan/:callPlanId",
    exact: true,
    component: ActivitiesDetailCallPlan,
  },
  {
    path: "/sfa-team-leader/salesmen-location/",
    exact: true,
    component: SalesmenLocation,
  },
  {
    path: "/sfa-team-leader/salesmen-location/list",
    exact: true,
    component: SalesmenLocationList,
  },
  {
    path: "/sfa-team-leader/salesmen-location/detail/",
    exact: true,
    component: SalesmenLocationDetail,
  },
  {
    path: "/task-management/",
    exact: true,
    component: TaskManagement,
  },
  {
    path: "/task-management/add",
    exact: true,
    component: TaskManagementAdd,
  },
  {
    path: "/task-management/draft",
    exact: true,
    component: TaskManagementDraft,
  },
  {
    path: "/task-management/edit/:id",
    exact: true,
    component: TaskManagementEdit,
  },
  {
    path: "/task-management/detail/:id",
    exact: true,
    component: TaskManagementDetail,
  },
  {
    path: "/task-management/detail-submit/:id",
    exact: true,
    component: TaskManagementDetailSubmit,
  },
  {
    path: "/task-management/reassign/:id",
    exact: true,
    component: TaskManagementDetailReAssign,
  },

  {
    path: "/system-configuration/task-category/",
    exact: true,
    component: TaskCategory,
  },
  {
    path: "/system-configuration/task-category/add",
    exact: true,
    component: TaskCategoryAdd,
  },
  {
    path: "/system-configuration/task-category/edit/:id",
    exact: true,
    component: TaskCategoryEdit,
  },
  { name: "Page404", component: Page404 },
];

export default routes;
