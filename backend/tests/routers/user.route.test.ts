import request from "supertest";

import app from "../../src/app";

const PHONE = "410"
const PASS = "test"

describe("User Routes", () => {
  it("successful login", async () => {
    const sampleLogin = {
        phone_number: PHONE,
        password: PASS
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.user.firstName).toEqual("Armaan2");
    expect(res.body.user.lastName).toEqual("Punj2");
  });

  it("unsuccessful login - wrong number", async () => {
    const sampleLogin = {
        phone_number: "401",
        password: PASS
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.message).toEqual("User doesn't exist.");
  });

  it("unsuccessful login - wrong password", async () => {
    const sampleLogin = {
        phone_number: PHONE,
        password: "testing"
    }
    const res = await request(app).post("/api/user/login").send(sampleLogin);

    expect(res.body.message).toEqual("Incorrect password.");
  });
});