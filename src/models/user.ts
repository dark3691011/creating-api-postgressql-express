// @ts-ignore
import Client from "../database";
import bcrypt from "bcrypt";

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
      const sql = `SELECT user_name, first_name, last_name, id FROM ${this.dbName}`;

      const result = await conn.query(sql);

      conn.release();

      return result.rows?.map((e: any) => this.returnUser(e));
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User | null> {
    try {
      const sql = `SELECT id, first_name, last_name, user_name FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return this.returnUser(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find users ${id}. Error: ${err}`);
    }
  }

  async getByUserName(userName: string) {
    const sql = `SELECT * FROM ${this.dbName} WHERE user_name=($1)`;
    // @ts-ignore
    const conn = await Client.connect();
    const result = await conn.query(sql, [userName]);
    conn.release();
    const user = result?.rows?.[0];
    return this.returnUser(user);
  }

  async create(u: User): Promise<User | null> {
    try {
      const sql = `INSERT INTO ${this.dbName} (user_name, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *`;

      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));

      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [
        u.userName,
        u.firstName,
        u.lastName,
        hash,
      ]);

      const user = result.rows[0];

      conn.release();

      return this.returnUser(user);
    } catch (err: any) {
      throw new Error(err?.message);
    }
  }

  async authenticate(userName: string, password: string): Promise<User | null> {
    try {
      const sql = `SELECT * FROM ${this.dbName} WHERE user_name=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [userName]);

      conn.release();
      if (result.rows?.length > 0) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return this.returnUser(user);
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Could authen user ${userName}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      const sql = `DELETE FROM ${this.dbName} WHERE id=($1)`;
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return this.returnUser(user);
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  private returnUser(user: any) {
    if (!user) return null;
    const returnData: User = {
      id: user.id,
      userName: user.user_name,
      password: user.password,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    return returnData;
  }
}
