const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb://localhost:27017/school_payments"; // Replace with your MongoDB URI

// Database and Collection Names
const dbName = "schoolschool_payments";
const collectionName = "transactions";

(async () => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");
   
    // Get the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Start watching changes on the collection
    const changeStream = collection.watch();

    console.log(`Watching changes on collection: ${collectionName}`);

    // Listen to change events
    changeStream.on("change", (change) => {
      console.log("Change detected:", change);

      // Handle different types of changes
      switch (change.operationType) {
        case "insert":
          console.log("Document Inserted:", change.fullDocument);
          break;
        case "update":
          console.log("Document Updated:", change.updateDescription);
          break;
        case "delete":
          console.log("Document Deleted:", change.documentKey);
          break;
        default:
          console.log("Other Operation Type:", change.operationType);
      }

      // Perform additional logic based on the event
      // For example, send a webhook or update a transaction status
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      console.log("Closing MongoDB connection");
      await client.close();
      process.exit();
    });

  } catch (error) {
    console.error("Error:", error);
  }
})();
