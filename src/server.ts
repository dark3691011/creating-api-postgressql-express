import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import productRoutes from "./handlers/product.route";
import userRoutes from "./handlers/user.route";
import orderRoutes from "./handlers/order.route";

const app: express.Application = express();
const address: string = "http://127.0.0.1:3000/";

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
