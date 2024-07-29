import router from "@adonisjs/core/services/router";
import { throttle } from "#start/limiter";
import authRoutes from './modules/auth_route.js'
import dashboardRoutes from "./modules/dashboard_route.js";

router.group(() => {
  authRoutes()
  dashboardRoutes()
})
.prefix('v1')
.as('v1')
.use(throttle)

