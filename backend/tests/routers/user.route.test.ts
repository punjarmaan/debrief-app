import request from "supertest";

import app from "../../src/server";
require('dotenv').config();

const PHONE = process.env.OWN_PHONE
const PASS = process.env.LOGIN_PASS

describe("User Routes", () => {
  it.skip("successful user creation", async () => {
    const sampleInfo = {
        firstName: "John",
        lastName: "Doe",
        username: "test1",
        password: "test",
        phone_extension: "+1",
        phone_number: "0000000001"
    }
    const res = await request(app).post("/api/user/create").send(sampleInfo).expect(201);

    expect(res.body.message).toEqual("User created successfully.")
  });

  it("unsuccessful user creation - existing username", async () => {
    const sampleInfo = {
        firstName: "John",
        lastName: "Doe",
        username: "owen",
        password: "test",
        phone_extension: "+1",
        phone_number: "919"

    }
    const res = await request(app).post("/api/user/create").send(sampleInfo).expect(409);

    expect(res.body.error).toEqual("Username already exists.")
  });

  it("unsuccessful user creation - invalid password", async () => {
    const sampleInfo = {
        firstName: "John",
        lastName: "Doe",
        username: "owen117",
        password: "",
        phone_extension: "+1",
        phone_number: "919"

    }
    const res = await request(app).post("/api/user/create").send(sampleInfo).expect(401);

    expect(res.body.error).toEqual("Invalid password.")
  });


  it("successful login", async () => {
    const sampleLogin = {
        phone_number: PHONE,
        password: PASS
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.user.firstName).toEqual("Owen");
    expect(res.body.user.lastName).toEqual("Owner");
    expect(res.body.user.phone_number).toEqual(PHONE)
  });

  it("unsuccessful login - wrong number", async () => {
    const sampleLogin = {
        phone_number: "000",
        password: PASS
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.message).toEqual("User doesn't exist.");
  });

  it("unsuccessful login - wrong password", async () => {
    const sampleLogin = {
        phone_number: PHONE,
        password: "test1234"
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.message).toEqual("Incorrect password.");
  });

  it("unsuccessful login - missing parameters", async () => {
    const sampleLogin = {
        phone_number: PHONE,
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin).expect(422)

    expect(res.body.message).toEqual("Missing phone number or password.");
  });
});