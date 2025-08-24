const router = require("express").Router();
const authRoute = require("./v1/auth.route");

// router.use("/auth", authRoute);
const myRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
];

myRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
