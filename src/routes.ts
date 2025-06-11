import { Router } from "express";
import { updateFull, updatePartial } from "./controllers/updateController";
import { asyncHandler } from "./utils/asyncHandler";
import { insert } from "./controllers/insertController";
import { deleteById } from "./controllers/deleteController";
import { selectAll, selectById } from "./controllers/selectController";

const router = Router();

//CRIEM AS CONTROLLERS COM ESSES NOMES OU ALTERE AQUI COM AS QUE VOCÊ CRIOU

//Select
router.get("/resources", asyncHandler(selectAll));
router.get("/resources/:id", asyncHandler(selectById));

//Insert
router.post("/resources", asyncHandler(insert));

//Update
router.put("/resources/:id", asyncHandler(updateFull));
router.patch("/resources/:id", asyncHandler(updatePartial));

//Delete
router.delete("/resources/:id", asyncHandler(deleteById));

export default router;
