import React, { Component } from 'react';
import Dialog, { DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import SwipeableViews from 'react-swipeable-views';
import Tabs, { Tab } from 'material-ui/Tabs';
import SettingContainer from './SettingContainer';
import BossContainer from './BossContainer';
import PubSub from 'pubsub-js';
import CSSModules from 'react-css-modules'
import styles from './SettingDialog.css'

class SettingDialog extends Component {
  state = {
    tabIndex: 0,
  };

  constructor(props) {
    super(props)
    var tabIndex = +localStorage.getItem('tabIndex');
    if (tabIndex === 0 || tabIndex === 1) {
      this.state.tabIndex = tabIndex;
    } else {
      this.state.tabIndex = 0;
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.open !== nextProps.open
      || this.state.tabIndex !== nextState.tabIndex;
  }

  handleClose = () => {
    this.props.onClose(this.props.value);
  };

  handleReload = () => {
    fetch('./boss.json').then(
      res => res.json()
    ).then(data => {
      localStorage.setItem('boss', JSON.stringify(data));
      PubSub.publish('ReloadBoss', data);
    }).catch(e => console.log("Oops, reload failed...", e))
  };

  handleShowReload = () => {
    if (this.state.tabIndex === 0) {
      return (
        <Button onClick={this.handleReload} color="primary">
          Reload
        </Button>
      );
    }
  };

  handleChangeTab = (event, value) => {
    localStorage.setItem('tabIndex', value);
    this.setState({ tabIndex: value });
    this.props.handleChangeTab(value);
  };

  render() {
    const { open } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
      >
        <div styleName="root">
          <AppBar position="static" color="primary" styleName="appBar">
            <Tabs
              value={this.state.tabIndex}
              onChange={this.handleChangeTab}
              indicatorColor="secondary"
              textColor="inherit"
            >
              <Tab label="FOLLOW" />
              <Tab label="SETTING" />
            </Tabs>
            <Button variant="fab" styleName="btnClose" color="primary" onClick={this.handleClose}>
              <Icon>clear</Icon>
            </Button>
          </AppBar>
          <SwipeableViews
            axis="x"
            index={this.state.tabIndex}
            onChangeIndex={this.handleChangeTab}
          >
            <BossContainer dir="x"></BossContainer>
            <SettingContainer dir="x"></SettingContainer>
          </SwipeableViews>
        </div>

        <DialogActions styleName="dialogActions">
          {this.handleShowReload()}
          <Button onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default CSSModules(SettingDialog, styles);