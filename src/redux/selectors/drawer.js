import { createSelector } from 'reselect';

export const selectState = state => state.drawer || {};

export const selectDrawerStack = createSelector(
  selectState,
  state => state.stack
);

export const selectIsPlayerVisible = createSelector(
  selectState,
  state => state.playerVisible
);

export const selectLastDrawerRoute = createSelector(
  selectState,
  state => {
    if (state.stack.length) {
      return state.stack[state.stack.length - 1];
    }

    return null;
  }
);

export const selectCurrentRoute = createSelector(
  selectState,
  state => state.currentRoute
);
