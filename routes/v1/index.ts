import router from "@adonisjs/core/services/router";
import authRoutes from './modules/auth_route.js'
import { throttle } from "#start/limiter";

router.group(() => {
  authRoutes()
})
.prefix('v1')
.as('v1')
.use(throttle)

