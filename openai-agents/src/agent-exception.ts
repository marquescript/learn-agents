import { Agent, GuardrailExecutionError, InputGuardrail, InputGuardrailTripwireTriggered, run } from "@openai/agents";
import "dotenv/config";
import z from "zod";

const guardrailAgent = new Agent({
    name: "Guardrail Agent",
    instructions: "Verifique se o usuário está pedindo para você fazer o dever de matemática.",
    outputType: z.object({
        isMathHomework: z.boolean(),
        reasoning: z.string()
    })
})

const unstableGuardrail: InputGuardrail = {
    name: "Math Homework Guardrail",
    execute: async () => {
        throw new Error("Algo está errado")
    }
}

const fallbackGuardrail: InputGuardrail = {
    name: "Math Homework Guardrail (fallback)",
    execute: async ({ input, context }) => {
        const result = await run(guardrailAgent, input, { context })
        return {
            outputInfo: result.finalOutput,
            tripwireTriggered: result.finalOutput?.isMathHomework ?? false
        }
    }
}

const agent = new Agent({
    name: "Agente de suporte",
    instructions: "Você é um agente de suporte ao cliente. Você ajuda os clientes com suas dúvidas.",
    inputGuardrails: [unstableGuardrail]
})

async function main() {
    try {
        const input = "Olá, você pode me ajudar a resolver x: 2x + 3 = 11?";
        const result = await run(agent, input)
        console.log(result.finalOutput)
    } catch(error) {
        if(error instanceof GuardrailExecutionError) {
            if(error.state) {
                try {
                    agent.inputGuardrails = [fallbackGuardrail]
                    const result = await run(agent, error.state)
                    console.log(result.finalOutput)
                }catch(err) {
                    if(err instanceof InputGuardrailTripwireTriggered) {
                        console.log("Usuário tentou fazer pedido para realizar dever de matemática")
                    }
                }
            }
        } else {
            throw error
        }
    }
}

main().catch(console.error);