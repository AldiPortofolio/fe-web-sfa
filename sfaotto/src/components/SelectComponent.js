import React from 'react';
import Select from 'react-select';

const SelectComponent = ({ options, initValue, handleChange, isDisabled }) => {
  return (
    <Select
      className='select-circle flex-fill'
      classNamePrefix='select-circle-inner'
      value={initValue}
      options={options}
      isDisabled={isDisabled}
      onChange={selectedData => handleChange(selectedData)}
    />
  );
}

export default SelectComponent
