const router = require("express").Router();
const authRoute = require("./v1/auth.route");
const storeRoute = require("./v1/store.route");

// router.use("/auth", authRoute);
const myRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/store",
    route: storeRoute,
  },
];

myRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
