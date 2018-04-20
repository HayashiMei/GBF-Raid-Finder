import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import { FormattedRelative } from 'react-intl';
import { copy } from './../utils/Utils'

import CSSModules from 'react-css-modules'
import styles from './RaidItem.css'

class RaidItem extends Component {
  constructor(props) {
    super(props);
    const { raidID, twitterText, timeFormat, time, showUserImages, userImages, userName } = this.props;
    this.state = {
      copied: false,
      raidID: raidID,
      twitterText: twitterText,
      timeFormat: timeFormat,
      time: time,
      showUserImages: showUserImages,
      userImages: userImages,
      userName: userName
    };
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      timeFormat: nextProps.timeFormat,
      showUserImages: nextProps.showUserImages
    });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state !== nextState;
  };

  getTime = () => {
    switch (this.state.timeFormat) {
      case '24H':
        return new Date(this.state.time).toTimeString().match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g)[0];
      case '12H':
        return new Date(this.state.time).toLocaleTimeString();
      default:
        return <FormattedRelative value={new Date(this.state.time).getTime()} />;
    }
  };

  getTwitterText = () => {
    if (!this.state.twitterText) return;
    return (
      <div styleName="twitterText">
        {this.state.twitterText}
      </div>
    );
  }

  getAvatar = () => {
    if (this.state.showUserImages) {
      return <Avatar styleName="avatar" src={this.state.userImages} />
    }
  };

  handleClick = () => {
    copy(this.state.raidID);
    this.setState({ copied: true });
  }

  render() {
    return (
      <ListItem divider button styleName={this.state.copied ? "copied" : "root"} onClick={this.handleClick}>
        <div styleName="user">
          {this.getAvatar()}
          <div styleName="details">
            <div>
              <span styleName="userName">{this.state.userName}</span>
              <span>
                {this.getTime()}
              </span>
            </div>
            {this.getTwitterText()}
          </div>
        </div>
        <div styleName="raidID">{this.state.raidID}</div>
      </ListItem>
    );
  }
}

export default CSSModules(RaidItem, styles);