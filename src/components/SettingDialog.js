import React, { Component } from 'react';
import Dialog, { DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import SettingTabs from './SettingTabs'
import CSSModules from 'react-css-modules'
import styles from './SettingDialog.css'

class SettingDialog extends Component {
  state = {};

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.open !== nextProps.open;
  }

  handleClose = () => {
    this.props.onClose(this.props.value);
  };

  render() {
    const { classes, handleChangeTab,  ...other } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        {...other}
      >
        <SettingTabs
          handleChangeTab={handleChangeTab}
          handleClose={this.handleClose}
        >
        </SettingTabs>
        <DialogActions styleName="dialogActions">
          <Button onClick={this.handleClose} color="primary">
            Reload
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CSSModules(SettingDialog, styles);