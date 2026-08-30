export const USER_DRAFT_QB_LIMIT=1;
const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers']);
const normPlayer=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');

export function userDraftStrategyExcluded(pos, counts={}, playerName=''){
  if(pos==='QB'&&USER_HARD_QB_EXCLUSIONS.has(normPlayer(playerName)))return true;
  return pos==='QB' && Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT;
}

export function safetyPromotionEligiblePolicy({pos,counts={},rank,adp,current,playerName}={}){
  if(pos==='QB'&&USER_HARD_QB_EXCLUSIONS.has(normPlayer(playerName)))return false;
  if(pos==='QB'&&Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT)return false;
  if(pos==='TE'&&Number(counts?.TE||0)>=1)return Number(rank)<=35&&Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=30;
  if(pos==='WR'&&Number(counts?.WR||0)>=6&&Number(current)>=81)return Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=10;
  return true;
}
