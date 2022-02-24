/* eslint no-console: 0 */
import Auth from '../api/auth';
import Cookies from 'js-cookie';
import { BUS_EVENTS } from '../../shared/constants/busEvents';

const parseErrorCode = error => {
  if (error.response.status == 402) {
    Cookies.set('subscription', error.response);
    bus.$emit(BUS_EVENTS.SHOW_PLAN_MODAL);
  }
  return Promise.reject(error);
};
export default axios => {
  const { apiHost = '' } = window.chatwootConfig || {};
  const wootApi = axios.create({ baseURL: `${apiHost}/` });
  // Add Auth Headers to requests if logged in
  if (Auth.isLoggedIn()) {
    const {
      'access-token': accessToken,
      'token-type': tokenType,
      client,
      expiry,
      uid,
    } = Auth.getAuthData();
    Object.assign(wootApi.defaults.headers.common, {
      'access-token': accessToken,
      'token-type': tokenType,
      client,
      expiry,
      uid,
    });
  }
  // Response parsing interceptor
  wootApi.interceptors.response.use(
    response => response,
    error => parseErrorCode(error)
  );
  return wootApi;
};
