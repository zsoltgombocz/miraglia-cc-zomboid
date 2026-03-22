import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-authenticated' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (token === 'admin-authenticated') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

export default router;
