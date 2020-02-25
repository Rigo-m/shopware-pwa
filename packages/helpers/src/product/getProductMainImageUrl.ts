import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";

/**
 * gets the cover image
 *
 * @alpha
 */
export function getProductMainImageUrl(product: Product): string {
  return product?.cover?.media?.url || product?.cover?.url || "";
}
