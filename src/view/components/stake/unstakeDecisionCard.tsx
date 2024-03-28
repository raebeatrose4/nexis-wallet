import React from 'react';
import { Card, Button } from 'reactstrap';
import classnames from 'classnames';

const UnstakeDecisionCard = ({ handleStep, handleModal, t }) => {
  return (
    <Card className="mx-auto text-center pt-5 pb-6" style={{ maxWidth: 670 }}>
      <h2 className="mb-5">
        {t("stakeWithdrawalDays")}
.
      </h2>
      <div
        className="mx-auto mt-4 w-100 d-flex justify-content-between"
        style={{ maxWidth: 480 }}
      >
        <Button
          onClick={() => handleStep('back')}
          color="darkish-pink"
          className={classnames('lg outlined mx-4')}
        >
          {t("maybeLater")}
        </Button>
        <Button
          onClick={e => handleModal(e)}
          color="topaz"
          className={classnames('lg outlined mx-4')}
        >
          {t("ok")}
,
          {t("unstake")}
        </Button>
      </div>
    </Card>
  );
};

export default UnstakeDecisionCard;
