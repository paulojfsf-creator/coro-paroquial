# 🎵 Sistema de Gestão Coral - Versão 24

## Coro Paroquial São João Batista de Rio Caldo

---

## 📦 Conteúdo do Pacote

Este pacote contém a **versão 24** completa do sistema de gestão coral, com a nova funcionalidade de **Sugestões Inteligentes**.

### Arquivos Incluídos

```
📁 site_coral_v24_completo/
│
├── 📄 README.md                      ← Este arquivo
├── 📄 INSTALACAO_RAPIDA.md           ← Guia de instalação passo a passo
├── 📄 ALTERACOES_V24.md              ← Documentação técnica completa
├── 📄 COMPARACAO_V22_V24.md          ← Comparação entre versões
├── 📄 GUIA_VISUAL.md                 ← Guia visual da interface
│
├── 📄 index_v24.html                 ← Arquivo HTML principal
├── 📁 scripts/
│   └── 📄 scripts.js                 ← JavaScript com todas as funcionalidades
│
└── 📦 site_coral_v24_completo.zip    ← Pacote completo comprimido
```

---

## ⚡ Início Rápido

### 1. Extrair arquivos
```bash
Descompacte o arquivo site_coral_v24_completo.zip
```

### 2. Renomear arquivo principal
```bash
Renomeie index_v24.html para index.html
```

### 3. Configurar Google Sheets
No arquivo `scripts/scripts.js`, atualize a URL:
```javascript
const SHEET_CSV_URL = 'SUA_URL_AQUI';
```

### 4. Testar localmente
Abra `index.html` num navegador moderno

### 5. Fazer deploy
Upload para Netlify, GitHub Pages, Vercel, ou outro serviço

📖 **Detalhes completos:** Veja `INSTALACAO_RAPIDA.md`

---

## 🆕 Novidades da V24

### 💡 Sistema de Sugestões Inteligentes

A grande novidade da V24 é a **aba Sugestões**, que:

✨ **Sugere automaticamente** os 3 melhores cânticos para cada parte do programa  
📊 **Calcula scores** baseados em 5 critérios litúrgicos  
🔄 **Evita repetições** penalizando cânticos usados recentemente  
⚡ **Economiza tempo** - reduz preparação de 15-20 min para 5-8 min  
🎯 **Mantém qualidade** - sugestões baseadas em critérios objetivos  

### Como Funciona

1. **Análise do contexto litúrgico** (tempo, cor, ciclo, celebração)
2. **Pontuação de todos os cânticos** do catálogo
3. **Ordenação por relevância** para cada parte
4. **Apresentação dos top 3** com informação completa
5. **Uso com 1 clique** direto no programa

---

## 📚 Documentação

### Para Começar
- 📄 **INSTALACAO_RAPIDA.md** - Guia passo a passo para instalar
- 📄 **GUIA_VISUAL.md** - Como fica a interface, com exemplos

### Para Entender
- 📄 **ALTERACOES_V24.md** - Documentação técnica completa
- 📄 **COMPARACAO_V22_V24.md** - Diferenças entre versões

### Seções Principais

#### 📖 INSTALACAO_RAPIDA.md
```
✓ Passos de instalação
✓ Configuração do Google Sheets
✓ Teste local
✓ Deploy
✓ Resolução de problemas
✓ Checklist completo
```

#### 📖 ALTERACOES_V24.md
```
✓ Visão geral das alterações
✓ Sistema de pontuação explicado
✓ Interface visual
✓ Funcionalidades técnicas
✓ Estrutura de dados
✓ Como usar
✓ Melhorias futuras
```

#### 📖 COMPARACAO_V22_V24.md
```
✓ Tabela comparativa
✓ Fluxo de trabalho antes/depois
✓ Melhorias de produtividade
✓ Casos de uso reais
✓ Custo-benefício
✓ Recomendações
```

#### 📖 GUIA_VISUAL.md
```
✓ Mockups da interface
✓ Exemplos práticos
✓ Cores e indicadores
✓ Vista mobile
✓ Interações do utilizador
```

---

## 🎯 Funcionalidades Completas

### Mantidas da V22
✅ Dashboard com resumo  
✅ Programa litúrgico completo  
✅ Motor litúrgico (tempos, cores, ciclos)  
✅ Catálogo sincronizado com Google Sheets  
✅ Histórico de programas  
✅ Gestor de ensaios  
✅ Folheto para impressão/PDF  
✅ Drag & drop para reordenar  
✅ Tema escuro/claro  
✅ Cores litúrgicas dinâmicas  

### Novas na V24
🆕 **Aba Sugestões** com sistema inteligente  
🆕 **Pontuação de relevância** por cântico  
🆕 **Alertas de uso recente** automáticos  
🆕 **Análise litúrgica avançada**  
🆕 **Evitar repetições** inteligente  

---

## 💻 Requisitos

### Sistema
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript ativado
- localStorage disponível
- Ligação à internet (para Google Sheets)

### Opcional
- Conta Netlify/GitHub/Vercel para hosting
- Google Sheets com catálogo publicado

---

## 🎨 Personalização

### Ajustar Pesos de Pontuação
Edite `scripts/scripts.js`, função `scoreSongForContext()`:
```javascript
// Adequação da secção
score += 40;  // Altere aqui

// Tempo litúrgico
score += 25;  // Altere aqui
```

### Alterar Número de Sugestões
Edite `scripts/scripts.js`, função `buildSuggestionsForDay()`:
```javascript
suggestions[part.id] = scored.slice(0, 3);  // Altere o 3
```

### Cores Litúrgicas
Edite `index_v24.html`, seção CSS:
```css
body.liturgic-advento {
  --header-bg: #4b2c6f;  /* Sua cor */
}
```

---

## 🔧 Resolução de Problemas

### Sugestões não aparecem
✓ Selecione uma data no Programa  
✓ Verifique se catálogo está carregado  
✓ Clique novamente na aba Sugestões  

### Catálogo vazio
✓ Verifique URL do Google Sheets  
✓ Confirme que sheet está publicada  
✓ Clique em "Atualizar catálogo"  

### Layout quebrado
✓ Confirme estrutura de pastas correta  
✓ Verifique caminho do scripts.js  
✓ Limpe cache do navegador  

### Histórico perdido
✓ localStorage foi limpo  
✓ Dados não são recuperáveis  
✓ Faça backups regulares  

---

## 📊 Estrutura do Google Sheets

### Colunas Necessárias (mínimo)
```
Título | Autor | Secção | Tempo | Tags | Letra
```

### Exemplo de Linha
```
Vinde, Cantai ao Senhor | J. Silva | Entrada | Advento | alegria,louvor | [letra completa]
```

### Dicas
- Use vírgulas nas Tags para múltiplas palavras-chave
- Preencha Secção e Tempo para melhores sugestões
- Letra é opcional mas recomendada

---

## 🚀 Roadmap Futuro

### Em Consideração
- Filtros personalizados nas sugestões
- Preferências de cânticos por utilizador
- Estatísticas de uso do repertório
- Sugestões baseadas em aprendizagem
- Compatibilidade com tonalidades
- Sincronização multi-dispositivo
- Gestão de partituras e gravações

---

## 📞 Suporte

### Documentação
Consulte os arquivos .md incluídos para informação detalhada.

### Problemas Técnicos
1. Verifique consola do navegador (F12)
2. Confirme estrutura de ficheiros
3. Teste com data diferente
4. Limpe cache

### Questões
Entre em contacto com o desenvolvedor da aplicação.

---

## 📜 Versões

### V24 (Atual) - Novembro 2024
✨ Sistema de Sugestões Inteligentes  
✨ Pontuação automática de relevância  
✨ Alertas de uso recente  
🔧 Mantém toda funcionalidade V22  

### V22 - Anterior
✓ Dashboard e ensaios  
✓ Programa e histórico  
✓ Catálogo e folheto  

---

## 📄 Licença

Sistema desenvolvido para uso do Coro Paroquial São João Batista de Rio Caldo.

---

## 🎵 Sobre

Este sistema foi desenvolvido para facilitar a preparação de celebrações litúrgicas, oferecendo:
- Organização eficiente do repertório
- Adequação litúrgica precisa
- Variedade no uso dos cânticos
- Economia de tempo na preparação
- Qualidade consistente nos programas

**Preparado com dedicação para a comunidade de Rio Caldo** 🙏

---

## 🎯 Próximos Passos

1. ✅ Ler `INSTALACAO_RAPIDA.md`
2. ✅ Configurar Google Sheets
3. ✅ Instalar sistema
4. ✅ Testar funcionalidades
5. ✅ Preparar primeiro programa
6. ✅ Explorar aba Sugestões
7. ✅ Dar feedback

---

**Versão 24 - Novembro 2024**  
**Desenvolvido para Coro Paroquial São João Batista de Rio Caldo**

🎵 _"Cantai ao Senhor um cântico novo"_ 🎵
