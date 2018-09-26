const browser = require('webextension-polyfill')
const Q = require('q')

export function Storage() {
  var model = {
    host: 'https://onetimesecret.com',
    auth: {
      username: '',
      apikey: ''
    },
    lifetime: 86400,
    askForPassphrase: false
  }

  var init = function() {
    var deferred = Q.defer()
    browser.storage.local
      .get(model)
      .then(function(storedModel) {
        model = storedModel
      })
      .finally(deferred.resolve)
    return deferred.promise
  }

  var setHost = function(host) {
    model.host = host
  }

  var setUsername = function(username) {
    model.auth.username = username
  }

  var setApiKey = function(apikey) {
    model.auth.apikey = apikey
  }

  var setLifetime = function(lifetime) {
    model.lifetime = lifetime
  }

  var setAskForPassphrase = function(askForPassphrase) {
    model.askForPassphrase = askForPassphrase
  }

  var getHost = function() {
    return model.host
  }

  var getUsername = function() {
    return model.auth.username
  }

  var getApiKey = function() {
    return model.auth.apikey
  }

  var getLifetime = function() {
    return model.lifetime
  }

  var getAskForPassphrase = function() {
    return model.askForPassphrase ? true : false
  }

  var persist = function() {
    return browser.storage.local.set(model)
  }

  return {
    init: init,
    persist: persist,
    setHost: setHost,
    setUsername: setUsername,
    setApiKey: setApiKey,
    setLifetime: setLifetime,
    setAskForPassphrase: setAskForPassphrase,
    getHost: getHost,
    getUsername: getUsername,
    getApiKey: getApiKey,
    getLifetime: getLifetime,
    getAskForPassphrase: getAskForPassphrase
  }
}
