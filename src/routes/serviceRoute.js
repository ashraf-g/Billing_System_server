module.exports = (app) => {
  const base_URL = require("../config/baseURL");

  const routes = require("express").Router();

  const service = require("../controllers/serviceController");
  const isAuth = require("../middleware/authMiddleware");

  routes.use(isAuth);

  routes.post("/service/create", service.createService);
  routes.get("/service/getall", service.getAllServices);
  routes.get("/service/get/:id", service.getServiceById);
  routes.put("/service/update/:id", service.updateService);
  routes.delete("/service/delete/:id", service.deleteService);
  routes.get("/service/search", service.searchService);

  app.use(base_URL, routes);
};
