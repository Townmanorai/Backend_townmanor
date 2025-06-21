import express from 'express';
import {
  getAllColivingRooms,
  getColivingRoomById,
  createColivingRoom,
  updateColivingRoom,
  deleteColivingRoom,
  updateColivingRoomOccupiedStatus, // added import
  getColivingRoomsByPropertyId, // new import
  getColivingRoomsByUserName,
  putColivingRoom
} from '../controllers/colivingRoomsController.js';

const router = express.Router();

router.get('/', getAllColivingRooms);
router.get('/:id', getColivingRoomById);
router.post('/', createColivingRoom);
router.put('/:id', updateColivingRoom);
router.delete('/:id', deleteColivingRoom);
router.patch('/:id/occupied', updateColivingRoomOccupiedStatus); // API for updating occupied status
router.get('/property/:property_id', getColivingRoomsByPropertyId); // new route
router.get('/user/:username', getColivingRoomsByUserName); // <-- add this route
router.put('/:id', putColivingRoom); // Route for PUT method to update coliving room


export default router;