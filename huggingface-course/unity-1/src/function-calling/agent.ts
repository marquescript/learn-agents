import "dotenv/config";
import OpenAI from "openai";
import { calculatorTool, executeCalculator } from "./tools";

const client = new OpenAI()

const model = "o4-mini-2025-04-16"

export class AICalculatorAgent {

    async run(userMessage: string): Promise<string> {
        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: "system", content: "Você é um assistente de calculadora que realiza operações matemáticas básicas (soma, subtração, multiplicação e divisão)." },
            { role: "user", content: userMessage }
        ]

        const response = await client.chat.completions.create({
            model,
            messages,
            tools: [calculatorTool],
            tool_choice: "required"
        })

        const message = response.choices[0].message
    
        if(message.tool_calls) {
            messages.push({
                role: "assistant",
                content: message.content,
                tool_calls: message.tool_calls
            })

            for (const toolCall of message.tool_calls) {
                if(toolCall.type === "function" && toolCall.function.name === "calculator") {
                    try {
                        const args = JSON.parse(toolCall.function.arguments)
                        const result = await executeCalculator(args)
                        
                        messages.push({
                            role: "tool",
                            content: JSON.stringify(result),
                            tool_call_id: toolCall.id
                        })
                    }catch(error) {
                        console.error(error)
                        messages.push({
                            role: "tool",
                            content: JSON.stringify({ error: "Erro ao executar a calculadora" }),
                            tool_call_id: toolCall.id
                        })
                    }
                }
            }

            const finalResponse = await client.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: "Responda a pergunta do usuário com base nas informações fornecidas pela calculadora, e fale qual tool foi utilizado para obter a resposta" },
                    ...messages
                ]
            })

            return finalResponse.choices[0].message.content || "Desculpe, não consegui calcular a operação."
        }

        return message.content || "Desculpe, não consegui calcular a operação."
    }
}