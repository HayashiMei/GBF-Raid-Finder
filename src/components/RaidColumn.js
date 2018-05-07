import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import List, { ListItemIcon } from 'material-ui/List';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Scrollbar from 'react-smooth-scrollbar';
import { Manager, Target, Popper } from 'react-popper';

import classNames from 'classnames';
import RaidItem from './RaidItem'

import CSSModules from 'react-css-modules'
import styles from './RaidColumn.css'

class RaidColumn extends Component {
  constructor(props) {
    super(props);

    const { bossName, bossEnName, raidIDs, timeFormat, showUserImages, isSubscribed } = this.props;
    this.state = {
      open: false,
      bossName: bossName,
      bossEnName: bossEnName,
      raidIDs: raidIDs.slice(),
      timeFormat: timeFormat,
      showUserImages: showUserImages,
      isSubscribed: isSubscribed,
    };
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      bossName: nextProps.bossName,
      bossEnName: nextProps.bossEnName,
      raidIDs: nextProps.raidIDs.slice(),
      timeFormat: nextProps.timeFormat,
      showUserImages: nextProps.showUserImages,
      isSubscribed: nextProps.isSubscribed,
    });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const change = this.state.bossName !== nextState.bossName
      || this.state.raidIDs !== nextState.raidIDs
      || this.state.timeFormat !== nextState.timeFormat
      || this.state.showUserImages !== nextState.showUserImages
      || this.state.open !== nextState.open
      || this.state.isSubscribed !== nextState.isSubscribed
    return change;
  };

  toggleMenu = event => {
    this.setState({ open: !this.state.open });
  };

  handleAwayClick = event => {
    if (this.target.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  closeMenu = event => {
    this.setState({ open: false });
  };

  handleMoveRight = bossName => {
    this.props.moveRight(bossName);
    this.closeMenu();
  };

  handleMoveLeft = bossName => {
    this.props.moveLeft(bossName);
    this.closeMenu();
  };

  handleUnfollow = bossName => {
    this.props.unfollow(bossName);
    this.closeMenu();
  };

  handleClear = bossName => {
    this.props.clear(bossName);
    this.closeMenu();
  };

  handleSubscribe = bossName => {
    Notification.requestPermission().then(permission => {
      if (Notification.permission === 'granted') {
        this.props.subscribe(bossName, true);
      }
    });
    this.closeMenu();
  };

  handleUnsubscribe = bossName => {
    this.props.subscribe(bossName, false);
    this.closeMenu();
  };

  handleSubscribedMenu = bossName => {
    if (this.state.isSubscribed) {
      return (
        <MenuItem onClick={this.handleUnsubscribe.bind(this, bossName)}>
          <ListItemIcon styleName="menuIcon">
            <Icon>notifications_off</Icon>
          </ListItemIcon>
          <h3 styleName="menuText">Unsubscribe</h3>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem onClick={this.handleSubscribe.bind(this, bossName)}>
          <ListItemIcon styleName="menuIcon">
            <Icon>notifications_active</Icon>
          </ListItemIcon>
          <h3 styleName="menuText">Subscribe</h3>
        </MenuItem>
      );
    }
  };

  showNotificationBanner = () => {
    if (this.state.isSubscribed) {
      return (
        <div styleName="notificationBanner">
          <div styleName="notificationBannerItem">
            <Icon styleName="notificationBannerIcon">notifications_active</Icon>
            Notifications on
          </div>
        </div>
      );
    }
  };

  render() {
    console.info('rende')
    const { open, bossName, bossEnName, raidIDs, timeFormat, showUserImages } = this.state,
      raidIDList = raidIDs.map((value, index) => {
        return (
          <RaidItem
            key={`${value.id}-` + Math.floor(Math.random()*10000) + '-' + Math.floor(Math.random()*10000)}
            raidID={value.id}
            showUserImages={showUserImages}
            userName={value.userName}
            userImages={value.profile_image_url}
            twitterText={value.twitterText}
            timeFormat={timeFormat}
            time={value.time}
          ></RaidItem>
        )
      });

    return (
      <div styleName="root">
        <AppBar position="static" styleName="appBar">
          <div styleName="paper">
            <Typography component="h2" styleName="bossName">
              {bossName}
            </Typography>
            <Typography component="p" styleName="bossEnName">
              {bossEnName}
            </Typography>
          </div>

          <Manager>
            <Target>
              <div ref={node => { this.target = node; }}>
                <Button
                  variant="fab"
                  color="primary"
                  styleName="btnEdit"
                  aria-owns={open ? 'menu-list-grow' : null}
                  aria-haspopup="true"
                  onClick={this.toggleMenu}
                >
                  <Icon>edit</Icon>
                </Button>
              </div>
            </Target>
            <Popper
              placement="bottom-end"
              eventsEnabled={open}
              className={classNames({ [styles.popperClose]: !open })}
            >
              <ClickAwayListener onClickAway={this.handleAwayClick}>
                <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                  <Paper>
                    <MenuList role="menu">
                      <MenuItem onClick={this.handleMoveLeft.bind(this, bossName)}>
                        <ListItemIcon styleName="menuIcon">
                          <Icon>keyboard_arrow_left</Icon>
                        </ListItemIcon>
                        <h3 styleName="menuText">Move Left</h3>
                      </MenuItem>
                      <MenuItem onClick={this.handleMoveRight.bind(this, bossName)}>
                        <ListItemIcon styleName="menuIcon">
                          <Icon>keyboard_arrow_right</Icon>
                        </ListItemIcon>
                        <h3 styleName="menuText">Move Right</h3>
                      </MenuItem>
                      <MenuItem onClick={this.handleClear.bind(this, bossName)}>
                        <ListItemIcon styleName="menuIcon">
                          <Icon>delete_sweep</Icon>
                        </ListItemIcon>
                        <h3 styleName="menuText">Clear</h3>
                      </MenuItem>
                      <MenuItem onClick={this.handleUnfollow.bind(this, bossName)}>
                        <ListItemIcon styleName="menuIcon">
                          <Icon>delete</Icon>
                        </ListItemIcon>
                        <h3 styleName="menuText">Unfollow</h3>
                      </MenuItem>
                      {this.handleSubscribedMenu(bossName)}
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            </Popper>
          </Manager>
        </AppBar>
        {this.showNotificationBanner()}
        <Scrollbar>
          <List styleName="content">
            {raidIDList}
          </List>
        </Scrollbar>
      </div>
    );
  }
}

export default CSSModules(RaidColumn, styles);