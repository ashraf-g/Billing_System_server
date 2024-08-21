const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// import controllers
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  searchInvoice,
  overView,
  summary,
  getTopCustomers,
  getCustomerDemographics,
  getCustomerDistribution,
  getPendingPayments,
  getRepeatCustomers,
  getRecentPayments,
  getStatusDistribution,
  getTopServicesByRevenue,
} = require("../Controllers/invoiceController");

router.use(isAuthenticated);

// Create a new invoice
router.post("/invoice/create", createInvoice);

// Get all invoices
router.get("/invoice/getall", getAllInvoices);

// Get a single invoice by ID
router.get("/invoice/get/:id", getInvoiceById);

// Delete an invoice
router.delete("/invoice/delete/:id", deleteInvoice);

// Search invoices
router.get("/invoice/search", searchInvoice);

// Update an invoice
router.put("/invoice/update/:id", updateInvoice);

// Get invoice overviews
router.get("/invoice/overview", overView);

// Get invoice summary
router.get("/invoice/summary", summary);

// Get top customers
router.get("/invoice/getTopCustomers", getTopCustomers);

// Get customer demographics
router.get("/invoice/getCustomerDemographics", getCustomerDemographics);

// Get customer distribution
router.get("/invoice/getCustomerDistribution", getCustomerDistribution);

// Get pending payments
router.get("/invoice/getPendingPayments", getPendingPayments);

// Get repeat customers
router.get("/invoice/getRepeatCustomers", getRepeatCustomers);

// Get recent payments
router.get("/invoice/getRecentPayments", getRecentPayments);

// Get status distribution
router.get("/invoice/getStatusDistribution", getStatusDistribution);

// Get top services by revenue
router.get("/invoice/getTopServicesByRevenue", getTopServicesByRevenue);

module.exports = router;
