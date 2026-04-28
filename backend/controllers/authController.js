const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { registerSchema, loginSchema } = require('../validations/authValidation');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
        message: 'User registered successfully'
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
        message: 'Logged in successfully'
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    OAuth sign-in / sign-up (GitHub, Google, etc.)
// @route   POST /api/auth/oauth
// @access  Public
const oauthLogin = async (req, res, next) => {
  try {
    const { name, email, oauthProvider, oauthId, avatar } = req.body;

    if (!email || !oauthProvider || !oauthId) {
      res.status(400);
      throw new Error('Missing required OAuth fields: email, oauthProvider, oauthId');
    }

    // Try to find by oauthId first, then fall back to email
    let user = await User.findOne({ oauthId, oauthProvider });

    if (!user) {
      // Try by email — maybe they registered manually before
      user = await User.findOne({ email });

      if (user) {
        // Link the OAuth provider to existing account
        await User.findByIdAndUpdate(user._id, {
          $set: { oauthProvider, oauthId, avatar: avatar || user.avatar }
        }, { runValidators: false });
        // Refresh user object
        user = await User.findById(user._id);
      } else {
        // Create a brand-new OAuth user (no password)
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          oauthProvider,
          oauthId,
          avatar: avatar || null,
          role: 'student'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
      message: 'OAuth login successful'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  oauthLogin,
};
