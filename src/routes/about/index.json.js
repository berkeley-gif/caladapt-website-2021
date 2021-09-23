export async function get(_req, res, next) {
  let json = JSON.stringify(require("./_data.json"));
  if (json !== null) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(json);
  } else {
    next();
  }
}
