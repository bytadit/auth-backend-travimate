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
