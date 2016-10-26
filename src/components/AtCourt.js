/**
 * 在球场
 * zaiqiuchang.com
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, InteractionManager,
  ScrollView, RefreshControl} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

import {COLOR, SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';
import * as components from './';
import * as helpers from './helpers';
import * as utils from '../utils';

export default class AtCourt extends Component {
  componentWillMount() {
    this.refreshing = false;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let {sceneKey, network} = this.props;
      if (network.isConnected && helpers.isNeedRefresh({sceneKey, network})) {
        this._refresh();
      }
    });
  }

  _refresh(cbFinish) {
    let {sceneKey, setSceneLastRefreshTime} = this.props;
    let {nearbyUsers} = this.props;

    setSceneLastRefreshTime({sceneKey});

    let finished = 0;
    nearbyUsers({cbFinish: () => finished++});
    utils.waitingFor({
      condition: () => finished == 1,
      cbFinish,
    });
  }

  render() {
    let {sceneKey, loading, processing, error, object, disableLoading, 
      enableLoading} = this.props;
    let {account, user} = this.props;
    let nearbyUsers = user.nearby
      .map((v) => helpers.userFromCache(object, v))
      .filter((v) => v !== null && v.id != account.userId)
      .slice(0, 10);

    return (
      <components.Layout 
        sceneKey={sceneKey} 
        loading={loading} 
        processing={processing} 
        error={error}
        hideTabBar={false}
        currentTab={1}
        renderTitle={() => components.NavBarTitle({title: '在球场'})}
        renderBackButton={() => null}
        refresh={() => this._refresh()}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.refreshing}
              onRefresh={() => {
                disableLoading();
                this.refreshing = true;
                this._refresh(() => {
                  this.refreshing = false;
                  enableLoading();
                });
              }}
            />
          }
          contentContainerStyle={{alignItems: 'center', padding: 10}}
        >
          <components.Icon
            name='plus-square-o' 
            onPress={() => Actions.CreatePost()} 
            style={styles.postIcon} 
            containerStyle={{marginVertical: Math.floor((SCREEN_HEIGHT / 2 - 200) / 2)}}
          />
          <View style={{alignSelf: 'stretch', alignItems: 'center', borderBottomWidth: 1, borderColor: COLOR.lineNormal}}>
            <components.TextNotice style={{paddingHorizontal: 0}}>正在球场上挥洒汗水？拍张照片让附近的球友发现你。</components.TextNotice>
          </View>
          <components.TextNotice style={{paddingHorizontal: 0}}>
            {nearbyUsers.length > 0 ? 'Ta们也在球场，赶紧去认识一下。' : '附近暂无球友。'}
          </components.TextNotice>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
            {nearbyUsers.map((user) => 
              <components.Image 
                key={user.id} 
                source={helpers.userAvatarSource(user)} 
                style={styles.userAvatar}
                containerStyle={{margin: 5}}
              />
            )}
          </View>
        </ScrollView>
      </components.Layout>
    );
  }
}

let avatarSize = Math.floor((SCREEN_WIDTH - 70) / 5);

const styles = StyleSheet.create({
  postIcon: {
    fontSize: 100,
    color: COLOR.theme,
  },
  userAvatar: {
    width: avatarSize,
    height: avatarSize,
  },
});
