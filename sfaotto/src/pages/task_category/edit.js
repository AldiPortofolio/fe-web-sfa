import React, { Component } from "react";
import { Link } from "react-router-dom";
import { LoadingDots, ModalConfirm } from "../../components";
import { getDetailCategory, editCategory } from "../../actions/task_category";
import { connect } from "react-redux";

class Edit extends Component {
  state = {
    id: "",
    name: "",
    description: "",
    isLoading: false,
    confirmIsOpen: false,
    type: "success",
    textSuccess: "",
    textError: "",
  };

  componentWillMount() {
    document.title = "SFA OTTO - Edit Task Kategori";
    this.setState({ id: this.props.match.params.id });
    this.props.getDetailCategory(this.props.match.params.id).then((data) => {
      this.setState({
        ...data.data,
      });
    });
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, description } = this.state;
    const { editCategory } = this.props;

    editCategory({
      id: id,
      name,
      description,
    })
      .then((data) => {
        if (data.meta.status === false) {
          this.setState({
            isLoading: false,
            confirmIsOpen: true,
            type: "error",
            textError: data.meta.message,
          });
        } else {
          this.setState({
            isLoading: false,
            confirmIsOpen: true,
            type: "success",
            textSuccess: "Edit data task kategori sukses",
            textError: "",
          });
        }
      })
      .catch((e) =>
        this.setState({
          isLoading: false,
          confirmIsOpen: true,
          type: "error",
          textError: "Edit data task kategori gagal",
        })
      );
  };

  render() {
    const {
      name,
      description,
      isLoading,
      confirmIsOpen,
      type,
      textError,
      textSuccess,
    } = this.state;
    const { history } = this.props;

    return (
      <>
        <ModalConfirm
          confirmIsOpen={confirmIsOpen}
          type={type}
          confirmClose={() => this.setState({ confirmIsOpen: false })}
          confirmSuccess={() =>
            history.push("/system-configuration/task-category")
          }
          textSuccess={textSuccess}
          textError={textError}
        />
        <form onSubmit={this.handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="col-12 mt-4">
                <div className="row">
                  <div className="col-sm">
                    <div className="float-left">
                      <h2>Tambah Category Tugas</h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-7 mb-4 mt-4" style={{ borderRadius: "15px" }}>
                <div className="card noSelect" style={{ borderRadius: "15px" }}>
                  <div className="card-body pb-0">
                    <h5>Task Category Information</h5>

                    <div className="form-group mt-4">
                      <label htmlFor="exampleInputEmail1">
                        Task Category Name
                      </label>
                      <input
                        onChange={this.handleChange}
                        value={name}
                        name="name"
                        type="text"
                        className="form-control form-control-line"
                        placeholder="Enter name"
                        maxLength={50}
                        required
                      />
                    </div>
                    <div className="form-group mt-4 mb-4">
                      <label htmlFor="exampleInputEmail1">Description</label>
                      <textarea
                        value={description}
                        onChange={this.handleChange}
                        name="description"
                        className="form-control"
                        placeholder="Enter description"
                        style={{ height: "150px" }}
                        maxLength={1000}
                        required
                      />
                      <small
                        id="emailHelp"
                        className="form-text text-muted"
                        style={{ float: "right" }}
                      >
                        {description.length}/1000 Kata
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-7 text-right mb-5">
                <div className="border-top pt-3">
                  <div className="form-group d-flex justify-content-between">
                    <Link
                      to="/system-configuration/task-category"
                      className="btn btn-default"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={`btn btn-danger ${
                        isLoading ? "disabled" : ""
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingDots /> : "save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default connect(({ task_category, auth }) => ({ task_category, auth }), {
  getDetailCategory,
  editCategory,
})(Edit);
