export const getNDCs = async (rxcui: string): Promise<string[]> => {
  const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/ndcs.json`, {
    method: 'GET',
  })
  const data = await res.json();
  return data.ndcGroup.ndcList.ndc;
};
