import request from "supertest";
import app from "../../src/server";
import { FAKE_ID } from "../data/users";
require('dotenv').config();


describe("Event Routes MiddleWare", () => {
  
  let TOKEN_OWN;
  let TOKEN_FIO1;
  let TOKEN_ROR1;

  let UID_OWN;
  let UID_FIO1;

  let EID_1;
  let EID_2;
  
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
    
    // Extract the token from the response
    TOKEN_FIO1 = res_fio1.body.token
    TOKEN_OWN = res_own.body.token
    TOKEN_ROR1 = res_ror1.body.token

    UID_FIO1 = res_fio1.body.user._id
    UID_OWN = res_own.body.user._id

    const events = await request(app)
    .get("/api/events/")
    .auth(TOKEN_FIO1, { type: "bearer" })
    .expect(200);

    EID_1 = events.body[2]._id
    EID_2 = events.body[1]._id
  });
  
  it("Successful events action (getEventById) - creator", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(EID_1)
  });
    
  it("Successful events action (getEventById) - member", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_FIO1, { type: "bearer" })


    expect(res.body._id).toEqual(EID_1)
  });

  it("Unsuccessful events action (getEventById) - non-member", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_ROR1, { type: "bearer" })
      .expect(401)

    expect(res.body.error).toEqual("Unauthorized action: user does not belong to event.")
  });

  it("Unsuccessful events action (getEventById) - event doesn't exist", async () => {
    const res = await request(app)
      .get("/api/events/" + FAKE_ID)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(404)

    expect(res.body.error).toEqual("Event doesn't exist.")
  });

  // it("Successful event creator action (deleteBox)", async () => {

  //   const res = await request(app)
  //     .get("/api/events/" + EID_1)
  //     .auth(TOKEN_FIO1, { type: "bearer" })
  //     .expect(200);

  //   expect(res.body._id).toEqual(EID_1)
  // });

  it.skip("Successful event creator action (deleteEvent)", async () => {

    const res = await request(app)
      .delete("/api/events/" + EID_2)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Event deleted by creator.")
  });

  it("Unuccessful event creator action (deleteEvent) - member", async () => {

    const res = await request(app)
      .delete("/api/events/" + EID_1)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(401);


    expect(res.body.error).toEqual("Unauthorized action: user does not own event.")
  });
});