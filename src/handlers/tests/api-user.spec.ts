import supertest from "supertest";
import app from "../../server";

const request = supertest(app);
describe("Test api users", () => {
  let token: string;
  beforeAll(async () => {
    const loginRes = await request.post("/api/users/login").send({
      userName: "admin01",
      password: "1",
    });
    token = loginRes.body.token;
  });

  it("api/users", async () => {
    const response = await request
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });

  it("api/users/:id", async () => {
    const response = await request
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });

  it("api/users/:id", async () => {
    const response = await request
      .post("/api/users")
      .send({
        userName: "admin09",
        firstName: "Admin",
        lastName: "01",
        password: "1",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });
});
