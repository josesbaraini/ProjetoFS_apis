import express from 'express';
import { UserListCreateController, UserDatailUpdateDeleteController  } from '../../controllers/v2/UserControllers.js';
const router = express.Router();
const userListCreateController = new UserListCreateController();
const userDatailUpdateDeleteController  = new UserDatailUpdateDeleteController()

router.all("/", userListCreateController.asHandler())

router.all("/:id", userDatailUpdateDeleteController.asHandler())


export default router;