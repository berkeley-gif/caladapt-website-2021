export const logException = (error, exFatal = false) => {
  if (process.env.NODE_ENV === "production") {
    ga("send", "exception", {
      exDescription: typeof error === "object" ? error.message : error,
      exFatal,
    });
  }
};
