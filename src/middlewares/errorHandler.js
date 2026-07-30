// Centralized Error Handling Middleware
function errorHandler(err, req, res, next) {
  // Log The Error Details To Console
  console.error("Error Occurred:", err);

  // Determine Status Code And Message
  const status = err.status || 500;
  const message = err.message || "Internal Server Error!";

  // Send JSON Response With Error Information
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
