const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((item) => item.message).join(", ");
  }

  if (err.code === 11000) {
    status = 409;
    message = "Duplicate value, already exists";
  }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
