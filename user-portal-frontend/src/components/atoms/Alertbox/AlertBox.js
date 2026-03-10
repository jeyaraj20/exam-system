import React from "react";
import { Alert } from "antd";
import { connect } from "react-redux";
import { clearAlert } from "../../../redux/actions/alertAction";

class AlertBox extends React.Component {
  render() {
    const { alertDetails, clearAlert } = this.props;

    if (!alertDetails.isAlert) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        <Alert
          message={alertDetails.title}
          description={alertDetails.message}
          type={alertDetails.type} // success | info | warning | error
          showIcon
          closable
          onClose={clearAlert}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  alertDetails: state.alertDetails,
});

export default connect(mapStateToProps, { clearAlert })(AlertBox);
