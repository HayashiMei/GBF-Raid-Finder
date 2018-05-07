import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { MuiThemeProvider } from 'material-ui/styles';
import Websocket from 'react-websocket';
import PubSub from 'pubsub-js';
import { IntlProvider } from 'react-intl';
import fetch from 'isomorphic-fetch';
import CSSModules from 'react-css-modules'
import RaidPanel from './RaidPanel'
import SettingDialog from './SettingDialog'
import { dark, light } from './Theme'
import { getIndexByProp } from '../utils/Utils';
import styles from './App.css'

class App extends Component {
  constructor(props) {
    super(props);

    const settingsStr = localStorage.getItem('settings'),
      tabIndex = localStorage.getItem('tabIndex'),
      newState = {
        open: false,
        icon: 'add_icon',
        theme: 'light',
      };
    if (settingsStr) {
      const settings = JSON.parse(settingsStr);
      newState.theme = settings.nightMode ? 'dark' : 'light';
    }
    newState.icon = +tabIndex === 1 ? 'settings' : 'add_icon';
    this.state = newState;
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state !== nextState;
  };

  componentDidMount = () => {
    this.updateTheme_token = PubSub.subscribe('UpdateTheme', (topic, settings) => {
      const { nightMode } = settings;
      this.setState({ theme: nightMode ? 'dark' : 'light' });
    });

    this.updateBosses()
  };

  componentWillUnmount = () => {
    PubSub.unsubscribe(this.updateTheme_token);
  };

  updateBosses = () => {
    fetch('./boss.json').then(
      res => res.json()
    ).then(data => {
      localStorage.setItem('boss', JSON.stringify(data));
      const followCache = localStorage.getItem('follow'),
        follow = JSON.stringify(followCache),
        newFollow = [];
      for (let i = 0; i < follow.length; i++) {
        if (getIndexByProp(data, 'name', follow[i].name) > -1) {
          newFollow.push(follow[i]);
        }
      }
    }).catch(e => console.log("Oops, updateBosses failed...", e))
  };

  handleOpenDialog = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleData(data) {
    let twitter = JSON.parse(data);
    if (twitter) {
      PubSub.publish('NewTwitter', twitter);
    }
  }

  handleChangeTab = value => {
    switch (value) {
      case 0:
        this.setState({icon: 'add_icon'})
        break;
      case 1:
        this.setState({icon: 'settings'})
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={this.state.theme === 'dark' ? dark : light}>
      <IntlProvider locale="en">
        <div className={this.state.theme === 'dark' ? "app app-theme--dark" : "app"}>
            <RaidPanel></RaidPanel>
            <Button variant="fab" color="primary" styleName="btnSettings" onClick={this.handleOpenDialog}>
              <Icon>{this.state.icon}</Icon>
            </Button>
            <SettingDialog
              open={this.state.open}
              onClose={this.handleClose}
              handleChangeTab={this.handleChangeTab}
            />
            <Websocket
              url={'ws://' + document.location.hostname + ':8181/tweet/'}
              onMessage={this.handleData.bind(this)}
            />
        </div>
      </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default CSSModules(App, styles);