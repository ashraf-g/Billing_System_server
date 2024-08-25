const express = require("express");

const router = express.Router();

//import controller
const {
  addItemToInvoice,
  removeItemFromInvoice,
  updateItemInInvoice,
  generateInvoicePDF,
} = require("../Controllers/invoiceItemController");

const isAuthenticated = require("../middleware/authMiddleware");

router.use(isAuthenticated);

// Add item to invoice

router.post("/invoice/:invoiceId/addItem", addItemToInvoice);

// Remove item from invoice

router.delete("/invoice/:invoiceId/removeItem/:itemId", removeItemFromInvoice);

// Update item in invoice

router.put("/invoice/:invoice_id/updateItem/:itemId", updateItemInInvoice);

// Generate invoice PDF

router.get("/invoice/:invoice_id/pdf", generateInvoicePDF);

module.exports = router;
