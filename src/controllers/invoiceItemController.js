const Invoice = require("../Models/invoiceModel");
const Service = require("../Models/serviceModel");
const { sendInvoiceEmail } = require("../Utils/mail");
const InvoiceItem = require("../Models/invoiceItemModel");

//add item to invoice

exports.addItemToInvoice = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const { service_id, quantity, total_price } = req.body;

    if (service_id || quantity || total_price) {
      return res.status(401).json({ message: "all fields are required" });
    }

    // Check if invoice exists
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Check if service exists
    const service = await Service.findById(service_id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const invoiceItem = new InvoiceItem({
      invoice_id,
      service_id,
      quantity,
      total_price,
    });

    // Save invoice
    await invoiceItem.save();
    res.json(invoiceItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// remove item from invoice
exports.removeItemFromInvoice = async (req, res) => {
  try {
    const { invoice_id, item_id } = req.params;

    // Check if invoice exists
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Remove item from invoice items array
    const updatedItems = invoice.items.filter(
      (item) => item._id.toString() !== item_id
    );
    invoice.items = updatedItems;

    // Save invoice
    await invoice.save();

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// update item in invoice

exports.updateItemInInvoice = async (req, res) => {
  try {
    const { invoice_id, item_id } = req.params;
    const { quantity, total_price } = req.body;

    // Check if invoice exists
    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Find the item in invoice items array
    const itemIndex = invoice.items.findIndex(
      (item) => item._id.toString() === item_id
    );

    // Update item if found
    if (itemIndex >= 0) {
      invoice.items[itemIndex].quantity = quantity;
      invoice.items[itemIndex].total_price = total_price;
    } else {
      return res.status(404).json({ message: "Item not found" });
    }
    // Save invoice
    await invoice.save();
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// exports.sendInvoiceEmail = async (req, res) => {
//   try {
//     const { invoice_id } = req.params;
//     const { invoicePDF } = req.file;

//     if (!invoice_id) {
//       return res.status(401).json({ message: "All fields are required" });
//     }

//     const invoice = await Invoice.findById(invoice_id);
//     if (!invoice) {
//       return res.status(404).json({ message: "Invoice not found" });
//     }

//     await sendInvoiceEmail(invoice, invoicePDF);
//     invoice.invoiceEmail = "sent";
//     await invoice.save();
//     res.json({ message: "Invoice sent successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.error(error);
//   }
// };
