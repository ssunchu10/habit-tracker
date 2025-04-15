import express from 'express';
import authRoutes from './auth.route';
// import trackerRoutes from './tracker.route';
// import profileRoutes from './profile.route';

const router = express.Router();

router.use('/auth', authRoutes);
// router.use('/tracker', trackerRoutes);
// router.use('/profile', profileRoutes);

export default router;