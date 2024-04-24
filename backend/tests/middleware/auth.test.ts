import request from "supertest";
import app from "../../src/server";
require('dotenv').config();


describe("Authentication MiddleWare", () => {
  
  let TOKEN_XIA;
  let UID_XIA;

  let IV_TOKEN;
  
  beforeAll(async () => {
  const sampleLogin_XIA = {
        phone_number: process.env.XIA_PHONE,
        password: process.env.LOGIN_PASS
      }
    const res_xia = await request(app).post("/api/user/login").send(sampleLogin_XIA);
    
    TOKEN_XIA = res_xia.body.token; // Extract the token from the response
    UID_XIA = res_xia.body.user._id
  });
  
  it("Successful auth-user action (updateProfile)", async () => {
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

    IV_TOKEN = process.env.IV_TOKEN
  });

  it("Unsuccessful auth-user action - no token", async () => {
    const sampleInfoToUpdate = {
        firstName: "Crystal",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: process.env.XIA_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .send(sampleInfoToUpdate)
        .expect(409)

    expect(res.body.message).toEqual("Invalid token.")
  });

  it("Unsuccessful auth-user action - invalid token", async () => {
    const sampleInfoToUpdate = {
        firstName: "Crystal",
        lastName: "Guo",
        username: "crystal",
        phone_extension: "+1",
        phone_number: process.env.XIA_PHONE
    }

    const res = await request(app)
        .put("/api/auth-user/edit")
        .auth(IV_TOKEN, { type: "bearer" })
        .send(sampleInfoToUpdate)

    expect(res.body.message).toEqual("Invalid token.")
  });
});