# wefit-cli

## 1.6.3

### Patch Changes

#### Fixes

- Ajustes para funcionamento do compressor de vídeos no Windows

## 1.6.2

### Patch Changes

#### Fixes

- Remoção de caracteres especiais
- Refatoração dos prompts

## 1.6.1

### Patch Changes

#### Fixes

- Corrigido erro no import da lib ffmpeg
- Alterado cores dos prompts com baixo contraste

## 1.6.0

### Minor Changes

#### Feature

- Adicionado comando `we compress-video` para comprimir vídeos

#### Fixes

- Dependabot - Bumps cross-spawn to 7.0.6 and updates ancestor dependency @changesets/cli

## 1.5.0

### Minor Changes

#### Feature

- Token de acesso do Figma passa a ser armazenado localmente para futuras execuções do comando `we figma-generate`
- Comando `we -v` passa a funcionar com a versão presente no `package.json`

#### Docs

- Alterado imagens do comando de criação do arquivo `.npmrc`

## 1.4.0

### Minor Changes

- 8d58412: Adicionada funcionalidade para criar um arquivo `.npmrc` com credenciais, com comandos e utilitários para gerenciar as credenciais

  #### Feature

  Adicionada nova funcionalidade para criar um arquivo `.npmrc` com credenciais, incluindo comandos e utilitários para gerenciar as credenciais.

  #### Docs

  Foram feitas melhorias nos imports, adicionando central de exports dos comandos.
  Acrescentado também toggle para as documentações de cada comando.

  #### Chore

  Atualizadas as bibliotecas para remover warnings de auditoria.

## 1.3.0

### Minor Changes

- 11b6e79: Adicionado changeset para controle de versões do projeto
  Alterado a documentação do File ID do Figma para o novo padrão

  #### Fix:

  Corrigido erro ao gerar ícones por requisição com parâmetros muito grande.
