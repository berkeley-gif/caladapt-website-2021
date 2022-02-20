import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  try {
    const aboutContent = getToolContent("extreme-precipitation", "about");
    const durationInfo = getToolContent(
      "extreme-precipitation",
      "learn-more-duration"
    );
    const indicatorInfo = getToolContent(
      "extreme-precipitation",
      "learn-more-indicators"
    );
    const periodInfo = getToolContent(
      "extreme-precipitation",
      "learn-more-returnperiod"
    );
    const thresholdTypeInfo = getToolContent(
      "extreme-precipitation",
      "learn-more-thresholdtype"
    );
    const aggregationInfo = getToolContent(
      "extreme-precipitation",
      "learn-more-aggregate"
    );
    const notificationText = getToolContent(
      "extreme-precipitation",
      "notification-text"
    );
    const warningLowSampleSize = getToolContent(
      "extreme-precipitation",
      "warning-low-sample-size"
    );
    const warningMissingCI = getToolContent(
      "extreme-precipitation",
      "warning-missing-ci"
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        aboutContent,
        learnMoreContent: {
          durationInfo,
          indicatorInfo,
          periodInfo,
          thresholdTypeInfo,
          aggregationInfo,
        },
        notificationText,
        warningLowSampleSize,
        warningMissingCI,
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
