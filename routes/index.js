const express = require("express");
const progressRouter = require("./progress.router");
const categoriesRouter = require("./categories.router");
const certificationsRouter = require("./certifications.router");
const purchasesRouter = require("./purchases.router");
const coursesRouter = require("./courses.router");
const multimediaRouter = require("./multimedia.router");
const levelsRouter = require("./levels.router");
const reviewsRouter = require("./reviews.router");
const usersRouter = require("./users.router");

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api', router);

  router.use('/progress', progressRouter);
  router.use('/categories', categoriesRouter);
  router.use('/certifications', certificationsRouter);
  router.use('/purchases', purchasesRouter);
  router.use('/courses', coursesRouter);
  router.use('/multimedia', multimediaRouter);
  router.use('/levels', levelsRouter);
  router.use('/reviews', reviewsRouter);
  router.use('/users', usersRouter);
}

module.exports = routerApi;
