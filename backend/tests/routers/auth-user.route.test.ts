import request from "supertest";
import { users } from '../data/users'
import app from "../../src/server";
require('dotenv').config();

describe("Auth-User Routes", () => {
  let TOKEN_XIA;
  let UID_XIA;
  let UID_ARM;

  beforeAll(async () => {

    const sampleLogin_XIA = {
          phone_number: process.env.XIA_PHONE,
          password: process.env.LOGIN_PASS
        }

    const sampleLogin_ARM = {
          phone_number: process.env.ARM_PHONE,
          password: process.env.LOGIN_PASS
        }
    const res_xia = await request(app).post("/api/user/login").send(sampleLogin_XIA);
    const res_arm = await request(app).post("/api/user/login").send(sampleLogin_ARM);
    
    TOKEN_XIA = res_xia.body.token; // Extract the token + uid from the responses
    UID_XIA = res_xia.body.user._id
    UID_ARM = res_arm.body.user._id
  });


  it("Successful update profile", async () => {
    const sampleInfoToUpdate = {
        firstName: "Crystal",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: process.env.XIA_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_XIA, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(200)

    expect(res.body.message).toEqual("Profile updated successfully.")
  });

  it("Unsuccessful update profile - username already exists", async () => {
    const sampleInfoToUpdate = {
        firstName: "Crystal",
        lastName: "Guo",
        username: "armaan",
        phone_extension: "+1",
        phone_number: process.env.XIA_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_XIA, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Username already exists.")

  });

  it("Unsuccessful update profile - phone number already exists", async () => {
    const sampleInfoToUpdate = {
        firstName: "Crystal",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: process.env.ARM_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(TOKEN_XIA, { type: "bearer" })
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Phone number is associated with an existing account.")

  });

  it("Successful getAllUsers", async () => {

    const res = await request(app)
        .get("/api/auth-user/")
        .auth(TOKEN_XIA, { type: "bearer" })
        .expect(200)

    expect(res.body).toHaveLength(users.length - 1)
    expect(res.body[0]).toHaveProperty('firstName')
    expect(res.body[0]).toHaveProperty('lastName')
    expect(res.body[0]).toHaveProperty('username')
  });


  it("Successful getUserById", async () => {

    const res = await request(app)
        .get("/api/auth-user/" + UID_ARM)
        .auth(TOKEN_XIA, { type: "bearer" })
        .expect(200)
    
    expect(res.body).toHaveProperty('_id')
    expect(res.body._id).toEqual(UID_ARM.toString())
  });

  it("Unuccessful getUserById - nonexistent user", async () => {

    const res = await request(app)
        .get("/api/auth-user/65dd0ae15ada8af5565d5723")
        .auth(TOKEN_XIA, { type: "bearer" })
        .expect(404)

    expect(res.body.message).toEqual('User not found.')
  });
});