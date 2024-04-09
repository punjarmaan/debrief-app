import request from "supertest";

import app from "../../src/server";
require('dotenv').config();

const SAMPLE_UID_ARM = process.env.TEST_UID_ARM


describe("Auth-User Routes", () => {
  let TOKEN_XIA;

  beforeAll(async () => {
  const sampleLogin_XIA = {
        phone_number: "2",
        password: "0000"
      }
    const res_xia = await request(app).post("/api/user/login").send(sampleLogin_XIA);
    
    TOKEN_XIA = res_xia.body.token; // Extract the token from the response
  });


  it("Successful update profile", async () => {
    const sampleInfoToUpdate = {
        firstName: "Xianyinggggg",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: "2"
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
        firstName: "Xianyinggggg",
        lastName: "Guo",
        username: "armaaaan",
        phone_extension: "+1",
        phone_number: "2"
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
        firstName: "Xianying",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: "3"
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

    expect(res.body).toHaveLength(9)
    expect(res.body[0]).toHaveProperty('firstName')
    expect(res.body[0]).toHaveProperty('lastName')
    expect(res.body[0]).toHaveProperty('username')
  });


  it("Successful getUserById", async () => {

    const res = await request(app)
        .get("/api/auth-user/" + SAMPLE_UID_ARM)
        .auth(TOKEN_XIA, { type: "bearer" })
        .expect(200)
    
    expect(res.body).toHaveProperty('_id')
    expect(res.body._id).toEqual(SAMPLE_UID_ARM)
  });

  it("Unuccessful getUserById - nonexistent user", async () => {

    const res = await request(app)
        .get("/api/auth-user/65dd0ae15ada8af5565d5723")
        .auth(TOKEN_XIA, { type: "bearer" })

    expect(res.body.message).toEqual('User not found.')
  });
});