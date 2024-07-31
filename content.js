document.addEventListener("DOMContentLoaded", function () {
  const pageContent = document.documentElement.outerHTML;

  chrome.runtime.sendMessage({
    action: "captureContent",
    data: pageContent,
  });
});
