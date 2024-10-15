import request from "supertest";
import app from "../../src/server";
import { FAKE_ID } from "../data/users";

require('dotenv').config();

jest.setTimeout(60000);


describe("Box Routes", () => {

  let TOKEN_FIO1;
  let TOKEN_FIO2;
  let TOKEN_FIO3;
  let TOKEN_OWN;

  let TOKEN_ROR1;
  let TOKEN_ROR2;


  let UID_OWN;
  let UID_FIO1;
  let UID_FIO2;
  let UID_FIO3;
  let UID_ROR1;
  let UID_ROR2;
  let UID_MAR;

  let EID_1;
  let EID_2;
  let EID_3;
  let BOX_1;
  let BOX_2
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

    const sampleLogin_FIO2 = {
      phone_number: process.env.FIO2_PHONE,
      password: process.env.LOGIN_PASS
    }

    const sampleLogin_FIO3 = {
      phone_number: process.env.FIO3_PHONE,
      password: process.env.LOGIN_PASS
    }

    const sampleLogin_ROR1 = {
      phone_number: process.env.ROR1_PHONE,
      password: process.env.LOGIN_PASS
    }

    const sampleLogin_ROR2 = {
      phone_number: process.env.ROR2_PHONE,
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

    const res_fio2 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_FIO2)
    .expect(200);

    const res_fio3 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_FIO3)
    .expect(200);

    const res_ror1 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_ROR1)
    .expect(200);

    const res_ror2 = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_ROR2)
    .expect(200);

    const res_mar = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_MAR)
    .expect(200);
    
    TOKEN_FIO1 = res_fio1.body.token
    TOKEN_FIO2 = res_fio2.body.token
    TOKEN_FIO3 = res_fio3.body.token
    TOKEN_OWN = res_own.body.token
    TOKEN_ROR1 = res_ror1.body.token
    TOKEN_ROR2 = res_ror2.body.token

    UID_FIO1 = res_fio1.body.user._id
    UID_OWN = res_own.body.user._id
    UID_ROR1 = res_ror1.body.user._id
    UID_ROR2 = res_ror2.body.user._id
    UID_FIO2 = res_fio2.body.user._id
    UID_FIO3 = res_fio3.body.user._id

    UID_MAR = res_mar.body.user._id

    const boxes = await request(app)
      .get("/api/box/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    
    BOX_1 = boxes.body[2]._id
    BOX_2 = boxes.body[1]._id
    BOX_3 = boxes.body[0]._id

    const events = await request(app)
    .get("/api/events/")
    .auth(TOKEN_FIO1, { type: "bearer" })
    .expect(200);
  
    EID_1 = events.body[2]._id
    EID_2 = events.body[1]._id
    EID_3 = events.body[0]._id
});

  it.skip("Successful box creation", async () => {
    const sampleInfo = {
        title: "TEST EVENT - 3"
    }

    const res = await request(app)
      .post("/api/box/")
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

  it("Unsuccessful box creation - missing title", async () => {
    const sampleInfo = {
      is_private: true
    }

    const res = await request(app)
      .post("/api/box/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .send(sampleInfo)
      .expect(400);

    expect(res.body.message).toEqual('Invalid Request: missing parameters.')
  });

  it("Successful getAllBoxes", async () => {

    const res = await request(app)
      .get("/api/box/")
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(3)
    expect(res.body[2]._id).toEqual(BOX_1)
    expect(res.body[1]._id).toEqual(BOX_2)
    expect(res.body[0]._id).toEqual(BOX_3)
  });

  it("Successful getAllBoxes - no boxes", async () => {

    const res = await request(app)
      .get("/api/box/")
      .auth(TOKEN_ROR2, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(0)
  });

  it("Successful getBoxById - by creator", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
    expect(res.body.creator_id).toEqual(UID_OWN)
  });

  it("Successful getBoxById - by member", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
    expect(res.body.members).toContain(UID_FIO1)
  });

  it.skip("Successful deleteBox - creator", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_3)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Box deleted by creator.")
  });

  it("Successful updateBox - member", async () => {
    const sampleInfoToUpdate = {
      title: "TEST BOX - 01"
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated box successfully.")
  });

  it("Successful addBoxMember - by creator", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/add/" + UID_ROR1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Successful addBoxMember - by member in open box", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_3 + "/members/add/" + UID_MAR)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Unsuccessful addBoxMember - member in private box", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_2 + "/members/add/" + UID_ROR2)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(401);

    expect(res.body.message).toEqual("Unauthorized action by a member: box is private.")
  });

  it("Successful deleteBoxMember - creator", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_3 + "/members/del/" +  UID_FIO3)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Member deleted successfully.")
  });

  it("Unsuccessful deleteBoxMember - member in private box", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_2 + "/members/del/" + UID_FIO2)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(401);

    expect(res.body.message).toEqual("Unauthorized action by a member: box is private.")
  });

  it("Successful addExistingEvent - by creator", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add/" + EID_1)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Event added to box successfully.")
  });

  it("Unsuccessful addExistingEvent - by member", async () => {
    
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add/" + EID_2)
      .auth(TOKEN_FIO1, { type: "bearer" })
      .expect(401);
  

    expect(res.body.message).toEqual("Unauthorized action: User does not own event.")
  });

  it("Unsuccessful addExistingEvent - event doesn't exist", async () => {
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add/" + FAKE_ID)
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(404);

    expect(res.body.message).toEqual("Event doesn't exist.")
  });

  it("Successful leaveBox - member", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_2 + "/members/leave")
      .auth(TOKEN_FIO2, { type: "bearer" });

    expect(res.body.message).toEqual("Left box successfully.")
  });

  it("Unsuccessful leaveBox - creator", async () => {

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/leave")
      .auth(TOKEN_OWN, { type: "bearer" })
      .expect(401);

    expect(res.body.message).toEqual("Creator cannot leave their own box.")
  });

  it("Successful addNewEvent", async () => {
    const sampleInfoToAdd = {
      title: "Test Event - 117"
    }

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/new")
      .auth(TOKEN_OWN, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("New event added successfully.")
  });

  it("Unsuccessful addNewEvent - missing title", async () => {
    const sampleInfoToAdd = {
      creator_id: UID_OWN
    }

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/new")
      .auth(TOKEN_OWN, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(400);

    expect(res.body.message).toEqual("Event title is required.")
  });
  




//   it("successful login", async () => {
//     const sampleLogin = {
//         phone_number: PHONE,
//         password: PASS
//     }
//     const res = await request(app).post("/api/user/login").send(sampleLogin);

//     expect(res.body.user.firstName).toEqual("Armaan3");
//     expect(res.body.user.lastName).toEqual("Punj3");
//     expect(res.body.user.phone_number).toEqual(PHONE)
//   });

//   it("unsuccessful login - wrong number", async () => {
//     const sampleLogin = {
//         phone_number: "401",
//         password: PASS
//     }
//     const res = await request(app).post("/api/user/login").send(sampleLogin);

//     expect(res.body.message).toEqual("User doesn't exist.");
//   });

//   it("unsuccessful login - wrong password", async () => {
//     const sampleLogin = {
//         phone_number: PHONE,
//         password: "testing"
//     }
//     const res = await request(app).post("/api/user/login").send(sampleLogin);

//     expect(res.body.message).toEqual("Incorrect password.");
//   });

//   it("unsuccessful login - missing parameters", async () => {
//     const sampleLogin = {
//         phone_number: PHONE,
//     }
//     const res = await request(app).post("/api/user/login").send(sampleLogin).expect(422)

//     console.log(res.body)
//     expect(res.body.error1).toEqual("Invalid login parameters.");
//   });
});