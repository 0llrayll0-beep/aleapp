// obfuscate.js
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Configurações de ofuscação
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

function obfuscateDirectory(inputDir, outputDir) {
  // Criar diretório de saída
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Ler todos os arquivos
  const files = fs.readdirSync(inputDir);

  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    if (fs.statSync(inputPath).isDirectory()) {
      obfuscateDirectory(inputPath, outputPath);
    } else if (file.endsWith('.js')) {
      console.log(`Ofuscando: ${file}`);
      
      try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
        fs.writeFileSync(outputPath, result.getObfuscatedCode());
        console.log(` ${file} ofuscado com sucesso!`);
      } catch (error) {
        console.error(` Erro ao ofuscar ${file}:`, error.message);
        // Copiar arquivo original se falhar
        fs.copyFileSync(inputPath, outputPath);
      }
    } else {
      // Copiar arquivos não-JS
      fs.copyFileSync(inputPath, outputPath);
    }
  });
}

// Executar
const inputDir = './dist';
const outputDir = './dist-obfuscated';

console.log('🔒 Iniciando ofuscação...');
obfuscateDirectory(inputDir, outputDir);
console.log('✨ Ofuscação concluída!');
console.log(`📁 Arquivos ofuscados em: ${outputDir}`);