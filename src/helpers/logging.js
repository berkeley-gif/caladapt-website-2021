export const logException = (error, fatal = false) => {
  if (process.env.NODE_ENV === "production") {
    gtag("event", "exception", {
      description: typeof error === "object" ? error.message : error,
      fatal,
    });
  }
};
