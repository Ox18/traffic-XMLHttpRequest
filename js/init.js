const fetchContent = (url) => {
  const path = chrome.extension.getURL(url + ".js");
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Hubo un problema con la petición Fetch:");
      console.log("Path:", path);
      console.error("Error al leer el archivo:", error);
    });
};

window.onload = async function () {
  const files = [
    "js/health",
    "js/utils/watcherApi",
    "js/utils/const",
    "js/config/index",
    "js/utils/logger",
    "js/app",
  ];

  const [...filesContent] = await Promise.all(
    files.map((file) => fetchContent(file))
  );

  const content = filesContent.join("\n");

  var script = document.createElement("script");
  script.type = "text/javascript";
  script.innerHTML = content;
  document.body.appendChild(script);
};
