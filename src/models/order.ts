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

  async findByUserId(userId: string): Promise<Order> {
    try {
      const sql = `
        SELECT
          row_to_json(o) AS order
        FROM (
          SELECT
            o.id,
            o.product_id,
            o.quantity,
            o.status,
            json_build_object(
              'id', u.id,
              'firstName', u.first_name,
              'lastName', u.last_name,
              'userName', u.user_name
            ) AS user
          FROM users u
          INNER JOIN orders o ON u.id = o.user_id
          WHERE o.user_id=($1)
        ) AS o;
      `;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [userId]);
      const listOrders = result.rows?.map((e: any) => e?.order);
      conn.release();

      const productId = listOrders?.reduce((final: any, curr: any) => {
        return final.push(curr?.product_id);
      }, []);

      return listOrders;
    } catch (err) {
      throw new Error(`Could not find orders of user ${userId}. Error: ${err}`);
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
