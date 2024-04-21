import { ProductStore } from "../product";

const store = new ProductStore();

describe("Product Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result?.length).toBeGreaterThan(0);
  });
});
