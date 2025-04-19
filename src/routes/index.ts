import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import habitRoutes from './habit.route';
import habitLogRoutes from './habitLog.route';


// import trackerRoutes from './tracker.route';
// import profileRoutes from './profile.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/habits', habitRoutes);
router.use('/logs', habitLogRoutes)

// router.use('/tracker', trackerRoutes);
// router.use('/profile', profileRoutes);

export default router;