// observer con un setInterval todos aquellos div que tengan esta propiedad
// data-model-id="" y que me devuelva su valor

setInterval(() => {
  console.log("interval");
  document.querySelectorAll("div[data-model-id]").forEach((element) => {
    console.log("xd");
    console.log(element.getAttribute("data-model-id"));
  });
});

console.log("ga");

for (let i = 0; i < 100; i++) {
  console.log("executing ga");
  document.querySelectorAll("div[data-model-id]").forEach((element) => {
    console.log("xd");
    console.log(element.getAttribute("data-model-id"));
  });
}
