const cloudinaryUploadPath = '/image/upload/';

export function optimizedImageUrl(url: string, width: number): string {
  try {
    const imageUrl = new URL(url);

    if (
      imageUrl.hostname !== 'res.cloudinary.com' ||
      !imageUrl.pathname.includes(cloudinaryUploadPath)
    ) {
      return url;
    }

    imageUrl.pathname = imageUrl.pathname.replace(
      cloudinaryUploadPath,
      `${cloudinaryUploadPath}f_auto,q_auto,w_${width}/`
    );

    return imageUrl.toString();
  } catch {
    return url;
  }
}
