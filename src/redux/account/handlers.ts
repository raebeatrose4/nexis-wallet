import { assocPath } from 'ramda';
import {
  accountSetCreate,
  accountSetCreateStage,
  accountSetList,
  accountAddAccount,
  accountSetAccount,
  accountSetTransfer,
  accountSetTransferErrors,
  accountSet,
  accountSetConnection,
  accountAddProvider,
  accountSetFTMtoUSD,
} from '~/redux/account/actions';
import { IAccountState, ACCOUNT_INITIAL_STATE } from '.';
import { ACCOUNT_ACTIONS } from './constants';

const setData = (
  state: IAccountState,
  { account }: ReturnType<typeof accountSet>
) => ({ ...state, ...account });

const setCreate = (
  state: IAccountState,
  { create }: ReturnType<typeof accountSetCreate>
) => assocPath(['create'], { ...state.create, ...create }, state);

const createClear = (state: IAccountState) =>
  assocPath(['create'], ACCOUNT_INITIAL_STATE.create, state);

const setCreateStage = (
  state: IAccountState,
  { stage }: ReturnType<typeof accountSetCreateStage>
) => assocPath(['create', 'stage'], stage, state);

const setList = (
  state: IAccountState,
  { list }: ReturnType<typeof accountSetList>
) => assocPath(['list'], list, state);

const addAccount = (
  state: IAccountState,
  { account }: ReturnType<typeof accountAddAccount>
) =>
  assocPath(
    ['list'],
    { ...state.list, [account.publicAddress]: account },
    state
  );

const setAccount = (
  state: IAccountState,
  { id, data }: ReturnType<typeof accountSetAccount>
) =>
  assocPath(
    ['list'],
    { ...state.list, [id]: { ...(state.list[id] || {}), ...data } },
    state
  );

const transferClear = (state: IAccountState) =>
  assocPath(['transfer'], ACCOUNT_INITIAL_STATE.transfer, state);

const setTransfer = (
  state: IAccountState,
  { transfer }: ReturnType<typeof accountSetTransfer>
) => assocPath(['transfer'], { ...state.transfer, ...transfer }, state);

const setTransferErrors = (
  state: IAccountState,
  { errors }: ReturnType<typeof accountSetTransferErrors>
) => assocPath(['transfer'], { ...state.transfer, errors }, state);

const setConnection = (
  state: IAccountState,
  { connection }: ReturnType<typeof accountSetConnection>
) => assocPath(['connection'], { ...state.connection, ...connection }, state);

const addProvider = (
  state: IAccountState,
  { address }: ReturnType<typeof accountAddProvider>
) =>
  assocPath(
    ['connection', 'custom_nodes'],
    [...state.connection.custom_nodes, {  address }],
    state
  );

  const setFtmToUsd = (
    state: IAccountState,
    { price }: ReturnType<typeof accountSetFTMtoUSD>
  ) => assocPath(['ftmToUsd'], price, state);

export const ACCOUNT_HANDLERS = {
  [ACCOUNT_ACTIONS.SET_CREATE]: setCreate,
  [ACCOUNT_ACTIONS.SET_CREATE_STAGE]: setCreateStage,
  [ACCOUNT_ACTIONS.SET_LIST]: setList,
  [ACCOUNT_ACTIONS.CREATE_CLEAR]: createClear,
  [ACCOUNT_ACTIONS.ADD_ACCOUNT]: addAccount,
  [ACCOUNT_ACTIONS.SET_ACCOUNT]: setAccount,
  [ACCOUNT_ACTIONS.TRANSFER_CLEAR]: transferClear,
  [ACCOUNT_ACTIONS.SET_TRANSFER_ERRORS]: setTransferErrors,
  [ACCOUNT_ACTIONS.SET_TRANSFER]: setTransfer,
  [ACCOUNT_ACTIONS.SET]: setData,
  [ACCOUNT_ACTIONS.SET_CONNECTION]: setConnection,
  [ACCOUNT_ACTIONS.ADD_PROVIDER]: addProvider,
  [ACCOUNT_ACTIONS.SET_FTM_USD]: setFtmToUsd,
};
