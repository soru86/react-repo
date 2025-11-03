export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserPublic {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | undefined> {
    const db = (await import('../db/database')).db;
    return db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findByUsername(username: string): Promise<User | undefined> {
    const db = (await import('../db/database')).db;
    return db.get<User>('SELECT * FROM users WHERE username = ?', [username]);
  }

  static async findById(id: number): Promise<User | undefined> {
    const db = (await import('../db/database')).db;
    return db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async create(userData: UserCreate): Promise<number> {
    const db = (await import('../db/database')).db;
    const result = await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [userData.username, userData.email, userData.password]
    );
    return result.lastID!;
  }

  static toPublic(user: User): UserPublic {
    const { password, ...publicUser } = user;
    return publicUser;
  }
}

