// @ts-ignore
import Client from "../database";
import { User } from "./user";

export type Order = {
  id: number;
  userId: number;
  status: StatusOrder;
};

enum StatusOrder {
  ACTIVE = 1,
  COMPLETE = 2,
}

export interface OrderRes {
  id: number;
  status: StatusOrder;
  user: User;
  details: Detail[];
}

export interface Detail {
  id: number;
  name: string;
  quantity: number;
  price: string;
  orderId: number;
  productId: number;
}

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

  async findByUserId(userId: string): Promise<OrderRes> {
    try {
      const sql = `SELECT
            o.id,
            o.status,
            json_build_object(
              'id', u.id,
              'userName', u.user_name,
              'firstName', u.first_name,
              'lastName', u.last_name
            ) AS user
          FROM orders o
          INNER JOIN users u ON u.id = o.user_id
          WHERE o.user_id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();
      const result = [];
      const queryOrder = await conn.query(sql, [userId]);
      if (queryOrder.rows?.length > 0) {
        const sqlOrderDetails = `SELECT o.id, o.order_id , o.quantity, p.name, p.price, p.id as product_id
        FROM order_details o
        INNER JOIN products p ON p.id = o.product_id
        WHERE o.order_id IN ('${queryOrder.rows.map((e: Order) => e.id).join("','")}')`;
        const queryDetails = await conn.query(sqlOrderDetails);
        const details = queryDetails.rows?.map((e: any) => {
          return {
            id: e.id,
            name: e.name,
            quantity: e.quantity,
            price: e.price,
            orderId: e.order_id,
            productId: e.product_id,
          };
        });

        for (let item of queryOrder.rows) {
          result.push({
            ...item,
            details: details?.filter(
              (detail: any) => detail.orderId === item.id
            ),
          });
        }
      }

      conn.release();

      return result as unknown as OrderRes;
    } catch (err) {
      throw new Error(`Could not find orders of user ${userId}. Error: ${err}`);
    }
  }

  async create(p: Order): Promise<Order> {
    try {
      const sql = `INSERT INTO ${this.dbName} ( user_id,  status ) VALUES($1, $2) RETURNING *`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [p.userId, p.status]);

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
