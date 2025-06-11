import { Request, Response } from 'express';
import  Evento  from '../models/Evento';

export const selectAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventos = await Evento.findAll();
      res.status(200).json({
        success: true,
        data: eventos,
        message: 'Recursos recuperados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar todos os recursos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar recursos',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  export const selectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      // Validação básica do ID
      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          message: 'ID inválido fornecido'
        });
        return;
      }
  
      const evento = await Evento.findById(Number(id));
      
      if (!evento) {
        res.status(404).json({
          success: false,
          message: 'Recurso não encontrado'
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: evento,
        message: 'Recurso recuperado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar recurso por ID:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao buscar o recurso',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
