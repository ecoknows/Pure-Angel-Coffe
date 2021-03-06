import express from "express";

const UtilsRouter = express.Router();

UtilsRouter.use(express.json());
UtilsRouter.use(express.urlencoded({ extended: true }));

UtilsRouter.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

export default UtilsRouter;
