import AuthenticUI from 'authentic-ui'

import opts from './options'
import wrap from './wrap.jsx'
import navigate from '../navigate'

var navHome = navigate.bind(null, '/')

var aui = bindAll(AuthenticUI({
  server: 'https://authentic.apps.js.la',
  links: {
    signup: '#/signup',
    login: '#/login',
    changePasswordRequest: '#/change-password-request'
  }
}), [
  'login',
  'signup',
  'confirm',
  'changePasswordRequest',
  'changePassword',
  'logout'
])

module.exports = {
  client: aui.auth,
  login: wrap(aui.login, navHome),
  logout: wrap(aui.logout, navHome),

  signup: wrap(aui.signup, {
    from: opts.from,
    subject: opts.welcomeSubject,
    confirmUrl: opts.confirmUrl,
    provide: { bodyTemplate: opts.welcomeTemplate }
  }),

  changePasswordRequest: wrap(aui.changePasswordRequest, {
    from: opts.from,
    subject: opts.changePasswordSubject,
    changeUrl: opts.changePasswordUrl,
    provide: { bodyTemplate: opts.changePasswordTemplate }
  }),

  confirm (params) {
    return wrap(aui.confirm, {
      email: params.email,
      confirmToken: params.confirmToken
    }, navHome)
  },

  changePassword (params) {
    return wrap(aui.changePassword, {
      email: params.email,
      changeToken: params.changeToken
    }, navHome)
  },

  get (url, cb) {
    aui.auth.get(url, function (err, body) {
      if (err) {
        return err.statusCode === 401
          ? aui.auth.logout()
          : cb(err)
      }

      cb(null, body)
    })
  },

  post (url, data, cb) {
    aui.auth.post(url, data, function (err, body) {
      if (err) {
        return err.statusCode === 401
          ? aui.auth.logout()
          : cb(err)
      }

      cb(null, body)
    })
  },

  email: function () { return aui.auth.email },
  authToken: function () { return aui.authToken() },
  isLoggedIn: function () { return Boolean(aui.authToken()) }
}

function bindAll (obj, keys) {
  keys.forEach(function (key) {
    if (typeof obj[key] !== 'function') return
    obj[key] = obj[key].bind(obj)
  })
  return obj
}
