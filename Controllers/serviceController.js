const Service = require("../Models/serviceModel");

//! Create a new service
exports.createService = async (req, res) => {
  try {
    // Destructure fields from request body
    const { name, description, unit_price } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !unit_price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new Service instance with the provided data
    const newService = new Service({ name, description, unit_price });

    // Save the new service to the database
    await newService.save();

    // Respond with the created service and HTTP status 201 (Created)
    res.status(201).json(newService);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};

//! Get All Services

exports.getAllServices = async (req, res) => {
  try {
    // Fetch all services from the database
    const services = await Service.find({});

    // Respond with the list of services and HTTP status 200 (OK)
    res.status(200).json(services);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};

//! Get a Single Service

exports.getServiceById = async (req, res) => {
  try {
    // Fetch the service by its ID from the database
    const service = await Service.findById(req.params.id);

    // If the service was not found, respond with HTTP status 404 (Not Found)
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Respond with the found service and HTTP status 200 (OK)
    res.status(200).json(service);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};

//! Update a Service

exports.updateService = async (req, res) => {
  try {
    // Fetch the service by its ID from the database
    const service = await Service.findById(req.params.id);

    // If the service was not found, respond with HTTP status 404 (Not Found)
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Destructure fields from request body
    const { name, description, unit_price } = req.body;

    // Update the service's fields with the provided data
    service.name = name;
    service.description = description;
    service.unit_price = unit_price;

    // Save the updated service to the database
    await service.save();

    // Respond with the updated service and HTTP status 200 (OK)
    res.status(200).json(service);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};

//! Delete a Service
exports.deleteService = async (req, res) => {
  try {
    // Fetch the service by its ID from the database
    const service = await Service.findByIdAndDelete(req.params.id);

    // If the service was not found, respond with HTTP status 404 (Not Found)
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Respond with a success message and HTTP status 201
    res.status(201).json({ message: "Service deleted successfully" });
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};

//! Search a service

exports.searchService = async (req, res) => {
  try {
    // Destructure search query from request query parameters
    const { search } = req.query;

    // Use the search query to find services in the database
    const services = await Service.find({
      $text: { $search: search },
    });

    // Respond with the list of matching services and HTTP status 200 (OK)
    res.status(200).json(services);
  } catch (error) {
    // Handle any errors that occurred during the process
    res.status(500).json({ message: error.message });
  }
};
