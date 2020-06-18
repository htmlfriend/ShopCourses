const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Your account was created",
    html: `
		<h1>Welcome to our shop</h1>
		<p>Your account was created with email - ${email}</p>
		<hr/>
		<a href='${keys.BASE_URL}'>Shop of the courses</a>
		`,
  };
};
