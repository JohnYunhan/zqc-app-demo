/**
 * 在球场
 * zaiqiuchang.com
 */

import {Actions} from 'react-native-router-flux';

import logger from '../logger';
import * as apis from '../apis';
import * as actions from './';

export function sendVerifyCode({by, mobile, email, cbOk}) {
  return (dispatch, getState) => {
    apis.sendVerifyCode({by, mobile, email})
      .then((response) => {
        if (cbOk) {
          cbOk();
        }
      })
      .catch(error => dispatch(actions.handleApiError(error)));
  }
}