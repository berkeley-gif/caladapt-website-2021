import getCardsData from "./_cards";

export function get(req, res, next) {
  const cardsData = getCardsData();
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
