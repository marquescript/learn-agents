# Estudo do Framework @openai/agents

Este repositório contém exemplos práticos e estudos sobre o uso do framework `@openai/agents` para a criação de assistentes de IA e orquestração de múltiplos agentes.

## Fluxos de Execução

### 1. `src/overview.ts`

Este arquivo demonstra um fluxo fundamental de orquestração de agentes.

**O que o código faz?**

O script estabelece um sistema onde um agente principal (de triagem) direciona uma pergunta do usuário para o agente especialista mais adequado para respondê-la.

**Fluxo de Execução:**

1.  **Definição de Ferramenta (`tool`):**
    *   Uma ferramenta chamada `historyFunFact` é criada. Sua única função é fornecer um fato histórico interessante. Ferramentas são habilidades que podem ser atribuídas a agentes.

2.  **Criação de Agentes Especialistas:**
    *   `historyTutorAgent`: Um agente focado em história, equipado com a ferramenta `historyFunFact`.
    *   `mathTutorAgent`: Um agente focado em matemática, sem ferramentas específicas neste exemplo.

3.  **Criação do Agente de Triagem (`triageAgent`):**
    *   Este é o agente orquestrador. Sua instrução é analisar a pergunta do usuário e decidir qual agente especialista deve assumir a tarefa.
    *   Ele conhece os agentes especialistas através da propriedade `handoffs`.

4.  **Execução (`run`):**
    *   A função `run` é chamada com o `triageAgent` e a pergunta: `"Qual é um fato interessante sobre a história?"`.
    *   O `triageAgent` identifica que a pergunta é sobre história e aciona (`handoff`) o `historyTutorAgent`.
    *   O `historyTutorAgent` utiliza sua ferramenta para gerar a resposta, que é então exibida no console.

Este exemplo ilustra o padrão de **orquestração**, um conceito central para construir sistemas de IA complexos e modulares com múltiplos agentes.

---

### 2. `src/agents.ts`

Este arquivo demonstra dois conceitos avançados do framework `@openai/agents`: passar dados contextuais para um agente e manter um histórico de conversa contínuo.

**Fluxo de Execução:**

O script é dividido em duas funções assíncronas principais: `contextExample` e `conversationExample`.

---

#### `contextExample`

Esta função mostra como passar dados de contexto específicos de uma sessão para um agente, permitindo que ele tome decisões ou acesse informações restritas com base nesse contexto.

1.  **Dados e Contexto:**
    *   Um array `userPurchases` simula um banco de dados de compras de usuários.
    *   Interfaces `Purchase` e `UserContext` definem a estrutura dos dados de compra e do contexto do usuário (como `uid`, `userName`, `isProUser`).

2.  **Ferramenta com Acesso ao Contexto (`getPurchasesTool`):**
    *   Uma ferramenta é criada para buscar as compras de um usuário.
    *   Crucialmente, a função `execute` da ferramenta recebe um `runContext`. Este objeto contém os dados da sessão que foram passados durante a chamada `run`.
    *   A ferramenta usa `runContext.context.userName` para encontrar o usuário correto e `runContext.context.isProUser` para verificar se o usuário tem permissão para acessar os dados. Isso demonstra um controle de acesso simples.

3.  **Criação e Execução do Agente:**
    *   Um novo `Agent` é criado, especificando que ele trabalhará com o tipo `UserContext`.
    *   A função `run` é chamada, passando não apenas a pergunta do usuário ("Quais são minhas compras pendentes?"), mas também um objeto `context` com os dados do usuário "carlos".

4.  **Resultado:**
    *   O agente usa a ferramenta, a ferramenta acessa o contexto para buscar as compras do usuário "carlos" e retorna apenas as que estão com status "pending".

---

#### `conversationExample`

Esta função demonstra como manter o estado de uma conversa, permitindo que o agente se lembre de interações anteriores.

1.  **Histórico da Conversa (`thread`):**
    *   Uma variável `thread` é inicializada como um array vazio. Ela será usada para armazenar todo o histórico da conversa (mensagens do usuário e do assistente).

2.  **Função `useSays`:**
    *   Esta função encapsula a interação com o agente.
    *   A cada chamada, ela concatena a nova mensagem do usuário (`text`) com o histórico existente (`thread`).
    *   Ela chama a função `run` com o histórico completo.
    *   Após receber a resposta, ela atualiza o `thread` com o novo histórico retornado pelo `result.history`.

3.  **Execução da Conversa:**
    *   A primeira pergunta é feita: "Em qual cidade fica a ponte Golden Gate?". O agente responde.
    *   A segunda pergunta é feita: "E qual o estado dessa cidade?". Como o histórico da primeira pergunta e resposta foi mantido e reenviado, o agente entende que "essa cidade" se refere a São Francisco e responde corretamente.

Este exemplo ilustra como construir conversas contínuas e com memória, que são a base para qualquer chatbot ou assistente virtual.

---

### 3. `src/agent-exception.ts`

Este arquivo explora como lidar com erros e implementar mecanismos de fallback robustos ao trabalhar com o framework `@openai/agents`. É crucial para construir sistemas de IA resilientes que possam se recuperar de falhas inesperadas ou limitações.

**O que o código faz?**

O script ilustra cenários onde um agente pode encontrar erros (por exemplo, uma ferramenta que falha, um modelo que retorna uma resposta inválida, ou um limite de uso excedido) e como o sistema pode ser configurado para reagir a essas falhas de forma controlada, em vez de simplesmente travar.

**Conceitos Abordados:**

1.  **Tratamento de Erros em Ferramentas (`Tools`):**
    *   Como as ferramentas podem sinalizar falhas e como o agente pode capturar e reagir a essas exceções.
    *   Implementação de lógica de `try-catch` dentro das ferramentas ou na sua execução.

2.  **Mecanismos de Fallback:**
    *   Definição de um comportamento alternativo (fallback) quando a execução principal de um agente falha. Isso pode incluir:
        *   Redirecionar a requisição para um agente mais genérico.
        *   Fornecer uma resposta padrão ou uma mensagem de erro amigável ao usuário.
        *   Tentar uma abordagem diferente para a mesma tarefa.

3.  **Estratégias de Resiliência:**
    *   Discussão sobre como projetar agentes para serem mais tolerantes a falhas, minimizando o impacto de problemas isolados.

**Exemplos de Cenários:**

*   Uma ferramenta de busca de dados que falha ao conectar a um serviço externo.
*   Um modelo de linguagem que retorna um erro de validação ou excede um limite de tokens.
*   Um agente que não consegue encontrar uma resposta adequada e precisa de um "plano B".

Este exemplo é fundamental para garantir a estabilidade e a confiabilidade de aplicações construídas com `@openai/agents`, permitindo que elas continuem operando mesmo diante de condições adversas.
