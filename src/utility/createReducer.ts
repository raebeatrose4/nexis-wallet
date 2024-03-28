import { Action } from "redux";

type Handlers<State, Types extends string, Actions extends Action<Types>> = {
  readonly [Type in Types]: (state: State, action: Actions) => State;
};

export const createReducer = (initialState, handlers) => (
  state = initialState,
  action
) =>
  Object.prototype.hasOwnProperty.call(handlers, action.type)
    ? handlers[action.type](state, action)
    : state;
