import { Separator } from "./components/ui/separator"; import { Github, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { useState } from "react";
import { useCompletion } from 'ai/react'


export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>('36fd7ee7-4287-4e31-a7a2-a3375d14989c')

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return (
    <div className="min-h-screen flex flex-col">

      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Developed with 🧡 on Rocketseat NLW
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </header>

      <main className="flex p-6 flex-1 gap-6">

        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="Include the prompt for AI"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="AI generation result..."
              value={completion}
              readOnly />
          </div>
          <p>
            Remind: you can use the
            <code className="text-primary">{' {transcription} '}</code>
            variable in your prompt to add the transcriptions content of your selected video.
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue='gpt3.5' disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs  italic text-muted-foreground">You will be able to customize this option soon</span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperature</Label>
              <Slider min={0} max={1} step={0.1} value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
                className="cursor-pointer" />
              <span className="block text-xs  italic text-muted-foreground">
                Higher values tend to make the result more creative and with possible errors
              </span>

            </div>

            <Separator />

            <Button type="submit" disabled={isLoading} className="w-full">
              Execute
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>

      </main>
    </div>
  )
}
