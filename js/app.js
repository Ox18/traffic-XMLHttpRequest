(async function () {
  traffic.watcherApi.on((payload) => {
      traffic.logger.debug(JSON.stringify(payload));
  });
})();
