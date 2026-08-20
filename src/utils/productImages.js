import { apiGet } from "./api";

const getJourneyProductId = (charm) =>
  charm?.product?.productId ?? charm?.productId ?? null;

const getJourneyImage = (charm) =>
  (Array.isArray(charm?.images) ? charm.images.find(Boolean) : null) ?? null;

export async function fillProductImagesFromJourneys(products) {
  if (!Array.isArray(products) || products.every((product) => product.productImage)) {
    return products;
  }

  try {
    console.info("[Collection Image 1/3] Journey 사진을 조회합니다. GET /api/charms");
    const { data } = await apiGet("/charms");
    const charms = Array.isArray(data?.charms) ? data.charms : [];

    const detailResults = await Promise.allSettled(
      charms.map(async (charm) => {
        if (getJourneyProductId(charm) != null && getJourneyImage(charm)) return charm;
        const { data: detail } = await apiGet(`/charms/${charm.charmId}`);
        return detail;
      }),
    );

    const imageByProductId = new Map();
    detailResults.forEach((result) => {
      if (result.status !== "fulfilled") return;
      const productId = getJourneyProductId(result.value);
      const image = getJourneyImage(result.value);
      if (productId != null && image && !imageByProductId.has(String(productId))) {
        imageByProductId.set(String(productId), image);
      }
    });

    console.info(`[Collection Image 2/3] Journey 사진 ${imageByProductId.size}개를 제품과 연결했습니다.`);
    return products.map((product) => ({
      ...product,
      productImage:
        product.productImage || imageByProductId.get(String(product.productId)) || "",
    }));
  } catch (error) {
    console.warn("[Collection Image] Journey 사진 연결에 실패해 제품 정보만 표시합니다.", error);
    return products;
  }
}
