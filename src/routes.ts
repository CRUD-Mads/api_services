import { Router } from 'express';

const router = Router();

//CRIEM AS CONTROLLERS COM ESSES NOMES OU ALTERE AQUI COM AS QUE VOCÊ CRIOU

//Select
router.get('/resources', selectAll);
router.get('/resources/:id', selectById);

//Insert
router.post('/resources', insert);

//Update
router.put('/resources/:id', updateFull);
router.patch('/resources/:id', updatePartial);

//Delete
router.delete('/resources/:id', deleteById);

export default router;
