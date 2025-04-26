export function getCardArtUrl(
  imageUrl: string,
  card?: { is_trail?: boolean; is_supply?: boolean; name?: string }
): string {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return imageUrl;

  const isTrail = card?.is_trail;
  const isCabinSupply = card?.is_supply && card?.name?.toLowerCase().includes('cabin');

  if (isTrail || isCabinSupply) {
    // Cropping slightly higher in portrait mode → shifts image right in landscape
    return imageUrl.replace(
      '/upload/',
      '/upload/c_crop,x_220,y_70,w_610,h_520/c_scale,w_260/'
    );
  }

  // Default crop for regular portrait cards
  return imageUrl.replace(
    '/upload/',
    '/upload/c_crop,x_42,y_158,w_784,h_611/c_scale,w_260/'
  );
}