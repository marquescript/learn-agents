import "dotenv/config";
import { OpenAI } from "openai";

const token = process.env.OPENAI_API_KEY

if(!token) {
    throw new Error("OPENAI_API_KEY is not set");
}

const model = "o4-mini-2025-04-16";

export default async function callLLM(prompt: string): Promise<string> {
    const openai = new OpenAI({
        apiKey: token
    })

    const responseLLM = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "Voce é um assistente treinado para responder perguntas!" },
            { role: "user", content: prompt }
        ],
        model,
        max_completion_tokens: 200
    })

    const response = responseLLM.choices[0]?.message.content

    if(!response) {
        throw new Error("No response from the model");
    }

    return response;
}

// callLLM("Qual a capital do Brasil ?")
//     .then(response => console.log(`Resposta: ${response}`))
//     .catch(error => console.error(`Erro: ${error}`));