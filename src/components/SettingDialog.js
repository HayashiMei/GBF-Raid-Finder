import React, { Component } from 'react';
import Dialog, { DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import SwipeableViews from 'react-swipeable-views';
import Tabs, { Tab } from 'material-ui/Tabs';
import SettingContainer from './SettingContainer';
import BossContainer from './BossContainer';
import fetch from 'isomorphic-fetch';
import PubSub from 'pubsub-js';
import { getIndexByProp } from './../utils/Utils';
import CSSModules from 'react-css-modules'
import styles from './SettingDialog.css'

class SettingDialog extends Component {
  state = {
    tabIndex: 0,
    boss: [],
    follow: [],
  };

  constructor(props) {
    super(props)
    let tabIndex = +localStorage.getItem('tabIndex'),
        bossCache = localStorage.getItem('boss'),
        followCache = localStorage.getItem('follow');

    if (tabIndex === 0 || tabIndex === 1) {
      this.state.tabIndex = tabIndex;
    } else {
      this.state.tabIndex = 0;
    }

    if (bossCache) {
      this.state.boss = JSON.parse(bossCache);
    }

    if (followCache) {
      this.state.follow = JSON.parse(followCache);
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.open !== nextProps.open
      || this.state.tabIndex !== nextState.tabIndex
      || this.state.boss !== nextState.boss
      || this.state.follow !== nextState.follow;
  }

  handleClose = () => {
    this.props.onClose(this.props.value);
  };

  handleReload = () => {
    fetch('./boss.json').then(
      res => res.json()
    ).then(data => {
      localStorage.setItem('boss', JSON.stringify(data));
      this.setState({ boss: data });
    }).catch(e => console.log("Oops, reload failed...", e));
  };

  handleToggle = bossName => () => {
    const newFollow = [...this.state.follow];
    let index = getIndexByProp(newFollow, 'name', bossName);

    if (index === -1) {
      newFollow.push({name: bossName, isSubscribed: false});
    } else {
      newFollow.splice(index, 1);
    }

    localStorage.setItem('follow', JSON.stringify(newFollow));
    this.setState({ follow: newFollow }, () => {
      PubSub.publish('UpdateFollow', this.state.follow);
    });
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
            <BossContainer
              boss={this.state.boss}
              follow={this.state.follow}
              handleToggle={this.handleToggle}>
            </BossContainer>
            <SettingContainer></SettingContainer>
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