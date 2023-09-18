import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.prompt.deleteMany()

  await prisma.prompt.create({
    data: {
      title: 'Resumo do vídeo',
      template: `Seu papel é entender o vídeo a partir de um vídeo e gerar um resumo.

Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar o conteúdo.

O resumo não deve exceder 1000 caracteres.
Os vídeos serão sempre sobre comida, portante dê enfase no que é dito sobre o assunto.
No resumo eu preciso que cite os pratos que são falados no vídeo (pelo menos os principais casho haja muitos)

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })

  await prisma.prompt.create({
    data: {
      title: 'Pratos e Receitas',
      template: `Seu papel é gerar uma lista de pratos e receitas a partir de uma transcrição de vídeo sobre comida.
  
Abaixo você receberá uma transcrição desse vídeo, use essa transcrição para gerar o conteúdo.

O conteúdo deve listar o nome dos pratos citados no vídeo e dar uma breve e curta descrição da receita, listando os ingredientes usados e também o modo de preparo (neste caso falar se foi assado, frito, no form, churrasqueira, microoendas, etc. De forma extremamente enxuta e resumida).

Após as receitas citadas no vídeo, cite uma curiosidade qualquer sobre qualquer uma das receitas.

Transcrição:
'''
{transcription}
'''`.trim()
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })