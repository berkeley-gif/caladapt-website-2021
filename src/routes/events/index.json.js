import { get_future_events } from "./_future-events";

export function get(req, res, next) {
  const eventsData = get_future_events();
  if (eventsData) {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(eventsData));
  } else {
    next();
  }
}
