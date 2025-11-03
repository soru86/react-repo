import bcrypt from 'bcryptjs';
import { db } from './database';
import { UserModel } from '../models/User';
import { AnimationModel } from '../models/Animation';
import path from 'path';
import fs from 'fs';

async function seed() {
  try {
    console.log('Starting seed process...');

    // Ensure tables are initialized first
    await db.ensureInitialized();

    // Clear existing data (use TRUNCATE or DELETE - SQLite doesn't support TRUNCATE)
    await db.run('DELETE FROM animations');
    await db.run('DELETE FROM users');

    // Create test users
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);
    const hashedPassword3 = await bcrypt.hash('password123', 10);

    const user1Id = await UserModel.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword1,
    });

    const user2Id = await UserModel.create({
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword2,
    });

    const user3Id = await UserModel.create({
      username: 'animator_pro',
      email: 'animator@example.com',
      password: hashedPassword3,
    });

    console.log('Created test users');

    // Create sample Lottie animation JSON files
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Sample Lottie animation data (minimal valid structure)
    const sampleAnimations = [
      {
        title: 'Loading Spinner',
        description: 'A smooth rotating loading spinner animation',
        filename: 'loading-spinner.json',
        tags: 'loading,spinner,ui',
        is_public: true,
        lottieData: {
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 60,
          w: 100,
          h: 100,
          nm: 'Loading Spinner',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Circle',
              sr: 1,
              ks: {
                o: { a: 0, k: 100 },
                r: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
                p: { a: 0, k: [50, 50, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 0, k: [100, 100, 100] },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      d: 1,
                      ty: 'el',
                      s: { a: 0, k: [40, 40] },
                      p: { a: 0, k: [0, 0] },
                      nm: 'Ellipse Path 1',
                    },
                    {
                      ty: 'st',
                      c: { a: 0, k: [0.2, 0.5, 1, 1] },
                      o: { a: 0, k: 100 },
                      w: { a: 0, k: 3 },
                      lc: 1,
                      lj: 1,
                      nm: 'Stroke 1',
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [0, 0] },
                      a: { a: 0, k: [0, 0] },
                      s: { a: 0, k: [100, 100] },
                      r: { a: 0, k: 0 },
                      o: { a: 0, k: 100 },
                      sk: { a: 0, k: 0 },
                      sa: { a: 0, k: 0 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Ellipse 1',
                  np: 2,
                  cix: 2,
                  bm: 0,
                },
              ],
              ip: 0,
              op: 60,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      },
      {
        title: 'Success Checkmark',
        description: 'Animated checkmark for success states',
        filename: 'success-check.json',
        tags: 'success,checkmark,validation',
        is_public: true,
        lottieData: {
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 30,
          w: 100,
          h: 100,
          nm: 'Success Checkmark',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Checkmark',
              sr: 1,
              ks: {
                o: { a: 0, k: 100 },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [50, 50, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 1, k: [{ i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [0, 0, 100] }, { t: 20, s: [100, 100, 100] }] },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ind: 0,
                      ty: 'sh',
                      ix: 1,
                      ks: {
                        a: 0,
                        k: {
                          i: [[0, 0], [0, 0]],
                          o: [[0, 0], [0, 0]],
                          v: [[-20, 0], [0, 20]],
                          c: false,
                        },
                      },
                      nm: 'Path 1',
                    },
                    {
                      ind: 1,
                      ty: 'sh',
                      ix: 2,
                      ks: {
                        a: 0,
                        k: {
                          i: [[0, 0], [0, 0]],
                          o: [[0, 0], [0, 0]],
                          v: [[0, 20], [20, -20]],
                          c: false,
                        },
                      },
                      nm: 'Path 2',
                    },
                    {
                      ty: 'st',
                      c: { a: 0, k: [0, 0.8, 0, 1] },
                      o: { a: 0, k: 100 },
                      w: { a: 0, k: 4 },
                      lc: 2,
                      lj: 2,
                      nm: 'Stroke 1',
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [0, 0] },
                      a: { a: 0, k: [0, 0] },
                      s: { a: 0, k: [100, 100] },
                      r: { a: 0, k: 0 },
                      o: { a: 0, k: 100 },
                      sk: { a: 0, k: 0 },
                      sa: { a: 0, k: 0 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Checkmark',
                  np: 3,
                  cix: 2,
                  bm: 0,
                },
              ],
              ip: 0,
              op: 30,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      },
      {
        title: 'Heartbeat Pulse',
        description: 'Pulsing heart animation effect',
        filename: 'heartbeat.json',
        tags: 'heart,health,pulse',
        is_public: false,
        lottieData: {
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 60,
          w: 100,
          h: 100,
          nm: 'Heartbeat',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Heart',
              sr: 1,
              ks: {
                o: { a: 0, k: 100 },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [50, 50, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: {
                  a: 1,
                  k: [
                    { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100] },
                    { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [120, 120] },
                    { t: 30, s: [100, 100] },
                  ],
                },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'el',
                      s: { a: 0, k: [30, 30] },
                      p: { a: 0, k: [-10, 0] },
                      nm: 'Circle 1',
                    },
                    {
                      ty: 'el',
                      s: { a: 0, k: [30, 30] },
                      p: { a: 0, k: [10, 0] },
                      nm: 'Circle 2',
                    },
                    {
                      ty: 'fl',
                      c: { a: 0, k: [1, 0, 0, 1] },
                      o: { a: 0, k: 100 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                    },
                  ],
                  nm: 'Heart Shape',
                  np: 3,
                  cix: 2,
                  bm: 0,
                },
              ],
              ip: 0,
              op: 60,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      },
      {
        title: 'Bouncing Ball',
        description: 'Simple bouncing ball physics animation',
        filename: 'bouncing-ball.json',
        tags: 'ball,physics,bounce',
        is_public: true,
        lottieData: {
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 90,
          w: 100,
          h: 200,
          nm: 'Bouncing Ball',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Ball',
              sr: 1,
              ks: {
                o: { a: 0, k: 100 },
                r: { a: 0, k: 0 },
                p: {
                  a: 1,
                  k: [
                    { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 0, s: [50, 20] },
                    { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 30, s: [50, 170] },
                    { i: { x: 0.667, y: 1 }, o: { x: 0.333, y: 0 }, t: 60, s: [50, 20] },
                    { t: 90, s: [50, 20] },
                  ],
                },
                a: { a: 0, k: [0, 0, 0] },
                s: {
                  a: 1,
                  k: [
                    { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 28, s: [100, 100] },
                    { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 32, s: [120, 80] },
                    { t: 60, s: [100, 100] },
                  ],
                },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'el',
                      s: { a: 0, k: [40, 40] },
                      p: { a: 0, k: [0, 0] },
                      nm: 'Circle',
                    },
                    {
                      ty: 'fl',
                      c: { a: 0, k: [0.2, 0.6, 1, 1] },
                      o: { a: 0, k: 100 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                    },
                  ],
                  nm: 'Ball Shape',
                  np: 2,
                  cix: 2,
                  bm: 0,
                },
              ],
              ip: 0,
              op: 90,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      },
      {
        title: 'Fade In Text',
        description: 'Text fade in animation',
        filename: 'fade-in-text.json',
        tags: 'text,fade,animation',
        is_public: true,
        lottieData: {
          v: '5.7.4',
          fr: 30,
          ip: 0,
          op: 60,
          w: 200,
          h: 100,
          nm: 'Fade In Text',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 5,
              nm: 'Text Layer',
              sr: 1,
              ks: {
                o: {
                  a: 1,
                  k: [
                    { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] },
                    { t: 30, s: [100] },
                  ],
                },
                r: { a: 0, k: 0 },
                p: { a: 0, k: [100, 50, 0] },
                a: { a: 0, k: [0, 0, 0] },
                s: { a: 0, k: [100, 100, 100] },
              },
              ao: 0,
              t: {
                d: {
                  k: [
                    {
                      s: {
                        f: 'Arial',
                        s: 24,
                        t: 'Hello World',
                        j: 1,
                        tr: 0,
                        lh: 28.8,
                        ls: 0,
                        fc: [0, 0, 0],
                      },
                      t: 0,
                    },
                  ],
                },
              },
              ip: 0,
              op: 60,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      },
    ];

    // Create animation files and database records
    for (let i = 0; i < sampleAnimations.length; i++) {
      const anim = sampleAnimations[i];
      const filePath = path.join(uploadsDir, `seed-${Date.now()}-${i}.json`);
      fs.writeFileSync(filePath, JSON.stringify(anim.lottieData, null, 2));

      const userId = i % 3 === 0 ? user1Id : (i % 3 === 1 ? user2Id : user3Id);
      
      const fileBasename = path.basename(filePath);
      const animationId = await AnimationModel.create({
        user_id: userId,
        title: anim.title,
        description: anim.description,
        filename: anim.filename,
        file_path: `/uploads/${fileBasename}`,
        file_size: fs.statSync(filePath).size,
        tags: anim.tags,
        is_public: anim.is_public,
      });

      console.log(`Created animation: ${anim.title} (ID: ${animationId})`);
    }

    console.log('Seed process completed successfully!');
    console.log('\nTest Users:');
    console.log('1. john_doe / john@example.com / password123');
    console.log('2. jane_smith / jane@example.com / password123');
    console.log('3. animator_pro / animator@example.com / password123');
    console.log('\nTotal animations created: 5');

    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await db.close();
    process.exit(1);
  }
}

seed();

