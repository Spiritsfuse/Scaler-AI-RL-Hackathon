import express from "express";
import { 
  createList, 
  getUserLists, 
  getListById, 
  updateList, 
  addListItem,
  updateListItem,
  deleteListItem,
  deleteList,
  shareList
} from "../controllers/list.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// List routes
router.post("/", createList);
router.get("/", getUserLists);
router.get("/:listId", getListById);
router.put("/:listId", updateList);
router.delete("/:listId", deleteList);
router.post("/:listId/share", shareList);

// List item routes
router.post("/:listId/items", addListItem);
router.put("/:listId/items/:itemId", updateListItem);
router.delete("/:listId/items/:itemId", deleteListItem);

export default router;
