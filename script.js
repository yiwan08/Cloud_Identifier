// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/mkVQ5QU5d/";

let model, webcam, labelContainer, maxPredictions;

const resultContainer = document.getElementById("result");
const startButton = document.getElementById("start-button")

const classLabels = ["Cirrus", "Cirrocumulus", "Cirrostratus", "Altocumulus","Altostratus", "Nimbostratus", "Cumulonimbus", "Cumulus", "Stratus", "Stratocumulus"];

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(800, 500, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
var scores = [];
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
  
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      var currentNode = labelContainer.childNodes[i];
        currentNode.innerHTML = classPrediction;
        scores.push(prediction[i].probability);
      
    if (prediction[i].probability.toFixed(2) >= 0.70) {
      currentNode.style.background = "light green";
    }
  }

var maxScore = Math.max(...scores);
var maxLabel = classLabels[scores.indexOf(maxScore)]
result.innerHTML = maxLabel;

  if (maxLabel === "Cirrus") {
    weather.innerHTML = "Indicates warm air will form; generally good weather; no precipitation!";
  } else if (maxLabel === "Cirrocumulus") {
    weather.innerHTML = "Fair weather; slight chance for storm.";
  } else if (maxLabel === "Cirrostratus") {
    weather.innerHTML = "Either persistent rain within a day or a light drizzle!";
  } else if (maxLabel === "Altocumulus") {
    weather.innerHTML = "Nothing will happen soon, enjoy the sun!";
  } else if (maxLabel === "Altostratus") {
    weather.innerHTML = "Usually indicates rain or snow to come but generally light precipitation~";
  } else if (maxLabel === "Nimbostratus") {
    weather.innerHTML = "Leads to continuous moderate precipitation that lasts for several hours.";
  } else if (maxLabel === "Cumulonimbus") {
    weather.innerHTML = "Leads to extreme weather such as heavy downpours and tornadoes. Be careful!";
  } else if (maxLabel === "Cumulus") {
    weather.innerHTML = "It's a sunny day! But may develops into cumulonimbus which causes precipitation...";
  } else if (maxLabel === "Stratus") {
    weather.innerHTML = "Usually no rainfall, sometimes slight drizzle, light snow if cold enough.";
  } else if (maxLabel === "Stratocumulus") {
    weather.innerHTML = "Most common type of cloud; does not mean anything :]";
  } else {
    weather.innerHTML = "N/A";
  }
  scores = [];
}
