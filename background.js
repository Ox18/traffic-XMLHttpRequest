// Guardar un valor en chrome.storage.local
function saveToLocalStorage(key, value) {
  let obj = {};
  obj[key] = value;
  chrome.storage.local.set(obj, function () {});
}

// Recuperar un valor de chrome.storage.local
function getFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      resolve(result[key]);
    });
  });
}

function clearAllStorage() {
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
}

const generateSessionID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const sessionID = generateSessionID();
const key = "data-" + sessionID;

clearAllStorage();

chrome.webRequest.onCompleted.addListener(
  async function (details) {
    // if (!details.url.includes("data.js")) {
    //   return;
    // }

    // if (restrictedFiles.includes(details.url)) {
    //   return;
    // }

    // if end with restrictedFiles return

    try {
      const isActived = await getFromLocalStorage(details.url);

      if (isActived) {
        return;
      }
      saveToLocalStorage(details.url, true);

      const data = await fetch(details.url).then((response) => response.text());

      if (!data.includes("window.globalProvideData('data'")) {
        return;
      }

      let dataJSON = data.match(/window.globalProvideData\('data', '(.*)'\);/);

      dataJSON = dataJSON[1];

      const cleaned = dataJSON.replace(/\\'/g, "'").replace(/\\\"/g, '"');

      const dataParsed = JSON.parse(cleaned);

      console.log(dataParsed);

      var answersID = [];

      // if dataParsed.slideBank is empty Object
      if (Object.keys(dataParsed.slideBank).length === 0) {
        console.log("No data");
        console.log("Formulario no encontrado");

        const scenes = dataParsed.scenes;

        scenes.forEach((scene) => {
          const slides = scene.slides;
          slides.forEach((slide) => {
            if (!slide) {
              return;
            }

            if (!slide.interactions) {
              return;
            }
            slide.interactions.forEach((interaction) => {
              if (interaction.answers) {
                interaction.answers.forEach((answer) => {
                  if (answer.status === "correct") {
                    // get ID
                    const statement = answer.evaluate.statements[0];
                    const choiceId = statement.choiceid;
                    const answerId = choiceId.split("_")[1];
                    answersID.push(answerId);
                  }
                });
              }
            });
          });
        });

        console.log(answersID);

        setInterval(function () {
          chrome.scripting.executeScript({
            target: { tabId: details.tabId, allFrames: true },
            func: (answersID) => {
              // Aquí puedes escribir el código para modificar el HTML dentro del iframe
              // const iframes = document.getElementsByTagName("iframe");
              // for (let iframe of iframes) {
              //   try {
              //     const doc =
              //       iframe.contentDocument || iframe.contentWindow.document;
              //     let styleContent = ``;

              //     answersID.forEach((answerID) => {
              //       styleContent += `
              //       div[data-model-id="${answerID}"] {
              //         box-shadow: red 0px 54px 55px, red 0px -12px 30px, red 0px 4px 6px, red 0px 12px 13px, red 0px -3px 5px;
              //       }
              //     `;
              //     });

              //     const style = doc.createElement("style");
              //     style.textContent = styleContent;
              //     doc.head.appendChild(style);
              //   } catch (e) {
              //     console.error("No se pudo acceder al iframe:", e);
              //   }
              // }
              // not frame to implement style
              let styleContent = ``;
              try {
                answersID.forEach((answerID) => {
                  styleContent += `
                  div[data-model-id="${answerID}"] {
                    box-shadow: red 0px 54px 55px, red 0px -12px 30px, red 0px 4px 6px, red 0px 12px 13px, red 0px -3px 5px;
                  }
                `;
                });
                const style = document.createElement("style");
                style.textContent = styleContent;
                document.head.appendChild(style);
              } catch (e) {
                console.error("No se pudo acceder al iframe:", e);
              }
            },
            args: [answersID],
          });
        }, 1000);

        return;
      }

      const slideBank = dataParsed.slideBank;

      const slides = slideBank.slides;

      slides.forEach((slide) => {
        slide.interactions.forEach((interaction) => {
          if (interaction.answers) {
            interaction.answers.forEach((answer) => {
              if (answer.status === "correct") {
                // get ID
                const statement = answer.evaluate.statements[0];
                const choiceId = statement.choiceid;
                const answerId = choiceId.split("_")[1];
                answersID.push(answerId);
              }
            });
          }
        });
      });

      console.log(answersID);

      setInterval(function () {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId, allFrames: true },
          func: (answersID) => {
            // Aquí puedes escribir el código para modificar el HTML dentro del iframe
            const iframes = document.getElementsByTagName("iframe");
            for (let iframe of iframes) {
              try {
                const doc =
                  iframe.contentDocument || iframe.contentWindow.document;
                let styleContent = ``;

                answersID.forEach((answerID) => {
                  styleContent += `
                  div[data-model-id="${answerID}"] {
                    box-shadow: red 0px 54px 55px, red 0px -12px 30px, red 0px 4px 6px, red 0px 12px 13px, red 0px -3px 5px;
                  }
                `;
                });

                const style = doc.createElement("style");
                style.textContent = styleContent;
                doc.head.appendChild(style);
              } catch (e) {
                console.error("No se pudo acceder al iframe:", e);
              }
            }
          },
          args: [answersID],
        });
      }, 1000);
    } catch (ex) {
      console.error(ex);
    }

    // Save data in local storage
  },
  { urls: ["<all_urls>"] }
);
