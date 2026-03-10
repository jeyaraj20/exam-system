import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { logoutUser } from "../../../redux/actions/loginAction";

class LogoutButton extends React.Component {
  render() {
    return (
      <Button type="primary" onClick={this.props.logoutUser}>
        Logout
      </Button>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logoutUser })(LogoutButton);
