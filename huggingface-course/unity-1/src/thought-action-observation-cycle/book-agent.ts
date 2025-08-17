import * as dotenv from "dotenv";

import OpenAI from "openai";
import { Message, ToolCall } from "./types";
import { bookLookupTool, booksDatabase } from "./database";

dotenv.config()

const model = "gpt-3.5-turbo"

const token = process.env.OPENAI_API_KEY

if(!token) {
    throw new Error("OPENAI_API_KEY is not set");
}

const client = new OpenAI({
    apiKey: token
})

function parseToolCall(content: string): ToolCall | null {
    const toolCallRegex = /book_lookup\s*\(\s*title\s*=\s*["']([^"']+)["']\s*\)/i
    const match = content.match(toolCallRegex)

    if(!match) return null

    return {
        toolName: "book_lookup",
        args: {
            title: match[1]
        }
    }
}

// Executar a ferramenta/tool
function executeTool(toolCall: ToolCall): string {
    if(toolCall.toolName === "book_lookup") {
        return bookLookupTool(toolCall.args)
    }

    return `ferramenta ${toolCall.toolName} não encontrada`
}

//Chamar o LLM
async function callLLM(messages: Message[]): Promise<string> {
    try {
        const responseLLM = await client.chat.completions.create({
            messages,
            model,
            max_completion_tokens: 200,
            top_p: 1.0
        })

        const response = responseLLM.choices[0]?.message.content

        if(!response) {
            throw new Error("No response from the model")
        }

        return response
    }catch(error) {
        console.log(error)
        throw new Error(`Erro ao chamar o LLM: ${error instanceof Error ? error.message : String(error)}`)
    }
}

function createSystemPrompt(): string {
    const availableBooks = Object.keys(booksDatabase).join(", ")

    return `
        Você é um assistente especializado em livros e literatura.

        FERRAMENTA DISPONÍVEL:
        - book_lookup: Busca informações detalhadas sobre um livro pelo título

        LIVROS NA BASE DE DADOS:
        ${availableBooks}

        INSTRUÇÕES PARA O CICLO THOUGHT-ACTION-OBSERVATION:

        1. **THOUGHT**: Analise a pergunta do usuário sobre livros
        - Se for sobre um livro específico → use a ferramentas
        - Se for pergunta geral → responda diretamente

        2. **ACTION**: Para buscar um livro, responda EXATAMENTE assim:
        book_lookup(title="Nome Exato do Livro")

        3. **OBSERVATION**: Após receber os dados, formule uma resposta completa

        EXEMPLOS:
        - "Me fale sobre Dom Casmurro" → book_lookup(title="Dom Casmurro")
        - "Quem escreveu 1984?" → book_lookup(title="1984")
        - "O que você sabe sobre Jane Austen?" → book_lookup(title="Pride and Prejudice")

        Se o usuário perguntar sobre livros que não estão na base, informe quais livros estão disponíveis.

        Seja sempre educativo e entusiasmado sobre literatura!
    `    
}

//Loop principal: Ciclo Thought-Action-Observation
async function runBookAgent(userQuestion: string, maxIterations: number = 3): Promise<any> {
    const messages: Message[] = [
        { role: "system", content: createSystemPrompt() },
        { role: "user", content: userQuestion }
    ]

    for(let iteration = 1; iteration <= maxIterations; iteration++) {
        try {
            //Thought: LLM analisando a situação
            const responseContent = await callLLM(messages)
            
            const toolCall = parseToolCall(responseContent)

            if(toolCall) {
                //Action: Executa busca de livro
                const toolCallResult = executeTool(toolCall)

                messages.push({
                    role: "assistant",
                    content: responseContent
                })
                messages.push({
                    role: "function",
                    name: toolCall.toolName,
                    content: toolCallResult
                })
            } else {
                //Resposta final
                return responseContent
            }

        }catch(error) {
            console.log(error)
            return "Erro ao processar"
        }
    }

    return "Limite de iterações atingido. Não foi possível completar a busca"
}

async function testBookAgent(): Promise<void> {
    const response = await runBookAgent("Me fale sobre o livro Dom Casmurro")
    console.log(response)

    console.log("====================================")

    const response2 = await runBookAgent("Me fale sobre Código Limpo")
    console.log(response2)
}

testBookAgent()
    .catch(error => console.log(error))