import React, { Component } from 'react';
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Switch from 'material-ui/Switch';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import PubSub from 'pubsub-js';

import CSSModules from 'react-css-modules'
import styles from './SettingContainer.css'

class SettingContainer extends Component {
  state = {
    timeFormat: 'relative',
    bossImageQuality: 'off',
    showUserImages: false,
    nightMode: false,
  };

  componentWillMount = () => {
    const settings = localStorage.getItem('settings');
    if (settings) this.setState(JSON.parse(settings));
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state !== nextState;
  }

  handleShowUserImages = () => {
    this.setState({showUserImages: !this.state.showUserImages}, this.updateLocalStorage)
  };

  handleNightMode = () => {
    this.setState({nightMode: !this.state.nightMode}, this.updateTheme)
  };

  changeTimeFormat = event => {
    this.setState({timeFormat: event.target.value}, this.updateLocalStorage)
  };

  changeBossImageQuality = event => {
    this.setState({bossImageQuality: event.target.value}, this.updateLocalStorage)
  };

  updateLocalStorage = () => {
    localStorage.setItem('settings', JSON.stringify(this.state));
    PubSub.publish('UpdateSettings', this.state);
  };

  updateTheme = () => {
    localStorage.setItem('settings', JSON.stringify(this.state));
    PubSub.publish('UpdateTheme', this.state);
  };

  render() {
    return (
      <div styleName="root">
        <List>
          <ListItem>
            <ListItemText primary="Time format" />
            <ListItemSecondaryAction styleName="selection">
              <FormControl component="fieldset" required styleName="fieldSet">
                <RadioGroup row={true} aria-label="timeFormat" name="timeFormat"
                  value={this.state.timeFormat} onChange={this.changeTimeFormat}>
                  <FormControlLabel value="relative" control={<Radio />} label="Relative" styleName="label" />
                  <FormControlLabel value="12H" control={<Radio />} label="12H" styleName="label" />
                  <FormControlLabel value="24H" control={<Radio />} label="24H" />
                </RadioGroup>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Boss image quality" />
            <ListItemSecondaryAction styleName="selection">
              <FormControl component="fieldset" required styleName="fieldSet">
                <RadioGroup row={true} aria-label="bossImageQuality" name="bossImageQuality"
                  value={this.state.bossImageQuality} onChange={this.changeBossImageQuality}>
                  <FormControlLabel value="off" control={<Radio />} label="Off" styleName="label" />
                  <FormControlLabel value="low" control={<Radio />} label="Low" styleName="label" />
                  <FormControlLabel value="height" control={<Radio />} label="Height" />
                </RadioGroup>
              </FormControl>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Show user images" />
            <ListItemSecondaryAction>
              <Switch onChange={this.handleShowUserImages} checked={this.state.showUserImages} />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Night mode" />
            <ListItemSecondaryAction>
              <Switch onChange={this.handleNightMode} checked={this.state.nightMode} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default CSSModules(SettingContainer, styles);