const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = router;

// import controllers
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  searchService,
} = require("../Controllers/serviceController");

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Create a new service
router.post("/service/create", createService);

// Get all services
router.get("/service/getall", getAllServices);

// Get a single service by ID
router.get("/service/get/:id", getServiceById);

// Update a service by ID
router.put("/service/update/:id", updateService);

// Delete a service by ID
router.delete("/service/delete/:id", deleteService);

// Search services by name or description
router.get("/service/search/:query", searchService);

// Add error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});
