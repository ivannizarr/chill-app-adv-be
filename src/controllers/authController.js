const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const emailService = require('../services/emailService');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { fullname, username, email, password } = req.body;

      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar'
        });
      }

      const newUser = await userService.createUser({
        fullname,
        username,
        email,
        password
      });

      console.log('Attempting to send emails to:', newUser.email);

      try {
        console.log('Sending welcome email...');
        await emailService.sendWelcomeEmail(newUser);
        console.log('✅ Welcome email sent successfully to:', newUser.email);

        console.log('Sending verification email...');
        await emailService.sendVerificationEmail(newUser);
        console.log('✅ Verification email sent successfully to:', newUser.email);
      } catch (emailError) {
        console.error('❌ Failed to send emails:', emailError.message);
        console.error('Error details:', emailError);
      }

      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil! Cek email Anda untuk verifikasi.',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal melakukan registrasi',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const isPasswordValid = await userService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal melakukan login',
        error: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil data profile',
        error: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const userId = req.user.userId;
      const { fullname, username, email, password } = req.body;

      const updatedUser = await userService.updateUser(userId, {
        fullname,
        username,
        email,
        password
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile berhasil diupdate',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate profile',
        error: error.message
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token verifikasi diperlukan'
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        if (decoded.type !== 'email-verification') {
          return res.status(400).json({
            success: false,
            message: 'Invalid Verification Token'
          });
        }

        const user = await userService.findUserById(decoded.userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Invalid Verification Token'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Email Verified Successfully'
        });
      } catch (tokenError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Verification Token'
        });
      }
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal memverifikasi email',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();