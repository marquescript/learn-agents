import { BookInfo } from "./types";

const booksDatabase: Record<string, BookInfo> = {
    "Dom Casmurro": {
    author: "Machado de Assis",
    year: 1899,
    summary: "Romance que narra a história de Bentinho e sua obsessão com a suposta traição de Capitu",
    genre: "Romance/Realismo",
    pages: 256
  },
  "O Cortiço": {
    author: "Aluísio Azevedo",
    year: 1890,
    summary: "Romance naturalista que retrata a vida em um cortiço no Rio de Janeiro do século XIX",
    genre: "Naturalismo",
    pages: 304,
  },
  "1984": {
    author: "George Orwell",
    year: 1949,
    summary: "Distopia que retrata uma sociedade totalitária sob constante vigilância do 'Big Brother'",
    genre: "Ficção Científica/Distopia",
    pages: 328,
  },
  "Pride and Prejudice": {
    author: "Jane Austen",
    year: 1813,
    summary: "Romance e crítica a sociedade inglesa através da história de Elizabeth Bennet e Mr. Darcy.",
    genre: "Romance/Drama",
    pages: 432,
  },
  "O Pequeno Príncipe": {
    author: "Antonie de Saint-Exupéry",
    year: 1943,
    summary: "Fábula poética sobre um príncipe que viaja entre planetas e aprende sobre a vida e amor.",
    genre: "Fábula/Infantil",
    pages: 96
  }
}

function bookLookupTool(args: { title: string }): string {
    let book = booksDatabase[args.title]

    if(!book) {
        const foundKey = Object.keys(booksDatabase).find(
            k => k.toLowerCase().includes(args.title.toLowerCase()) ||
            args.title.toLowerCase().includes(k.toLowerCase())
        )

        if(foundKey) {
            book = booksDatabase[foundKey]
        }

        if(!book) {
            return `Livro ${args.title} não encontrado`
        }
    }

    return `
        Autor: ${book.author}
        Ano: ${book.year}
        Resumo: ${book.summary}
        Gênero: ${book.genre}
        Páginas: ${book.pages}
    `
}

export {
    bookLookupTool,
    booksDatabase
}