require("dotenv").config();
const url =
  "mongodb+srv://anurag3979:coderAnurag3979@cluster0.a18im.mongodb.net/fileShare?retryWrites=true&w=majority";
const mongoose = require("mongoose");
// function connectDB() {
//   // Database connection 🥳
//   mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: true,
//   });
//   const connection = mongoose.connection;
//   connection
//     .once("open", () => {
//       console.log("Database connected ");
//     })
//     .catch((err) => {
//       // console.log("Connection failed ");
//       console.log(err);
//     });
// }
function connectDB() {
  try {
    // Connect to the MongoDB cluster
    mongoose.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected")
    );
  } catch (e) {
    console.log("could not connect", e);
  }
  mongoose.connection
    .once("open", function () {
      console.log("MongoDB running");
    })
    .on("error", function (err) {
      console.log(err);
    });
}
module.exports = connectDB;
