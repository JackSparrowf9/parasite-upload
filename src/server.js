import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// import config
// import { PORT } from "@/config";
// import db from "@/database";
import app from "./app.js";
import { PORT } from "./config.js";
import db from "./database/index.js";

//routes import
// import LinkRouter from "@/routes/link.route";
// import SiteRouter from "@/routes/site.route";
// import CategoryRouter from "@/routes/category.route";
// import NicheRouter from "@/routes/niche.route";
// import TitleRouter from "@/routes/title.route";
// import ContentRouter from "@/routes/content.route";
// import UploadRouter from "@/routes/upload.route";
import LinkRouter from "./routes/link.route.js";
import SiteRouter from "./routes/site.route.js";
import CategoryRouter from "./routes/category.route.js";
import NicheRouter from "./routes/niche.route.js";
import TitleRouter from "./routes/title.route.js";
import ContentRouter from "./routes/content.route.js";
import UploadRouter from "./routes/upload.route.js";

// connect to database
db.connect();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.group("/api", (router) => {
  router.use("/link", LinkRouter);
  router.use("/site", SiteRouter);
  router.use("/category", CategoryRouter);
  router.use("/niche", NicheRouter);
  router.use("/title", TitleRouter);
  router.use("/content", ContentRouter);
  router.use("/upload", UploadRouter);
});

app.listen(PORT, async () => {
  console.log(`server running on Port http:127.0.0.1:${PORT}`);
});
