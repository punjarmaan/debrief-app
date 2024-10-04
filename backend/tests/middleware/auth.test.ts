import request from "supertest";
import app from "../../src/server";
require('dotenv').config();


describe("Authentication MiddleWare", () => {
  
  let TOKEN_FIO1;
  let UID_FIO1;

  let IV_TOKEN;
  
  beforeAll(async () => {
  const sampleLogin_FIO1 = {
        phone_number: process.env.FIO1_PHONE,
        password: process.env.LOGIN_PASS
      }
    const res_fio1 = await request(app).post("/api/user/login").send(sampleLogin_FIO1);
    
    TOKEN_FIO1 = res_fio1.body.token; // Extract the token from the response
    UID_FIO1 = res_fio1.body.user._id
  });
  
  it("Successful auth-user action (updateProfile)", async () => {
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

    IV_TOKEN = process.env.IV_TOKEN
  });

  it("Unsuccessful auth-user action - no token", async () => {
    const sampleInfoToUpdate = {
        firstName: "Fiona",
        lastName: "Friend1",
        username: "fiona1",
        phone_extension: "+1",
        phone_number: process.env.FIO1_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Invalid token.")
  });

  it("Unsuccessful auth-user action - invalid token", async () => {
    const sampleInfoToUpdate = {
        firstName: "Fiona",
        lastName: "Friend1",
        username: "fiona1",
        phone_extension: "+1",
        phone_number: process.env.FIO1_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(IV_TOKEN, { type: "bearer" })
        .send(sampleInfoToUpdate)

    expect(res.body.message).toEqual("Invalid token.")
  });
});