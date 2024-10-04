import request from "supertest";
import { users, FAKE_ID } from '../data/users'
import app from "../../src/server";
require('dotenv').config();

describe("Auth-User Routes", () => {
  let TOKEN_FIO1;
  let UID_FIO1;
  let UID_OWN;

  beforeAll(async () => {

    const sampleLogin_FIO1 = {
          phone_number: process.env.FIO1_PHONE,
          password: process.env.LOGIN_PASS
        }

    const sampleLogin_OWN = {
          phone_number: process.env.OWN_PHONE,
          password: process.env.LOGIN_PASS
        }

    const res_fio1 = await request(app).post("/api/user/login").send(sampleLogin_FIO1);
    const res_own = await request(app).post("/api/user/login").send(sampleLogin_OWN);
    
    TOKEN_FIO1 = res_fio1.body.token; // Extract the token + uid from the responses
    UID_FIO1 = res_fio1.body.user._id
    UID_OWN = res_own.body.user._id
  });


  it("Successful update profile", async () => {
    const sampleInfoToUpdate = {
        firstName: "Fiona",
        lastName: "Friend1",
        username: "fiona1",
        phone_extension: "+1",
        phone_number: process.env.FIO1_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_FIO1, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(200)

    expect(res.body.message).toEqual("Profile updated successfully.")
  });

  it("Unsuccessful update profile - username already exists", async () => {
    const sampleInfoToUpdate = {
        firstName: "Fiona",
        lastName: "Friend1",
        username: "owen",
        phone_extension: "+1",
        phone_number: process.env.FIO1_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_FIO1, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Username already exists.")

  });

  it("Unsuccessful update profile - phone number already exists", async () => {
    const sampleInfoToUpdate = {
        firstName: "Fiona",
        lastName: "Friend1",
        username: "fiona1",
        phone_extension: "+1",
        phone_number: process.env.OWN_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_FIO1, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Phone number is associated with an existing account.")

  });

  it("Successful getAllUsers", async () => {

    const res = await request(app)
        .get("/api/auth-user/")
        .auth(TOKEN_FIO1, { type: "bearer" })
        .expect(200)

    expect(res.body).toHaveLength(users.length - 1)
    expect(res.body[0]).toHaveProperty('firstName')
    expect(res.body[0]).toHaveProperty('lastName')
    expect(res.body[0]).toHaveProperty('username')
  });


  it("Successful getUserById", async () => {

    const res = await request(app)
        .get("/api/auth-user/" + UID_OWN)
        .auth(TOKEN_FIO1, { type: "bearer" })
        .expect(200)
    
    expect(res.body).toHaveProperty('_id')
    expect(res.body._id).toEqual(UID_OWN.toString())
  });

  it("Unuccessful getUserById - nonexistent user", async () => {

    const res = await request(app)
        .get("/api/auth-user/" + FAKE_ID)
        .auth(TOKEN_FIO1, { type: "bearer" })
        .expect(404)

    expect(res.body.message).toEqual('User not found.')
  });
});