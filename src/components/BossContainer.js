import React, { Component } from 'react';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import Scrollbar from 'react-smooth-scrollbar';
import { getIndexByProp } from './../utils/Utils';

import CSSModules from 'react-css-modules';
import styles from './BossContainer.css';

class BossContainer extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.boss !== nextProps.boss
      || this.props.follow !== nextProps.follow;
  }

  render() {
    const newList = this.props.boss.map((boss, index) => {
      return (
        <ListItem divider button key={index} onClick={this.props.handleToggle(boss.name)}>
          <ListItemText primary={boss.name} secondary={boss.en} />
          <ListItemIcon styleName="icon">
            <Icon>{getIndexByProp(this.props.follow, 'name', boss.name) !== -1 ? 'star' : ''}</Icon>
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