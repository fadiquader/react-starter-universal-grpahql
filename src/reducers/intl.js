import { createReducer, createAction } from 'redux-act';

export const setLocalStart = createAction('setLocalStart');
export const setLocalSuccess = createAction('setLocalSuccess');
export const setLocalError = createAction('setLocalError');

const intl = createReducer(
  {
    [setLocalStart]: (state, payload) => {
      const locale = state[payload.locale] ? payload.locale : state.locale;
      return {
        ...state,
        locale,
        newLocale: payload.locale,
      };
    },
    [setLocalSuccess]: (state, payload) => ({
      ...state,
      locale: payload.locale,
      newLocale: null,
      messages: {
        ...state.messages,
        [payload.locale]: payload.messages,
      },
    }),
    [setLocalError]: state => ({
      ...state,
      newLocale: null,
    }),
  },
  {
    initialNow: Date.now(),
  },
);

export default intl;
