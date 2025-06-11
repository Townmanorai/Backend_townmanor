import express from 'express';
import {
  getAllColivingRooms,
  getColivingRoomById,
  createColivingRoom,
  updateColivingRoom,
  deleteColivingRoom,
  updateColivingRoomOccupiedStatus // added import
} from '../controllers/colivingRoomsController.js';

const router = express.Router();

router.get('/', getAllColivingRooms);
router.get('/:id', getColivingRoomById);
router.post('/', createColivingRoom);
router.put('/:id', updateColivingRoom);
router.delete('/:id', deleteColivingRoom);
router.patch('/:id/occupied', updateColivingRoomOccupiedStatus); // API for updating occupied status

export default router;