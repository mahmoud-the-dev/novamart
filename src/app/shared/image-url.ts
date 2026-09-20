export function optimizedImageUrl(url: string, width: number): string {
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}
