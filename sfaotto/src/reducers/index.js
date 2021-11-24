import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import auth from "./auth";
import admins from "./admins";
import sales from "./sales";
import countries from "./countries";
import provinces from "./provinces";
import cities from "./cities";
import districts from "./districts";
import villages from "./villages";
import company_codes from "./company_codes";
import genders from "./genders";
import roles from "./roles";
import targets from "./targets";
import manage_targets from "./manage_targets";
import manage_target_types from "./manage_target_types";
import companies from "./companies";
import todos from "./todos";
import reviews from "./reviews";
import regions from "./region";
import branches from "./branches";
import areas from "./areas";
import subareas from "./subareas";
import reports from "./reports";
import ottopay from "./ottopay";
import ottocash_user from "./ottocash_users";
import requests from "./requests";
import notifications from "./notifications";
import category_list from "./category_list";
import todo_list from "./todo_list";
import sub_category from "./sub_category";
import attendance_history from "./attendance_history";
import attendance_category from "./attendance_category";
import clusters from "./cluster";
import calendars from "./calendar";
import merchants from "./merchant";
import call_plan from "./call_plan";
import call_plan_merchants from "./call_plan_merchants";
import sales_types from "./sales_types";
import recruitments from "./recruitments";
import sales_levels from "./sales_level";
import sales_level_assignments from "./sales_level_assignment";
import acquisitions from "./acquisitions";
import merchant_types from "./merchant_types";
import activities from "./salesman_activity";
import task_category from "./task_category";
import salesmen_location from "./salesmen_location";
import task_management from "./task_management";
import minio from "./minio";

const rootReducer = combineReducers({
  auth,
  admins,
  sales,
  attendance_history,
  attendance_category,
  countries,
  provinces,
  cities,
  districts,
  villages,
  company_codes,
  category_list,
  sub_category,
  todo_list,
  genders,
  roles,
  targets,
  manage_targets,
  manage_target_types,
  companies,
  todos,
  reviews,
  regions,
  branches,
  areas,
  subareas,
  reports,
  ottopay,
  ottocash_user,
  requests,
  notifications,
  clusters,
  calendars,
  merchants,
  call_plan,
  call_plan_merchants,
  sales_types,
  recruitments,
  sales_levels,
  sales_level_assignments,
  acquisitions,
  merchant_types,
  activities,
  task_category,
  salesmen_location,
  task_management,
  minio,
  form: formReducer,
});

export default rootReducer;
