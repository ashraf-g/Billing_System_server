const Invoice = require("../Models/invoiceModel");
const Service = require("../Models/serviceModel");
const InvoiceItem = require("../Models/invoiceItemModel");

//add item to invoice

exports.addItemToInvoice = async (req, res) => {
  try {
    const { invoice_id, service_id, quantity, total_price } = req.body;

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

    // Add item to invoice items array
    invoice.items.push({
      service_id,
      quantity,
      total_price,
    });

    // Save invoice
    await invoice.save();
    res.json(invoice);
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

// Generate invoice PDF
exports.generateInvoicePDF = async (req, res) => {
  try {
    const { invoice_id } = req.params;

    // Fetch the invoice and invoice items
    const invoice = await Invoice.findById(invoice_id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Calculate total price and tax
    // const totalPrice = invoice.items.reduce(
    //   (acc, item) => acc + item.total_price,
    //   0
    // );
    // const tax = totalPrice * 0.05;

    // Generate invoice PDF
    const pdf = await generateInvoicePDF(invoice);

    res.attachment("invoice.pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate invoice PDF function
const generateInvoicePDF = async (invoice, totalPrice, tax) => {
  const pdfDoc = await PDFDocument.create();

  // Add metadata
  pdfDoc.registerFont("Arial", "fonts/Arial.ttf");
  pdfDoc.registerFont("Helvetica", "fonts/Helvetica.ttf");

  // Set font size and alignment
  pdfDoc.font("Arial").fontSize(12);
  pdfDoc.text("Invoice", { align: "center" });
  pdfDoc.moveDown(0.5);

  // Add client details
  pdfDoc.font("Helvetica").fontSize(10);
  pdfDoc.text(`Client Name: ${invoice.client_id.name}`);
  pdfDoc.text(`Email: ${invoice.client_id.email}`);
  pdfDoc.text(`Address: ${invoice.client_id.address}`);
  pdfDoc.text(`Contact Number: ${invoice.client_id.contact_number}`);
  pdfDoc.moveDown(0.5);
  pdfDoc.lineSeparator();
  pdfDoc.moveDown(0.5);
  pdfDoc.text("Invoice Details", { align: "center" });
  pdfDoc.moveDown(0.5);
  pdfDoc.lineSeparator();
  pdfDoc.moveDown(0.5);
  pdfDoc.font("Helvetica").fontSize(8);
  pdfDoc.text(`Invoice Number: ${invoice.invoice_number}`);
  pdfDoc.text(`Date: ${invoice.invoice_date}`);
  pdfDoc.text(`Due Date: ${invoice.due_date}`);
  pdfDoc.moveDown(1);
  pdfDoc.lineSeparator();
  pdfDoc.moveDown(0.5);
  pdfDoc.text("Item", { width: 60, align: "center" });
  pdfDoc.text("Description", { width: 100, align: "center" });
  pdfDoc.text("Quantity", { width: 30, align: "center" });
  pdfDoc.text("Price", { width: 30, align: "center" });
  pdfDoc.text("Total", { width: 30, align: "center" });
  pdfDoc.moveDown(0.5);
  pdfDoc.lineSeparator();
  pdfDoc.moveDown(0.5);
  invoice.items.forEach((item) => {
    pdfDoc.text(`${item.service_id.name}`, { width: 60 });
    pdfDoc.text(`${item.description}`, { width: 100 });
    pdfDoc.text(`${item.quantity}`, { width: 30, align: "right" });
    pdfDoc.text(`${item.price}`, { width: 30, align: "right" });
    pdfDoc.text(`${item.total_price.toFixed(2)}`, {
      width: 30,
      align: "right",
    });
    pdfDoc.moveDown(0.5);
    pdfDoc.lineSeparator();
  });
  pdfDoc.moveDown(0.5);
  pdfDoc.lineSeparator();
  pdfDoc.moveDown(0.5);
  pdfDoc.font("Helvetica").fontSize(10);
  pdfDoc.text(`Subtotal: ${totalPrice.toFixed(2)}`);
  pdfDoc.text(`Tax: ${tax.toFixed(2)}`);
  pdfDoc.text(`Total: ${(totalPrice + tax).toFixed(2)}`);
  pdfDoc.moveDown(2);
  pdfDoc.font("Helvetica").fontSize(8);
  pdfDoc.text("Thank you for your business!");
  pdfDoc.moveDown(2);
  pdfDoc.text("This invoice is generated automatically.");
  pdfDoc.moveDown(2);
  pdfDoc.text("Please contact us if you have any questions.");
  pdfDoc.moveDown(2);
  pdfDoc.text("Best regards,");
  pdfDoc.text("Your Team");
  pdfDoc.end();
  return pdfDoc.outputSync();
  // Save the PDF buffer to a file
  // fs.writeFileSync("invoice.pdf", pdfDoc.outputSync());
};
