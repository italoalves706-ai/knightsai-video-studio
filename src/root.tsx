import React from 'react';
import {AbsoluteFill, Composition, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14}});
  const titleY = interpolate(pop, [0, 1], [100, 0]);
  const glow = 0.4 + Math.sin(frame / 9) * 0.2;
  const labels = ['ROTEIRO', 'NARRAÇÃO', 'MOTION', 'RENDER'];
  return <AbsoluteFill style={{backgroundColor:'#050908', color:'#eafff2', fontFamily:'Arial, sans-serif', overflow:'hidden'}}>
    <div style={{position:'absolute',inset:55,border:'2px solid #16e68b',opacity:0.35}} />
    <div style={{position:'absolute',top:90,left:95,color:'#16e68b',fontSize:30,letterSpacing:8}}>KNIGHTSAI // STUDIO</div>
    <div style={{position:'absolute',top:330,left:80,right:80,transform:`translateY(${titleY}px)`,opacity:pop}}>
      <div style={{fontSize:110,fontWeight:900,lineHeight:1.05,textShadow:`0 0 45px rgba(22,230,139,${glow})`}}>O FUTURO<br/>É CRIADO<br/><span style={{color:'#16e68b'}}>AGORA.</span></div>
      <div style={{height:5,background:'#16e68b',width:`${interpolate(frame,[20,75],[0,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}%`,marginTop:48}} />
    </div>
    <div style={{position:'absolute',top:1120,left:80,right:80,display:'flex',flexWrap:'wrap',gap:22}}>
      {labels.map((label,i)=>{const reveal = interpolate(frame,[55+i*18,75+i*18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <div key={label} style={{border:'2px solid #16e68b',padding:'22px 25px',fontSize:32,letterSpacing:3,opacity:reveal,transform:`translateY(${(1-reveal)*30}px)`}}>{String(i+1).padStart(2,'0')} / {label}</div>})}
    </div>
    <div style={{position:'absolute',bottom:105,left:85,color:'#16e68b',fontSize:26,letterSpacing:5}}>AUTOMATED VISUAL SYSTEM</div>
    <div style={{position:'absolute',bottom:105,right:85,fontSize:26}}>{String(Math.floor(frame/fps)).padStart(2,'0')} : 10</div>
  </AbsoluteFill>;
};
export const Root: React.FC = () => <Composition id="KnightsAI" component={Demo} durationInFrames={300} fps={30} width={1080} height={1920}/>;
