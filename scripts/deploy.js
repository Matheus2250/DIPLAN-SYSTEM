// scripts/deploy.js
const { execSync } = require('child_process');

console.log('📦 Preparando arquivos para deploy...');

try {
  // Compacta a pasta dist após o build
  execSync('cd dist && zip -r ../build.zip .');
  console.log('✅ Arquivos compactados com sucesso!');
  
  // Substitua com as informações do seu servidor
  const SERVER = 'usuario@seu-servidor.com';
  const REMOTE_PATH = '/caminho/para/diretorio/web';
  
  // Envia o arquivo para o servidor
  console.log('🚀 Enviando para o servidor...');
  execSync(`scp build.zip ${SERVER}:${REMOTE_PATH}`);
  
  // Descompacta no servidor e faz limpeza
  console.log('📂 Descompactando no servidor...');
  execSync(`ssh ${SERVER} "cd ${REMOTE_PATH} && unzip -o build.zip && rm build.zip"`);
  
  // Opcional: reinicia serviços no servidor, se necessário
  console.log('🔄 Reiniciando serviços...');
  execSync(`ssh ${SERVER} "pm2 restart diplan-api || echo 'Serviço não encontrado'"`);
  
  // Limpa arquivos locais
  execSync('rm build.zip');
  
  console.log('✅ Deploy concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro durante o deploy:', error.message);
  process.exit(1);
}