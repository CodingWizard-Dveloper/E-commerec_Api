const router = require("express").Router();
const authRoute = require("./v1/auth.route");
const storeRoute = require("./v1/store.route");
const productRoute = require("./v1/products.route")

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
  {
    path: "/products",
    route: productRoute
  }
];

myRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
