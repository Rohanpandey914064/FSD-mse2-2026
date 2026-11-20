const clean = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    if (key === "password") continue;

    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim().replace(/[<>]/g, "");
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      clean(obj[key]);
    }
  }
};

const sanitize = (req, res, next) => {
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
};

module.exports = sanitize;
