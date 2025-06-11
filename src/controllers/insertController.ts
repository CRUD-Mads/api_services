import Evento from "../models/Evento";
import { Request, Response } from "express";

// POST - Criação de novo evento
export async function insert(req: Request, res: Response) {
  try {
    const { nome, descricao, data_inicio, data_fim, local_id, status, preco_entrada, imagem_url } = req.body;

    // Instancia o objeto para passar pelas validações do construtor
    const evento = new Evento(
      undefined,
      nome,
      data_inicio,
      data_fim,
      local_id,
      status,
      preco_entrada,
      descricao,
      imagem_url
    );

    // Executa a inserção no banco de dados
    const eventoId = await evento.insert();

    // Retorna o evento criado com status 201 (Created)
    evento.setId(eventoId);
    return res.status(201).json({
      message: "Evento criado com sucesso",
      data: {
        id: eventoId,
        nome: evento.getNome(),
        descricao: evento.getDescricao(),
        data_inicio: evento.getDataInicio(),
        data_fim: evento.getDataFim(),
        local_id: evento.getLocalId(),
        status: evento.getStatus(),
        preco_entrada: evento.getPrecoEntrada(),
        imagem_url: evento.getImagemUrl(),
      },
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

// POST - Criação em lote (opcional, para casos de múltiplos eventos)
export async function createBatch(req: Request, res: Response) {
  try {
    const { eventos } = req.body;

    if (!Array.isArray(eventos) || eventos.length === 0) {
      return res.status(400).json({ error: "Array de eventos é obrigatório" });
    }

    const eventosInseridos = [];
    const erros = [];

    for (let i = 0; i < eventos.length; i++) {
      try {
        const { nome, descricao, data_inicio, data_fim, local_id, status, preco_entrada, imagem_url } = eventos[i];

        const evento = new Evento(nome, data_inicio, data_fim, local_id, status, preco_entrada, descricao, imagem_url);

        const eventoId = await evento.insert();
        evento.setId(eventoId);

        eventosInseridos.push({
          index: i,
          id: eventoId,
          nome: evento.getNome(),
        });
      } catch (error: any) {
        erros.push({
          index: i,
          error: error.message,
          evento: eventos[i],
        });
      }
    }

    return res.status(201).json({
      message: `${eventosInseridos.length} evento(s) criado(s) com sucesso`,
      data: {
        sucessos: eventosInseridos,
        erros: erros,
        total_processados: eventos.length,
        total_sucessos: eventosInseridos.length,
        total_erros: erros.length,
      },
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
