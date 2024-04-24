import request from "supertest";
import app from "../../src/server";
require('dotenv').config();


describe("Box Routes MiddleWare", () => {
  
  let TOKEN_ARM;
  let TOKEN_XIA;
  let TOKEN_SHA;
  let TOKEN_JOS;

  let UID_ARM;
  let UID_XIA;
  let UID_JOS;

  let BOX_1;
  let BOX_2;
  let BOX_3;
  
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

    const sampleLogin_JOS = {
        phone_number: process.env.JOS_PHONE,
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

    const res_jos = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_JOS)
    .expect(200);
    
    // Extract the token from the response
    TOKEN_XIA = res_xia.body.token      
    TOKEN_ARM = res_arm.body.token
    TOKEN_SHA = res_sha.body.token

    UID_XIA = res_xia.body.user._id
    UID_ARM = res_arm.body.user._id
    UID_JOS = res_jos.body.user._id

    const boxes = await request(app)
    .get("/api/box/")
    .auth(TOKEN_ARM, { type: "bearer" })
    .expect(200);
  
    BOX_1 = boxes.body[0]._id
    BOX_2 = boxes.body[1]._id
    BOX_3 = boxes.body[2]._id
  });
  
  it("Successful box action (getBoxById) - creator", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
  });

  it("Unsuccessful box action (getBoxById) - non-member", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(401)

    expect(res.body.error).toEqual("Unauthorized action: user does not belong to box.")
  });

  it("Unsuccessful box action (getBoxById) - box doesn't exist", async () => {
    const res = await request(app)
      .get("/api/box/66185b1d9e153a252a235151")
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(404)

    expect(res.body.error).toEqual("Box doesn't exist.")
  });

  it.skip("Successful box creator action (deleteBox)", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_3)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Box deleted by creator.")
  });

  it("Unuccessful box creator action (deleteBox) - member", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(401);

    console.log(res.body.message)
    expect(res.body.message).toEqual("Unauthorized action: user does not own box.")
  });
});