import express from "express";
import {
  list,
  get,
  create,
  addBulk,
  update,
  remove,
} from "../controllers/link.controller.js";

const Router = express.Router();

Router.get("/", list);

Router.get("/:id", get);

Router.post("/create", create);

Router.post("/addBulk", addBulk);

Router.patch("/:id", update);

Router.delete("/:id", remove);

export default Router;
