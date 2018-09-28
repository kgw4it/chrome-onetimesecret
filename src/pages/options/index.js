import {
  Storage
} from '../../modules/storage'
import '../../css/bootstrap-responsive.min.css'
import '../../css/bootstrap.min.css'
import '../../css/main.css'

var myStorage = Storage()

function saveOptions() {
  let host = document.getElementById('hostField').value
  let username = document.getElementById('usernameField').value
  let apikey = document.getElementById('apikeyField').value
  let lifetime = document.getElementById('lifetimeField').value
  let askForPassphrase =
    document.getElementById('askForPassphraseField').value === 'yes'
  let openSettingsOnIconClick =
    document.getElementById('openSettingsOnIconClickField').value === 'yes'

  myStorage.setHost(host)
  myStorage.setUsername(username)
  myStorage.setApiKey(apikey)
  myStorage.setLifetime(lifetime)
  myStorage.setAskForPassphrase(askForPassphrase)
  myStorage.setOpenSettingsOnIconClick(openSettingsOnIconClick)
  myStorage.persist().then(function() {
    // Update status to let user know options were saved.
    document.getElementById('status').style.display = 'block'
    setTimeout(function() {
      document.getElementById('status').style.display = 'none'
    }, 3000)
  })
  return false
}

function restoreOptions() {
  myStorage.init().then(function() {
    document.getElementById('hostField').value = myStorage.getHost()
    document.getElementById('usernameField').value = myStorage.getUsername()
    document.getElementById('apikeyField').value = myStorage.getApiKey()
    document.getElementById('lifetimeField').value = myStorage.getLifetime()
    document.getElementById(
      'askForPassphraseField'
    ).value = myStorage.getAskForPassphrase() ? 'yes' : 'no'
    document.getElementById(
      'openSettingsOnIconClickField'
    ).value = myStorage.getOpenSettingsOnIconClick() ? 'yes' : 'no'
  })
}
document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)