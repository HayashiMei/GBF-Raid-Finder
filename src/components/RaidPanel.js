import React, { Component } from 'react';
import RaidColumn from './RaidColumn';
import { bosses } from './../utils/boss';
import PubSub from 'pubsub-js';
import { copy, getIndexByProp } from './../utils/Utils';
import CSSModules from 'react-css-modules';
import styles from './RaidPanel.css';

class RaidPanel extends Component {
  state = {};

  constructor(props) {
    super(props);
    const newState = {
      follow: [],
      raidIDs: {},
      timeFormat: 'relative',
      showUserImages: false,
    };

    const follow = localStorage.getItem('follow'), settingsStr = localStorage.getItem('settings');
    if (follow) {
      JSON.parse(follow).map((value, index) => {
        newState.follow.push(value);
        newState.raidIDs[value.name] = [];
        return true;
      })

      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        newState.timeFormat = settings.timeFormat;
        newState.showUserImages = settings.showUserImages;
      }
    }

    this.state = newState;
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state !== nextState;
  };

  componentDidMount = () => {
    this.updateFollow_token = PubSub.subscribe('UpdateFollow', (topic, follow) => {
      const { raidIDs } = this.state;
      follow.map((value, index) => {
        if (!raidIDs[value.name]) raidIDs[value.name] = [];
        return true;
      })
      this.setState({ follow: follow });
    });

    this.newTwitter_token = PubSub.subscribe('NewTwitter', (topic, tw) => {
      const { raidIDs, follow } = this.state, { text, created_at, user } = tw;
      const name = text.split('\n')[2];
      if (raidIDs[name]) {
        let id = text.match(/[A-Z0-9]{8}/g)[0],
          endPos = text.indexOf(id) - 1,
          twitterText = text.substring(0, endPos)
        const raidId = {
          id: id,
          time: created_at,
          userName: user.name,
          profile_image_url: user.profile_image_url_https,
          twitterText: twitterText,
        };
        raidIDs[name].unshift(raidId);
        if (raidIDs[name].length > 40) {
          raidIDs[name].pop();
        }
        this.setState({ raidIDs: raidIDs });

        for (let i = 0; i < follow.length; i++ ) {
          if (follow[i].name === name && follow[i].isSubscribed) {
            let notification = new Notification(name, {
              body: '@' + user.name + ': ' + id,
            })
            notification.onclick = event => {
              event.preventDefault();
              copy(id);
              notification.close();
            };
            break;
          }
        }
      }
    });

    this.updateSettings_token = PubSub.subscribe('UpdateSettings', (topic, settings) => {
      const { timeFormat, showUserImages } = settings;
      this.setState({ timeFormat: timeFormat, showUserImages: showUserImages });
    });
  };

  componentWillUnmount = () => {
    PubSub.unsubscribe(this.updateFollow_token);
    PubSub.unsubscribe(this.newTwitter_token);
  };

  moveLeft = bossName => {
    const newFollow = [...this.state.follow];
    let index = getIndexByProp(newFollow, 'name', bossName);

    if (index > 0) {
      [newFollow[index - 1], newFollow[index]] = [newFollow[index], newFollow[index - 1]];
      localStorage.setItem('follow', JSON.stringify(newFollow));
      this.setState({ follow: newFollow });
    }
  };

  moveRight = bossName => {
    const newFollow = [...this.state.follow];
    let index = getIndexByProp(newFollow, 'name', bossName);

    if (index < newFollow.length - 1) {
      [newFollow[index], newFollow[index + 1]] = [newFollow[index + 1], newFollow[index]];
      localStorage.setItem('follow', JSON.stringify(newFollow));
      this.setState({ follow: newFollow });
    }
  };

  clear = bossName => {
    const { raidIDs } = this.state;
    raidIDs[bossName] = []
    this.setState({ raidIDs: raidIDs });
  };

  unfollow = bossName => {
    const newFollow = [...this.state.follow];
    let index = getIndexByProp(newFollow, 'name', bossName);

    if (index !== -1) {
      newFollow.splice(index, 1);
      localStorage.setItem('follow', JSON.stringify(newFollow));
      this.setState({ follow: newFollow });
    }
  };

  subscribe = (bossName, isSubscribed) => {
    const newFollow = [...this.state.follow];
    for (let i = 0; i < newFollow.length; i++ ) {
      if (newFollow[i].name === bossName) {
        newFollow[i].isSubscribed = isSubscribed;
        break;
      }
    }

    localStorage.setItem('follow', JSON.stringify(newFollow));
    this.setState({ follow: newFollow });
  };

  render() {
    const items = this.state.follow.map((value, index) => {
        var en = ''
        for (var i in bosses) {
          if (bosses[i].name === value.name) {
            en = bosses[i].en;
          }
        }
        return (
          <RaidColumn
            key={index}
            bossName={value.name}
            bossEnName={en}
            raidIDs={this.state.raidIDs[value.name]}
            timeFormat={this.state.timeFormat}
            showUserImages={this.state.showUserImages}
            moveLeft={this.moveLeft}
            moveRight={this.moveRight}
            clear={this.clear}
            unfollow={this.unfollow}
            subscribe={this.subscribe}
            isSubscribed={value.isSubscribed}
          ></RaidColumn>
        );
      });

    return (
      <div styleName="root">
        {items}
      </div>
    );
  }
}

export default CSSModules(RaidPanel, styles);