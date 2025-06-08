const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const userRole = require('../models/userRole.model')

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized! Invalid or expired token." });
    }
    req.userId = decoded.id; // User ID is attached to the request

    User.findByPk(req.userId)
      .then(user => {
        if (!user) {
          // If user associated with token doesn't exist (e.g., deleted)
          return res.status(401).send({ message: "Unauthorized! User not found." });
        }
        // Assuming User model has a getRoles() method from Sequelize association
        // This method typically returns a Promise resolving to an array of Role instances
        user.getRoles()
          .then(roles => {
            // Extract role names and attach them to the request
            // Storing as uppercase for consistency, common practice for role names
            req.roles = roles.map(role => role.name.toUpperCase());
            next(); // Proceed to the next middleware or route handler
          })
          .catch(roleErr => {
            console.error("Error fetching user roles for userId " + req.userId + ":", roleErr);
            // It's important to send a response here to avoid hanging requests
            return res.status(500).send({ message: "Internal server error: Could not retrieve user roles." });
          });
      })
      .catch(userErr => {
        console.error("Error fetching user by Pk for userId " + req.userId + ":", userErr);
        // It's important to send a response here
        return res.status(500).send({ message: "Internal server error: Could not retrieve user." });
      });
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;