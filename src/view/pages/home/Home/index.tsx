import React, { FC } from 'react';
import { Container, Row, Col, Card } from 'reactstrap';

import styles from './styles.module.scss';
import { Layout } from '~/view/components/layout/Layout';
import KeyIcon from '../../../../images/icons/key.png';
import WalletIcon from '../../../../images/icons/wallet.png';
import classnames from 'classnames';
import { useTranslation } from "react-i18next";

function goToRoute(props) {
  props.history.push('/account/create');
}
const Home: FC<{}> = props => {
  const { t } = useTranslation();

  return (
    <Layout noFooter>
      <div className={styles.banner}>
        <Container>
          <h1 className={styles.homeTitle}>{t('welcomeFantomWallet')}</h1>
          <h3 className="font-weight-semi-bold">
            Send, receive and stake your NZT
          </h3>
        </Container>
      </div>
      <div className={styles.homeWrapper}>
        <Container>
          <div className={styles.desktopView}>
            <Row>
              <Col xl={6} lg={12} className={styles.marginBottom}>
                <Card
                  className={classnames(
                    'bg-dark-periwinkle text-white h-100',
                    styles.card
                  )}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardIcon}>
                      <img src={WalletIcon} alt="wallet" />
                    </div>
                    <div className={styles.homecontent}>
                      <div className={styles.text}>
                        <h2>Create a new wallet</h2>
                        <p className="text-white">
                          Generate your unique Nexis Network wallet. Receive your own
                          unique public address, and create access and recovery
                          credentials.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={styles.walletBtn}
                        onClick={() => goToRoute(props)}
                      >
                        Get started
                        <i className="fas fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xl={6} lg={12} md={12} className={styles.marginBottom}>
                <Card
                  className={classnames(
                    'bg-topaz text-white h-100',
                    styles.card
                  )}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardIcon}>
                      <img src={KeyIcon} alt="key" />
                    </div>
                    <div className={styles.homecontent}>
                      <div className={styles.text}>
                        <h2>Access your wallet</h2>
                        <p className="text-white">
                          Connect to the Nexis Network network and:
                          <ul>
                            <li>Send and receive NZT</li>
                            <li>Stake your NZT</li>
                            <li>Collect your rewards</li>
                          </ul>
                        </p>
                      </div>
                      <button type="button" className={styles.walletBtn}>
                        Access now
                        <i className="fas fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          <div className={styles.mobileView}>
            <Row>
              <Col lg={12} className="mb-4">
                <button
                  type="button"
                  className={classnames('bg-dark-periwinkle', styles.mobileBtn)}
                >
                  Create a new wallet
                </button>
              </Col>
              <Col lg={12} className="mb-4">
                <button
                  type="button"
                  className={classnames('bg-topaz', styles.mobileBtn)}
                >
                  Access your wallet
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
export default Home;
