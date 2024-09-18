const Invoice = require("../Models/invoiceModel");

const generateInvoiceNo = async () => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Count the number of invoices created in the current year
    const invoiceCount = await Invoice.countDocuments({
      issue_date: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1),
      },
    });

    // Function to generate the base invoice number
    const generateBaseInvoiceNumber = (count) => {
      return `INV-${currentYear}-${count.toString().padStart(4, "0")}`;
    };

    // Check if the generated invoice number already exists
    const checkInvoiceExists = async (invoiceNumber) => {
      return await Invoice.findOne({ invoice_number: invoiceNumber });
    };

    // Generate the initial invoice number
    let baseInvoiceNumber = generateBaseInvoiceNumber(invoiceCount + 1);
    let invoiceExists = await checkInvoiceExists(baseInvoiceNumber);

    // Append an alphabetic suffix if necessary
    let suffix = "";
    while (invoiceExists) {
      suffix = suffix ? String.fromCharCode(suffix.charCodeAt(0) + 1) : "A";
      if (suffix > "Z") {
        throw new Error("Exceeded possible suffix combinations.");
      }
      baseInvoiceNumber =
        generateBaseInvoiceNumber(invoiceCount + 1) + `-${suffix}`;
      invoiceExists = await checkInvoiceExists(baseInvoiceNumber);
    }

    return baseInvoiceNumber;
  } catch (err) {
    throw new Error(`Error generating invoice number: ${err.message}`);
  }
};

module.exports = { generateInvoiceNo };
