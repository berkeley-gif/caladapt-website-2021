import getCardsData_temp from "./_cards_temp";

export function get(req, res, next) {
  const cardsData = getCardsData_temp();
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
