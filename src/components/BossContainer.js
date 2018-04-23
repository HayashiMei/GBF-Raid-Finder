import React, { Component } from 'react';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import Scrollbar from 'react-smooth-scrollbar';
import PubSub from 'pubsub-js';
import { getIndexByProp } from './../utils/Utils';

import CSSModules from 'react-css-modules';
import styles from './BossContainer.css';

class BossContainer extends Component {
  state = {
    boss: [],
    follow: [],
  };

  constructor(props) {
    super(props);
    var bossCache = localStorage.getItem('boss'),
        followCache = localStorage.getItem('follow');

    if (bossCache) {
      this.state.boss = JSON.parse(bossCache);
    }

    if (followCache) {
      this.state.follow = JSON.parse(followCache);
    }
  }
  
  componentDidMount = () => {
    this.reloadBoss_token = PubSub.subscribe('ReloadBoss', (topic, boss) => {
      console.info(boss)
    });
  };

  componentWillUnmount = () => {
    PubSub.unsubscribe(this.reloadBoss_token);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return this.state !== nextState;
  }

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

  render() {
    const newList = this.state.boss.map((boss, index) => {
      return (
        <ListItem divider button key={index} onClick={this.handleToggle(boss.name)}>
          <ListItemText primary={boss.name} secondary={boss.en} />
          <ListItemIcon styleName="icon">
            <Icon>{getIndexByProp(this.state.follow, 'name', boss.name) !== -1 ? 'star' : ''}</Icon>
          </ListItemIcon>
        </ListItem>
      );
    });

    return (
      <Scrollbar styleName="root">
        <List styleName="content">
            {newList}
        </List>
      </Scrollbar>
    );
  }
}

export default CSSModules(BossContainer, styles);