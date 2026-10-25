import { generateToken } from '../middleware/auth.js';

// Pre-seeded demo credentials for instant evaluation
const demoUsers = [
  {
    id: 'user-admin',
    name: 'Sarah Montgomery (General Manager)',
    email: 'admin@hotelpro.com',
    password: 'adminPassword123',
    role: 'admin',
    department: 'Executive Management',
    phone: '+1 (555) 019-2834',
  },
  {
    id: 'user-frontdesk',
    name: 'Liam Gallagher (Front Desk Supervisor)',
    email: 'frontdesk@hotelpro.com',
    password: 'frontdeskPassword123',
    role: 'receptionist',
    department: 'Guest Relations',
    phone: '+1 (555) 019-5521',
  },
  {
    id: 'user-guest',
    name: 'Alexander Wright',
    email: 'guest@hotelpro.com',
    password: 'guestPassword123',
    role: 'guest',
    department: 'Private Guest',
    phone: '+1 (555) 441-9872',
  },
];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Use demo credentials or register.',
      });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    const token = generateToken(tokenPayload);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: tokenPayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'guest', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existing = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      phone: phone || '',
      department: role === 'admin' ? 'Executive Management' : 'Guest Relations',
    };

    demoUsers.push(newUser);

    const tokenPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    };

    const token = generateToken(tokenPayload);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: tokenPayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const getDemoCredentials = async (req, res) => {
  return res.status(200).json({
    success: true,
    credentials: [
      { role: 'admin', email: 'admin@hotelpro.com', password: 'adminPassword123', label: 'Hotel General Manager' },
      { role: 'receptionist', email: 'frontdesk@hotelpro.com', password: 'frontdeskPassword123', label: 'Front Desk Staff' },
      { role: 'guest', email: 'guest@hotelpro.com', password: 'guestPassword123', label: 'Guest Account' },
    ],
  });
};
