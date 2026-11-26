# Bella Massa · Gestão de pizzaria

Projeto acadêmico de adaptação do **Sakai Vue**, template da família PrimeFaces, utilizando **Vue 3, PrimeVue 4 e Vite**.

A proposta é uma pizzaria fictícia chamada Bella Massa. O nome, a descrição e os dados de atendimento podem ser alterados na tela **Configurações**.

## Executar localmente

Use Node.js 24 e npm.

```bash
git submodule update --init --recursive
npm ci
npm run dev
```

Abra [a loja](http://127.0.0.1:5173/) e [o painel](http://127.0.0.1:5173/admin). O Vite inicia também a API Express. Use o usuário `admin` para o primeiro acesso. A primeira execução gera a senha em `data/acesso-admin.txt`, junto com o banco `data/bella-massa.sqlite` e a chave local dos JWTs.

No Windows, também é possível executar **INICIAR-LOCAL.cmd**. O script usa o Node disponível no computador ou o runtime local do Codex, quando presente. Mantenha o terminal aberto enquanto utiliza o sistema. Se a porta 5173 já estiver sendo usada pela prévia do projeto, utilize a prévia aberta ou encerre o servidor anterior antes de iniciar outro.

Encerre o servidor de desenvolvimento antes de servir a versão compilada com `npm run build` e `npm start`. Use os comandos abaixo para verificar o projeto.

```bash
npm run test
npm run lint
```

A compilação é gerada em `dist/`. Os arquivos de desenvolvimento ficam em `src/`.

## Telas adaptadas

| Tela          | Funcionalidades                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visão geral   | Indicadores de pedidos, faturamento de pedidos finalizados, etapas da operação, histórico semanal e pizzas mais pedidas.                            |
| Pedidos       | Comandas em lista compacta, busca por pedido, cliente ou item, filtros, cadastro, detalhes, edição de recebidos, exclusão de recebidos ou cancelados e histórico de andamento. |
| Entregas      | Pedidos para entrega, atribuição de entregador, saída para entrega e confirmação de conclusão.                                                      |
| Cardápio      | Cadastro, edição e exclusão de pizzas, bebidas, sobremesas e acompanhamentos com descrição, categoria e preço.                                       |
| Clientes      | Cadastro, edição, exclusão, busca, telefone, endereço com ViaCEP, estados e municípios do IBGE e resumo de compras.                                   |
| Usuários      | Consulta, cadastro, edição, desativação e exclusão de usuários do painel, com credenciais individuais.                                                |
| Configurações | Nome da pizzaria, contato, horários informativos, abertura manual, taxa e prazo de entrega.                                                         |
| Loja          | Banner animado, cardápio com fotos, seleção de tamanho, carrinho, checkout e acompanhamento na conta do cliente. |

Menu, tabelas, formulários, paginação e mensagens estão em português. Valores usam real brasileiro; datas usam o fuso de Fortaleza. O layout se adapta a computador e celular, com navegação por teclado, rótulos e foco visível.

## Como apresentar

1. Na loja, abra **Minha conta → Criar conta**. Confira o novo registro na tela **Clientes** do painel.
2. Para um cadastro feito pela equipe, clique na chave ao lado do cliente. Na loja, use **Minha conta → Ativar cadastro** com o telefone cadastrado e o código de uso único.
3. Escolha uma pizza e seu tamanho, adicione ao carrinho e envie o pedido. O painel atualiza a lista em poucos segundos enquanto estiver aberto. A comanda aparece como **Recebido**, com a indicação **Site**.
4. No painel, avance o pedido pelas etapas **Recebido → Em preparo → No forno → Pronto**. Para entrega, atribua um entregador antes de avançar para **Em entrega**.
5. Na loja, abra **Minha conta → Meus pedidos** para conferir a situação e o número da comanda.

Produtos pausados não podem entrar em novos pedidos. Pedidos já registrados preservam nomes, preços e taxa, mesmo após edições do cardápio. Pizzas pequenas e médias usam 70% e 85% do preço da grande; bebidas e acompanhamentos têm preço por unidade. Faturamento considera apenas pedidos finalizados na data da conclusão, incluindo a taxa de entrega. Pedidos cancelados mantêm seu histórico.

A edição de um pedido fica disponível até o início do preparo. As exclusões pedem confirmação. Produtos e clientes excluídos saem dos cadastros, e os pedidos anteriores mantêm os dados registrados. Pedidos recebidos ou cancelados podem ser excluídos. Cancelar um pedido preserva seu histórico até que ele seja excluído.

### Demonstração técnica

1. Abra o painel em uma janela anônima e pressione **F12 → Network (Rede) → Fetch/XHR**. Limpe a lista antes de cada ação. Em **Headers**, mostre a rota, o método e o status. Em **Payload**, mostre o JSON enviado. Em **Response**, mostre o JSON devolvido pela API.
2. Tente entrar com senha incorreta. Abra `POST /api/admin/login` e compare a resposta `401` com o aviso exibido no centro da tela. Entre com a senha correta e confira o `200`. O servidor grava o JWT no cookie `bella_admin` com o atributo `HttpOnly`.
3. Em **Cardápio**, tente salvar um produto de teste com o nome preenchido e o preço em branco. A API retorna `422` e o painel exibe a mensagem do backend. Na aba **Response**, confira `code: VALIDATION_ERROR` e o campo `/price` em `details`.
4. Preencha o preço e salve novamente. Mostre o `POST /api/admin/products` com status `201`. Use `result.id` da resposta para consultar o produto pelo Swagger. Edite o nome no painel e confira o `PATCH /api/admin/products/{id}` com status `200`. Na loja, mostre o novo nome no cardápio e na resposta de `GET /api/menu`. Para demonstrar a persistência local, reinicie o servidor e carregue a loja novamente.
5. Exclua o produto de teste no painel, confira o `DELETE /api/admin/products/{id}` com status `200` e repita a consulta por ID no Swagger. A API retorna `404`.
6. Faça um pedido pela loja e abra `POST /api/customer/orders` na aba **Network**. Mostre os itens enviados e o número do pedido na resposta. Localize a mesma comanda no painel e use o Swagger para consultar `GET /admin/orders/{id}`. A resposta mostra o cliente vinculado e os itens registrados.

## Dados e escopo desta etapa

O banco SQLite é a fonte compartilhada para cadastros, cardápio, pedidos e configurações. As senhas cadastradas usam hash scrypt com salt. A autenticação emite JWTs assinados com HS256 em cookies HttpOnly separados por perfil. A API valida assinatura, emissor, público, prazo e sessão ativa no SQLite. Sair revoga a sessão. Desativar ou excluir um usuário do painel revoga seus acessos. O carrinho fica no navegador até o envio.

Se o navegador tiver dados da versão anterior, use **Configurações → Importar dados deste navegador** antes da primeira alteração no banco compartilhado. A cópia local continua no navegador.

A carga inicial contém exemplos fictícios. O checkout registra a forma de pagamento para a entrega ou retirada. A configuração de abertura é manual. O código de ativação é entregue ao cliente pela equipe da pizzaria.

As fotos e o fundo da loja são servidos em WebP. O banner e o carrinho respeitam a preferência do sistema por movimento reduzido.

## API e Swagger

- [Swagger UI](http://127.0.0.1:5173/api/docs) para consultar e testar as operações. O painel também oferece o atalho em **Configurações → Swagger da API**.
- [Contrato OpenAPI](http://127.0.0.1:5173/api/openapi.json) em JSON.
- [Verificação de saúde](http://127.0.0.1:5173/api/health) do servidor e da conexão SQLite.

Entre na loja ou no painel no mesmo domínio antes de testar as operações protegidas no Swagger. Você também pode entrar pelo Swagger com `POST /admin/login` ou `POST /customer/login`. Para executar uma rota, expanda a operação, clique em **Try it out**, preencha os dados e clique em **Execute**. O navegador envia o cookie JWT automaticamente. As operações de escrita atuam no banco do ambiente aberto.

O frontend usa Fetch. Os CRUDs administrativos ficam em `/api/admin/customers`, `/api/admin/users`, `/api/admin/products` e `/api/admin/orders`. Use GET e POST na coleção, e GET, PATCH e DELETE no endereço com ID. As consultas de CEP, estados e municípios passam por `/api/addresses`. [ViaCEP](https://viacep.com.br/) · [Serviço de Dados do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades)

A API valida a estrutura das requisições JSON antes de aplicar as regras de negócio. Erros retornam `error`, uma mensagem em português, e `code`, um código estável. Falhas de esquema também incluem `details` com o caminho e a regra do campo. O limite de requisição é de 64 KiB, ou 1 MiB para a importação de dados da versão anterior.

A instalação padrão usa o mesmo domínio para frontend e API. Se o frontend estiver em outra origem, defina `BELLA_MASSA_ALLOWED_ORIGINS` como a lista de origens confiáveis separadas por vírgula e `VITE_BELLA_MASSA_API_URL` como a origem da API no build do frontend. Para origens em sites distintos, use HTTPS, `BELLA_MASSA_SECURE_COOKIES=1` e `BELLA_MASSA_CROSS_SITE_COOKIES=1`. Nesse caso, a sessão depende da política de cookies do navegador.

## Executar no Render

Crie um **Web Service** com runtime Node.js para servir a loja, o painel e a API no mesmo domínio. O projeto usa Node.js 24 e o Render fornece `PORT` ao processo.

O arquivo `render.yaml` descreve a demonstração gratuita como um Blueprint. Ao criar o Blueprint a partir do repositório, o Render gera `BELLA_MASSA_ADMIN_PASSWORD` e `BELLA_MASSA_JWT_SECRET`. A senha fica na página **Environment** do serviço. A loja fica em `/`, o painel em `/admin` e o Swagger em `/api/docs`.

| Configuração | Valor |
| --- | --- |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |
| `BELLA_MASSA_ADMIN_PASSWORD` | Senha do painel com 12 a 128 caracteres, definida como variável de ambiente no Render |
| `BELLA_MASSA_JWT_SECRET` | Chave de assinatura de JWTs com pelo menos 32 bytes, definida como variável de ambiente |
| `BELLA_MASSA_DATA_DIR` | Caminho de montagem do disco persistente, por exemplo `/var/data` |

Para uma demonstração gratuita, use dados descartáveis. O sistema de arquivos do serviço Free é temporário e o SQLite poderá ser recriado em reinícios e novas versões. Para guardar cadastros e pedidos com o SQLite atual, anexe um disco persistente a um serviço pago e defina `BELLA_MASSA_DATA_DIR` com o mesmo caminho da montagem. [Serviços gratuitos](https://render.com/docs/free) · [Discos persistentes](https://render.com/docs/disks)

No Render, o processo escuta em `0.0.0.0` e os cookies de sessão usam o atributo `Secure`. Em outro provedor com proxy HTTPS, defina `BELLA_MASSA_HOST=0.0.0.0` e `BELLA_MASSA_SECURE_COOKIES=1`.

## Organização

- `src/data/pizzaria.js`: dados iniciais da demonstração.
- `src/stores/pizzaria.js`: regras de pedidos, cadastros e configurações.
- `src/stores/admin.js`: carregamento e sincronização do painel.
- `server/`: API Express, autenticação JWT, SQLite e execução do site compilado.
- `src/views/Storefront.vue`: loja pública.
- `src/utils/pizzaria.js`: preços, datas, etapas e indicadores.
- `src/components/pizzaria/`: componentes reutilizáveis de pedido e identidade visual.
- `src/views/pizzaria/`: telas da pizzaria.
- `src/styles/pizzaria.scss`: personalização visual e responsividade.
- `tests/pizzaria.test.mjs`: testes das regras de pedidos e persistência.
- `tests/loja-api.test.mjs`: testes da integração entre loja, painel e servidor.
- `.vercel/backup/`: registros da recuperação do projeto original.

## Entrega U2A2

- Cada integrante trabalha com sua própria conta GitHub e configura neste repositório um nome e um e-mail vinculados a ela. O endereço `noreply` da conta também pode ser usado. Confiram a autoria em **Commits** no GitHub após o push. [Configurar o e-mail de commit](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)
- Dividam mudanças reais que cada pessoa possa apresentar. Por exemplo, uma pessoa pode implementar e testar melhorias no formulário de endereço e a outra pode escrever e executar um teste de integração adicional para login ou revogação. Cada pessoa explica e assina com seu nome um comentário sobre o trecho em que contribuiu, faz o commit e publica a alteração na própria conta. Preservem a autoria dos commits ao integrar as branches.
- No repositório da dupla, executem `npm test`, `npm run lint` e `npm run build`. Depois do deploy, validem a loja, o login do painel, o Swagger e um fluxo de cadastro e pedido com dados fictícios.
- O professor pede o link do repositório GitHub e o projeto funcionando online. Confiram que ele pode acessar os dois links. Um integrante envia pelo Classroom com o tema e os nomes da dupla.

## Créditos

Base: [Sakai Vue](https://github.com/primefaces/sakai-vue), da PrimeTek. Componentes: [PrimeVue](https://primevue.org/). A licença original foi preservada em `LICENSE.md`.
