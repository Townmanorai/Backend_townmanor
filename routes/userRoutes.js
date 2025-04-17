import express from 'express';
import { signup, login, verifyEmail ,protectedRoute} from '../APIController/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.get('/api/protected' , protectedRoute);

// ─── Admin / CRUD on users ─────────────────────────────────────────────────────
router.get('/',          getUsers);      // GET    /api/users
router.get('/:id',       getUserById);   // GET    /api/users/:id
router.put('/:id',       updateUser);    // PUT    /api/users/:id
router.delete('/:id',    deleteUser);    // DELETE /api/users/:id


// Uncomment the following lines if you have a middleware for authentication

// import { authMiddleware } from '../middleware/auth.js';

// router.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'You have access to this protected route' });
// });


export default router;
