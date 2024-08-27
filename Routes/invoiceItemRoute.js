const express = require("express");

const router = express.Router();

//import controller
const {
  addItemToInvoice,
  removeItemFromInvoice,
  updateItemInInvoice,
  sendInvoiceEmail,
} = require("../Controllers/invoiceItemController");

const isAuthenticated = require("../middleware/authMiddleware");

router.use(isAuthenticated);

// Add item to invoice

router.post("/invoice/:invoice_id/addItem", addItemToInvoice);

// Remove item from invoice

router.delete("/invoice/:invoice_id/removeItem/:itemId", removeItemFromInvoice);

// Update item in invoice

router.put("/invoice/:invoice_id/updateItem/:itemId", updateItemInInvoice);

// Send invoice email
// router.post("/invoice/:invoice_id/sendEmail", sendInvoiceEmail);

module.exports = router;
