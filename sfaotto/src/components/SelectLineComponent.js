import React from "react";
import Select from "react-select";

const SelectLineComponent = ({
  options,
  initValue,
  handleChange,
  isDisabled,
  placeholder,
  required,
}) => {
  return (
    <Select
      className="select-line w-100"
      classNamePrefix="select-line-inner"
      placeholder={placeholder ? placeholder : "Select"}
      value={initValue}
      options={options}
      isDisabled={isDisabled}
      onChange={(selectedData) => handleChange(selectedData)}
      required={required}
    />
  );
};

export default SelectLineComponent;
