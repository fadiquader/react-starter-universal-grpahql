import { createReducer, createAction } from 'redux-act';
import { SET_RUNTIME_VARIABLE } from '../constants';

export const setRuntimeVariable = createAction('setRuntimeVariable');

const reducer = createReducer(
  {
    [setRuntimeVariable]: (state, payload) => ({
      ...state,
      [payload.name]: payload.value,
    }),
  },
  {},
);

export default reducer;
// export default function runtime(state = {}, action) {
//   switch (action.type) {
//     case SET_RUNTIME_VARIABLE:
//       return {
//         ...state,
//         [action.payload.name]: action.payload.value,
//       };
//     default:
//       return state;
//   }
// }
