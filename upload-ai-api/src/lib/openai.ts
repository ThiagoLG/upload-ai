import OpenAI from "openai";
import 'dotenv/config'

export const openai = new OpenAI({
  // apiKey: process.env.OPENAI_KEY
  apiKey: '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'
})