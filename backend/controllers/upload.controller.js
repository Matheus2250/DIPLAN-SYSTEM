const xlsx = require('xlsx');
const path = require('path');
const db = require('../config/db.config');

// Função auxiliar para processar e formatar datas corretamente
function processarData(dataExcel) {
  if (!dataExcel) return null;
  
  try {
    console.log(`Processando data: ${dataExcel} (tipo: ${typeof dataExcel})`);
    
    // Se for uma string, tentar reconhecer formatos comuns
    if (typeof dataExcel === 'string') {
      // Remover espaços extras
      dataExcel = dataExcel.trim();
      
      // Verificar se está vazio
      if (!dataExcel || dataExcel === '0000-00-00') return null;
      
      // Formato brasileiro: dd/mm/aaaa
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataExcel)) {
        const [dia, mes, ano] = dataExcel.split('/');
        return `${ano}-${mes}-${dia}`;
      }
      
      // Já está no formato ISO: aaaa-mm-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(dataExcel)) {
        return dataExcel;
      }
      
      // Outros formatos...
      // Pode adicionar mais conversões aqui conforme necessário
    }
    
    // Se for um número (Excel armazena datas como números sequenciais desde 1/1/1900)
    if (typeof dataExcel === 'number') {
      // Converter de formato Excel para JavaScript Date
      // Excel: 1 = 01/01/1900, 2 = 02/01/1900, etc. 
      // Nota: Excel tem um bug com o ano 1900 (considera-o erroneamente como bissexto)
      const excelEpoch = new Date(1900, 0, 0); // 0 de Janeiro = 31 de Dezembro
      const dataJS = new Date(excelEpoch.getTime() + (dataExcel * 24 * 60 * 60 * 1000));
      
      // Verificar se é uma data válida
      if (isNaN(dataJS.getTime())) return null;
      
      // Formatar como YYYY-MM-DD para MySQL
      const ano = dataJS.getFullYear();
      const mes = String(dataJS.getMonth() + 1).padStart(2, '0');
      const dia = String(dataJS.getDate()).padStart(2, '0');
      
      return `${ano}-${mes}-${dia}`;
    }
    
    // Se chegou aqui, não conseguiu interpretar a data
    console.log(`Não foi possível processar a data: ${dataExcel}`);
    return null;
    
  } catch (error) {
    console.error(`Erro ao processar data ${dataExcel}:`, error);
    return null;
  }
}

// Função para processar valores monetários
function processarValorMonetario(valor) {
  if (valor === null || valor === undefined) return 0;
  
  try {
    console.log(`Processando valor monetário: ${valor} (tipo: ${typeof valor})`);
    
    // Se já for um número, retornar diretamente
    if (typeof valor === 'number') {
      return valor;
    }
    
    // Se for string, limpar e converter
    if (typeof valor === 'string') {
      // Remover espaços, símbolos de moeda e outros caracteres não numéricos exceto . e ,
      let valorLimpo = valor.replace(/[^\d.,]/g, '');
      
      // Tratar formato brasileiro (1.234,56)
      if (valorLimpo.indexOf('.') < valorLimpo.indexOf(',')) {
        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
      } else {
        // Tratar formato americano (1,234.56)
        valorLimpo = valorLimpo.replace(/,/g, '');
      }
      
      // Converter para número
      return parseFloat(valorLimpo);
    }
    
    // Caso não seja possível processar, retornar 0
    console.warn(`Valor monetário não reconhecido: ${valor}`);
    return 0;
  } catch (error) {
    console.error(`Erro ao processar valor monetário ${valor}:`, error);
    return 0;
  }
}

// Função corrigida para processar valores monetários
function processarValorMonetario(valor) {
  if (valor === null || valor === undefined) return 0;
  
  try {
    console.log(`Processando valor monetário original: ${valor} (tipo: ${typeof valor})`);
    
    // Se já for um número, retornar diretamente (sem multiplicação)
    if (typeof valor === 'number') {
      console.log(`Valor numérico preservado: ${valor}`);
      return valor;
    }
    
    // Se for string, converter corretamente
    if (typeof valor === 'string') {
      // Remover símbolos não numéricos exceto pontos e vírgulas
      let valorLimpo = valor.replace(/[^\d.,]/g, '').trim();
      
      if (valorLimpo === '') return 0;
      
      // Verificar se é formato brasileiro (ex: 1.234,56)
      if (valorLimpo.indexOf('.') < valorLimpo.lastIndexOf(',') && valorLimpo.indexOf('.') !== -1) {
        // Formato brasileiro: converter para formato americano
        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
      } 
      // Verificar se é formato com vírgula como separador decimal sem pontos (ex: 1234,56)
      else if (valorLimpo.indexOf(',') !== -1 && valorLimpo.indexOf('.') === -1) {
        // Formato com vírgula: substituir por ponto
        valorLimpo = valorLimpo.replace(',', '.');
      }
      // Caso contrário, assume-se formato americano (já com pontos corretos)
      
      // Converter para número
      const resultado = parseFloat(valorLimpo);
      console.log(`Valor convertido: ${valor} -> ${resultado}`);
      return resultado;
    }
    
    // Caso não seja possível processar, retornar 0
    return 0;
  } catch (error) {
    console.error(`Erro ao processar valor monetário ${valor}:`, error);
    return 0;
  }
}

// Processar upload de planilha PCA
const uploadPca = async (req, res) => {
  try {
    console.log("Recebendo requisição de upload");
    
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    
    console.log("Arquivo recebido:", req.file.originalname);
    const filePath = req.file.path;
    
    // Usando ID fixo para teste - substitua pelo req.user.id quando a autenticação estiver funcionando
    const userId = 1;
    
    try {
      // Ler arquivo Excel
      console.log("Lendo arquivo Excel de:", filePath);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Converter para JSON
      const data = xlsx.utils.sheet_to_json(worksheet);
      console.log(`Convertido para JSON. ${data.length} registros encontrados.`);
      
      if (data.length === 0) {
        return res.status(400).json({ message: 'Planilha vazia' });
      }
      
      // Mostrar amostra para diagnóstico
      if (data.length > 0) {
        console.log("Amostra da primeira linha:");
        console.log(JSON.stringify(data[0], null, 2));
        
        // Verificar especificamente os campos de data
        console.log("Campo de data início:", data[0]['Data estimada para o início do processo de contratação']);
        console.log("Campo de data conclusão:", data[0]['Data estimada para a conclusão do processo de contratação']);
      }
      
      // Iniciar transação
      console.log("Iniciando transação no banco de dados");
      await db.query('START TRANSACTION');
      
      // Registrar importação
      console.log("Registrando importação na tabela historico_importacao");
      const [importResult] = await db.query(`
        INSERT INTO historico_importacao (
          arquivo, usuario_id, registros_processados, status
        ) VALUES (?, ?, ?, ?)
      `, [req.file.originalname, userId, data.length, 'Processando']);
      
      const importId = importResult.insertId;
      console.log("ID da importação:", importId);
      
      let contratacoesCriadas = 0;
      let contratacoesAtualizadas = 0;
      let erros = [];
      
      // Processar cada linha da planilha
      console.log("Processando linhas da planilha");
      for (const row of data) {
        try {
          // Verificar dados mínimos necessários
          if (!row['Número da contratação'] || !row['Título da contratação']) {
            erros.push(`Linha com dados incompletos: ${JSON.stringify(row)}`);
            continue;
          }
          
          const numeroContratacao = String(row['Número da contratação']);
          console.log(`Processando contratação ${numeroContratacao}`);
          
          // Processar datas
          const dataInicio = processarData(row['Data estimada para o início do processo de contratação']);
          const dataConclusao = processarData(row['Data estimada para a conclusão do processo de contratação']);
          
          console.log(`Datas processadas - Início: ${dataInicio}, Conclusão: ${dataConclusao}`);
          
          // Verificar se a contratação já existe
          const [existentes] = await db.query(
            'SELECT id FROM contratacoes WHERE numero_contratacao = ?', 
            [numeroContratacao]
          );
          
          if (existentes.length > 0) {
            // Atualizar contratação existente
            const id = existentes[0].id;
            console.log(`Atualizando contratação existente ID: ${id}`);
            
            await db.query(`
              UPDATE contratacoes SET
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
                classificacao = ?,
                updated_at = NOW()
              WHERE id = ?
            `, [
              row['Status da contratação'] || null,
              row['Situação da Execução'] || null,
              row['Título da contratação'],
              row['Categoria da contratação'] || null,
              row['UASG Atual'] || null,
              processarValorMonetario(row['Valor total da contratação']),
              dataInicio, // Data formatada
              dataConclusao, // Data formatada
              row['Prazo estimado de duração do processo de contratação (dias)'] || null,
              row['Área requisitante'] || null,
              row['Nº DFD'] || null,
              row['Prioridade'] || null,
              row['Nº do Item no DFD'] || null,
              processarData(row['Data da conclusão da Contratação no DFD']), // Outra data formatada
              row['Classificação da Contratação'] || null,
              id
            ]);
            
            // Remover materiais/serviços existentes
            await db.query('DELETE FROM materiais_servicos WHERE contratacao_id = ?', [id]);
            
            // Adicionar material/serviço
            if (row['Código material/serviço']) {
              console.log(`Adicionando material/serviço para contratação ${id}`);
              await db.query(`
                INSERT INTO materiais_servicos (
                  contratacao_id, codigo_classe, nome_classe, codigo_pdm, nome_pdm,
                  codigo_material, descricao, unidade_fornecimento, valor_unitario,
                  quantidade, valor_total
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                id,
                row['Código Classe/Grupo'] || null,
                row['Nome Classe/Grupo'] || null,
                row['Código PDM material'] || null,
                row['Nome do PDM material'] || null,
                row['Código material/serviço'] || null,
                row['Descrição material/serviço'] || null,
                row['Unidade Fornecimento'] || null,
                processarValorMonetario(row['Valor Unitário']),
                parseInt(row['Quantidade'] || '0'),
                processarValorMonetario(row['Valor Total'])
              ]);
            }
            
            contratacoesAtualizadas++;
          } else {
            // Criar nova contratação
            console.log(`Criando nova contratação: ${numeroContratacao}`);
            
            const [result] = await db.query(`
              INSERT INTO contratacoes (
                numero_contratacao, status_contratacao, situacao_execucao, titulo,
                categoria, uasg, valor_total, data_inicio_estimada, data_conclusao_estimada,
                prazo_estimado, area_requisitante, numero_dfd, prioridade, item_dfd,
                data_conclusao_dfd, classificacao
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              numeroContratacao,
              row['Status da contratação'] || null,
              row['Situação da Execução'] || null,
              row['Título da contratação'],
              row['Categoria da contratação'] || null,
              row['UASG Atual'] || null,
              row['Valor total da contratação'] || 0,
              dataInicio, // Data formatada
              dataConclusao, // Data formatada
              row['Prazo estimado de duração do processo de contratação (dias)'] || null,
              row['Área requisitante'] || null,
              row['Nº DFD'] || null,
              row['Prioridade'] || null,
              row['Nº do Item no DFD'] || null,
              processarData(row['Data da conclusão da Contratação no DFD']), // Outra data formatada
              row['Classificação da Contratação'] || null
            ]);
            
            const contratacaoId = result.insertId;
            console.log(`Nova contratação criada com ID: ${contratacaoId}`);
            
            // Adicionar material/serviço
            if (row['Código material/serviço']) {
              console.log(`Adicionando material/serviço para nova contratação ${contratacaoId}`);
              await db.query(`
                INSERT INTO materiais_servicos (
                  contratacao_id, codigo_classe, nome_classe, codigo_pdm, nome_pdm,
                  codigo_material, descricao, unidade_fornecimento, valor_unitario,
                  quantidade, valor_total
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                contratacaoId,
                row['Código Classe/Grupo'] || null,
                row['Nome Classe/Grupo'] || null,
                row['Código PDM material'] || null,
                row['Nome do PDM material'] || null,
                row['Código material/serviço'] || null,
                row['Descrição material/serviço'] || null,
                row['Unidade Fornecimento'] || null,
                row['Valor Unitário'] || 0,
                row['Quantidade'] || 0,
                row['Valor Total'] || 0
              ]);
            }
            
            contratacoesCriadas++;
          }
        } catch (rowError) {
          console.error('Erro ao processar linha:', rowError);
          erros.push(`Erro na linha ${data.indexOf(row) + 2}: ${rowError.message}`);
        }
      }
      
      // Atualizar status da importação
      console.log("Atualizando status final da importação");
      await db.query(`
        UPDATE historico_importacao SET
          registros_novos = ?,
          registros_atualizados = ?,
          status = ?
        WHERE id = ?
      `, [
        contratacoesCriadas,
        contratacoesAtualizadas,
        erros.length > 0 ? 'Concluído com erros' : 'Concluído',
        importId
      ]);
      
      // Confirmar transação
      console.log("Confirmando transação");
      await db.query('COMMIT');
      
      console.log("Importação concluída com sucesso");
      res.status(200).json({
        message: 'Planilha processada com sucesso',
        registros_processados: data.length,
        contratacoes_criadas: contratacoesCriadas,
        contratacoes_atualizadas: contratacoesAtualizadas,
        erros: erros.length > 0 ? erros : null
      });
    } catch (excelError) {
      // Se houver erro no processamento do Excel, reverta e retorne erro específico
      await db.query('ROLLBACK');
      console.error('Erro ao processar arquivo Excel:', excelError);
      res.status(400).json({ 
        message: 'Erro ao processar arquivo Excel. Verifique o formato do arquivo.',
        error: excelError.message 
      });
    }
  } catch (error) {
    // Captura erros gerais que possam ocorrer durante todo o processo
    try {
      // Tentar reverter transação se houver erro
      await db.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Erro ao reverter transação:', rollbackError);
    }
    
    console.error('Erro ao processar planilha:', error);
    res.status(500).json({ 
      message: 'Erro interno ao processar planilha',
      error: error.message
    });
  }
};

module.exports = {
  uploadPca
};