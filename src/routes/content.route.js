import express from "express";

import {
  list,
  get,
  create,
  remove,
  addBulk,
} from "../controllers/content.controller.js";

const Router = express.Router();

Router.get("/", list);

Router.get("/:id", get);

Router.post("/create", create);

Router.post("/addBulk", addBulk);

Router.delete("/:id", remove);

export default Router;
