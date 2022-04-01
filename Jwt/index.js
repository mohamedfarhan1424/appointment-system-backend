const jwt = require("@hapi/jwt");

module.exports.verifyToken = (artifact, secret, options = {}) => {
  try {
    jwt.token.verify(artifact, secret, options);
    return { isValid: true };
  } catch (err) {
    return {
      isValid: false,
      error: err.message,
    };
  }
};

module.exports.getToken = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};
