"""Find reusable contextual photos on Wikimedia Commons. Fails safely to text-only scenes."""
import json, re, html, time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT=Path("public")
ROOT.joinpath("visuals").mkdir(parents=True,exist_ok=True)
SEARCHES=[
  "Miami skyline night",
  "video game controller",
  "Miami music festival concert",
  "DJ mixing console",
  "fashion magazine editorial",
  "Miami basketball arena",
  "Miami neon Ocean Drive",
  "marketing billboard city",
  "Miami skyline aerial",
]
ALLOWED=("cc-by","cc by","public domain","cc0")
def fetch(url):
  req=Request(url,headers={"User-Agent":"KnightsAIVideoStudio/0.3 (educational media search; GitHub Actions)"})
  with urlopen(req,timeout=25) as resp: return resp.read()
def plain(value):
  return re.sub("<[^>]*>","",html.unescape(value or "")).strip()
def search(query):
  args={"action":"query","format":"json","generator":"search","gsrsearch":query+" filetype:bitmap","gsrnamespace":6,"gsrlimit":12,"prop":"imageinfo","iiprop":"url|extmetadata|mime","iiurlwidth":1000,"iiextmetadatafilter":"LicenseShortName|LicenseUrl|Artist|Credit|UsageTerms"}
  data=json.loads(fetch("https://commons.wikimedia.org/w/api.php?"+urlencode(args)))
  for page in sorted(data.get("query",{}).get("pages",{}).values(),key=lambda p:p.get("index",999)):
    info=(page.get("imageinfo") or [{}])[0]
    if info.get("mime") not in ("image/jpeg","image/png","image/webp"): continue
    md=info.get("extmetadata") or {}
    license=plain(md.get("LicenseShortName",{}).get("value",""))
    if not any(tag in license.lower() for tag in ALLOWED): continue
    url=info.get("thumburl") or info.get("url")
    if not url: continue
    yield {"url":url,"source":info.get("descriptionurl",""),"license":license,"license_url":plain(md.get("LicenseUrl",{}).get("value","")),"artist":plain(md.get("Artist",{}).get("value","")),"title":page.get("title","")}
def main():
  output=[]
  for i,query in enumerate(SEARCHES):
    item={"chapter":i,"query":query,"file":None}
    try:
      for candidate in search(query):
        try:
          data=fetch(candidate["url"])
          if len(data)>7_000_000 or len(data)<5000: continue
          ext=".png" if data.startswith(b"\x89PNG") else ".jpg" if data[:3]==b"\xff\xd8\xff" else ".webp" if data[:4]==b"RIFF" else None
          if ext is None: continue
          path=f"visuals/chapter-{i}{ext}"
          ROOT.joinpath(path).write_bytes(data)
          item.update(candidate)
          item["file"]=path
          break
        except (URLError,HTTPError,TimeoutError,ValueError): continue
    except Exception as exc:
      print(f"Chapter {i}: no image ({type(exc).__name__})")
    output.append(item)
    print(f"Chapter {i}: {item['file'] or 'fallback'}")
    time.sleep(.3)
  ROOT.joinpath("visuals.json").write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding="utf-8")
  Path("out").mkdir(exist_ok=True)
  Path("out/visual-credits.json").write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding="utf-8")
if __name__=="__main__":main()
