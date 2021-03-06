const jwt = require('jsonwebtoken');
const userModel = require('../model/user');
const config = require('../config');

/**
 * login service:
 *        - validates user
 *        - generates and returns a JWT token if user credentials are valid
 *        - returns error message if user credentials are invalid
 *
 * @param username
 * @param password
 * @returns {Promise<*>}
 */
const login = async (username, password) => {
  console.log('entered login() service');
  let user, token;
  try {
    user = await userModel.validateUser(username, password);
    console.log(`User ${username} login success`);
    token = jwt.sign({username}, config.jwt_secret, {expiresIn: '2h'});
  } catch (e) {
    console.log(`User ${username} login failed`);
    return {message: e};
  }

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    }
  };
};

/**
 * register service:
 *          - Adds the user in the user database (or) sends errorMessage if exists
 *          - A verification Email is sent to the user once user is added to the database
 *
 * @param user
 * @returns {Promise<*>}
 */
const register = async (user) => {
    console.debug('entered register() service');
  let userFound = await userModel.isUserExists(user.username);
  if (userFound) {
    let message = `username - ${user.username}, already exists`;
    console.debug(message);
    return {
      errorMessage: message
    }
  } else {
    userModel.addUser(user);
    console.info(`User: ${user.username}, registered`);
    return {
      message: "A user has ben registered"
    }
  }
};

module.exports = {
  login,
  register,
};