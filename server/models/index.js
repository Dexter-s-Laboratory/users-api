const db = require('../db');

module.exports = {
  getAllUsersFromDB: () => {
    return db.query('SELECT username FROM users');
  },

  getUserByIdFromDB: (userId, auth) => {
    if (auth) {
      return db.query('SELECT * FROM users WHERE id = $1', [userId]);
    } else {
      return db.query('SELECT u.id AS user_id, u.username, u.interests, sr.overall_1_count, sr.overall_2_count, sr.overall_3_count, sr.overall_4_count, sr.overall_5_count FROM users u LEFT JOIN seller_ratings sr on u.id = sr.seller_id WHERE u.id = $1', [userId]);
    }
  },

  createUserInDB: (data) => {
    return db.query('INSERT INTO users (full_name, username, address_line_1, city, state_abbr, zip, phone_number, email, interests, firebase_uid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id', [data.full_name, data.username, data.address_line_1, data.city, data.state_abbr, data.zip, data.phone_number, data.email, data.interests, data.firebase_uid]);
  },

  updateUserProfileInDB: (userId, fieldName, data) => {
    return db.query(`UPDATE users SET ${fieldName} = $1 WHERE id = $2 RETURNING id`, [data, userId]);
  },

  banUserProfileInDB: (userId) => {
    return db.query('UPDATE users SET banned = true WHERE id = $1', [userId]);
  },

  deleteUserFromDB: (userId) => {
    return db.query('DELETE FROM users WHERE id = $1', [userId]);
  },

  createSellerRatingsInDB: (userId) => {
    return db.query('INSERT INTO seller_ratings (seller_id) VALUES ($1)', [userId]);
  },

  updateSellerRatingsInDB: (sellerId, rating) => {
    return db.query(`UPDATE users SET overall_${rating}_count = overall_${rating}_count + 1 WHERE seller_id = $1`, [sellerId]);
  }
};