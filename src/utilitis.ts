export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export function getYears(date: string) {
  const dateY = new Date(date);
  return dateY.getFullYear();
}

export function getTime(time: number) {
  const hours = Math.floor(time / 60);
  const min = time % 60;
  return `${hours}시간 ${min}분`;
}
