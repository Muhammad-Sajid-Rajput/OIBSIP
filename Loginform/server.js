const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory user store (for demo only)
const users = {};

// In-memory store for reset tokens
const resetTokens = {};

// Configure nodemailer (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sajidrajp5@gmail.com',
    pass: 'gzvr tagq tthd jkdw'
  }
});

// ✅ Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready.");
  }
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (users[email]) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  users[email] = { name, email, password };
  res.status(201).json({ message: 'Registration successful.' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  res.json({ message: 'Login successful.', name: user.name });
});

// Reset Password endpoint (manual form)
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }
  const user = users[email];
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  user.password = newPassword;
  res.json({ message: 'Password reset successful.' });
});

// Forgot Password endpoint (sends token link)
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users[email];
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 30 * 60 * 1000; // 30 minutes
  resetTokens[token] = { email, expires };

  const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;
  const mailOptions = {
    from: 'kungfupanda2253@gmail.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p>Hello ${user.name},</p>
      <p>Click the link below to reset your password. This link is valid for 30 minutes:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Failed to send email:", err);
      return res.status(500).json({ message: 'Failed to send email.' });
    }
    console.log("📧 Email sent:", info.response);
    res.json({ message: 'Password reset link sent to your email.' });
  });
});

// Reset Password using token
app.post('/api/reset-password-token', (req, res) => {
  const { token, newPassword } = req.body;
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
  const user = users[data.email];
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  user.password = newPassword;
  delete resetTokens[token];
  res.json({ message: 'Password reset successful.' });
});

// Serve static files (frontend like HTML/CSS/JS)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});