import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconCalendar } from "../components/Icons";

const DatePickerComponent = ({
  handleChange,
  value,
  required,
  disabled,
  yearDropdownItemNumber,
  placeholder,
  maxDate,
  className,
  disablePastDate,
}) => {
  if (yearDropdownItemNumber === "") {
    yearDropdownItemNumber = 50;
  }

  if (!className) {
    className = "form-control form-control-line";
  }

  return (
    // <DatePicker
    //   className="form-control form-control-line"
    //   showMonthDropdown
    //   showYearDropdown
    //   scrollableYearDropdown
    //   yearDropdownItemNumber={yearDropdownItemNumber}
    //   placeholderText={ placeholder ? placeholder : "dd-mm-yyyy"}
    //   maxDate={maxDate ? moment(maxDate, 'YYYY-MM-DD') : null}
    //   dateFormat="DD-MM-YYYY"
    //   selected={value ? moment(value, 'DD-MM-YYYY') : null}
    //   onChange={(value) => {
    //     handleChange(value)
    //   }}
    //   disabled={disabled}
    //   required={required}
    // />

    <div className="input-filter">
      <DatePicker
        className={className}
        // style={{ position: "absolute" }}
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={yearDropdownItemNumber}
        placeholderText={placeholder ? placeholder : "dd-mm-yyyy"}
        maxDate={maxDate ? moment(maxDate, "YYYY-MM-DD") : null}
        dateFormat="DD-MM-YYYY"
        selected={value ? moment(value, "YYYY-MM-DD") : null}
        onChange={(value) => {
          handleChange(value.format("YYYY-MM-DD"));
        }}
        disabled={disabled}
        required={required}
        minDate={disablePastDate ? moment().toDate() : ""}
      />
      <span className="input-group-addon">
        <IconCalendar />
      </span>
    </div>
  );
};

export default DatePickerComponent;
