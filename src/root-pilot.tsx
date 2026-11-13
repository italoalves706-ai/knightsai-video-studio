import React from 'react';
import {AbsoluteFill, Audio, Composition, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import manifest from '../public/pilot-manifest.json';
const G='#70ffb5';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const words=(text:string)=>text.split(' ');
const Text:React.FC<{children:React.ReactNode;size?:number;color?:string}>=({children,size=84,color='#fff'})=><div style={{fontSize:size,color,fontWeight:950,lineHeight:1.03,textTransform:'uppercase',letterSpacing:-3,textShadow:'0 8px 28px #000'}}>{children}</div>;
const Scene:React.FC<{index:number;duration:number;text:string}>=({index,duration,text})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const pop=spring({frame:f,fps,config:{damping:13,stiffness:125}});
 const fade=interpolate(f,[0,8,duration-8,duration],[0,1,1,0],clamp);
 const slide=interpolate(pop,[0,1],[110,0]);
 const p=f/duration;
 const tokens=words(text);const token=Math.min(tokens.length-1,Math.floor(p*tokens.length));
 const start=Math.max(0,token-3);const caption=tokens.slice(start,start+8).join(' ');
 const common={position:'absolute' as const,left:72,right:72,opacity:fade};
 return <AbsoluteFill style={{backgroundColor:'#040a10',color:'white',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 65% 38%, #0a3a39 0%,#040a10 64%)'}}/>
 {Array.from({length:15},(_,i)=><div key={i} style={{position:'absolute',left:0,right:0,top:110+i*105,borderTop:'1px solid #ffffff0c'}}/>)}
 <div style={{position:'absolute',top:80,left:72,color:G,fontSize:25,letterSpacing:6}}>KNIGHTSAI // CASE STUDY</div>
 <div style={{position:'absolute',top:83,right:72,fontSize:25,color:'#aac7be'}}>GTA VI / MARKETING</div>
 {index===0&&<div style={{...common,top:440,transform:`translateY(${slide}px) scale(${.93+.07*pop})`}}><Text size={128}>GTA 6<br/><span style={{color:G}}>NÃO É</span><br/>PARA GAMERS?</Text><div style={{marginTop:65,fontSize:34,letterSpacing:8,color:'#b9d9ce'}}>UMA TEORIA DE MARKETING</div></div>}
 {index===1&&<div style={{...common,top:435,transform:`translateY(${slide}px)`}}><Text size={90}>QUEM JOGA<br/><span style={{color:G}}>JÁ CONHECE.</span></Text><div style={{marginTop:75,border:'2px solid #4cffb1',padding:40,fontSize:45,fontWeight:800}}>COMUNIDADE GAMER <span style={{color:G}}>✓</span></div></div>}
 {index===2&&<div style={{...common,top:390,transform:`translateY(${slide}px)`}}><Text size={92}>ENTÃO PRA<br/><span style={{color:G}}>QUEM</span><br/>ANUNCIAR?</Text><div style={{display:'flex',gap:14,marginTop:85}}>{['MÚSICA','MODA','ESPORTE'].map((x,i)=><div key={x} style={{border:'2px solid #60ffb3',padding:18,fontSize:27,transform:`translateY(${Math.sin(f/9+i)*14}px)`}}>{x}</div>)}</div></div>}
 {index===3&&<div style={{...common,top:345,transform:`translateY(${slide}px)`}}><Text size={100}>A MARCA<br/><span style={{color:G}}>SAI DO JOGO.</span></Text><div style={{marginTop:90,fontSize:42,lineHeight:1.5}}>GAMES → CULTURA<br/>PRODUTO → FENÔMENO</div></div>}
 {index===4&&<div style={{...common,top:395,transform:`translateY(${slide}px)`}}><Text size={92}>VICE CITY<br/><span style={{color:G}}>NO MUNDO REAL.</span></Text><div style={{marginTop:80,borderLeft:'8px solid #70ffb5',paddingLeft:30,fontSize:40}}>MÚSICA · ESPORTE · MODA</div></div>}
 <div style={{position:'absolute',left:72,right:72,bottom:380,background:'#081a1cdd',border:'1px solid #6fffad55',padding:'30px 34px',minHeight:130,fontSize:42,fontWeight:800,lineHeight:1.2}}>{caption}</div>
 <div style={{position:'absolute',left:72,right:72,bottom:245,height:8,background:'#12382d'}}><div style={{height:'100%',width:`${Math.min(100,p*100)}%`,background:G}}/></div>
 <div style={{position:'absolute',left:72,bottom:175,color:G,fontSize:26}}>PILOTO V4 · MOTION GRAPHICS</div>
 </AbsoluteFill>;
};
const Film:React.FC=()=> <AbsoluteFill>{manifest.scenes.map((s,i)=><Sequence key={i} from={s.startFrame} durationInFrames={s.durationFrames}><Scene index={i} duration={s.durationFrames} text={s.text}/><Audio src={staticFile(s.audio)}/></Sequence>)}</AbsoluteFill>;
export const Root:React.FC=()=> <Composition id="KnightsAIPilot" component={Film} durationInFrames={manifest.scenes.reduce((n,s)=>n+s.durationFrames,0)} fps={24} width={1080} height={1920}/>;
