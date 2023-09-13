import { Separator } from "./components/ui/separator"; import { FileVideo, Github, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";

export function App() {
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
            />
            <Textarea
              className="resize-none p-5 leading-relaxed"
              placeholder="AI generation result..."
              readOnly />
          </div>
          <p>
            Remind: you can use the
            <code className="text-primary">{' {transcription} '}</code>
            variable in your prompt to add the transcriptions content of your selected video.
          </p>
        </div>

        <aside className="w-80 space-y-6">

          <form className="space-y-6">
            <label htmlFor="video" className="border flex w-full aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/50 hover:transition rounded">
              <FileVideo className="h-4 w-4" />
              Select a video'
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="transcription-prompt">Tarnscription prompt</Label>
              <Textarea id="transcription-prompt" className="min-h-[5rem] max-h-[20rem]"
                placeholder="Include keywords mentioned in the video separated by commas (,)" />
            </div>

            <Button type="submit" className="w-full">Upload Video</Button>
          </form>

          <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">Youtube video title</SelectItem>
                  <SelectItem value="gpt3.5">Youtube video description</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

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
              <Slider min={0} max={1} step={0.1} className="cursor-pointer" />
              <span className="block text-xs  italic text-muted-foreground">
                Higher values tend to make the result more creative and with possible errors
              </span>

            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Execute
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>

      </main>
    </div>
  )
}
