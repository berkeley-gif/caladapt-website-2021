import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  try {
    const aboutContent = getToolContent("streamflow", "about");
    const indicatorInfo = getToolContent("streamflow", "learn-more-indicator");
    const selectMonthInfo = getToolContent(
      "streamflow",
      "learn-more-select-month"
    );
    const selectPeriodInfo = getToolContent(
      "streamflow",
      "learn-more-select-period"
    );
    const selectStationInfo = getToolContent(
      "streamflow",
      "learn-more-select-station"
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        aboutContent,
        learnMoreContent: {
          indicatorInfo,
          selectMonthInfo,
          selectPeriodInfo,
          selectStationInfo,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}
