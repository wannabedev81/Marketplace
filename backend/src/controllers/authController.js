const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { JWT_SECRET, NODE_ENV } = require('../config/env');
const fs = require('fs');
const path = require('path');


exports.register = (req, res) => {
    const { email, password } = req.body;
    let users = db.getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ email, password:hashedPassword });
    db.saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        const users = db.getUsers();

        const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password '});
    }
    
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    //setting token as cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        domain: 'localhost'
    });
    console.log('Cookie set successfully');

    //sending token in the response
    res.json({ token });
    } catch (err) {
        console.error( 'Error in login function:', err);
        res.status(500).json({ message: 'internal server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
};

exports.me = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ email: decoded.email });
    } catch (err) {
        res.status(401).json({ message: 'invalid token' });
    }
};

exports.getProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied' });
    }
    res.json({ email: req.user.email });
};

exports.deleteProfile = (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser || !currentUser.email) {
            return res.status(404).json({ message: 'User not found' });
        }
        const email = currentUser.email;

        //loading users and items
        const users = db.getUsers();
        let items = db.getItems();

        //checking whether user exists:
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found'});
        } 

        //get all items of the user
        const userItems = items.filter(item => item.owner === email);

        //delete associated items
        userItems.forEach(item => {
            if (item.images && item.images.length > 0) {
                item.images.forEach(img => {
                    const filePath = path.join(__dirname, '..', '..', img.path.replace(/^\//, ''));
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`Deleted processed image: ${filePath}`);
                    }
                });
            }

        });

        //remove items belong to the user
        items = items.filter(item => item.owner !== email);
        db.saveItems(items);

        //remove user
        users.splice(userIndex, 1);
        db.saveUsers(users);

        //clear cookie
        res.clearCookie('token');

        res.json({ message: `Profile and ${userItems.length} items and related images were deleted successfully.` });

    } catch (err) {
        console.error("Error deleting profile: ", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};