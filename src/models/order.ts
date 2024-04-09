// @ts-ignore
import Client from "../database";

export type Order = {
  id: number;
  productId: number[];
  userId: number;
  quantity: number;
  status: number;
};

export class OrderStore {
  dbName = "orders";
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = `SELECT * FROM ${this.dbName}`;

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = `SELECT * FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find orders ${id}. Error: ${err}`);
    }
  }

  async create(p: Order): Promise<Order> {
    try {
      const sql = `INSERT INTO ${this.dbName} (product_id, user_id, quantity, status ) VALUES($1, $2, $3, $4) RETURNING *`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [
        p.productId,
        p.userId,
        p.quantity,
        p.status,
      ]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = `DELETE FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
