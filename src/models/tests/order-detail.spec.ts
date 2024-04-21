import { OrderDetailStore } from "../order-detail";

const store = new OrderDetailStore();

describe("Order Detail Model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of order details", async () => {
    const result = await store.index();
    expect(result?.length).toBeGreaterThan(0);
  });
});
