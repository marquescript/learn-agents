import "dotenv/config";
import { Agent, AgentInputItem, run, RunContext, tool } from "@openai/agents"
import z from "zod";

const userPurchases: { user: string, purchases: Purchase[] }[] = [
    {
        user: "carlos",
        purchases: [
            { id: "1", uid: "123", deliveryStatus: "delivered", productName: "Smartphone" },
            { id: "2", uid: "123", deliveryStatus: "pending", productName: "Laptop" },
            { id: "3", uid: "123", deliveryStatus: "pending", productName: "Headphones" }
        ]
    }
]

interface Purchase {
    id: string
    uid: string
    deliveryStatus: string
    productName: string
}

interface UserContext {
    uid: string
    userName: string
    isProUser: boolean
}

const getPurchasesTool = tool({
    name: "get_purchases",
    description: "Use esta ferramenta para obter a lista de compras dos usuários",
    parameters: z.object({}),
    execute: async (_, runContext: RunContext<UserContext> | undefined) => {
        if (!runContext?.context?.userName) {
            return "Erro: Não foi possível identificar o usuário da sessão.";
        }

        if(runContext.context.isProUser === false) {
            return "Você não tem acesso às informações de compras. Por favor, atualize para Pro User.";
        }

        const userName = runContext.context.userName.toLowerCase().trim();

        const userPurchase = userPurchases.find(p => p.user === userName)
        if(userPurchase) {
            return userPurchase.purchases
        }

        return "Nenhuma compra encontrada para o usuário."
    }
})

async function contextExample() {
    const agent = new Agent<UserContext>({
        name: "Personal shopper",
        instructions: `
            Responder sobre compras e produtos do usuário. Sempre com muida educação e amigabilidade. Utilize a ferramenta get_purchases para obter as compras do usuário.
        `,
        tools: [getPurchasesTool],
        modelSettings: { toolChoice: "required" }
    })

    agent.on("agent_start", (ctx, agent) => {
        console.log(`Agente ${agent.name} iniciado para o usuário: ${ctx.context?.userName}`);
    })

    const result = await run(agent, "Quais são minhas compras pendentes?", {
        context: {
            uid: "123",
            isProUser: true,
            userName: "carlos"
        } as UserContext
    })

    console.log(result.finalOutput)
}

// contextExample().catch(console.error)

async function conversationExample() {
    let thread: AgentInputItem[] = []

    const agent = new Agent({
        name: "Assistant"
    })

    const useSays = async (text: string) => {
        const result = await run(agent, thread.concat({ role: "user", content: text }))

        thread = result.history
        return result.finalOutput
    }

    const question = await useSays("Em qual cidade fica a ponte Golden Gate?")
    console.log(question)

    const question2 = await useSays("E qual o estado dessa cidade?")
    console.log(question2)
}

conversationExample().catch(console.error)