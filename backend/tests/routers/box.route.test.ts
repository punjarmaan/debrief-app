import request from "supertest";
import app from "../../src/server";

require('dotenv').config();


describe("Box Routes", () => {

  let TOKEN_XIA;
  let TOKEN_ARM;
  let TOKEN_SHA;
  let UID_ARM;
  let UID_XIA;
  let UID_SHA;
  let UID_JOS;
  let UID_MAT;
  let EID_1;
  let EID_2;
  let EID_3;
  let BOX_1;
  let BOX_2
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

    const sampleLogin_MAT = {
      phone_number: process.env.MAT_PHONE,
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

    const res_mat = await request(app)
    .post("/api/user/login")
    .send(sampleLogin_MAT)
    .expect(200);
    
    TOKEN_XIA = res_xia.body.token
    TOKEN_ARM = res_arm.body.token
    TOKEN_SHA = res_sha.body.token

    UID_XIA = res_xia.body.user._id
    UID_ARM = res_arm.body.user._id
    UID_SHA = res_sha.body.user._id
    UID_JOS = res_jos.body.user._id
    UID_MAT = res_mat.body.user._id

    const boxes = await request(app)
      .get("/api/box/")
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    
    BOX_1 = boxes.body[0]._id
    BOX_2 = boxes.body[1]._id
    BOX_3 = boxes.body[2]._id

    const events = await request(app)
    .get("/api/events/")
    .auth(TOKEN_ARM, { type: "bearer" })
    .expect(200);
  
    EID_1 = events.body[0]._id
    EID_2 = events.body[1]._id
    EID_3 = events.body[2]._id
});

  it.skip("Successful box creation", async () => {
    const sampleInfo = {
        title: "TEST EVENT - 3"
    }

    const res = await request(app)
      .post("/api/box/")
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

    const res = await request(app)
      .post("/api/box/")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfo)
      .expect(400);

    expect(res.body.message).toEqual('Invalid Request: missing parameters.')
  });

  it("Successful getAllBoxes", async () => {

    const res = await request(app)
      .get("/api/box/")
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(3)
    expect(res.body[0]._id).toEqual(BOX_1)
    expect(res.body[1]._id).toEqual(BOX_2)
    expect(res.body[2]._id).toEqual(BOX_3)
  });

  it("Successful getAllBoxes - no boxes", async () => {

    const res = await request(app)
      .get("/api/box/")
      .auth(TOKEN_SHA, { type: "bearer" })
      .expect(200);

    expect(res.body).toHaveLength(0)
  });

  it("Successful getBoxById - by creator", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
    expect(res.body.creator_id).toEqual(UID_ARM)
  });

  it("Successful getBoxById - by member", async () => {

    const res = await request(app)
      .get("/api/box/" + BOX_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .expect(200);

    expect(res.body._id).toEqual(BOX_1)
  });

  it.skip("Successful deleteBox - creator", async () => {

    const res = await request(app)
      .delete("/api/box/" + BOX_3)
      .auth(TOKEN_ARM, { type: "bearer" })
      .expect(200);

    expect(res.body.message).toEqual("Box deleted by creator.")
  });

  it("Successful updateBox - member", async () => {
    const sampleInfoToUpdate = {
      title: "TEST BOX - 1"
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1)
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToUpdate)
      .expect(200);

    expect(res.body.message).toEqual("Updated box successfully.")
  });

  it.skip("Successful addBoxMember - by creator", async () => {

    const sampleInfoToAdd = {
      new_mem_id: UID_SHA
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it.skip("Successful addEventMember - by member", async () => {

    const sampleInfoToAdd = {
      new_mem_id: UID_MAT
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/add")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member added successfully.")
  });

  it("Unsuccessful addBoxMember - user doesn't exist", async () => {

    const sampleInfoToAdd = {
      new_mem_id: "660715c577d51356d7e0043c"
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(404);

    expect(res.body.message).toEqual("User doesn't exist.")
  });

  it("Unsuccessful addBoxMember - private box", async () => {

    const sampleInfoToAdd = {
        new_mem_id: UID_XIA
      }
    const res = await request(app)
      .put("/api/box/" + BOX_2 + "/members/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(405);

    expect(res.body.message).toEqual("Box is private.")
  });

  it("Successful deleteBoxMember - creator", async () => {

    const sampleInfoToAdd = {
      del_mem_id: UID_JOS
    }

    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/members/del")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Member deleted successfully.")
  });

  it("Successful addExistingEvent - by creator", async () => {

    const sampleInfoToAdd = {
      new_event_id: EID_1
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Event added to box successfully.")
  });

  it("Successful addExistingEvent - by member", async () => {

    const sampleInfoToAdd = {
      new_event_id: EID_3
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add")
      .auth(TOKEN_XIA, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(200);

    expect(res.body.message).toEqual("Event added to box successfully.")
  });

  it("Unsuccessful addExistingEvent - event doesn't exist", async () => {

    const sampleInfoToAdd = {
      new_event_id: "660715c577d51356d7e0043b"
    }
    const res = await request(app)
      .put("/api/box/" + BOX_1 + "/add")
      .auth(TOKEN_ARM, { type: "bearer" })
      .send(sampleInfoToAdd)
      .expect(404);

    expect(res.body.message).toEqual("Event doesn't exist.")
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