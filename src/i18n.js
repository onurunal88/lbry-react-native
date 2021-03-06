import { NativeModules, Platform } from 'react-native';
import { SETTINGS } from 'lbry-redux';
import { doTransifexUpload } from 'lbryinc';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

const isProduction = !__DEV__; // eslint-disable-line no-undef
let knownMessages = null;

window.language = NativeModules.UtilityModule.language;
window.i18n_messages = window.i18n_messages || {};

function saveMessage(message) {
  // file path that won't get wiped if app storage is cleared or the app is uninstalled
  const messagesFilePath = RNFS.ExternalStorageDirectoryPath + '/lbry-app-strings.json';

  if (knownMessages === null) {
    RNFS.readFile(messagesFilePath, 'utf8')
      .then(fileContents => {
        knownMessages = JSON.parse(fileContents);
        checkMessageAndSave(message, messagesFilePath);
      })
      .catch(err => {
        knownMessages = {}; // no known messages, initialise the object
        checkMessageAndSave(message, messagesFilePath);
      });
  } else {
    checkMessageAndSave(message, messagesFilePath);
  }
}

function checkMessageAndSave(message, messagesFilePath) {
  if (!knownMessages[message]) {
    knownMessages[message] = message;
    const contents = JSON.stringify(knownMessages, null, 2);

    RNFS.writeFile(messagesFilePath, contents, 'utf8')
      .then(() => {
        // successful write
        // send to transifex (should we do this even if the file doesn't get saved?)
        // TODO: load token from .env
        /* doTransifexUpload(
          contents,
          'lbry-mobile',
          '*token*',
          () => {
            // successful
          },
          err => {
            // failed
          }
        ); */
      })
      .catch(err => {
        if (err && !isProduction) {
          // only do this when not in production
          console.error(err);
        }
      });
  }
}

export function __(message, tokens) {
  const w = global.window ? global.window : window;
  let language = w.language ? w.language : 'en';

  if (!isProduction) {
    saveMessage(message);
  }

  const translatedMessage = w.i18n_messages[language] ? w.i18n_messages[language][message] || message : message;

  if (!tokens) {
    return translatedMessage;
  }

  return translatedMessage.replace(/%([^%]+)%/g, function($1, $2) {
    return tokens.hasOwnProperty($2) ? tokens[$2] : $2;
  });
}
