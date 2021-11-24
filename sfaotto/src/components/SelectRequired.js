import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const noop = () => {
  // no operation (do nothing real quick)
};

class SelectRequired extends React.Component {
  state = {
    value: this.props.value || "",
  };

  selectRef = null;
  setSelectRef = (ref) => {
    this.selectRef = ref;
  };

  onChange = (value, actionMeta) => {
    this.props.onChange(value, actionMeta);
    this.setState({ value });
  };

  // onInputChange = (selectedData) => {
  //   this.props.onInputChange(selectedData)
  //   }

  getValue = () => {
    if (this.props.value !== undefined) return this.props.value;
    return this.state.value || "";
  };

  render() {
    const { required, placeholder, ...props } = this.props;
    const { isDisabled } = this.props;
    const enableRequired = !isDisabled;

    return (
      <div>
        <Select
          {...props}
          ref={this.setSelectRef}
          onChange={this.onChange}
          className="select-line w-100"
          classNamePrefix="select-line-inner"
          placeholder={placeholder}
        />
        {enableRequired && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              width: "100%",
              height: 0,
              position: "absolute",
            }}
            value={this.getValue()}
            onChange={noop}
            // onInputChange={noop}
            onFocus={() => this.selectRef.focus()}
            required={required}
          />
        )}
      </div>
    );
  }
}

SelectRequired.defaultProps = {
  onChange: noop,
  // onInputChange: noop
};

SelectRequired.protoTypes = {
  // onInputChange: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default SelectRequired;
