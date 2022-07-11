export const cleanName = (name: string): string => {
  const firstName = name.split(' / ')[0];
  const cleanedName = firstName.replace(/\(\s?|\)|\{|\}/g, '');
  return cleanedName;
};
