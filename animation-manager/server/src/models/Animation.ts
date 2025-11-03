export interface Animation {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  filename: string;
  file_path: string;
  file_size: number | null;
  tags: string | null;
  is_public: number;
  created_at: string;
  updated_at: string;
}

export interface AnimationCreate {
  user_id: number;
  title: string;
  description?: string;
  filename: string;
  file_path: string;
  file_size?: number;
  tags?: string;
  is_public?: boolean;
}

export interface AnimationUpdate {
  title?: string;
  description?: string;
  tags?: string;
  is_public?: boolean;
}

export class AnimationModel {
  static async findById(id: number): Promise<Animation | undefined> {
    const db = (await import('../db/database')).db;
    return db.get<Animation>('SELECT * FROM animations WHERE id = ?', [id]);
  }

  static async findByUserId(userId: number): Promise<Animation[]> {
    const db = (await import('../db/database')).db;
    return db.all<Animation>('SELECT * FROM animations WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }

  static async findPublic(): Promise<Animation[]> {
    const db = (await import('../db/database')).db;
    return db.all<Animation>('SELECT * FROM animations WHERE is_public = 1 ORDER BY created_at DESC');
  }

  static async create(animationData: AnimationCreate): Promise<number> {
    const db = (await import('../db/database')).db;
    const result = await db.run(
      `INSERT INTO animations (user_id, title, description, filename, file_path, file_size, tags, is_public)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        animationData.user_id,
        animationData.title,
        animationData.description || null,
        animationData.filename,
        animationData.file_path,
        animationData.file_size || null,
        animationData.tags || null,
        animationData.is_public ? 1 : 0
      ]
    );
    return result.lastID!;
  }

  static async update(id: number, userId: number, updateData: AnimationUpdate): Promise<boolean> {
    const db = (await import('../db/database')).db;
    const fields: string[] = [];
    const values: any[] = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.tags !== undefined) {
      fields.push('tags = ?');
      values.push(updateData.tags);
    }
    if (updateData.is_public !== undefined) {
      fields.push('is_public = ?');
      values.push(updateData.is_public ? 1 : 0);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id, userId);

    const result = await db.run(
      `UPDATE animations SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return result.changes > 0;
  }

  static async delete(id: number, userId: number): Promise<boolean> {
    const db = (await import('../db/database')).db;
    const result = await db.run('DELETE FROM animations WHERE id = ? AND user_id = ?', [id, userId]);
    return result.changes > 0;
  }

  static async search(query: string, userId?: number): Promise<Animation[]> {
    const db = (await import('../db/database')).db;
    const searchTerm = `%${query}%`;
    
    if (userId) {
      return db.all<Animation>(
        `SELECT * FROM animations 
         WHERE (title LIKE ? OR description LIKE ? OR tags LIKE ?)
         AND (user_id = ? OR is_public = 1)
         ORDER BY created_at DESC`,
        [searchTerm, searchTerm, searchTerm, userId]
      );
    } else {
      return db.all<Animation>(
        `SELECT * FROM animations 
         WHERE (title LIKE ? OR description LIKE ? OR tags LIKE ?)
         AND is_public = 1
         ORDER BY created_at DESC`,
        [searchTerm, searchTerm, searchTerm]
      );
    }
  }
}

