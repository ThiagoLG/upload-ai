import { FileVideo } from "lucide-react"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react"
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { api } from "@/lib/axios"

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success' | 'error'
const StatusMessages = {
  waiting: 'Upload Video',
  converting: 'Converting...',
  uploading: 'Uploading...',
  generating: 'Generating...',
  success: 'Success',
  error: 'Error'
}

interface VidoInputFormProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm({ onVideoUploaded }: VidoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const previewURL = useMemo(() => {
    if (!videoFile) return null
    return URL.createObjectURL(videoFile);
  }, [videoFile])

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return

    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }

  async function convertVideoToAudio(video: File) {
    console.log('Converting started');

    const ffmpeg = await getFFmpeg()
    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', progress => {
      console.log('Converting progress: ', Math.round(progress.progress * 100));
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })

    console.log('Convertion finished.');


    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!videoFile) return;

    setStatus('converting')
    const prompt = promptInputRef.current?.value;
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData()
    data.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', data)
    console.log('response: ', response)

    const videoId = response.data.id

    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, { prompt })

    onVideoUploaded(videoId)

    setStatus('success')
  }

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label htmlFor="video" className="border flex w-full aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/50 hover:transition rounded relative">
        {previewURL ? <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
          :
          (<>
            <FileVideo className="h-4 w-4" />
            Select a video'
          </>)
        }
      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

      <Separator />

      <div className="space-y-1">
        <Label htmlFor="transcription-prompt">Tarnscription prompt</Label>
        <Textarea id="transcription-prompt" className="min-h-[4rem] max-h-[20rem]"
          placeholder="Include keywords mentioned in the video separated by commas (,)"
          disabled={status !== 'waiting'}
          ref={promptInputRef} />
      </div>

      <Button type="submit" disabled={status !== 'waiting'}
        className="w-full data-[success=true]:bg-emerald-600" data-success={status === StatusMessages.success}>
        {StatusMessages[status]}
      </Button>
    </form >
  )
}