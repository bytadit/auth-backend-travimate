/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of user, must be unique and required
 *         password:
 *           type: string
 *           description: The password of user account, must have at least an Uppercase Letter, a Number, a Special Character, and at least 6 character long
 *         dob:
 *           type: string
 *           format: date
 *           description: The date of birth of user
 *         phone:
 *           type: string
 *           description: The phone number input by user
 *         greeting:
 *           type: string
 *           description: The nick greeting of user
 *         roles
 *           type: array
 *           description: The array of roles attached to user
 *       example:
 *         username: bytadit1,
 *         email: bytadit1@gmail.com,
 *         password: Bytadit_123,
 *         dob: 2024-01-16,
 *         phone: 098993128,
 *         greeting: nyonya,
 *         roles: ["admin"]
 */

const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.validatePassword,
    ],
    controller.signup
  );
  app.get("/api/auth/verify-email", controller.verifyEmail);
  app.post("/api/auth/forgot-password", controller.forgotPassword);
  app.post("/api/auth/reset-password", controller.resetPassword);

  app.post("/api/auth/signin", controller.signin);
  // Logout route
  app.post("/api/auth/logout", [authJwt.authCheck], controller.logout);
};
