export const USER_DRAFT_QB_LIMIT=1;

export function userDraftStrategyExcluded(pos, counts={}){
  return pos==='QB' && Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT;
}

export function safetyPromotionEligiblePolicy({pos,counts={},rank,adp,current}={}){
  if(pos==='QB'&&Number(counts?.QB||0)>=USER_DRAFT_QB_LIMIT)return false;
  if(pos==='TE'&&Number(counts?.TE||0)>=1)return Number(rank)<=35&&Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=30;
  if(pos==='WR'&&Number(counts?.WR||0)>=6&&Number(current)>=101)return Number.isFinite(Number(adp))&&Number(current)-Number(adp)>=10;
  return true;
}
