import { getMemos, getResearch } from "./_data";

export function get(req, res, next) {
  const memosData = getMemos();
  const researchData = getResearch();

  if (memosData && researchData) {
    const data = { memosData, researchData };

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(data));
  } else {
    next();
  }
}
