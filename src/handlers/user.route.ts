import express, { Request, Response } from "express";
import { User, UserStore } from "../models";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../middlewares/auth";

const store = new UserStore();
const secret = process.env.TOKEN_SECRET || "";

type UserRes = Omit<User, "password">;

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error?.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        status: 404,
        message: "Username and password is require",
      });
    }

    const user: User | null = await store.authenticate(userName, password);

    if (user) {
      const token = jwt.sign({ user: user }, secret);
      const returnUser: UserRes = {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id,
      };
      return res.status(200).json({
        token,
        user: returnUser,
      });
    }
    return res.status(400).json({
      status: 404,
      message: "Username or password is invalid",
    });
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err?.message,
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      userName: req.body.userName,
    };

    if (!user.userName || !user.password) {
      return res.status(400).json({
        status: 404,
        message: "Username and password is require",
      });
    }

    const checkUser = await store.getByUserName(user.userName);
    if (checkUser) {
      return res.status(400).json({
        status: 400,
        message: "Username allready exist",
      });
    }

    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, secret);
    res.json(token);
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err?.message,
    });
  }
};

const userRoutes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", register);
  app.post("/users/login", login);
};

export default userRoutes;
