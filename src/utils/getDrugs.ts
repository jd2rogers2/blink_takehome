import { cleanName } from '.';

import type { Drug } from '../types';

type Response = {
  drugGroup: {
    conceptGroup?: {
      tty: string;
      conceptProperties?: Drug[]
    }[]
  }
};

const formatDrugs = (response: Response): Drug[] => {
  const flatDrugs = response.drugGroup.conceptGroup?.reduce<Drug[]>((acc, curr) => {
    acc.push(...(curr.conceptProperties || []));
    return acc;
  }, []) ?? [];
  const sanitizedDrugs = flatDrugs.map(d => ({ ...d, cleanName: cleanName(d.name) }))
  const sortedDrugs = sanitizedDrugs.sort((a,b) => a.cleanName > b.cleanName ? 1 : -1);
  return sortedDrugs;
}

export const getDrugs = async (searchText: string): Promise<Drug[]> => {
  const res = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchText}`, {
    method: 'GET',
  })
  const data = await res.json();
  return formatDrugs(data);
};
