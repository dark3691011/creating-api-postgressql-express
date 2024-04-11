import express, { Request, Response } from "express";
import { User, UserStore } from "../models";
import jwt from "jsonwebtoken";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      userName: req.body.userName,
    };

    const checkUser = await store.getByUserName(user.userName);
    if (checkUser) {
      return res.status(400).json({
        status: 400,
        message: "Username allready exist",
      });
    }

    const newUser = await store.create(user);
    const secret = process.env.TOKEN_SECRET || "";
    var token = jwt.sign({ user: newUser }, secret);
    res.json(token);
  } catch (err: any) {
    res.status(400).json({
      status: 400,
      message: err?.message,
    });
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.body.id);
  res.json(deleted);
};

const userRoutes = (app: express.Application) => {
  app.get("/users", index);
  app.get("/users/:id", show);
  app.post("/users", create);
  app.delete("/users/:id", destroy);
};

export default userRoutes;
