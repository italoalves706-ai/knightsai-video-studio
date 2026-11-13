import asyncio, json, os, subprocess
import edge_tts
from pathlib import Path
chapters=json.loads(Path("content/gta6.json").read_text(encoding="utf-8"))
Path("public/audio").mkdir(parents=True,exist_ok=True)
fps=24
async def main():
  output=[]
  cursor=0
  for chapter in chapters:
    audio=f"audio/{chapter['id']}.mp3"
    await edge_tts.Communicate(chapter["text"],voice="pt-BR-AntonioNeural",rate="+10%").save("public/"+audio)
    seconds=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1","public/"+audio],text=True).strip())
    frames=round((seconds+1.2)*fps)
    output.append({**chapter,"audio":audio,"startFrame":cursor,"durationFrames":frames})
    cursor+=frames
  Path("public/manifest.json").write_text(json.dumps({"fps":fps,"chapters":output},ensure_ascii=False,indent=2),encoding="utf-8")
  print(f"Video duration: {cursor/fps:.1f} seconds")
asyncio.run(main())
