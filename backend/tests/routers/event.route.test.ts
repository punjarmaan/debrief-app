import request from "supertest";
import app from "../../src/server";
import { FAKE_ID } from "../data/users";
require('dotenv').config();

jest.setTimeout(60000);


describe("Event Routes", () => {

  let TOKEN_FIO1;
  let TOKEN_OWN;
  let TOKEN_ROR1;
  
  let UID_OWN;
  let UID_FIO1;
  let UID_ROR1;
  let UID_FIO2;
  let UID_MAR;
  let EID_1;
  let EID_2;
  let EID_3;



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

    const sampleLogin_MAR = {
      phone_number: process.env.MAR_PHONE,
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

    const res_mar = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_MAR)
    .expect(200);
    
    TOKEN_FIO1 = res_fio1.body.token
    TOKEN_OWN = res_own.body.token
    TOKEN_ROR1 = res_ror1.body.token

    UID_FIO1 = res_fio1.body.user._id
    UID_OWN = res_own.body.user._id
    UID_ROR1 = res_ror1.body.user._id
    UID_FIO2 = res_fio2.body.user._id
    UID_MAR = res_mar.body.user._id

    const events = await request(app)
      .get("/api/events/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    
    EID_1 = events.body[2]._id.toString()
    EID_2 = events.body[1]._id.toString()
    EID_3 = events.body[0]._id.toString()
});

  it.skip("Successful event creation", async () => {
    const sampleInfo = {
        title: "TEST EVENT - 3"
    }

    const res = await request(app)
      .post("/api/events/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .send(sampleInfo)
      .expect(200);

    expect(res.body).toHaveProperty('title')
    expect(res.body.title).toEqual('TEST EVENT')

    expect(res.body).toHaveProperty('locked')
    expect(res.body.locked).toEqual(true)

    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveLength(0)

    expect(res.body.members).toHaveLength(1)
  });

  it("Unsuccessful event creation - missing title", async () => {
    const sampleInfo = {}

    const res = await request(app)
      .post("/api/events/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .send(sampleInfo)
      .expect(400);

    expect(res.body.message).toEqual('Event title is required.')

  });

  it("Successful getAllEvents", async () => {

    const res = await request(app)
      .get("/api/events/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(3)
    expect(res.body[0]._id.toString()).toEqual(EID_3)
    expect(res.body[1]._id.toString()).toEqual(EID_2)
    expect(res.body[2]._id.toString()).toEqual(EID_1)
  });

  it("Successful getAllEvents - no events", async () => {

    const res = await request(app)
      .get("/api/events/")
      .auth(TOKEN_ROR1, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(0)
  });

  it("Successful getEventById - by creator", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(EID_1)
    expect(res.body.creator_id._id).toEqual(UID_OWN)
  });

  it("Successful getEventById - by member", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_FIO1, { type: "bearer" })

    expect(res.body._id).toEqual(EID_1)
  });

  it.skip("Successful deleteEvent - creator", async () => {

    const res = await request(app)
      .delete("/api/events/" + EID_2)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Event deleted by creator.")
  });

  it("Successful updateEvent - creator", async () => {
    const sampleInfoToUpdate = {
      title: "TEST EVENT - 01"
    }
    const res = await request(app)
      .put("/api/events/" + EID_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated event successfully.")
  });

  it("Successful updateEvent - member", async () => {
    const sampleInfoToUpdate = {
      title: "TEST EVENT - 03"
    }
    const res = await request(app)
      .put("/api/events/" + EID_3)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated event successfully.")
  });

  it.skip("Successful addEventMember - by creator", async () => {
    const res = await request(app)
      .put("/api/events/" + EID_1 + "/members/add/" + UID_ROR1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Successful addEventMember - by member", async () => {

    const res = await request(app)
      .put("/api/events/" + EID_1 + "/members/add/" + UID_MAR)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Successful deleteEventMember - creator", async () => {

    const res = await request(app)
      .put("/api/events/" + EID_3 + "/members/del/" + UID_FIO2)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);
    

    expect(res.body.message).toEqual("Member deleted successfully.")
  });
});