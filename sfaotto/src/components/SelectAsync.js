import React from 'react';
import Select from 'react-select';

const SelectAsync = ({ options, initValue, onInputChange, handleChange, isDisabled, placeholder, required, className, classNamePrefix }) => {
  if (className == null){
    className = 'select-line w-100'
    classNamePrefix = 'select-line-inner'
  }
  return (
    <Select
      className={className}
      classNamePrefix={classNamePrefix}
      value={initValue ? initValue : required}
      options={options}
      isDisabled={isDisabled}
      onChange={selectedData => handleChange(selectedData)}
      onInputChange={selectedData => onInputChange(selectedData)}
      required={required}
    />
  );
}

export default SelectAsync
