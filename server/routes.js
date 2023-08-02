var controller = require('./controllers');
var router = require('express').Router();

// GET /api/users retrieve all users
router.get('/users', controller.getAllUsers);

// GET /api/users/:user_id retrieve information for specific user (public/private)
router.get('/users/:user_id', controller.getUserById);

// POST /api/users (create new users)
router.post('/users', controller.createUser);

// PUT /api/users/:user_id/profile (update user profile)
router.put('/users/:user_id/profile', controller.updateUserProfile);

// PUT /api/users/:user_id/ban (bans profile from app)
router.put('/users/:user_id/ban', controller.banUserProfile);

// PUT /api/users/:user_id/rate (rate a user profile from app)
router.put('/users/:user_id/rate', controller.rateSeller);

// DELETE /api/users/:user_id (delete account)
router.delete('/users/:user_id', controller.deleteUser);

module.exports = router;

