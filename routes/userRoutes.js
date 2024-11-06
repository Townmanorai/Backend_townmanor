import express from 'express';
import { signup, login, verifyEmail ,protectedRoute} from '../APIcontroller/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/api/protected' , protectedRoute);


// import { authMiddleware } from '../middleware/auth.js';

// router.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'You have access to this protected route' });
// });


export default router;
