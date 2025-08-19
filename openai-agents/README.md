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

### 2. (Próximo arquivo)

*   **Descrição:** (Breve descrição do que este arquivo demonstra)
*   **Fluxo:** (Explicação do fluxo de execução)
