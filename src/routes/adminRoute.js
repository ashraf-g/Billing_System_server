module.exports = (app) => {
  const base_URL = require("../config/baseURL");

  const routes = require("express").Router();

  const admin = require("../controllers/adminController");

  routes.post("/admin/signup", admin.signUp);
  routes.post("/admin/login", admin.signIn);
  routes.put("/admin/update/:id", admin.updateAdmin);
  routes.put("/admin/change-password/:id", admin.changePassword);
  routes.post("/admin/send-otp", admin.sendOtp);
  routes.post("/admin/verify-otp", admin.verifyOtp);
  routes.put("/admin/reset-password", admin.resetPassword);

  app.use(base_URL, routes);
};
