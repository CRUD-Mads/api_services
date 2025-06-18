import Evento from "../models/Evento";
import { Request, Response } from "express";

// PUT - Atualização completa
export async function updateFull(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao, data_inicio, data_fim, local_id, status, preco_entrada, imagem_url } = req.body;

    // Instancia o objeto para passar pelas validações do construtor
    const evento = new Evento(
      Number(id),
      nome,
      data_inicio,
      data_fim,
      local_id,
      status,
      Number(preco_entrada),
      descricao,
      imagem_url
    );
    evento.setId(Number(id));
    await evento.updateFull();
    return res.status(200).json({ message: "Evento atualizado com sucesso." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

// PATCH - Atualização parcial
export async function updatePartial(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const fields = req.body;

    // Busca o evento atual para garantir as validações do construtor
    const eventoAtual = await Evento.findById(Number(id));
    if (!eventoAtual) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }
    eventoAtual.setId(Number(id));
    await eventoAtual.updatePartial(fields);
    return res.status(200).json({ message: "Campo atualizado com sucesso." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
