import { Request, Response } from 'express';
import Evento from '../models/Evento';

// DELETE - Exclusão por ID (Soft Delete)
export async function deleteById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Validação básica do ID
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido fornecido'
            });
        }

        // Verifica se o evento existe antes de tentar deletar
        const eventoExistente = await Evento.findById(Number(id));
        if (!eventoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Evento não encontrado'
            });
        }

        // Soft delete - marca como cancelado ao invés de excluir fisicamente
        const evento = new Evento(
            eventoExistente.nome,
            eventoExistente.data_inicio,
            eventoExistente.data_fim,
            eventoExistente.local_id,
            eventoExistente.status,
            eventoExistente.preco_entrada,
            eventoExistente.descricao,
            eventoExistente.imagem_url
        );
        evento.setId(Number(id));
        
        // Usa o método updatePartial para marcar como cancelado
        await evento.updatePartial({ status: 'Cancelado' });
        
        return res.status(200).json({
            success: true,
            message: 'Evento excluído com sucesso'
        });

    } catch (error: any) {
        console.error('Erro ao excluir evento:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao excluir o evento',
            error: error.message
        });
    }
}

// DELETE - Exclusão em lote por IDs
export async function deleteBatch(req: Request, res: Response) {
    try {
        const { ids } = req.body;
        
        // Validação do array de IDs
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Array de IDs é obrigatório'
            });
        }

        // Validação se todos os IDs são números válidos
        const idsValidos = ids.filter(id => !isNaN(Number(id)) && Number(id) > 0);
        if (idsValidos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nenhum ID válido fornecido'
            });
        }

        const eventosExcluidos = [];
        const erros = [];

        for (const id of idsValidos) {
            try {
                // Verifica se o evento existe
                const eventoExistente = await Evento.findById(Number(id));
                if (!eventoExistente) {
                    erros.push({
                        id: Number(id),
                        error: 'Evento não encontrado'
                    });
                    continue;
                }

                // Soft delete - marca como cancelado
                const evento = new Evento(
                    eventoExistente.nome,
                    eventoExistente.data_inicio,
                    eventoExistente.data_fim,
                    eventoExistente.local_id,
                    eventoExistente.status,
                    eventoExistente.preco_entrada,
                    eventoExistente.descricao,
                    eventoExistente.imagem_url
                );
                evento.setId(Number(id));
                await evento.updatePartial({ status: 'Cancelado' });
                eventosExcluidos.push({
                    id: Number(id),
                    nome: eventoExistente.nome || 'Nome não disponível'
                });

            } catch (error: any) {
                erros.push({
                    id: Number(id),
                    error: error.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `${eventosExcluidos.length} evento(s) excluído(s) com sucesso`,
            data: {
                sucessos: eventosExcluidos,
                erros: erros,
                total_processados: idsValidos.length,
                total_sucessos: eventosExcluidos.length,
                total_erros: erros.length
            }
        });

    } catch (error: any) {
        console.error('Erro ao excluir eventos em lote:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao excluir eventos',
            error: error.message
        });
    }
}

// DELETE - Soft delete alternativo
export async function softDelete(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Validação básica do ID
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido fornecido'
            });
        }

        // Verifica se o evento existe
        const eventoExistente = await Evento.findById(Number(id));
        if (!eventoExistente) {
            return res.status(404).json({
                success: false,
                message: 'Evento não encontrado'
            });
        }

        // Cria nova instância para fazer o update
        const evento = new Evento(
            eventoExistente.nome,
            eventoExistente.data_inicio,
            eventoExistente.data_fim,
            eventoExistente.local_id,
            eventoExistente.status,
            eventoExistente.preco_entrada,
            eventoExistente.descricao,
            eventoExistente.imagem_url
        );
        evento.setId(Number(id));
        
        // Atualiza o status para "Cancelado" (soft delete)
        await evento.updatePartial({ status: 'Cancelado' });
        
        return res.status(200).json({
            success: true,
            message: 'Evento desativado com sucesso'
        });

    } catch (error: any) {
        console.error('Erro ao desativar evento:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao desativar o evento',
            error: error.message
        });
    }
}