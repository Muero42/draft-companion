const assert = require('assert');

const LIVE_DRAFT_ID_2026 = '1366053132970233856';

function extractDraftId(value){
  const m=String(value||'').match(/(\d{12,})/);
  return m ? m[1] : '';
}

function resolveDraftId({surface='mock', mockInput='', liveDraftId=LIVE_DRAFT_ID_2026}){
  return surface==='live' ? liveDraftId : extractDraftId(mockInput);
}

function validateLiveDraft({id, season, teams, rounds, slot}){
  const errors=[];
  if(String(id)!==LIVE_DRAFT_ID_2026) errors.push('live-draft-id-mismatch');
  if(String(season)!=='2026') errors.push('season-mismatch');
  if(Number(teams)!==10) errors.push('team-count-mismatch');
  if(Number(rounds)!==15) errors.push('round-count-mismatch');
  if(Number(slot)!==9) errors.push('slot-mismatch');
  return {ok:errors.length===0,errors};
}

assert.equal(resolveDraftId({surface:'live',mockInput:'https://sleeper.app/draft/nfl/9999999999999999999'}), LIVE_DRAFT_ID_2026);
assert.equal(resolveDraftId({surface:'mock',mockInput:'https://sleeper.app/draft/nfl/1395034363292319744'}), '1395034363292319744');
assert.equal(resolveDraftId({surface:'mock',mockInput:'1392854745084858368'}), '1392854745084858368');
assert.deepEqual(validateLiveDraft({id:LIVE_DRAFT_ID_2026,season:2026,teams:10,rounds:15,slot:9}),{ok:true,errors:[]});
assert.equal(validateLiveDraft({id:'1395034363292319744',season:2026,teams:10,rounds:15,slot:9}).ok,false);
assert.equal(validateLiveDraft({id:LIVE_DRAFT_ID_2026,season:2026,teams:12,rounds:15,slot:9}).ok,false);

console.log('live-draft-id-guard gate: OK');
