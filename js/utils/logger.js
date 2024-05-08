class Logger {
  #name;

  #loggers = [
    ["info", "INFO", "#bada55"],
    ["warn", "WARN", "orange"],
    ["debug", "DEBUG", "white"],
    ["error", "ERROR", "red"],
  ];

  constructor(name) {
    this.#name = name;
    this.#build();
  }

  #build() {
    this.#loggers.forEach(([methodName, prefix, color]) => {
      this[methodName] = (message) => {
        if (
          methodName === "debug" &&
          traffic.config.mode !== traffic.consts.MODE.DEVELOPMENT
        ) {
          return;
        }

        this.#print(message, prefix, color);
      };
    });
  }

  #print(message, prefix, color) {
    console.log(
      `%c ${this.#generateMessage(message, prefix)}`,
      `background: #222; color: ${color}`
    );
  }

  #generateMessage(message, type) {
    return `${this.getTimestamp()}:${type}  [${this.#name}]: ${message}`;
  }

  getTimestamp() {
    return new Date().toISOString();
  }
}

traffic.logger = new Logger("app");
