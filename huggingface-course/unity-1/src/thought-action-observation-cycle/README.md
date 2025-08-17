# Ciclo Thought-Action-Observation

Este diretório contém um exemplo de como implementar um agente de IA que segue o ciclo "Thought-Action-Observation" (Pensamento-Ação-Observação) para responder a perguntas sobre livros.

## Como funciona

O agente utiliza um modelo de linguagem grande (LLM) para seguir um ciclo de três etapas:

1.  **Thought (Pensamento)**: O agente analisa a pergunta do usuário e decide qual ação tomar. Ele pode responder diretamente ou usar uma ferramenta de busca de livros.
2.  **Action (Ação)**: Se o agente decidir usar a ferramenta, ele a executa com os parâmetros necessários (neste caso, o título do livro).
3.  **Observation (Observação)**: O agente recebe o resultado da ferramenta e o utiliza para formular uma resposta final e completa para o usuário.

Este ciclo permite que o agente realize tarefas mais complexas, dividindo-as em etapas menores e mais gerenciáveis.

## Arquivos

- `book-agent.ts`: Contém a lógica principal do agente de livros, incluindo o ciclo "Thought-Action-Observation" e a comunicação com a API da OpenAI.
- `database.ts`: Simula um banco de dados de livros e fornece a ferramenta `bookLookupTool` para buscar informações sobre os livros.
- `types.ts`: Define os tipos de dados TypeScript usados no projeto.