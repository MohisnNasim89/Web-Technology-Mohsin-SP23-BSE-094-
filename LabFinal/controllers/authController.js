const bcrypt = require('bcrypt');
const User = require('../models/usermodel'); // Import the User model

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', { error: 'Email already exists', layout: "authLayout" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'client', // Default role is 'client'
        });

        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/register', { error: 'Registration failed', layout: "authLayout" });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('auth/login', { error: 'Invalid credentials', layout: "authLayout" });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('auth/login', { error: 'Invalid credentials', layout: "authLayout" });
        }
        
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/homepage');
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/login', { error: 'Login failed', layout: "authLayout" });
    }
};

// Logout a user
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/login');
    });
};
