import React from 'react';
import {AbsoluteFill, Audio, Composition, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import manifest from '../public/manifest.json';
import visuals from '../public/visuals.json';
const FPS=24;
const Chapter:React.FC<{title:string;text:string;index:number;duration:number}>=({title,text,index,duration})=>{
 const frame=useCurrentFrame();
 const photo=visuals[index]?.file;
 const progress=Math.min(1,frame/Math.max(1,duration-30));
 const fade=interpolate(frame,[0,15,duration-15,duration],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const words=text.trim().split(' ');
 const current=Math.min(words.length-1,Math.floor(progress*words.length));
 const excerpt=words.slice(Math.max(0,current-9),Math.max(0,current-9)+19).join(' ');
 return <AbsoluteFill style={{background:'#040908',color:'#f4fff9',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
 {photo&&<AbsoluteFill><Img src={staticFile(photo)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.05+progress*.14})`,opacity:.65}}/></AbsoluteFill>}
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.58),rgba(0,0,0,.25) 30%,rgba(0,0,0,.83) 73%,#020806)'}}/>
 <div style={{position:'absolute',top:75,left:75,color:'#5cffbb',fontSize:29,letterSpacing:5}}>KNIGHTSAI // GTA VI</div>
 <div style={{position:'absolute',top:230,left:70,right:70,opacity:fade,fontSize:76,fontWeight:900,lineHeight:1.05,textShadow:'0 5px 20px #000'}}>{title.toUpperCase()}</div>
 <div style={{position:'absolute',left:70,right:70,bottom:345,fontSize:49,fontWeight:800,lineHeight:1.2,opacity:fade,textShadow:'0 4px 18px #000'}}>{excerpt}</div>
 <div style={{position:'absolute',left:70,right:70,bottom:175,height:7,background:'#163b2c'}}><div style={{height:'100%',width:`${progress*100}%`,background:'#5cffbb'}}/></div>
 <div style={{position:'absolute',left:70,bottom:105,fontSize:26,color:'#5cffbb'}}>CAPÍTULO {String(index+1).padStart(2,'0')} / 09</div>
 </AbsoluteFill>
};
const Film:React.FC=()=> <AbsoluteFill>{manifest.chapters.map((c,i)=><Sequence key={c.id} from={c.startFrame} durationInFrames={c.durationFrames}><Chapter title={c.title} text={c.text} index={i} duration={c.durationFrames}/><Audio src={staticFile(c.audio)}/></Sequence>)}</AbsoluteFill>;
export const Root:React.FC=()=> <Composition id="KnightsAIVisual" component={Film} durationInFrames={manifest.chapters.reduce((n,c)=>n+c.durationFrames,0)} fps={FPS} width={1080} height={1920}/>;
