import User from '../../src/models/user.model'
import Event from '../../src/models/event.model'
import Box from '../../src/models/box.model'
import { users } from '../data/users'
import { events } from '../data/events'
import { boxes } from '../data/boxes'
import bcrypt from 'bcrypt';
import path from 'path';

const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();


export const insertTestData = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_TEMP
    )

    if (connection) {
        console.log("Connected to MongoDB!")
    }

    let O_ID;
    let F1_ID;
    let F2_ID;
    let F3_ID;
    let R1_ID;
    let R2_ID;
    let M_ID;

    // Insert user tset data
    let user_ids = new Map<string, string>();

    for (let i = 0; i < users.length; i++) {
      const user = users.at(i)
      let pass = await bcrypt.hash(user.password, 12)
      const new_user = await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: pass,
        phone_extension: user.phone_extension,
        phone_number: user.phone_number
      })

      user_ids.set(new_user.username, new_user._id.toString())
    }

    if (user_ids.size != users.length) {
      console.log("Error adding all test users.")
      process.exit()
    }

    console.log("Test users saved.")

    O_ID = user_ids.get("owen")
    F1_ID = user_ids.get("fiona1")
    F2_ID = user_ids.get("fiona2")
    F3_ID = user_ids.get("fiona3")
    R1_ID = user_ids.get("rory1")
    R2_ID = user_ids.get("rory2")
    M_ID = user_ids.get("mary")



    // insert event-related test data

    let event_ct = 0;


    for (let i = 0; i < events.length; i++) {
      const event = events.at(i)
      const new_event = await Event.create({
        title: event.title,
        creator_id: O_ID,
        members: [O_ID, F1_ID, F2_ID]
      })

      if (!new_event) {
        console.log("Error adding ${event.title}")
      }

      event_ct += 1;
    }

    if (event_ct != events.length) {
      console.log("Error adding all test events.")
      process.exit()
    }

    console.log("Test events created.")

    // insert event-related test data
    let box_ct = 0

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes.at(i)
      const new_box = await Box.create({
        title: box.title,
        creator_id: O_ID,
        members: [O_ID, F1_ID, F2_ID],
        private: box.is_private
      })

      if (!new_box) {
        console.log("Error adding ${box.title}")
      }

      box_ct += 1;
    }

    if (box_ct != boxes.length) {
      console.log("Error adding all test boxes.")
      process.exit()
    }

    console.log("Test boxes created.")

    // save user ids
    await fs.writeFile(path.join(__dirname, '../data/testUserIds.json'), JSON.stringify(Array.from(user_ids.values())));

  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

insertTestData();