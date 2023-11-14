# WeFit CLI

Ferramenta desenvolvida pela WeFit para auxiliar nossos TechDesigners.

## Instalação

- Instalar no npm global com o seguinte comando:

```bash
npm install -g wefit-cli
```

- Testar a instalação chamando a CLI:

```bash
we
```

![We Sucesso](./images/we-success.png)

## Comandos

### Ajuda

Para verificar os possíveis comandos

```bash
we -h
```

![Comando de ajuda, `we -h` executado](./images/help.png)

### Tradução

Para rodar os comandos de tradução é preciso estar no mesmo nível da pasta locales

- **translation-export**: Exporta os arquivos da pasta locales para xlsx
- **translation-import**: Importa a planilha de tradução

### Figma

- **figma-generate**: Executa a exportação do DS e gera os arquivos no local da execução do comando:

  - /assets/icons/config.json

  ### Ao exucetar o comando abaixo você vai precisar inserir dois token prompt:

  ```bash
  we figma-generate # we fg
  ```

  - Token de usuário do Figma, que pode ser gerado aqui:
    ![We Sucesso](./images/user-config.png)
    ![We Sucesso](./images/generate-token.png)

  - ID do arquivo do Figma, você pode pegar na url logo após o *www.figma.com/file/*
    ![We FigmaUrl](./images/figma-url.png)

  ### Atualizando a lista de tipagem de nomes dos ícones

  Após executar a importação do figma e ter seu config.json atualizado é preciso seguir os seguintes passos:

  - Adicionar em seu `package.json` o script:

  ```
  "update:icon": "node caminho/para-o-arquivo/generateIconType.js"
  ```

  - Executar `npm run update:icon`

  Você encontrar o script `generateIconType.js` e o componente React que renderiza ícones a partir do `icon/config.json` [aqui](./templates/Icon/)

### Credencial Devops

Para executar o comando de atualização de credencial, você pode estar em qualquer parte do sistema.

- **set-git-credential**: Seta a nova credencial para o repositório

```bash
we set-git-credential sua_nova_credencial # we sgc sua_nova_credencial
```

A partir desse comando, será solicitado o _path_ do repositório que deverá ser atualizado e o que você quer fazer, executar o comando ou copiar para a área de transferência.

![Comando `we sgc` executado por completo](./images/set-git-credential.png)

## Templates

Abaixo a lista de templates.

- [Componente de ícone icon/config.json - React](./templates/Icon/)
