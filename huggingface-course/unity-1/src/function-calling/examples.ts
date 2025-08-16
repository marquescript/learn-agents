import { AICalculatorAgent } from "./agent";

async function aiAgentCalculatorTest(): Promise<string> {

    const agent = new AICalculatorAgent()

    const addOperation = await agent.run("Calcule 30 * 3")
    return addOperation
}

aiAgentCalculatorTest()
    .then(response => console.log("Resposta final:", response))
    .catch(error => console.error("Erro:", error))