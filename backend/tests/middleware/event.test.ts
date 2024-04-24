import request from "supertest";
import app from "../../src/server";
require('dotenv').config();


describe("Event Routes MiddleWare", () => {
  
  let TOKEN_ARM;
  let TOKEN_XIA;
  let TOKEN_SHA;

  let UID_ARM;
  let UID_XIA;

  let EID_1;
  let EID_2;
  
  beforeAll(async () => {
    const sampleLogin_ARM = {
        phone_number: process.env.ARM_PHONE,
        password: process.env.LOGIN_PASS
    }

    const sampleLogin_XIA = {
        phone_number: process.env.XIA_PHONE,
        password: process.env.LOGIN_PASS
    }

    const sampleLogin_SHA = {
        phone_number: process.env.SHA_PHONE,
        password: process.env.LOGIN_PASS
      }

    const res_arm = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_ARM)
    .expect(200);

    const res_xia = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_XIA)
    .expect(200);

    const res_sha = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_SHA)
    .expect(200);
    
    // Extract the token from the response
    TOKEN_XIA = res_xia.body.token      
    TOKEN_ARM = res_arm.body.token
    TOKEN_SHA = res_sha.body.token

    UID_XIA = res_xia.body.user._id
    UID_ARM = res_arm.body.user._id

    const events = await request(app)
    .get("/api/events/")
    .auth(TOKEN_ARM, { type: "bearer" })
    .expect(200);

    EID_1 = events.body[0]._id
    EID_2 = events.body[1]._id
  });
  
  it("Successful events action (getEventById) - creator", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(EID_1)
  });
    
  it("Successful events action (getEventById) - member", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(EID_1)
  });

  it("Unsuccessful events action (getEventById) - non-member", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(401)

    expect(res.body.error).toEqual("Unauthorized action: user does not belong to event.")
  });

  it("Unsuccessful events action (getEventById) - event doesn't exist", async () => {
    const res = await request(app)
      .get("/api/events/66185b1d9e153a252a235151")
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(404)

    expect(res.body.error).toEqual("Event doesn't exist.")
  });

  it("Successful event creator action (deleteBox)", async () => {

    const res = await request(app)
      .get("/api/events/" + EID_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(EID_1)
  });

  it("Successful event creator action (deleteEvent)", async () => {

    const res = await request(app)
      .delete("/api/events/" + EID_2)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Event deleted by creator.")
  });

  it("Unuccessful event creator action (deleteEvent) - member", async () => {

    const res = await request(app)
      .delete("/api/events/" + EID_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(401);

    expect(res.body.message).toEqual("Unauthorized action: user does not own event.")
  });
});