const db = require('../config/database');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    const { fullname, username, email, password, role = 'user' } = userData;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        'INSERT INTO users (fullname, username, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [fullname, username, email, hashedPassword, role]
      );

      return {
        id: result.insertId,
        fullname,
        username,
        email,
        role
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email sudah terdaftar');
      }
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, fullname, username, email, role, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    const fields = [];
    const values = [];

    if (userData.fullname) {
      fields.push('fullname = ?');
      values.push(userData.fullname);
    }

    if (userData.username) {
      fields.push('username = ?');
      values.push(userData.username);
    }

    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      throw new Error('Tidak ada data untuk diupdate');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    try {
      const [result] = await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findUserById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email sudah digunakan');
      }
      throw error;
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserService();