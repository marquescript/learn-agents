import { CalculatorInput, CalculatorInputType, CalculatorOutput, CalculatorOutputType, zodToOpenAI } from "./schemas";

export const calculatorTool = {
    type: "function" as const,
    function: {
        name: "calculator",
        description: "Realiza operações matemáticas básicas",
        parameters: zodToOpenAI(CalculatorInput)
    }
}

export async function executeCalculator(input: CalculatorInputType): Promise<CalculatorOutputType> {
    const { a, b, operation } = input

    const validated = CalculatorInput.parse(input)

    let result: number

    switch(operation) {
        case "add":
            result = a + b
            break
        case "subtract":
            result = a - b
            break
        case "multiply":
            result = a * b
            break
        case "divide":
            if(b === 0) {
                throw new Error("Cannot divide by zero")
            }
            result = a / b
            break
        default:
            throw new Error("Invalid operation")
    }

    return CalculatorOutput.parse({
        result,
        explanation: `The result of ${validated.a} ${validated.operation} ${validated.b} is ${result}`
    })
}