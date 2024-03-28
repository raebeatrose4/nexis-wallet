import { createReducer } from '~/utility/createReducer';
import { ACCOUNT_HANDLERS } from './handlers';
import { AccountCreateCredentials } from '~/view/pages/account/AccountCreateCredentials';
import { AccountCreateInfo } from '~/view/pages/account/AccountCreateInfo';
import { AccountCreateConfirm } from '~/view/pages/account/AccountCreateConfirm';
import { IAccount, INodeRecord } from './types';
import { AccountRestoreCredentials } from '~/view/pages/account/AccountRestoreCredentials';
import { AccountEnterMnemonics } from '~/view/pages/account/AccountEnterMnemonics';

export const ACCOUNT_CREATION_STAGES = {
  CREDENTIALS: 0,
  INFO: 1,
  CONFIRM: 2,
  ACCESS: 3,
};

export const ACCOUNT_CREATION_STAGES_COMPONENTS = {
  [ACCOUNT_CREATION_STAGES.CREDENTIALS]: AccountCreateCredentials,
  [ACCOUNT_CREATION_STAGES.INFO]: AccountCreateInfo,
  [ACCOUNT_CREATION_STAGES.CONFIRM]: AccountCreateConfirm,
};

export const ACCOUNT_RESTORE_STAGES_COMPONENTS = {
  [ACCOUNT_CREATION_STAGES.CREDENTIALS]: AccountRestoreCredentials,
  [ACCOUNT_CREATION_STAGES.INFO]: AccountEnterMnemonics,
  [ACCOUNT_CREATION_STAGES.ACCESS]: AccountCreateConfirm,
};
export interface IAccountState {
  create: {
    stage: typeof ACCOUNT_CREATION_STAGES[keyof typeof ACCOUNT_CREATION_STAGES];
    password: string;
    icon: string;
    mnemonic: string;
    privateKey?: string;
    publicAddress: string;
    errors: Record<string, string>;
  };
  transfer: {
    errors: Record<string, string>;
    fee: string;
    is_processing: boolean;
    is_sent: boolean;
  };
  list: Record<string, IAccount>;
  connection: {
    current_node: number;
    is_node_connected: boolean;
    custom_nodes: INodeRecord[];
    error: string | null;
  };
  ftmToUsd: string;
  marketCap: string;
}

export const ACCOUNT_INITIAL_STATE: IAccountState = {
  create: {
    stage: ACCOUNT_CREATION_STAGES.INFO,
    password: '',
    icon: '',
    publicAddress: '',
    mnemonic: '',
    errors: {},
  },
  transfer: {
    errors: {},
    fee: '',
    is_processing: false,
    is_sent: false,
  },
  connection: {
    current_node: 0,
    custom_nodes: [],
    is_node_connected: false,
    error: null,
  },
  list: {},
  ftmToUsd: '0',
  marketCap: '0',
};

export const account = createReducer(ACCOUNT_INITIAL_STATE, ACCOUNT_HANDLERS);
