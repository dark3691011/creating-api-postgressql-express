// @ts-ignore
import Client from "../database";

export type OrderDetail = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
};

export class OrderDetailStore {
  dbName = "order_details";
  async index(): Promise<OrderDetail[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = `SELECT * FROM ${this.dbName}`;

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get order details. Error: ${err}`);
    }
  }
}
