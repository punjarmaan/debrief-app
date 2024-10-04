import request from "supertest";
import app from "../../src/server";
import { FAKE_ID } from "../data/users";
require('dotenv').config();


describe("Box Routes MiddleWare", () => {
  
  let TOKEN_OWN;
  let TOKEN_FIO1;
  let TOKEN_ROR1;
  let TOKEN_FIO2;

  let UID_OWN;
  let UID_FIO1;
  let UID_FIO2;

  let BOX_1;
  let BOX_2;
  let BOX_3;
  
  beforeAll(async () => {
    const sampleLogin_OWN = {
        phone_number: process.env.OWN_PHONE,
        password: process.env.LOGIN_PASS
    }

    const sampleLogin_FIO1 = {
        phone_number: process.env.FIO1_PHONE,
        password: process.env.LOGIN_PASS
    }

    const sampleLogin_ROR1 = {
        phone_number: process.env.ROR1_PHONE,
        password: process.env.LOGIN_PASS
      }

    const sampleLogin_FIO2 = {
        phone_number: process.env.FIO2_PHONE,
        password: process.env.LOGIN_PASS
      }

    const res_own = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_OWN)
    .expect(200);

    const res_fio1 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_FIO1)
    .expect(200);

    const res_ror1 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_ROR1)
    .expect(200);

    const res_fio2 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_FIO2)
    .expect(200);
    
    // Extract the token from the response
    TOKEN_FIO1 = res_fio1.body.token      
    TOKEN_OWN = res_own.body.token
    TOKEN_ROR1 = res_ror1.body.token

    UID_FIO1 = res_fio1.body.user._id
    UID_OWN = res_own.body.user._id
    UID_FIO2 = res_fio2.body.user._id

    const boxes = await request(app)
    .get("/api/box/")
    .auth(TOKEN_OWN, { type: "bearer" })
    .expect(200);
  
    BOX_1 = boxes.body[0]._id
    BOX_2 = boxes.body[1]._id
    BOX_3 = boxes.body[2]._id
  });
  
  it("Successful box action (getBoxById) - creator", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
  });

  it("Unsuccessful box action (getBoxById) - non-member", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_ROR1, { type: "bearer" })
      .expect(401)

    expect(res.body.error).toEqual("Unauthorized action: user does not belong to box.")
  });

  it("Unsuccessful box action (getBoxById) - box doesn't exist", async () => {
    const res = await request(app)
      .get("/api/box/" + FAKE_ID)
      .auth(TOKEN_ROR1, { type: "bearer" })
      .expect(404)

    expect(res.body.error).toEqual("Box doesn't exist.")
  });

  it.skip("Successful box creator action (deleteBox)", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_3)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Box deleted by creator.")
  });

  it("Unuccessful box creator action (deleteBox) - member", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_1)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(401);

    console.log(res.body.message)
    expect(res.body.message).toEqual("Unauthorized action: user does not own box.")
  });
});