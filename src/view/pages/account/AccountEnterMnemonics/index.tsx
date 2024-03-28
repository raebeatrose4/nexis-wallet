/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, useCallback, useMemo, ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import * as ACCOUNT_ACTIONS from '~/redux/account/actions';
import { selectAccountCreate } from '~/redux/account/selectors';
import { push as historyPush } from 'connected-react-router';
import { Input, Button } from 'reactstrap';
import { AccessWalletCard } from 'src/view/components/cards';
import classnames from 'classnames';
import uploadIcon from 'src/images/icons/upload.svg';
import { useTranslation } from "react-i18next";

import { Input as FormInput } from 'src/view/components/forms';
import {
  KeystoreIcon,
  MnemonicIcon,
  PrivatekeyIcon,
} from 'src/view/components/svgIcons';
import styles from './styles.module.scss';
import { Layout } from '~/view/components/layout/Layout';

const mapStateToProps = state => ({
  accountDetails: selectAccountCreate(state),
});
const mapDispatchToProps = {
  accountCreateRestoreMnemonics: ACCOUNT_ACTIONS.accountCreateRestoreMnemonics,
  accountCreateRestorePrivateKey:
    ACCOUNT_ACTIONS.accountCreateRestorePrivateKey,
  accountCreateCancel: ACCOUNT_ACTIONS.accountCreateCancel,
  accountUploadKeystore: ACCOUNT_ACTIONS.accountUploadKeystore,

  push: historyPush,
};

type IProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  RouteComponentProps & {};

const AccountEnterMnemonicsUnconnected: FC<IProps> = ({
  accountCreateRestoreMnemonics,
  accountUploadKeystore,
  push,
  accountDetails,
  accountCreateRestorePrivateKey,
}) => {
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState(false);
  const [uploadedFile, setFile] = useState()
  const [currentTab, setCurrentTab] = useState(1)
  const [password, setPassword] = useState('')
  const [fileError, setFileError] = useState(false)
  const [passError, setPassError] = useState(false)
  const [userPrivateKey, setUserPrivateKey] = useState('');
  const [privateKeyError , setPrivateKeyError] = useState(false)
  const {t} = useTranslation();
 
  const is_next_disabled = useMemo<boolean>(() => {
    if (phrase.length === 0) return false;
    // let isCorrectWords = true

    const words = phrase
      .split(' ')
      .map(el => el.trim())
      .filter(el => {
        
        return /^[a-zA-Z]+$/.test(el)
      });

    return words.length === 12 || words.length === 24;
  }, [phrase]);


  

  const onSubmit = useCallback(() => {
    let isValidMnemonics = true
    const words =
      phrase !== '' &&
      phrase
        .split(' ')
        .map(el => el.trim())
        .filter(el => {
          
            if(el !== '' && !/^[a-zA-Z]+$/.test(el)){
              isValidMnemonics = false
            }
            return /^[a-zA-Z]+$/.test(el)
          
        });
    const validation_errors = {
      phrase:
        phrase === '' ||
        (words && !(words.length === 12 || words.length === 24) || !isValidMnemonics),
    };

    if (validation_errors.phrase) return setError(validation_errors.phrase);

    

    const mnemonic = phrase
      .split(' ')
      .map(el => el.trim())
      .filter(el => /^[a-zA-Z]+$/.test(el))
      .join(' ');

    accountCreateRestoreMnemonics({ mnemonic });
  }, [phrase, accountCreateRestoreMnemonics]);

  const onUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (!file) return;
    setFile(file);

    },
    []
  );


  const handleFileSubmit = useCallback(
    () => {
     
      accountUploadKeystore(uploadedFile, password);
    },
    [accountUploadKeystore,password,  uploadedFile]
  );

 

  const handlePrivateKeySubmit = useCallback(() => {
    const regx = /^[a-zA-Z0-9]+$/;
    if (
      (
         (userPrivateKey === '' ||
        userPrivateKey.length !== 66 ||
        regx.test(userPrivateKey) === false ||
        userPrivateKey.toLowerCase().substring(0, 2) !== '0x')
      )
    ) {
      setPrivateKeyError(true)

    } else {
      accountCreateRestorePrivateKey({ privateKey: userPrivateKey });


    }
  }, [userPrivateKey, accountCreateRestorePrivateKey]);

  

  

  const handleAllSubmit = useCallback((e: any) => {
    e.preventDefault();
 

    if (currentTab === 1) {
      if(!(password && password !== '')){
        setPassError(true)
        return
      }
      if(!uploadedFile){
        setFileError(true)
        return 
  
      }
      handleFileSubmit()
    } else if (currentTab === 2) {
      onSubmit();
    } else if (currentTab === 3) {
      handlePrivateKeySubmit();
    }
     
    },
    [currentTab, password, uploadedFile, handleFileSubmit, onSubmit, handlePrivateKeySubmit]
  );


  const getErrorText = () => {
    if(passError){
      return t('pleaseEnterPassword')

    }
    if(fileError){
      return t('pleaseUploadKeystore')

    }
    if(Object.keys(accountDetails.errors).length > 0 && accountDetails.errors.keystore){
      if(accountDetails.errors.keystore === 'Invalid keystore file or password'){
        return t('invalidKeystoreTitle')
      } 
       if(accountDetails.errors.keystore === 'An account with this address already exist'){
        return t('accountAlreadyExist')

      }
      return accountDetails.errors.keystore

    }


    
  }

  const handleTabs = tab => {
    setCurrentTab(tab)

  setPrivateKeyError(false)
  setPassError(false)
  setFileError(false)
  setError(false)

  }

  const getButtonActiveClass = () => {
    if(currentTab === 2){
      if(is_next_disabled){
        return 'primary'
      }
      return 'secondary'
    }

    if(currentTab === 1){


     
   if((password && password !== '') && uploadedFile){
        return 'primary'
      }
      return 'secondary'
    }

    if(currentTab === 3){
   if(userPrivateKey && userPrivateKey.length === 66){
    return 'primary'
  }
  return 'secondary'
    }

  }

  const handleClose = () => {
    push('/')
  }

  let isPrivateKeyError = false;
  if(Object.keys(accountDetails.errors).length > 0 && accountDetails.errors.privateKey){
    isPrivateKeyError = true

  }

  let isMnemonicExistError = false;
  if(Object.keys(accountDetails.errors).length > 0 && accountDetails.errors.mnemonic){
    isMnemonicExistError = true

  }

  


  return (
    

    <Layout>
      <AccessWalletCard handleClose={handleClose} t={t}>
        <div className={styles.mainWrapper}>
          <div>
            <div className={styles.optionsWrapper}>
              <div className={styles.optionCol}>
                <div
                  className={classnames(styles.option, {
                    [styles.active]: currentTab === 1,
                  })}
                  onClick={() => handleTabs(1)}
                >
                  <KeystoreIcon />
                  <h4 className="opacity-7">{t("keystore")}</h4>
                </div>
              </div>
              <div className={styles.optionCol}>
                <div
                  className={classnames(styles.option, {
                    [styles.active]: currentTab === 2,
                  })}
                  onClick={() => handleTabs(2)}
                >
                  <MnemonicIcon />
                  <h4 className="opacity-7">{t('mnemonicPhrase')}</h4>
                </div>
              </div>
              <div className={styles.optionCol}>
                <div
                  className={classnames(styles.option, {
                    [styles.active]: currentTab === 3,
                  })}
                  onClick={() => handleTabs(3)}
                >
                  <PrivatekeyIcon className="mt-1" />
                  <h4 className="opacity-7">{t('privateKey')}</h4>
                </div>
              </div>
            </div>
            {/* --Keystore Start-- */}
            {currentTab === 1 && (
              <div>
                <div className={classnames(styles.fileUploadBtnWrapper)}>
                  <label
                    className={classnames(
                      styles.fileUploadBtn,
                      'outlined text-dark-grey-blue btn btn-topaz'
                    )}
                  >
                    <input
                      className="d-none"
                      type="file" 
                      onChange={e => {onUpload(e); setFileError(false)}}
                    />
                    <img src={uploadIcon} alt="Upload keystore file" />
                    {t('uploadKeystoreFile')}
                  </label>
                  {uploadedFile && <p className={styles.info}>{t('keystoreSucessfullyLoaded')}</p>}
                </div>
                <FormInput
                  accessWallet
                  noBorder
                  type="password"
                  placeholder={t('enterYourWalletPassword')}
                  value={password}
                  handler={val => {
                      setPassword(val)
                      setPassError(false)
                    }}
                  isError={passError}
                  errorMsg={getErrorText()}
                />
                
            
         
              </div>)}
            {/* --Keystore End-- */}

            {/* --Mnemonic Start-- */}
            {currentTab === 2 && (<div>
              <h4 className={classnames('opacity-7', styles.inputLabel)}>
                {t('enterMnemonic')}
.
              </h4>
      
              <div className={styles.inputWrapper}>
                
                <Input
                  type="textarea"
                  className={classnames(styles.input, styles.textarea, {
                      [styles.isError]: error,
                    })}
                  value={phrase}
                  onChange={e => {
                      setPhrase(e.target.value);
                      setError(false);
                    }}
                />
                {error ? (
                  <p className={styles.errorText}>{t('invalidRecoveryPhrase')}</p>
                  ) : 
                isMnemonicExistError ? <p className={styles.errorText}>
                  { accountDetails.errors && accountDetails.errors.mnemonic &&  
                t('accountAlreadyExist')}

                </p> : ''}
              </div>
            </div>
            )}
            {/* --Mnemonic End-- */}

            {/* --Private Start-- */}
            {currentTab === 3 && (
              <div>
                <FormInput
                  accessWallet
                  type="text"
                  label={t('typePrivateKey')}
                  handler={val => {
                    setUserPrivateKey(val);
                    setPrivateKeyError(false)
                  }}
                  value={userPrivateKey}
                  isError={privateKeyError}
                  errorMsg={isPrivateKeyError ? accountDetails.errors && 
                    accountDetails.errors.privateKey && t("accountAlreadyExist") : 
                  privateKeyError ? t("enterPrivateValidation") : ""}
                />
              </div>
            )}
          
          </div>
          <div className="text-center">
            <Button
              color={getButtonActiveClass()}
              className={styles.btn}
              onClick={e => handleAllSubmit(e)}
            >
              {t("unlockWallet")}
            </Button>
          </div>
        </div>
      </AccessWalletCard>
    </Layout>
  );
};

const AccountEnterMnemonics = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountEnterMnemonicsUnconnected));

export { AccountEnterMnemonics };
