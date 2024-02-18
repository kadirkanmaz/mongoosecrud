require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;


//database connection
// mongoose.connect(process.env.MONGO_URL,{
//    useUnifiedTopology: true,
//   });

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;
db.on('error', (error) => {console.log(error)});
db.once('open', () => console.log('connected to the database'));


//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
        secret:"my secret key",
        saveUninitialized: true,
        resave:false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set("view engine", "ejs");

// app.get('/', (req, res) => {
//     res.send("Hello World");
// });

app.use("", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(process.env.MONGODB_URL);
    console.log(`Server started at http://localhost:${PORT}`);
})