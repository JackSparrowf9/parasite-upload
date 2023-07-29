import express from "express";

import { uploadNewPdf } from "../controllers/upload.controller.js";

const Router = express.Router();

Router.post("/newpdf", uploadNewPdf);

export default Router;
