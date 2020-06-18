const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Reset password",
    html: `
		<h1>You have foggot the password</h1>
		<p>If not , please ignore this email</p>
		<hr/>
		<p>If yes , please go to the link below</p>
		<p><a href="${keys.BASE_URL}/auth/password/${token}">Set up a new password</a></p>
		<a href='${keys.BASE_URL}'>Shop of the courses</a>
		`,
  };
};
