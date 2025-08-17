import OpenAI from "openai"

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam

type BookInfo = {
    author: string
    year: number
    summary: string
    genre: string
    pages: number
}

type ToolCall = {
    toolName: string
    args: any
}

export type { Message, BookInfo, ToolCall }