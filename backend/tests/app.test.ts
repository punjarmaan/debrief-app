import request from "supertest";
import app from "../src/app"
// import server from "../src/server";

describe("Test app.ts", () => {
  it("Catch-all route", async () => {
    const res = await request(app).get("/");
    console.log(res.body)
    expect(res.body.message).toEqual("Pong");
  });
});

