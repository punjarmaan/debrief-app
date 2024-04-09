import User from '../../src/models/user.model'
const mongoose = require('mongoose');
const users = require('../scripts/data/users')
require('dotenv').config();

const connection = mongoose.connect(
    process.env.MONGO_TEMP
)

if (connection) {
    console.log("Connected to MongoDB!")
}

export const insertTestData = async () => {
    try {
      // Insert users
      const user_list = await User.insertMany(users);
  
      // Insert events, relating them to users if necessary
      console.log(user_list)
  
      console.log('Test data inserted');
    } catch (error) {
      console.error('Error inserting test data:', error);
    }
  };

insertTestData();