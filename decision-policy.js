export const USER_DRAFT_QB_LIMIT=1;

export const USER_DRAFT_HARD_EXCLUSIONS=new Set(['geno smith','aaron rodgers']);

export function userDraftStrategyExcluded(pos, counts={}, name=''){
  const key=String(name||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  if(USER_DRAFT_HARD_EXCLUSIONS.has(key))return true;
  return pos==='QB' && Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT;
}

export function safetyPromotionEligiblePolicy({pos,counts={},rank,adp,current}={}){
  if(pos==='QB'&&Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT)return false;
  if(pos==='TE'&&Number(counts?.TE||0)>=1)return Number(rank)<=35&&Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=30;
  if(pos==='WR'&&Number(counts?.WR||0)>=6&&Number(current)>=81)return Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=10;
  return true;
}
