/* eslint-disable import/prefer-default-export */

import { IntlProvider } from 'react-intl';

import {
  setLocalStart,
  setLocalSuccess,
  setLocalError,
} from '../reducers/intl';

import queryIntl from './intl.graphql';

function getIntlFromState(state) {
  const intl = (state && state.intl) || {};
  const { initialNow, locale, messages } = intl;
  const localeMessages = (messages && messages[locale]) || {};
  const provider = new IntlProvider({
    initialNow,
    locale,
    messages: localeMessages,
    defaultLocale: 'en-US',
  });
  return provider.getChildContext().intl;
}

export function getIntl() {
  return (dispatch, getState) => getIntlFromState(getState());
}

export function setLocale({ locale }) {
  return async (dispatch, getState, { client, history }) => {
    dispatch({
      type: setLocalStart,
      payload: {
        locale,
      },
    });

    try {
      // WARNING !!
      // do not use client.networkInterface except you want skip Apollo store
      // use client.query if you want benefit from Apollo caching mechanisms
      const { data } = await client.networkInterface.query({
        query: queryIntl,
        variables: { locale },
      });
      const messages = data.intl.reduce((msgs, msg) => {
        msgs[msg.id] = msg.message; // eslint-disable-line no-param-reassign
        return msgs;
      }, {});
      dispatch({
        type: setLocalSuccess,
        payload: {
          locale,
          messages,
        },
      });

      // remember locale for every new request
      if (process.env.BROWSER) {
        const maxAge = 3650 * 24 * 3600; // 10 years in seconds
        document.cookie = `lang=${locale};path=/;max-age=${maxAge}`;
        history.push(`?lang=${locale}`);
      }

      // return bound intl instance at the end
      return getIntlFromState(getState());
    } catch (error) {
      dispatch({
        type: setLocalError,
        payload: {
          locale,
          error,
        },
      });
      return null;
    }
  };
}
