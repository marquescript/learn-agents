import "dotenv/config";
import { Agent, run, tool } from "@openai/agents";
import z from "zod";

const historyFunFact = tool({
    name: "history_fun_fact",
    description: "Contar um fato divertido sobre a história",
    parameters: z.object({}),
    execute: async () => {
        return "Tubarões existiram há mais de 400 milhões de anos, muito antes dos dinossauros!";
    }
})

async function main() {

    const historyTutorAgent = new Agent({
        name: "History Tutor",
        instructions: "Você fornece assistência com consultas históricas. Explique eventos importantes e contexto claramente.",
        tools: [historyFunFact],
        model: "o4-mini",
        modelSettings: {
            maxTokens: 200,
            topP: 1.0
        }
    })

    const mathTutorAgent = new Agent({
        name: "Math Tutor",
        instructions: "Você fornece ajuda com problemas de matemática. Explique seu raciocínio em cada etapa e inclua exemplos"
    })

    const triageAgent = Agent.create({
        name: "Triage Agent",
        instructions: "Você determina qual agente usar com base na pergunta do dever de casa do usuário",
        handoffs: [historyTutorAgent, mathTutorAgent]
    })

    const resutlt = await run(triageAgent, "Qual é um fato interessante sobre a história?");
    console.log(resutlt.finalOutput)
}

main().catch(console.error)