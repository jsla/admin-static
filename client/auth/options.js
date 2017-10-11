module.exports = {
  from: 'js.la <support@js.la>',

  confirmUrl: window.location.origin + '/',
  welcomeSubject: 'Welcome to js.la!',
  welcomeTemplate: `
    <h1>js.la</h1>
    <p>
      We received your registration request. Please
      <a href="${window.location.origin}#/confirm/<%= email %>/<%= confirmToken %>">
        confirm your account
      </a>
      to proceed to account activation.
    </p>
  `,

  changePasswordSubject: 'Change Your Password!',
  changePasswordUrl: window.location.origin + '/#/change-password',
  changePasswordTemplate: `
    <h1>js.la </h1>
    <p> We received your request to change your password. Please
      <a href="${window.location.origin}/#/change-password/<%= email %>/<%= changeToken %>">
        choose a new password
      </a>
      to continue.
    </p>
  `
}
