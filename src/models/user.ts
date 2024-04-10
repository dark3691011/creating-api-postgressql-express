// @ts-ignore
import Client from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export type User = {
  id?: number;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
};

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS || "10";

export class UserStore {
  dbName = "users";
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = `SELECT * FROM ${this.dbName}`;

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = `SELECT * FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find users ${id}. Error: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql = `INSERT INTO ${this.dbName} (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *`;

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));

      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [u.firstName, u.lastName, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not add new user ${u.firstName} ${u.lastName}. Error: ${err}`
      );
    }
  }

  async authenticate(userName: string, password: string): Promise<User | null> {
    try {
      const sql = `SELECT password FROM ${this.dbName} WHERE user_name=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [userName]);

      conn.release();
      if (result.rows?.length > 0) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Could authen user ${userName}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = `DELETE FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
