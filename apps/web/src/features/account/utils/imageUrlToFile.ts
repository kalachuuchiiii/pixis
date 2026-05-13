export const imageUrlToFile = async (url: string, filename: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};
