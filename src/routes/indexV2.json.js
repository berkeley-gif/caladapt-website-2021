import getCardsDataV2 from "./_cards_v2";

export function get(req, res, next) {
  const cardsData = getCardsDataV2();
  if (cardsData) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        cardsData,
        revealNewHomepage: process.cal_adapt_features.revealNewHomepage,
      })
    );
  } else {
    next();
  }
}
