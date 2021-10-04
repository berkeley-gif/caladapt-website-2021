export async function get(_req, res, next) {
  let json = JSON.stringify((await import("./_categories")).default);
  if (json !== null) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(json);
  } else {
    next();
  }
}
