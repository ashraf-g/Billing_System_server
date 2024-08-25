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
  getPendingPayments,
  getRepeatCustomers,
  getRecentPayments,
  getTopServicesByRevenue,
  sendInvoice,
  getSentEmail,
  getUnSentEmail,
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

// Get pending payments
router.get("/invoice/getPendingPayments", getPendingPayments);

// Get repeat customers
router.get("/invoice/getRepeatCustomers", getRepeatCustomers);

// Get recent payments
router.get("/invoice/getRecentPayments", getRecentPayments);

// Get top services by revenue
router.get("/invoice/getTopServicesByRevenue", getTopServicesByRevenue);

// Send invoice by email
router.post("/invoice/sendInvoice/:id", sendInvoice);

// Get sent email
router.get("/invoice/getSentEmail", getSentEmail);

// Get unsent email
router.get("/invoice/getUnsentEmail", getUnSentEmail);

module.exports = router;
