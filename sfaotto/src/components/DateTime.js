import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({handleChange, value, required, disabled, placeholder}) => {

  return (
    <DatePicker
      className="form-control form-control-line"
      showMonthDropdown
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={50}
      placeholderText={placeholder}
      dateFormat="DD-MM-YYYY, HH:mm"
      selected={value ? moment(value, 'YYYY-MM-DD HH:mm:ss') : null}
      onChange={(value) => { if (value !== null) {
          handleChange(value.format('YYYY-MM-DD HH:mm:ss'))
        } else {
          handleChange("")
        }
      }}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={1}
      disabled={disabled}
      required={required}
    />
  )
}

export default DatePickerComponent

// import React from 'react'
// import moment from 'moment'
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const DatePickerComponent = ({handleChange, value, required, disabled}) => {

//   return (
//     <DatePicker
//       className="form-control form-control-line"
//       showMonthDropdown
//       showYearDropdown
//       scrollableYearDropdown
//       yearDropdownItemNumber={50}
//       placeholderText='Imput'
//       dateFormat="dd-MM-yyyy, HH:mm"
//       selected={value}
//       onChange={(value) => {
//         handleChange(value)
//       }}
//       timeInputLabel="Time:"
//       showTimeInput
//       disabled={disabled}
//       required={required}
//     />
//   )
// }

// export default DatePickerComponent

