const db = require('../config').db;

/**
 *
 * Data accessing functionality, serves as DAO layer for the application.
 *
 */

const userCollection = 'user';

const addUser = async (user) => {
  let userObj = await db.createUser(user);
  return userObj;
};

const isUserExists = async (username) => {
  let userDB = db.getUserDB();
  let user = await userDB.db().collection(userCollection).findOne({username});
  return user;
};

const validateUser = async (username, password) => {
  let userDB = db.getUserDB();
  let user;
  try {
    user = await userDB.db().collection(userCollection).findOne({username, password});
  }catch (e) {
    throw e;
  }

  if(user) {
    return user;
  }else {
    throw new Error('Invalid Credentials!');
  }
};

module.exports = {
  addUser,
  validateUser,
  isUserExists,
};
