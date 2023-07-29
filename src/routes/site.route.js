import express from "express";

import {
  list,
  get,
  create,
  update,
  remove,
} from "../controllers/site.controller.js";

const Router = express.Router();

Router.get("/", list);

Router.get("/:id", get);

Router.post("/create", create);

Router.patch("/:id", update);

Router.delete("/:id", remove);

export default Router;
