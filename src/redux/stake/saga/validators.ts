// @flow
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  STAKE_ACTIONS,
  getValidatorsListSuccess,
  getValidatorsListFailure,
} from '../actions';
import { getDataWithQueryString } from '../../../api';

const validatorsListApi = async () => {
  return getDataWithQueryString('validatorList', `?verbosity=2`);
};

export function* validatorsListSaga() {
  try {
    const response = yield call(validatorsListApi);
    yield put(getValidatorsListSuccess(response.data.data.stakers));
  } catch (exception) {
    yield put(getValidatorsListFailure());
  }
}

export default function* validators() {
  yield takeLatest(STAKE_ACTIONS.VALIDATORS_LIST, validatorsListSaga);
}
