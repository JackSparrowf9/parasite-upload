import express from "express";

import {
  list,
  get,
  create,
  addBulk,
  removeByNiche,
  removeById,
} from "../controllers/title.controller.js";

const Router = express.Router();

Router.get("/", list);

Router.get("/:id", get);

Router.post("/create", create);

Router.post("/addBulk", addBulk);

Router.delete("/remove-by-niche/:niche", removeByNiche);

Router.delete("/remove-by-id/:id", removeById);

export default Router;
