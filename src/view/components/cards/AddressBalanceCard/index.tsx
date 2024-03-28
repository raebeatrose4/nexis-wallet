import React, { FC, useEffect } from 'react';
import { Card } from 'reactstrap';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import * as ACCOUNT_ACTIONS from '~/redux/account/actions';
import { selectAccount } from '~/redux/account/selectors';
import { push as historyPush } from 'connected-react-router';
import { convertFTMValue } from '~/view/general/utilities';
import { useTranslation } from "react-i18next";

const mapStateToProps = state => ({
  accountData: selectAccount(state),
});

const mapDispatchToProps = {
  accountCreateSetCredentials: ACCOUNT_ACTIONS.accountCreateSetCredentials,
  accountGetBalance: ACCOUNT_ACTIONS.accountGetBalance,

  push: historyPush,
};

type IProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  RouteComponentProps & {
    address: string;
    addNew: boolean;
    balance: string;
    accountGetBalance: (address: string) => {};
  };

const AddressCardCreateWallet: FC<IProps> = ({
  push,
  address = '',
  accountData,
  addNew = false,
  accountGetBalance,
}) => {
  const balance =
    accountData.list && address && accountData.list[address].balance;
    const { t } = useTranslation();

  useEffect(() => {
    accountGetBalance(address);
  }, [accountGetBalance, address]);

  return (
    <>
      <div className={styles.addCardWrapper}>
        <Card className={classnames({ [styles.addCard]: addNew, pointer: !addNew }, 'h-100')}>
          {addNew ? (
            <div className="text-center">
              <>
                <div className={styles.addCardBtn}>
                  <button
                    type="button"
                    className="btn btn-dark-periwinkle mb-4"
                    onClick={() => push('/account/create')}
                  >
                    {t("createWallet")}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-topaz px-5"
                    onClick={() => push('/account/restore')}
                  >
                    {t('restoreWallet')}
                  </button>
                </div>
              </>
            </div>
          ) : (
            <>
              <p className="card-label mb-0">{t("address")}</p>
              <h2 className={classnames(styles.value, 'mb-4')}>{address}</h2>
              <p className="card-label mb-0">{t("balance")}</p>
              <h2 className={styles.value}>
                {convertFTMValue(parseFloat(balance || '0'))}
                {' '}
NZT
              </h2>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

const AccountCreateAddNew = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddressCardCreateWallet));

export default AccountCreateAddNew;
