const model = require('../models');

module.exports = {

  getAllUsers: (req, res) => {
    model.getAllUsersFromDB()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => {
        console.error('Error retrieving users:', err);
        res.status(500).send({ error: err });
      });
  },

  getUserById: (req, res) => {
    var userId = req.params.firebase_uid || null;

    if (req.headers.userId) {
      model.getUserByIdFromDB(req.headers.userId, true)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.error('Error retrieving user:', err);
          res.status(500).send({ error: err });
        });
    } else {
      model.getUserByIdFromDB(userId, false)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.error('Error retrieving user:', err);
          res.status(500).send({ error: err });
        });
    }
  },

  createUser: (req, res) => {
    var data = req.body;

    model.createUserInDB(data)
      .then((result) => {
        if (!data.address_line_2) {
          return result
        } else {
          console.log(result[0].id);
          let userId = result[0].id;
          return model.updateUserProfileInDB(userId, 'address_line_2', data.address_line_2);
        }
      })
      .then((result) => {
        let userId = result[0].id;
        return model.createSellerRatingsInDB(userId);
      })
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.error('Error creating new user:', err);
        res.status(500).send({ error: err });
      });
  },

  updateUserProfile: (req, res) => {
    var userId = req.headers.userId;
    var fieldName = Object.keys(req.body)[0];
    var data = req.body[fieldName];

    model.updateUserProfileInDB(userId, fieldName, data)
      .then((result) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.error('Error updating user profile:', err);
        res.status(500).send({ error: err });
      })
  },

  banUserProfile: (req, res) => {

    var adminId = req.headers.userId;
    var userId = req.params.user_id;

    model.getUserByIdFromDB(adminId, true)
      .then((result) => {
        if (result[0].admin) {
          return model.banUserProfileInDB(userId);
        } else {
          res.status(403).end();
        }
      })
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        console.error('Error banning user:', err);
        res.status(500).send({ error: err });
      })
  },

  rateSeller: (req, res) => {
    if (!req.headers.userId) {
      res.status(403).end();
    }

    var rating = req.body.rating;

    model.updateSellerRatingsInDB(req.params.seller_id, rating)
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        console.error('Error rating seller:', err);
        res.status(500).send({ error: err });
      });
  },

  deleteUser: (req, res) => {
    var userId = req.headers.userId;

    model.deleteUserFromDB(userId)
      .then(() => {
        res.status(204).end();
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
        res.status(500).send({ error: err });
      })
  }
};