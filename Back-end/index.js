require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');





const app = express();
app.use(express.json()); 

app.use(cors());

// Alternatively, enable CORS for a specific domain (replace with your frontend URL)
app.use(cors({
  origin: 'https://edviron-school-dashboard.vercel.app/', // replace with the frontend URL or "*" for all origins
}));// Middleware to parse incoming JSON data

// Define the student schema
const studentSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // The unique ID for the student
    school_id: { type: String, required: true }, // School ID field
    trustee_id: { type: String, required: true }, // Trustee ID field
    gateway: { type: String, required: true }, // The payment gateway used (e.g., "CASHFREE")
    order_amount: { type: Number, required: true }, // The order amount
    custom_order_id: { type: String, required: true }, // The custom order ID associated with the transaction
    institute_name: { type: String, required: true }, // The name of the institute
    date_time: { type: Date, required: true }, // The transaction date and time
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // The unique ID for the transaction
  collect_id: { type: String, required: true }, // The collect ID field
  status: { type: String, required: true }, // The status of the transaction (e.g., "SUCCESS")
  payment_method: { type: String, required: true }, // The payment method (e.g., "upi")
  gateway: { type: String, required: true }, // The payment gateway used (e.g., "CASHFREE")
  transaction_amount: { type: Number, required: true }, // The transaction amount
  bank_reference: { type: String, required: true } // The bank reference
}, { timestamps: true });


// Create the Student model, specifying 'student' as the collection name
const Student = mongoose.model('Student', studentSchema, 'student');  // 'student' is the collection name
const Transaction = mongoose.model('Transactions', transactionSchema,"transactions");

const uri = process.env.MONGO_URI;

// MongoDB connection setup
const connectDB = async () => {
    

    mongoose
      .connect(uri)
      .then(() => {
        console.log('MongoDB connected successfully');
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error);
      });
};

// Call connectDB to connect to the database
connectDB();






//Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};









// Define routes
app.get('/transactions', async (req, res) => {

  
  try {
  
    // Fetch transactions with the required fields
    const transactions = await Transaction.find().select('collect_id gateway transaction_amount status');
   
    const myCheck = transactions.filter((eachItem) =>{
      return eachItem.collect_id === "6730d9b926c65c39b0ee0149"
    })
    console.log(`--------------------${myCheck}`)

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }
     console.log("-----------------------------------")
    // Enrich transactions with corresponding student details
    const enrichedTransactions = await Promise.all(
      transactions.map(async (eachItem) => {
        console.log(eachItem)
        // Fetch the student details based on collect_id
        const student = await Student.findOne({ _id: eachItem.collect_id })
       
        console.log(student)

        return {
          collect_id: eachItem.collect_id,
          school_id: student ? student.school_id : 'N/A',
          institute_name: student ? student.institute_name: 'N/A',
          date_time: student ? student.date_time: new Date(),
          gateway: eachItem.gateway,
          order_amount: student ? student.order_amount : 'N/A', // Assuming order_amount is in the Student model
          transaction_amount: eachItem.transaction_amount,
          status: eachItem.status,
          custom_order_id: student ? student.custom_order_id : 'N/A',
        };
      })
    );

    // Return the enriched transactions
    res.status(200).json(enrichedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
});




// Endpoint to fetch transactions for a given school
app.get("/transaction/:school_id",async(req,res) =>{
  const {school_id} = req.params
  console.log(school_id)
  try{
  const getCollectId = await Student.findOne({school_id:school_id}).select("_id")
  console.log(getCollectId)
  const getTransactionDetails = await Transaction.find({ collect_id: getCollectId._id });
  console.log(getTransactionDetails)
  if (getTransactionDetails.length === 0) {
    return res.status(404).json({ message: 'No transactions found for the given collect ID' });
  }

  // Step 3: Return the transaction details
  res.status(200).json(getTransactionDetails);
}catch(error) {
  console.error('Error fetching transaction details:', error);
  res.status(500).json({ message: 'Error fetching data', error });
}

})

app.post('/transaction-status-check', async (req, res) => {
  const { custom_order_id } = req.body;

  try{
  
    
    const getOrderId = await Student.findOne({custom_order_id:custom_order_id}).select("_id") 
    console.log(getOrderId)

    const transactionDetails = await Transaction.find({collect_id:getOrderId._id}) 
    console.log(transactionDetails)
    if (transactionDetails.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given collect ID' });
    }
  
    // Step 3: Return the transaction details
    res.status(200).json(transactionDetails);

  }catch(error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
  
   });






app.post(
  '/update-transaction-status',
  [
    body('custom_order_id')
      .notEmpty()
      .isString()
      .withMessage('Custom Order ID must be a valid string'),
    body('status')
      .notEmpty()
      .isString()
      .withMessage('Status must be a valid string'),
  ],
  validateRequest, // Middleware to handle validation errors
  async (req, res) => {
    try {
      const { custom_order_id, status } = req.body;

      // Step 1: Retrieve collect_id from Student model based on custom_order_id
      const student = await Student.findOne({ custom_order_id }).select('_id');

      // If no student found with the provided custom_order_id, return 404 error
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      console.log(student); // Logging for debugging

      // Step 2: Retrieve transaction details using collect_id
      const result = await Transaction.updateOne(
        { collect_id: student._id }, // Find the transaction by collect_id
        { $set: { status } } // Update the status field
      );

      console.log(result)

      // If no transaction was updated, return 404 error
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Step 3: Return success response with the updated transaction information
      res.status(200).json({
        message: 'Transaction status updated successfully',
        updated_transaction: result,
      });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      res.status(500).json({ message: 'Error updating transaction status', error });
    }
  }
);











// Start the server
app.listen(3000, () => {
  console.log("Server running successfully on port 3000");
});
