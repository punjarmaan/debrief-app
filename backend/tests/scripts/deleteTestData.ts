import User from '../../src/models/user.model'
import Event from '../../src/models/event.model'
import Box from '../../src/models/box.model'
import path from 'path';
import { users } from '../data/users'
import { events } from '../data/events'
import { boxes } from '../data/boxes'

const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

export const deleteTestData = async () => {
  const connection = mongoose.connect(
    process.env.MONGO_TEMP
  )

  if (connection) {
      console.log("Connected to MongoDB!")
  }

  try {
    // Delete users
    const user_data = await fs.readFile(path.join(__dirname, '../data/testUserIds.json'), 'utf-8');
    const user_ids = Array.from(JSON.parse(user_data))

    const event_del = await Event.deleteMany({
      members: user_ids[0]
    })

    if (event_del.deletedCount == events.length) {
      console.log("Test events deleted.")
    }

    const box_del = await Box.deleteMany({
      members: user_ids[0]
    })

    if (box_del.deletedCount == boxes.length) {
      console.log("Test boxes deleted.")
    }

    const user_del = await User.deleteMany({
        _id: {
            $in: user_ids
        }
    })

    if (user_del.deletedCount == users.length) {
        console.log("Test users deleted.")
    }

    fs.unlink(path.join(__dirname, '../data/testUserIds.json'), (err) => {
        if (err) {
            console.error('Failed to delete testUserIds.json:', err);
          } else {
            console.log('testUserIds.json deleted successfully');
          }
    })
  } catch (error) {
    console.error('Error deleting test data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

deleteTestData();