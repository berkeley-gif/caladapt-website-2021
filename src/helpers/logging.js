export const logException = (error, fatal = false) => {
  if (process.env.DEPLOY === "prod") {
    try {
      gtag("event", "exception", {
        description: typeof error === "object" ? error.message : `${error}`,
        fatal,
      });
    } catch (e) {
      console.warn("gtag exception event capture failed: ", e.message);
    }
  }
};
