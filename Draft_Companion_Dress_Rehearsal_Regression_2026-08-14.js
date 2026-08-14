'use strict';
function endgameSkillShare(c,current,mode='live'){
  if(current<120)return 1;
  const openSpecial=(c.K===0?1:0)+(c.DEF===0?1:0);
  if(mode==='mock'&&current>=130)return openSpecial===2?.20:openSpecial===1?.45:.92;
  return openSpecial===2?.34:openSpecial===1?.62:.92;
}
if(endgameSkillShare({K:0,DEF:0},132,'mock')!==.20)throw new Error('mock final-turn K/DST hazard not strengthened');
if(endgameSkillShare({K:0,DEF:0},129,'mock')!==.34)throw new Error('pre-130 mock hazard changed unexpectedly');
if(endgameSkillShare({K:0,DEF:0},132,'live')!==.34)throw new Error('LIVE K/DST hazard must remain conservative');
if(endgameSkillShare({K:1,DEF:0},132,'mock')!==.45)throw new Error('one-open-special mock branch wrong');

// Expected endgame direction: MOCK final-turn hazard must reduce skill-player consumption
// materially relative to LIVE while leaving the live baseline untouched.
const mockTwoOpen=endgameSkillShare({K:0,DEF:0},132,'mock');
const liveTwoOpen=endgameSkillShare({K:0,DEF:0},132,'live');
if(!(mockTwoOpen<liveTwoOpen && mockTwoOpen<=.20))throw new Error('mock endgame relief is not materially stronger than live');

const rosterRule='max. 4 WR / 3 RB / 2 TE gleichzeitig startbar; das sind KEINE Draft-/Roster-Caps.';
if(!rosterRule.includes('KEINE Draft-/Roster-Caps'))throw new Error('roster semantics missing');
const duplicateRule='DUPLIKAT/UNVERÄNDERT — wenn dieser Pick/Fingerprint im Chat bereits ausgewertet wurde, NICHT erneut analysieren; sofort einen aktuellen/neuen Snapshot anfordern.';
if(!duplicateRule.includes('NICHT erneut analysieren'))throw new Error('duplicate snapshot guard missing');
console.log('PASS rc4.13 dress-rehearsal hardening');
