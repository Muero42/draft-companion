'use strict';

const STATES=Object.freeze({
  KNOWN_SEVERE:'KNOWN_SEVERE',
  KNOWN_MINOR:'KNOWN_MINOR',
  MATERIAL_UNCERTAINTY:'MATERIAL_UNCERTAINTY'
});

function validHealthyRank(record){
  const n=Number(record?.healthyPanelRank);
  return Number.isFinite(n)&&n>0?n:null;
}

function relevantHealthyWindow(record,{currentPick,normalQualityBoundary,displayedTierRanks=[]}={}){
  if(record?.state!==STATES.MATERIAL_UNCERTAINTY)return false;
  const healthy=validHealthyRank(record);if(healthy==null)return false;
  const pick=Number(currentPick),boundary=Number(normalQualityBoundary);
  const limit=Math.max(Number.isFinite(boundary)?boundary:0,Number.isFinite(pick)?pick+12:0);
  if(healthy<=limit)return true;
  return (displayedTierRanks||[]).some(r=>Number.isFinite(Number(r))&&Math.abs(Number(r)-healthy)<=3);
}

function forceVisibleDecisionBoard(rows,{currentPick,normalQualityBoundary,records={},limit=10}={}){
  const source=Array.isArray(rows)?rows:[];
  const normal=source.filter(x=>x?.normalAdmissible);
  const fallback=source.filter(x=>!x?.normalAdmissible);
  const normalShown=normal.slice(0,limit);
  const displayedTierRanks=normalShown.map(x=>x?.panelRank).filter(Number.isFinite);
  const forced=source.filter(x=>{
    const rec=records[x?.playerKey];
    return !normalShown.includes(x)&&relevantHealthyWindow(rec,{currentPick,normalQualityBoundary,displayedTierRanks});
  });
  const room=Math.max(0,limit-normalShown.length);
  const selectedFallback=fallback.filter(x=>!forced.includes(x)).slice(0,Math.max(0,room-forced.length));
  let board=normalShown.concat(forced.slice(0,room),selectedFallback);
  const overflow=forced.slice(room);
  return {board:board.slice(0,limit),riskFallers:overflow};
}

function recommendationAction(row,record,baseAction){
  if(record?.state===STATES.MATERIAL_UNCERTAINTY&&record?.blockRecommendation)return'HOLD';
  return baseAction;
}

function displayHealthy(record){
  const n=validHealthyRank(record);
  return n==null?null:n;
}

module.exports={STATES,validHealthyRank,relevantHealthyWindow,forceVisibleDecisionBoard,recommendationAction,displayHealthy};
