/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import App from '~/App';
import './main.scss';
import * as serviceWorker from '~/serviceWorker';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { englishTranslation } from './utility/translations/english';
import { koreanTranslation } from './utility/translations/korean';
import { chineseTranslation } from './utility/translations/chinese';
import {} from 'update-electron-app'
import detectBrowserLanguage from 'detect-browser-language'



const setCurrentLang = () => {
  const isChecked = localStorage.getItem('isManualLang')
    let locale = localStorage.getItem('language') || i18n.language 


    if(isChecked !== 'true'){
      const res = detectBrowserLanguage()
        const isEnglish = res.toLowerCase().substring(0, 2) === 'en'
        const isChinese = res.toLowerCase().substring(0, 2) === 'zh'
        const isKorean = res === 'ko' || res === 'ko_KR' || res === 'ko-KR'
        if (isChinese) locale = 'chi'
        if(isEnglish) locale = 'en'
        if(isKorean) locale = 'kor'
        localStorage.setItem('language', locale)  
    }
    return locale


}



i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: englishTranslation,
      },
      kor: {
        translation: koreanTranslation,
      },
      chi: {
        translation: chineseTranslation,
      },
    },
    lng: setCurrentLang() || 'en',
    fallbackLng: setCurrentLang() || 'en' ,

    interpolation: {
      escapeValue: false,
    },
  });


ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
