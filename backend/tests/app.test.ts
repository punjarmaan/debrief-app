import request from "supertest";
import app from "../src/server"
// import server from "../src/server";
require('dotenv').config();

describe("Test server.ts", () => {
  it("Catch-all route", async () => {
    const res = await request(app).get("/");
    expect(res.body.message).toEqual("Pong");
  });
});

