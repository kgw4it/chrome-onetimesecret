const browser = require('webextension-polyfill')
import { OneTimeSecretApi } from 'onetimesecret-api'
import { Storage } from '../modules/storage'

// Create OTS page context menu options
function createContextItem() {
  const contexts = ['page', 'link', 'selection']

  browser.contextMenus.create({
    id: '1',
    title: 'Create secret link',
    contexts: contexts
  })

  browser.contextMenus.onClicked.addListener(function(info, tab) {
    var secret
    if (info.selectionText) {
      secret = info.selectionText
    } else if (info.linkUrl) {
      secret = info.linkUrl
    } else {
      secret = info.pageUrl
    }

    var myStorage = Storage()
    myStorage.init().then(function() {
      const ots = new OneTimeSecretApi(
        myStorage.getUsername(),
        myStorage.getApiKey(),
        {
          url: myStorage.getHost(),
          apiVersion: 'v1'
        }
      )

      var options = {
        ttl: parseInt(myStorage.getLifetime())
      }
      if (myStorage.getAskForPassphrase()) {
        var passphrase = prompt('Please enter an optional passphrase: ', '')

        if (passphrase.length) {
          options.passphrase = passphrase
        }
      }
      ots
        .share(secret, options)
        .then(function(response) {
          browser.tabs.create({
            url: myStorage.getHost() + '/private/' + response.metadata_key
          })
        })
        .catch(function(error) {
          alert('Unable to create secret link: ' + error.message)
        })
    })
  })
}

// add the context buttons
createContextItem()
