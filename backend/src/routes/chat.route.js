import express from "express"
import { get } from "mongoose"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getStreamToken } from "../controllers/chat.controller.js"

const router = express.Router()

router.get("/token",protectRoute,getStreamToken)

export default router