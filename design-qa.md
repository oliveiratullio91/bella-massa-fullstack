# Verificação visual do painel Bella Massa

A tela `/admin/pedidos` foi comparada no estado inicial, com o filtro Todos e a primeira página de pedidos fictícios. A referência é a imagem aprovada `C:/Users/tassi/.codex/generated_images/01a1f501-d15a-7c33-b449-c65538b24103/exec-f8634b90-d93f-4d7b-ba09-9408149197a2.png`.

## Evidências

- Capturas do Chrome em `C:/Users/tassi/.codex/visualizations/2026/11/19/01a1f501-d15a-7c33-b449-c65538b24103`.
- `bella-massa-admin-desktop.jpg` mostra a implementação na área de exibição de 1487 × 1058 CSS px, com densidade 1. A captura de 1472 × 1048 px foi normalizada para 1487 × 1058 px antes da comparação com a referência.
- `bella-massa-admin-comparacao.jpg` mostra a referência à esquerda e a implementação à direita. `bella-massa-admin-comparacao-cartao.jpg` amplia o cartão #1027, incluindo os itens, valores e ações.
- `bella-massa-admin-celular.jpg` mostra a tela a 390 × 844 CSS px, com um pedido criado no teste isolado. A grade também foi verificada a 800 × 1000 CSS px, com duas colunas. Nenhuma das três larguras apresentou rolagem horizontal.

## Comparação

- **Tipografia.** Georgia reproduz a hierarquia serifada do nome da pizzaria e do título. A fonte do sistema mantém números, nomes, estados e ações legíveis nos cartões.
- **Espaçamento.** A composição exibe seis cartões em três colunas no desktop. A grade reduz para duas colunas no tablet e uma no celular. A navegação inferior acomoda os seis destinos.
- **Cores.** O creme e o verde-oliva seguem a referência. As situações mantêm rótulos visíveis, e os botões de edição e exclusão usam terracota com contorno.
- **Imagem.** O logotipo do projeto foi reutilizado. O fundo WebP de 16 KB repete os traços claros dos cantos da referência, com as áreas de busca e cartões em superfícies opacas.
- **Conteúdo.** As comandas exibem os itens e valores armazenados. O subtítulo acompanha o cadastro da pizzaria. Os horários, a paginação e os filtros avançados foram mantidos para operar a lista real.

## Ajustes e testes

- Na primeira captura, os contornos de Visualizar e Excluir estavam claros demais e a paginação criava uma faixa branca junto ao menu. Os contornos foram ajustados para oliva e terracota, e a paginação passou a usar o próprio fundo da tela. A comparação final confirma as correções.
- Na cópia isolada, foram verificados busca por item, filtro Em preparo, abertura dos filtros avançados, paginação e navegação pelas seis telas. Um pedido foi criado, editado e conferido após recarregar a página. O diálogo de exclusão abriu com foco em Voltar, e essa ação manteve o pedido. As exclusões foram cobertas pelos testes automatizados.
- A compilação, o lint e os 13 testes passaram. O console do Chrome ficou sem erros registrados durante a verificação.

## Revisão de responsividade

- Com os dados de demonstração e o modo automático, a lista de Pedidos passou de 242 px para 0 px de rolagem vertical inicial em 1366 × 768 e de 1.346 px para 0 px em 390 × 844. A tela exibe seis comandas no desktop, quatro no tablet e duas no celular. A paginação fica acima da grade.
- A Visão geral passou de 1.646 px de altura para caber na área de 1366 × 768. Em 390 × 844 restaram 21 px de rolagem, com o resumo de vendas fechado. Os gráficos e produtos mais pedidos continuam acessíveis ao abrir esse resumo.
- Foram conferidas telas de 320, 390, 800, 1280 e 1366 px, sem rolagem horizontal nas telas de Visão geral e Pedidos. Em 320 × 640, a lista de Pedidos precisou de 17 px de rolagem vertical. A aba principal voltou ao tamanho padrão do Chrome.
- Foram verificados no navegador a paginação, a escolha de quantidade por página, a abertura dos detalhes de vendas, o menu Mais e os diálogos de edição e exclusão. O console ficou sem erros registrados.
- As novas capturas ficam no mesmo diretório de evidências. Os arquivos são `bella-massa-pedidos-compacto-desktop.jpg`, `bella-massa-pedidos-compacto-celular.jpg` e `bella-massa-visao-geral-compacta.jpg`.

## Loja pública e integração

- A referência aprovada é `C:/Users/tassi/.codex/generated_images/01a1f501-d15a-7c33-b449-c65538b24103/exec-508f0ffb-71de-4b14-8fc8-46fdb900ad81.png`. As capturas da loja renderizada no Chrome ficam no diretório de evidências descrito acima.
- A comparação no estado de entrega com duas pizzas no carrinho está em `bella-massa-loja-comparacao.jpg` e o recorte do carrinho está em `bella-massa-loja-comparacao-carrinho.jpg`. A referência tem 1536 × 1024 px. A captura de 1521 × 1014 px foi normalizada para a comparação com o viewport de 1536 × 1024 CSS px.
- **Tipografia e conteúdo.** O título serifado, as fotos, os tamanhos e os botões de pedido seguem a proposta. A ação Minha conta está no cabeçalho. O carrinho inicia vazio e reflete os itens do cliente.
- **Espaçamento, cor e imagens.** Cabeçalho, banner, cardápio e carrinho se alinham numa grade centralizada de até 1.280 px. O fundo areia aparece até as bordas. O banner e as seis fotos de pizza em WebP preservam a composição. O banner se move lentamente, com alternativa estática para a preferência de movimento reduzido.
- **Celular.** Na primeira captura, a segunda linha de categorias deslocou a ação Adicionar para trás do carrinho fixo. As categorias passaram a compartilhar uma faixa horizontal e o banner ganhou altura menor. A captura final `bella-massa-loja-celular.jpg` mostra a primeira pizza, o botão Adicionar e o carrinho juntos em 390 × 844 CSS px, com 18 px de margem e sem rolagem horizontal na página.
- **Integração.** No servidor isolado, o cadastro criado na loja apareceu no painel e o pedido #1028 apareceu como Recebido, com a origem Site e total de R$ 95,32. Um cadastro criado no painel foi ativado na loja com código de uso único, exibindo o endereço cadastrado. O carrinho lateral também foi aberto no celular.
- A compilação, o lint e os 17 testes passaram. A API administrativa respondeu 401 sem sessão. A senha do painel e o arquivo SQLite ficaram fora do Git e indisponíveis pelas rotas públicas. Os fluxos verificados no Chrome ficaram sem erros no console.

final result: passed
