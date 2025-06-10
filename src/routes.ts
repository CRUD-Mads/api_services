import { Router } from 'express';
import { updateFull, updatePartial } from './controllers/updateController';
import { asyncHandler } from './utils/asyncHandler';
import { insert } from './controllers/insertController'

const router = Router();

//CRIEM AS CONTROLLERS COM ESSES NOMES OU ALTERE AQUI COM AS QUE VOCÊ CRIOU

//Select
//router.get('/resources', selectAll);
//router.get('/resources/:id', selectById);

//Insert
router.post('/resources', asyncHandler(insert));

//Update
router.put('/resources/:id', asyncHandler(updateFull));
router.patch('/resources/:id', asyncHandler(updatePartial));

//Delete
//router.delete('/resources/:id', deleteById);

export default router;
