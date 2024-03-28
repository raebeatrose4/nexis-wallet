/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import { connect } from 'react-redux';
import { Card, Collapse, Table, Button } from 'reactstrap';
import classnames from 'classnames';
import { ArrowUpDownIcon } from 'src/view/components/svgIcons';
import { getValidatorsList as getValidatorsListAction } from '../../../redux/stake/actions';

const SubView = ({ totalStaked, spaceLeft, stackeLeftPer, t }) => {
  const stakedValue = 
  parseFloat(totalStaked).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return (
    <>
      <tr>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.label)}>
            {t("totalStaked")}
:
          </p>
        </td>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.value)}>
            <b>
              {stakedValue}
              {' '}
NZT (
              {stackeLeftPer}
% full)
            </b>
          </p>
        </td>
      </tr>
      <tr>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.label)}>
            {t("spaceLeft")}
:
          </p>
        </td>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.value)}>
            <b>
              {spaceLeft}
              {' '}
NZT
            </b>
          </p>
        </td>
      </tr>
      <tr>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.label)}>
            {t("commission")}
:
          </p>
        </td>
        <td className="px-md-3">
          <p className={classnames(styles.txDetails, styles.value)}>
            <b>15%</b>
          </p>
        </td>
      </tr>
    </>
  );
};

export const formatNumber = num => {
  if (num && num.toString().indexOf('.') !== -1) {
    return num.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
const DataRow = props => {
  // eslint-disable-next-line one-var
  const {
    id,
    index,
    address: name,
    poi,
    validationScore: validatingPower,
    totalStake,
    delegatedMe,
    txRewardWeight,
    deactivatedTime,
    createdTime,
    handleValidatorSelect,
    balance,
    t,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const currDate = Math.round(new Date().getTime() / 1000);

  const upTime =
    100 - (Number(deactivatedTime) / (currDate - Number(createdTime))) * 100;
  // Validator is full if "delegatedMe" = "stake"*15

  const totalStaked = Number(totalStake) / 10 ** 18;

  const nodeFull = 15 * Number(totalStake) - Number(delegatedMe);

  const stakingSpace = 15 * totalStake - delegatedMe;
  const dividend = 10 ** 18;
  const stakingSpaceLeft = formatNumber(
    Number((stakingSpace / dividend).toFixed(2))
  );
  const stakeSpace = Number(stakingSpace) / dividend;
  const totalStakes = Number(totalStake) / dividend;

  const perc = Number((totalStakes / stakeSpace) * 100);
  return (
    <>
      <tr className={styles.contentRow} onClick={() => setIsOpen(!isOpen)}>
        <td className={styles.indexBox}>
          <p className={classnames(styles.txDetails, styles.index)}>{index}</p>
        </td>
        <td>
          <p
            className={classnames(styles.txDetails, 'pr-2')}
            style={{ wordBreak: 'break-all' }}
          >
            <b>{name}</b>
          </p>
        </td>
        <td className="no-mobile">
          <p className={styles.txDetails}>{poi}</p>
        </td>
        <td className="text-right text-md-left">
          <p className={classnames(styles.validatingPowerLable, 'd-md-none')}>
            {t("validatingPower")}
          </p>
          <p className={styles.txDetails}>{validatingPower}</p>
        </td>
        <td className="no-mobile">
          <p className={styles.txDetails}>
            {upTime}
%
          </p>
        </td>
      </tr>
      <tr className={styles.subViewRow}>
        <td colSpan={5} className="p-0">
          <Collapse isOpen={isOpen}>
            <div className={styles.subViewContainer}>
              <table className={styles.subViewTable}>
                <tr>
                  <td className="d-md-none">
                    <p className={classnames(styles.txDetails, styles.label)}>
                      {t('poiFull')}
                    </p>
                  </td>
                  <td className="d-md-none">
                    <p className={classnames(styles.txDetails, styles.value)}>
                      {poi}
                    </p>
                  </td>
                  <td className="d-md-none">
                    <p className={classnames(styles.txDetails, styles.label)}>
                      {t("uptime")}
                    </p>
                  </td>
                  <td className="d-md-none">
                    <p className={classnames(styles.txDetails, styles.value)}>
                      {upTime}
%
                    </p>
                  </td>
                </tr>
                <SubView
                  t={t}
                  key={name + 1}
                  spaceLeft={stakingSpaceLeft}
                  stackeLeftPer={Number(perc).toFixed(2)}
                  totalStaked={totalStaked}
                />
              </table>
              <div className="text-center pt-2">
                {nodeFull <= 0 ? (
                  <p className={styles.txDetails}>
                    <b>
                      {t('nodeFull')}
.
                      <br />
                      
                      {t('diffNode')}
.
                    </b>
                  </p>
                ) : (
                  <Button
                    color="topaz"
                    className={classnames('lg outlined', styles.selectBtn)}
                    onClick={() => handleValidatorSelect({ name, id })}
                  >
                    {t("select")}
                  </Button>
                )}
              </div>
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};

const validator = props => {
  const { getValidatorsList, validators, handleValidatorSelect, t } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getValidatorsList();
  }, [getValidatorsList]);

  if (!validators || (validators && validators.length === 0)) return null;

  return (
    <Card className={styles.card}>
      <h2 className={classnames(styles.title, 'font-weight-extra-bold')}>
        {t("Validators")}
      </h2>
      <p>{t("clickValidator")}</p>
      <div>
        <Table className={styles.table}>
          <thead className={styles.tableHead}>
            <th />
            <th
              className={classnames({
                [styles.up]: false,
                [styles.down]: false,
              })}
            >
              {t("name")}
              <ArrowUpDownIcon />
            </th>
            <th
              className={classnames({
                [styles.up]: false,
                [styles.down]: true,
              })}
            >
              PoI
              <ArrowUpDownIcon />
            </th>
            <th
              className={classnames({
                [styles.up]: false,
                [styles.down]: false,
              })}
            >
              {t("validatingPower")}
              <ArrowUpDownIcon />
            </th>
            <th
              className={classnames({
                [styles.up]: false,
                [styles.down]: false,
              })}
            >
              {t("uptime")}
              <ArrowUpDownIcon />
            </th>
          </thead>
          <tbody>
            {validators.map((data, index) => (
              <DataRow
                key={data.id}
                index={index + 1}
                {...data}
                t={t}
                balance={props.balance}
                handleValidatorSelect={handleValidatorSelect}
                validators={validators}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

const mapStateToProps = state => ({
  validators: state.stakes.validators,
});

const mapDispatchToProps = {
  getValidatorsList: getValidatorsListAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(validator);
