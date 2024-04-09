import request from "supertest";
import app from "../../src/server";
import { EventInfo } from "../../src/types/index"
require('dotenv').config();

const SAMPLE_UID_ARM = process.env.TEST_UID_ARM
const SAMPLE_UID_XIA = process.env.TEST_UID_XIA
const SAMPLE_UID_JOS = process.env.TEST_UID_JOS
const SAMPLE_UID_MAT = process.env.TEST_UID_MAT
const W_SAMPLE_UID = process.env.W_TEST_UID
const SAMPLE_EID = process.env.TEST_EID
const W_SAMPLE_EID = process.env.W_TEST_EID


describe("Event Routes", () => {

  let TOKEN_XIA;
  let TOKEN_ARM;
  let TOKEN_SHA;

  beforeAll(async () => {
  const sampleLogin_ARM = {
      phone_number: "420",
      password: "test"
  }
  const sampleLogin_XIA = {
      phone_number: "2",
      password: "0000"
  }

  const sampleLogin_SHA = {
    phone_number: "0",
    password: "0000"
  }
  
  const res_xia = await request(app)
      .post("/api/user/login")
      .send(sampleLogin_XIA)
      .expect(200);

  const res_arm = await request(app)
      .post("/api/user/login")
      .send(sampleLogin_ARM)
      .expect(200);

  const res_sha = await request(app)
  .post("/api/user/login")
  .send(sampleLogin_SHA)
  .expect(200);
  
  TOKEN_XIA = res_xia.body.token
  TOKEN_ARM = res_arm.body.token
  TOKEN_SHA = res_sha.body.token
  
});

  it.skip("Successful event creation", async () => {
    const sampleInfo: EventInfo = {
        title: "TEST EVENT"
    }

    const res = await request(app)
      .post("/api/events/")
      .auth(TOKEN_XIA, { type: "bearer" })
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
    console.log(TOKEN_XIA)
    console.log(TOKEN_ARM)
    const res = await request(app)
      .post("/api/events/")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfo)
      .expect(400);

    expect(res.body.message).toEqual('Event title is required.')
  });

  it("Successful getAllEvents", async () => {

    const res = await request(app)
      .get("/api/events/")
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(1)
    expect(res.body[0]._id).toEqual(SAMPLE_EID)
  });

  it("Successful getAllEvents - no events", async () => {

    const res = await request(app)
      .get("/api/events/")
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(0)
  });

  it("Successful getEventById - by creator", async () => {

    const res = await request(app)
      .get("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(SAMPLE_EID)
    expect(res.body.creator_id._id).toEqual(SAMPLE_UID_XIA)
  });

  it("Successful getEventById - by member", async () => {

    const res = await request(app)
      .get("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);


    expect(res.body._id).toEqual(SAMPLE_EID)
    expect(res.body.members).toContainEqual({
      _id: SAMPLE_UID_ARM, 
      firstName: "Armaan",
      lastName: "Punj",
      username: "armaan!"
    })
  });

  it.skip("Successful deleteEvent - creator", async () => {

    const res = await request(app)
      .delete("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Event deleted by creator.")
  });

  it("Unuccessful deleteEvent - member", async () => {

    const res = await request(app)
      .delete("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(401);

    expect(res.body.message).toEqual("Unauthorized action: user does not own event.")
  });

  it.skip("Successful updateEvent - creator", async () => {
    const sampleInfoToUpdate = {
      title: "TEST EVENT"
    }
    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated event successfully.")
  });

  it("Successful updateEvent - member", async () => {
    const sampleInfoToUpdate = {
      title: "TEST EVENT"
    }
    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID)
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated event successfully.")
  });

  it("Successful addEventMember - creator", async () => {

    const sampleInfoToAdd = {
      new_mem_id: SAMPLE_UID_JOS
    }
    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID + "/members/add")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Successful addEventMember - member", async () => {

    const sampleInfoToAdd = {
      new_mem_id: SAMPLE_UID_MAT
    }
    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID + "/members/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Successful deleteEventMember - creator", async () => {

    const sampleInfoToAdd = {
      del_mem_id: SAMPLE_UID_JOS
    }

    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID + "/members/del")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member deleted successfully.")
  });

  it("Unsuccessful deleteEventMember - member", async () => {

    const sampleInfoToAdd = {
      del_mem_id: SAMPLE_UID_MAT
    }

    const res = await request(app)
      .put("/api/events/" + SAMPLE_EID + "/members/del")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(401);

    expect(res.body.message).toEqual("Unauthorized action: User does not own event.")
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
//     expect(res.body.error).toEqual("Invalid login parameters.");
//   });
});