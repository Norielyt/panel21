import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Cambiar en producción

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminUser(username: string, password: string) {
  const hashedPassword = await hashPassword(password);
  try {
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${hashedPassword})
      ON CONFLICT (username) DO NOTHING
    `;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  try {
    const { rows } = await sql<{ password_hash: string }>`
      SELECT password_hash FROM admin_users WHERE username = ${username}
    `;
    
    if (rows.length === 0) {
      // Si no hay usuarios, crear uno por defecto
      if (username === 'admin' && password === ADMIN_PASSWORD) {
        await createAdminUser(username, password);
        return true;
      }
      return false;
    }
    
    return verifyPassword(password, rows[0].password_hash);
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
}
