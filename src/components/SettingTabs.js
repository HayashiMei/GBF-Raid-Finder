import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Icon from 'material-ui/Icon';
import SwipeableViews from 'react-swipeable-views';
import Tabs, { Tab } from 'material-ui/Tabs';
import SettingContainer from './SettingContainer';
import BossContainer from './BossContainer';

import CSSModules from 'react-css-modules'
import styles from './SettingTabs.css'

class SettingTabs extends Component {
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
    return this.state.tabIndex !== nextState.tabIndex;
  }

  handleChange = (event, value) => {
    localStorage.setItem('tabIndex', value);
    this.setState({ tabIndex: value });
    this.props.handleChangeTab(value);
  };

  handleChangeIndex = value => {
    localStorage.setItem('tabIndex', value);
    this.setState({ tabIndex: value });
    this.props.handleChangeTab(value);
  };

  render() {
    const { handleClose } = this.props;
    return (
      <div styleName="root">
        <AppBar position="static" color="primary" styleName="appBar">
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab label="FOLLOW" />
            <Tab label="SETTING" />
          </Tabs>
          <Button variant="fab" styleName="btnClose" color="primary" onClick={handleClose}>
            <Icon>clear</Icon>
          </Button>
        </AppBar>
        <SwipeableViews
          axis="x"
          index={this.state.tabIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          <BossContainer dir="x"></BossContainer>
          <SettingContainer dir="x"></SettingContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default CSSModules(SettingTabs, styles);