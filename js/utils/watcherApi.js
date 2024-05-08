class WatcherApi {
  _handle;
  constructor() {
    this._handle = () => {};
    this.#run();
  }

  on(callback) {
    this._handle = callback;
  }

  #run() {
    var originalXhrOpen = window.XMLHttpRequest.prototype.open;

    var self = this;
    window.XMLHttpRequest.prototype.open = function (method, url) {
      const payload = {
        method,
        url,
      };

      self._handle(payload);

      return originalXhrOpen.apply(this, arguments);
    };
  }
}

traffic.watcherApi = new WatcherApi();
