"use strict";

const fs = require("fs");
const path = require("path");

let ECO_CACHE = null;

function loadECO() {
  if (ECO_CACHE) return ECO_CACHE;

  const ecoPath = path.join(__dirname, "eco.json");
  const raw = fs.readFileSync(ecoPath, "utf-8");

  ECO_CACHE = JSON.parse(raw);

  return ECO_CACHE;
}

module.exports = {
  loadECO,
};
