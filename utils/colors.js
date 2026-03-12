const colorConfig = require("../configs/colors.json");

function hexToInt(hex) {
  return parseInt(hex.replace("#", ""), 16);
}

const colors = {};
for (const [key, value] of Object.entries(colorConfig)) {
  colors[key] = hexToInt(value);
}

module.exports = colors;
