const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { isLoggedIn, isAdmin, isUser } = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayout);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(authRoutes);
app.use('/products', isLoggedIn, productRoutes); // Menu routes
app.use('/cart', isLoggedIn, cartRoutes); // Cart routes
app.use('/admin', isLoggedIn, isAdmin, adminRoutes); // Admin routes

// Root Route
app.get("/", (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/admin' : '/homepage');
    }
    res.render('auth/login', { layout: "authLayout" });
});

// Homepage for Users
app.get('/homepage', isLoggedIn, isUser, (req, res) => {
    res.render('user/homepage', { layout: "layout" });
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/layers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
