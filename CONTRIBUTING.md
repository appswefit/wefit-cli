## Introdução

Obrigado por se interessar em contribuir com a CLI da WeFit 🤎. O apoio de nossos TechDesigners é fundamental para a manutenção e continuidade desse projeto, que visa facilitar nosso dia a dia.

Nós aceitamos todo tipo de contribuição, não apenas código. Você pode contribuir com:

- **Apontamento de BUGs**: Ao utilizar a CLI e perceber comportamentos inesperados você pode reportar isso nas *issues* desse repositório.

- **Documentação**: Ajude-nos a melhorar a documentação das funcionalidades disponíveis.

- **Novas funcionalidades**: Como dito anteriormente, o objetivo desta ferramenta é facilitar o dia a dia dentro da WeFit. Se você vê uma funcionalidade que poderia ser adicionada para ajudar nesse objetivo, fique a vontade para abrir uma *Pull Request* com novas implementações, ou caso não saiba ao certo como "codar" essa funcionalidade, você pode abrir uma issue sugerindo essa funcionalidade com as labels ***enhancement*** e  ***need help***

- **Refatorações**: Fique a vontade para submeter melhorias na base de código.

## Como contribuir com a base de código

Todas as alterações na base de código deste repositório é realizada através da abertura de *pull requests* seguindo este fluxo:
#### 1 - Crie uma cópia local do repositório

```bash
git clone https://github.com/appswefit/wefit-cli.git
cd wefit-cli
```

#### 2 - Crie uma nova branch

```bash
git checkout -b feature/awesome-new-feature
```

#### 3 - Faça o push das mudanças para o github

```bash
git push origin feature/awesome-new-feature
```

#### 4 - Abra a Pull Request
Na própria interface do github ou através da CLI do próprio github, realize a abertura da pull request, apontando para a branch `main`

## Controle de Alterações com Changeset

Ao realizar alterações neste projeto, é necessário atualizar o arquivo `CHANGELOG.md` para isso utilize o comando

```bash
  npm run changeset
```

Este comando irá criar um arquivo dentro da pasta `.changeset` na raiz do projeto, neste arquivo devem ser listadas todas as alterações realizadas, e ao final deve ser executado o comando.

```bash
  npm run version-packages
```

Com esse comando a versão do projeto e o arquivo `CHANGELOG.md` são atualizados.