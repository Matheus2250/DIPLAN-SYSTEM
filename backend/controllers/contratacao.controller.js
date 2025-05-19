const db = require('../config/db.config');

// Listar todas as contratações
const getAll = async (req, res) => {
  try {
    const [contratacoes] = await db.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM materiais_servicos WHERE contratacao_id = c.id) as total_itens
      FROM contratacoes c
      ORDER BY c.data_inicio_estimada DESC
    `);
    
    res.status(200).json(contratacoes);
  } catch (error) {
    console.error('Erro ao listar contratações:', error);
    res.status(500).json({ message: 'Erro ao listar contratações' });
  }
};

// Obter uma contratação por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obter contratação
    const [contratacoes] = await db.query('SELECT * FROM contratacoes WHERE id = ?', [id]);
    
    if (contratacoes.length === 0) {
      return res.status(404).json({ message: 'Contratação não encontrada' });
    }
    
    // Obter materiais/serviços
    const [materiais] = await db.query('SELECT * FROM materiais_servicos WHERE contratacao_id = ?', [id]);
    
    res.status(200).json({
      ...contratacoes[0],
      materiais
    });
  } catch (error) {
    console.error('Erro ao obter contratação:', error);
    res.status(500).json({ message: 'Erro ao obter contratação' });
  }
};

// Criar uma nova contratação
const create = async (req, res) => {
  try {
    const {
      numero_contratacao,
      status_contratacao,
      situacao_execucao,
      titulo,
      categoria,
      uasg,
      valor_total,
      data_inicio_estimada,
      data_conclusao_estimada,
      prazo_estimado,
      area_requisitante,
      numero_dfd,
      prioridade,
      item_dfd,
      data_conclusao_dfd,
      classificacao,
      materiais
    } = req.body;
    
    // Iniciar transação
    await db.query('START TRANSACTION');
    
    // Inserir contratação
    const [result] = await db.query(`
      INSERT INTO contratacoes (
        numero_contratacao, status_contratacao, situacao_execucao, titulo, 
        categoria, uasg, valor_total, data_inicio_estimada, data_conclusao_estimada, 
        prazo_estimado, area_requisitante, numero_dfd, prioridade, item_dfd, 
        data_conclusao_dfd, classificacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      numero_contratacao, status_contratacao, situacao_execucao, titulo, 
      categoria, uasg, valor_total, data_inicio_estimada, data_conclusao_estimada, 
      prazo_estimado, area_requisitante, numero_dfd, prioridade, item_dfd, 
      data_conclusao_dfd, classificacao
    ]);
    
    const contratacaoId = result.insertId;
    
    // Inserir materiais/serviços se fornecidos
    if (materiais && materiais.length > 0) {
      for (const material of materiais) {
        await db.query(`
          INSERT INTO materiais_servicos (
            contratacao_id, codigo_classe, nome_classe, codigo_pdm, nome_pdm, 
            codigo_material, descricao, unidade_fornecimento, valor_unitario, 
            quantidade, valor_total
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          contratacaoId, material.codigo_classe, material.nome_classe, 
          material.codigo_pdm, material.nome_pdm, material.codigo_material, 
          material.descricao, material.unidade_fornecimento, material.valor_unitario, 
          material.quantidade, material.valor_total
        ]);
      }
    }
    
    // Confirmar transação
    await db.query('COMMIT');
    
    res.status(201).json({
      message: 'Contratação criada com sucesso',
      id: contratacaoId
    });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao criar contratação:', error);
    res.status(500).json({ message: 'Erro ao criar contratação' });
  }
};

// Atualizar uma contratação
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero_contratacao,
      status_contratacao,
      situacao_execucao,
      titulo,
      categoria,
      uasg,
      valor_total,
      data_inicio_estimada,
      data_conclusao_estimada,
      prazo_estimado,
      area_requisitante,
      numero_dfd,
      prioridade,
      item_dfd,
      data_conclusao_dfd,
      classificacao
    } = req.body;
    
    // Verificar se a contratação existe
    const [contratacoes] = await db.query('SELECT * FROM contratacoes WHERE id = ?', [id]);
    
    if (contratacoes.length === 0) {
      return res.status(404).json({ message: 'Contratação não encontrada' });
    }
    
    // Atualizar contratação
    await db.query(`
      UPDATE contratacoes SET
        numero_contratacao = ?,
        status_contratacao = ?,
        situacao_execucao = ?,
        titulo = ?,
        categoria = ?,
        uasg = ?,
        valor_total = ?,
        data_inicio_estimada = ?,
        data_conclusao_estimada = ?,
        prazo_estimado = ?,
        area_requisitante = ?,
        numero_dfd = ?,
        prioridade = ?,
        item_dfd = ?,
        data_conclusao_dfd = ?,
        classificacao = ?
      WHERE id = ?
    `, [
      numero_contratacao, status_contratacao, situacao_execucao, titulo, 
      categoria, uasg, valor_total, data_inicio_estimada, data_conclusao_estimada, 
      prazo_estimado, area_requisitante, numero_dfd, prioridade, item_dfd, 
      data_conclusao_dfd, classificacao, id
    ]);
    
    res.status(200).json({ message: 'Contratação atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar contratação:', error);
    res.status(500).json({ message: 'Erro ao atualizar contratação' });
  }
};

// Excluir uma contratação
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a contratação existe
    const [contratacoes] = await db.query('SELECT * FROM contratacoes WHERE id = ?', [id]);
    
    if (contratacoes.length === 0) {
      return res.status(404).json({ message: 'Contratação não encontrada' });
    }
    
    // Iniciar transação
    await db.query('START TRANSACTION');
    
    // Excluir materiais/serviços relacionados
    await db.query('DELETE FROM materiais_servicos WHERE contratacao_id = ?', [id]);
    
    // Excluir contratação
    await db.query('DELETE FROM contratacoes WHERE id = ?', [id]);
    
    // Confirmar transação
    await db.query('COMMIT');
    
    res.status(200).json({ message: 'Contratação excluída com sucesso' });
  } catch (error) {
    // Reverter transação em caso de erro
    await db.query('ROLLBACK');
    console.error('Erro ao excluir contratação:', error);
    res.status(500).json({ message: 'Erro ao excluir contratação' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};