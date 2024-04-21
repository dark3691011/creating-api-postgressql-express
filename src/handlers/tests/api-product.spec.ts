import supertest from "supertest";
import app from "../../server";

const request = supertest(app);
describe("Test api products", () => {
  let token: string;
  beforeAll(async () => {
    const loginRes = await request.post("/api/users/login").send({
      userName: "admin01",
      password: "1",
    });
    token = loginRes.body.token;
  });

  it("api/products", async () => {
    const response = await request.get("/api/products");
    expect(response.status).toEqual(200);
    expect(response.body?.length).toBeGreaterThan(0);
  });

  it("api/products/:id", async () => {
    const response = await request.get("/api/products/1");
    expect(response.status).toEqual(200);
  });

  it("api/products", async () => {
    const response = await request
      .post("/api/products")
      .send({
        name: "Red T-Shirt",
        price: "19.99",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });
});
