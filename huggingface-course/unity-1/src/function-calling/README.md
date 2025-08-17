# Exemplo de Function Calling

Este diretório contém um exemplo de como usar o recurso de function calling da API da OpenAI para criar um agente de IA simples que pode realizar cálculos matemáticos básicos.

## Como funciona

O agente usa um modelo de linguagem grande (LLM) para entender a solicitação do usuário e determinar qual ferramenta usar. Neste caso, a única ferramenta disponível é uma calculadora. O agente então executa a ferramenta com os parâmetros apropriados e usa a saída da ferramenta para gerar uma resposta ao usuário.

## Arquivos

- `agent.ts`: Este arquivo contém a lógica principal do agente. Ele recebe uma solicitação do usuário em linguagem natural, chama a API da OpenAI para determinar qual ferramenta usar, executa a ferramenta e, em seguida, chama a API da OpenAI novamente para gerar uma resposta.
- `tools.ts`: Este arquivo define a `calculatorTool` e a função `executeCalculator`. A `calculatorTool` é um objeto JSON que descreve a ferramenta para a API da OpenAI. A função `executeCalculator` é a implementação real da calculadora.
- `schemas.ts`: Este arquivo define os esquemas de entrada e saída para a `calculatorTool` usando a biblioteca `zod`. Isso garante que os dados passados para e da ferramenta estejam no formato correto.
- `examples.ts`: Este arquivo contém um exemplo de como usar o `AICalculatorAgent`.
