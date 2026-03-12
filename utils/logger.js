const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function getTimestamp() {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

const logger = {
  info: (message) => {
    console.log(
      `${colors.cyan}[INFO]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
    );
  },

  success: (message) => {
    console.log(
      `${colors.green}[SUCCESS]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
    );
  },

  warn: (message) => {
    console.log(
      `${colors.yellow}[WARN]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
    );
  },

  error: (message) => {
    console.log(
      `${colors.red}[ERROR]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
    );
  },

  debug: (message) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
      );
    }
  },

  command: (message) => {
    console.log(
      `${colors.blue}[COMMAND]${colors.reset} ${colors.dim}[${getTimestamp()}]${colors.reset} ${message}`,
    );
  },
};

module.exports = logger;
