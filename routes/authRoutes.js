import express from 'express';
import { registerCreator, registerBacker, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register/creator', registerCreator);
router.post('/register/backer', registerBacker);
router.post('/login', login);

export default router;
