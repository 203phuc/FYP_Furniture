// middleware/timingMiddleware.js
const timingMiddleware = (req, res, next) => {
  // Record the start time
  const start = Date.now();

  // Listen for the 'finish' event to know when the response is sent
  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate duration
    console.log(
      `Request to ${req.method} ${req.originalUrl} took ${duration} ms`
    );
  });

  next(); // Move to the next middleware/route handler
};

export default timingMiddleware;
