import asyncio, json, subprocess
from pathlib import Path
import edge_tts
scenes=[
"GTA 6 não é para o público gamer. Calma, eu vou explicar.",
"Quem joga videogame já conhece GTA. Milhões de pessoas acompanham cada novidade da Rockstar.",
"Então por que anunciar só para quem já está interessado? O próximo público pode estar na música, na moda e no esporte.",
"A ideia é simples: transformar um videogame em um assunto da cultura pop.",
"E fazer Vice City aparecer muito além das telas. Isso é marketing de expansão de público."
]
async def main():
 Path("public/pilot-audio").mkdir(parents=True,exist_ok=True)
 result=[];cursor=0
 for i,text in enumerate(scenes):
  path=f"pilot-audio/{i}.mp3"
  await edge_tts.Communicate(text,voice="pt-BR-AntonioNeural",rate="+10%").save("public/"+path)
  seconds=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1","public/"+path],text=True).strip())
  frames=round((seconds+.35)*24)
  result.append({"text":text,"audio":path,"startFrame":cursor,"durationFrames":frames})
  cursor+=frames
 Path("public/pilot-manifest.json").write_text(json.dumps({"scenes":result},ensure_ascii=False,indent=2),encoding="utf-8")
 print("Pilot length",cursor/24)
asyncio.run(main())
