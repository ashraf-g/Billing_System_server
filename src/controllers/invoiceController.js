const Invoice = require("../Models/invoiceModel");
const Payment = require("../Models/paymentModel");
const InvoiceItem = require("../Models/invoiceItemModel");
const { generateInvoiceNo } = require("../Utils/genrateInvoiceNo");
const { sendInvoice } = require("../Utils/mail");

exports.createInvoice = async (req, res) => {
  try {
    const { name, email, address, contact_number } = req.body;
    const invoiceNo = await generateInvoiceNo();
    const issue_date = Date.now();

    // Validate request fields
    if (!name || !email || !address || !contact_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new invoice instance
    const newInvoice = new Invoice({
      invoice_number: invoiceNo,
      issue_date,
      customer: {
        name,
        email,
        address,
        contact_number,
      },
    });

    // Create a new invoice
    await newInvoice.save();
    // Send invoice email
    // await sendInvoice(invoiceNo, email);
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoiceNo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params; // Use req.params to get the route parameter
    const updates = req.body; // Get the update data from the request body

    // Validate that `id` is provided
    if (!id) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }
    const invoice = await Invoice.findOneAndUpdate(
      { _id: id }, // Search by the invoice ID
      updates, // Update with the provided data
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchInvoice = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the query parameter
    if (!query) {
      return res.status(400).json({
        error: "Query parameter is required",
      });
    }

    // Determine the search criteria
    const searchCriteria = {
      $or: [
        { invoice_number: { $regex: query, $options: "i" } },
        { "customer.name": { $regex: query, $options: "i" } },
      ],
    };

    // Search for the invoice(s)
    const invoices = await Invoice.find(searchCriteria);

    if (invoices.length === 0) {
      return res.status(404).json({ error: "No invoices found" });
    }

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//overview general
exports.overView = async (req, res) => {
  try {
    // Get total sales, income, and number of invoices
    const invoiceData = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total_amount" },
          invoiceCount: { $count: {} },
        },
      },
    ]);
    const paymentData = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: "$amount" },
        },
      },
    ]);
    const totalAmount = invoiceData[0]?.totalAmount || 0;
    const invoiceCount = invoiceData[0]?.invoiceCount || 0;
    const totalPayments = paymentData[0]?.totalPayments || 0;
    const outstandingPayments = totalAmount - totalPayments;

    res.json({
      total_sales: totalAmount,
      income: totalPayments,
      number_of_invoices: invoiceCount,
      outstanding_payments: outstandingPayments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopServicesByRevenue = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Aggregate revenue by service
    const topServices = await InvoiceItem.aggregate([
      {
        $lookup: {
          from: "invoices",
          localField: "invoice_id",
          foreignField: "_id",
          as: "invoice",
        },
      },
      { $unwind: "$invoice" },
      {
        $match: {
          "invoice.status": "paid", // Only consider paid invoices
        },
      },
      {
        $group: {
          _id: "$service_id",
          totalRevenue: { $sum: "$total_price" },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $sort: { totalRevenue: -1 },
      },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          serviceName: "$service.name",
          totalRevenue: 1,
        },
      },
    ]);

    res.json(topServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentPayments = async (req, res) => {
  try {
    // Set the number of recent payments to fetch (e.g., 10)
    const limit = parseInt(req.query.limit) || 10;

    // Fetch recent payments with sorting and limit
    const recentPayments = await Payment.find()
      .sort({ payment_date: -1 }) // Sort by payment_date in descending order
      .limit(limit)
      .exec();

    res.json(recentPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    // Aggregate invoices with pending payments
    const pendingInvoices = await Invoice.aggregate([
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "invoice_id",
          as: "payments",
        },
      },
      {
        $addFields: {
          totalPaid: {
            $sum: {
              $map: {
                input: "$payments",
                as: "payment",
                in: "$$payment.amount",
              },
            },
          },
        },
      },
      {
        $addFields: {
          amountDue: {
            $subtract: ["$total_amount", "$totalPaid"],
          },
        },
      },
      {
        $match: {
          $expr: {
            $gt: ["$amountDue", 0], // Filter invoices with amount due
          },
          status: "pending", // Consider only pending invoices
        },
      },
      {
        $project: {
          _id: 1,
          invoice_number: 1,
          issue_date: 1,
          due_date: 1,
          total_amount: 1,
          totalPaid: 1,
          amountDue: 1,
        },
      },
    ]);

    res.json(pendingInvoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRepeatCustomers = async (req, res) => {
  try {
    // Define the time frame to consider recent purchases (e.g., last 12 months)
    const recentDateThreshold = new Date();
    recentDateThreshold.setMonth(recentDateThreshold.getMonth() - 12);

    // Aggregate data to classify customers as repeat or new
    const customerClassification = await Invoice.aggregate([
      {
        $group: {
          _id: "$customer.email", // Use a unique identifier for customers
          firstPurchaseDate: { $min: "$issue_date" },
          lastPurchaseDate: { $max: "$issue_date" },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          firstPurchaseDate: 1,
          lastPurchaseDate: 1,
          totalPurchases: 1,
          isRepeatCustomer: {
            $cond: [
              { $gte: ["$lastPurchaseDate", recentDateThreshold] }, // Recent purchase in the last 12 months
              true,
              false,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$isRepeatCustomer",
          customers: {
            $push: {
              email: "$email",
              firstPurchaseDate: "$firstPurchaseDate",
              lastPurchaseDate: "$lastPurchaseDate",
              totalPurchases: "$totalPurchases",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 }, // Sort to ensure true (repeat) customers come first
      },
    ]);

    res.json(customerClassification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    console.log(invoice);
    await sendInvoice(invoice);
    invoice.invoiceEmail = "sent";
    await invoice.save();
    res.json({ message: "Invoice sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSentEmail = async (req, res) => {
  try {
    const invoices = await Invoice.find({ invoiceEmail: "sent" });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnSentEmail = async (req, res) => {
  try {
    const invoices = await Invoice.find({ invoiceEmail: { $ne: "sent" } });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
