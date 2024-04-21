import supertest from "supertest";
import app from "../../server";

const request = supertest(app);
describe("Test api orders", () => {
  let token: string;
  beforeAll(async () => {
    const loginRes = await request.post("/api/users/login").send({
      userName: "admin01",
      password: "1",
    });
    token = loginRes.body.token;
  });

  it("gets data order with token", async () => {
    const response = await request
      .get("/api/orders/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body?.length).toBeGreaterThan(0);
  });
});
