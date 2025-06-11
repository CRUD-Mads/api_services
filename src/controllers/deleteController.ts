import { Request, Response } from "express";
import Evento from "../models/Evento";

// DELETE - Exclusão por ID (Soft Delete)
export async function deleteById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validação básica do ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID inválido fornecido",
      });
    }
    await Evento.delete(Number(id));
    res.status(200).json({
      success: true,
      message: "Evento excluído com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao excluir evento:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao excluir o evento",
      error: error.message,
    });
  }
}
