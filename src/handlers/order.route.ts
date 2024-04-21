import express, { Request, Response } from "express";
import { verifyAuthToken } from "../middlewares/auth";
import { OrderStore } from "../models";

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.findByUserId(req.params.user_id);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error?.message,
    });
  }
};

const orderRoutes = (app: express.Router) => {
  app.get("/orders/:user_id", verifyAuthToken, show);
};

export default orderRoutes;
