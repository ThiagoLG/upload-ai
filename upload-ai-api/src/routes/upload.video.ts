import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart'
import path from "node:path";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import fs from 'node:fs'
import { prisma } from "../lib/prisma";

export async function uploadVideoRoute(app: FastifyInstance) {

  const pump = promisify(pipeline)

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25MB
    }
  })

  app.post('/videos', async (request, reply) => {
    const data = await request.file();

    if (!data)
      return reply.status(400).send({ error: 'Missing file input.' })

    const extension = path.extname(data.filename)

    if (extension !== '.mp3')
      return reply.status(400).send({ error: 'Invalid input type, please upload a MP3.' })

    const fileBaseName = path.basename(data.fieldname, extension)
    const fileUploadName = `${fileBaseName}${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, '../../temp', fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        title: data.filename,
        path: uploadDestination
      }
    })

    return video
  })
}
