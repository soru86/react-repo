import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AnimationModel } from '../models/Animation';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept JSON files (Lottie animations are JSON)
    if (file.mimetype === 'application/json' || path.extname(file.originalname).toLowerCase() === '.json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  },
});

// Get all animations (public + user's private)
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const animations = await AnimationModel.findByUserId(userId);
    const publicAnimations = await AnimationModel.findPublic();
    
    // Combine and deduplicate
    const animationMap = new Map<number, any>();
    animations.forEach(anim => animationMap.set(anim.id, anim));
    publicAnimations.forEach(anim => {
      if (!animationMap.has(anim.id)) {
        animationMap.set(anim.id, anim);
      }
    });

    const result = Array.from(animationMap.values());
    console.log(`[GET /animations] Returning ${result.length} animations for user ${userId}`);
    res.json(result);
  } catch (error) {
    console.error('Get animations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get public animations (no auth required)
router.get('/public', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const animations = await AnimationModel.findPublic();
    res.json(animations);
  } catch (error) {
    console.error('Get public animations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's animations
router.get('/my-animations', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const animations = await AnimationModel.findByUserId(userId);
    res.json(animations);
  } catch (error) {
    console.error('Get my animations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single animation
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const animation = await AnimationModel.findById(id);

    if (!animation) {
      res.status(404).json({ error: 'Animation not found' });
      return;
    }

    // Check if user has access (owner or public)
    if (animation.user_id !== req.user!.id && animation.is_public === 0) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(animation);
  } catch (error) {
    console.error('Get animation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search animations
router.get('/search/:query', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Decode the URL-encoded query parameter
    const query = decodeURIComponent(req.params.query);
    const userId = req.user!.id;
    const animations = await AnimationModel.search(query, userId);
    res.json(animations);
  } catch (error) {
    console.error('Search animations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload animation
router.post(
  '/',
  authenticate,
  upload.single('file'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'File is required' });
        return;
      }

      const { title, description, tags, is_public } = req.body;

      const animationId = await AnimationModel.create({
        user_id: req.user!.id,
        title,
        description: description || null,
        filename: req.file.originalname,
        file_path: `/uploads/${req.file.filename}`,
        file_size: req.file.size,
        tags: tags || null,
        is_public: is_public === 'true' || is_public === true,
      });

      const animation = await AnimationModel.findById(animationId);
      res.status(201).json(animation);
    } catch (error) {
      console.error('Create animation error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update animation
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const animation = await AnimationModel.findById(id);

      if (!animation) {
        res.status(404).json({ error: 'Animation not found' });
        return;
      }

      if (animation.user_id !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const { title, description, tags, is_public } = req.body;
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (tags !== undefined) updateData.tags = tags;
      if (is_public !== undefined) updateData.is_public = is_public === 'true' || is_public === true;

      const updated = await AnimationModel.update(id, req.user!.id, updateData);
      if (!updated) {
        res.status(404).json({ error: 'Animation not found' });
        return;
      }

      const updatedAnimation = await AnimationModel.findById(id);
      res.json(updatedAnimation);
    } catch (error) {
      console.error('Update animation error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete animation
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const animation = await AnimationModel.findById(id);

    if (!animation) {
      res.status(404).json({ error: 'Animation not found' });
      return;
    }

    if (animation.user_id !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete file
    const filePath = path.join(__dirname, '../../', animation.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const deleted = await AnimationModel.delete(id, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Animation not found' });
      return;
    }

    res.json({ message: 'Animation deleted successfully' });
  } catch (error) {
    console.error('Delete animation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

