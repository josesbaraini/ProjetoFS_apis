import express from 'express';
import { TreinosListCreateController } from '../../controllers/v2/TreinosController.js';
const router = express.Router();
const treinosListCreateController = new TreinosListCreateController();


router.all("/", treinosListCreateController.asHandler())

// router.all("/:id", treinosDatailUpdateDeleteController.asHandler())


export default router;