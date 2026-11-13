import React from 'react';
import {AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import manifest from '../public/manifest.json';
const FPS=24;
const Chapter:React.FC<{title:string;text:string;index:number;duration:number}>=({title,text,index,duration})=>{
 const frame=useCurrentFrame();
 const fade=interpolate(frame,[0,15,duration-16,duration-1],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const shift=interpolate(frame,[0,duration],[0,-80]);
 const words=text.trim().split(' ');
 const progress=Math.min(1,frame/Math.max(1,duration-30));
 const current=Math.min(words.length-1,Math.floor(progress*words.length));
 const start=Math.max(0,current-11);
 const excerpt=words.slice(start,start+24).join(' ');
 return <AbsoluteFill style={{background:'radial-gradient(circle at 75% 25%, #103529, #040908 60%)',color:'#effff6',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
 <div style={{position:'absolute',inset:45,border:'2px solid #1ce89b',opacity:.24}}/>
 <div style={{position:'absolute',left:75,top:95,color:'#1ce89b',fontSize:27,letterSpacing:6}}>KNIGHTSAI / ANÁLISE</div>
 <div style={{position:'absolute',right:80,top:92,fontSize:27,color:'#9beac5'}}>CAPÍTULO {String(index+1).padStart(2,'0')}</div>
 <div style={{position:'absolute',left:75,right:75,top:420,opacity:fade,transform:`translateY(${shift}px)`}}>
 <div style={{fontSize:82,fontWeight:900,lineHeight:1.06,textTransform:'uppercase',textShadow:'0 0 45px #0b6944'}}>{title}</div>
 <div style={{height:6,background:'#1ce89b',width:'55%',marginTop:55}}/>
 </div>
 <div style={{position:'absolute',left:75,right:75,bottom:410,fontSize:49,fontWeight:700,lineHeight:1.25,opacity:fade,minHeight:260}}>{excerpt}</div>
 <div style={{position:'absolute',left:75,right:75,bottom:155,height:8,background:'#234437'}}><div style={{height:'100%',width:`${progress*100}%`,background:'#1ce89b'}}/></div>
 <div style={{position:'absolute',left:75,bottom:90,color:'#8be1b7',fontSize:25,letterSpacing:4}}>GTA VI / MARKETING & CULTURA</div>
 </AbsoluteFill>
};
const Film:React.FC=()=> <AbsoluteFill style={{backgroundColor:'#040908'}}>{manifest.chapters.map((c,i)=><Sequence key={c.id} from={c.startFrame} durationInFrames={c.durationFrames}><Chapter title={c.title} text={c.text} index={i} duration={c.durationFrames}/><Audio src={staticFile(c.audio)}/></Sequence>)}</AbsoluteFill>;
export const Root:React.FC=()=> <Composition id="KnightsAILong" component={Film} durationInFrames={manifest.chapters.reduce((n,c)=>n+c.durationFrames,0)} fps={FPS} width={1080} height={1920}/>;
