export function getCardArtUrl(imageUrl: string) {
    if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return imageUrl
    return imageUrl.replace(
      '/upload/',
      '/upload/c_crop,x_42,y_158,w_784,h_611/c_scale,w_260/'
    )
  }