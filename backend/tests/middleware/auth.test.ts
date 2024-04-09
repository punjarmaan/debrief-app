import request from "supertest";

import app from "../../src/server";
require('dotenv').config();


const TOKEN = process.env.TEST_TOKEN_XIA
const SAMPLE_ID = process.env.TEST_ID_XIA


describe("Authentication MiddleWare", () => {
  
  let TOKEN_XIA;
  beforeAll(async () => {
  const sampleLogin_XIA = {
        phone_number: "2",
        password: "0000"
      }
    const res_xia = await request(app).post("/api/user/login").send(sampleLogin_XIA);
    
    TOKEN_XIA = res_xia.body.token; // Extract the token from the response
  });
  
  it("Successful auth-user action (updateProfile)", async () => {
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
});