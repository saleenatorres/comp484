const locations = [
  null,
	/* coords 1 & 3 = top right corner of box, coords 2 & 4 = bottom left corner of box */
  (jacaranda = [34.239488, 34.24114213197049, -118.530045, -118.52952465185729]),
  (usu = [34.240796, 34.239195, -118.525217, -118.527264]),
  (manzanita = [34.23782384750282, 34.23685261755312, -118.5294897831521, -118.53063240421922]),
  (chaparral = [34.238604371214144, 34.2378593260103, -118.52670565012934, -118.52724209194493]),
  (sierra = [34.2384535887884, 34.23811210994351, -118.53004231822213, -118.53137805834285]),
];

var map;
var questionNumber = 1;
var correctAnswers = 0;
const ColorCorrect = "#00FF00";
const ColorWrong = "#FF0000";
const MAXQUESTIONS = locations.length - 1;

function initMap() {
  showQuestion(questionNumber);
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.239171, lng: -118.527593 },
    zoom: 17,
    // mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    draggable: false,
    clickableIcons: false,
    disableDefaultUI: true,
    gestureHandling: "none",
    styles: [
      //PLACES OF INTEREST LABELS
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      // ROAD LABELS
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ],
  });

  map.addListener("dblclick", function (answer) {
    if (!timerIsOn) startTimer();

    if (questionNumber < locations.length) {
      let Point = getUserAnswer(answer);
      processAnswer(locations[questionNumber], Point);

      questionNumber++;
      showQuestion(questionNumber);
    }
    if (questionNumber == locations.length) {
      showScore();
      clearInterval(timer);
    }
  });
}

function showScore() {
  s = document.getElementById("score");
  s.innerHTML = " You Got " + correctAnswers + " Out of " + MAXQUESTIONS;
}
function processAnswer(location, point) {
  if (isInside(location, point)) {
    colorRectangle(location, true);
    colorWord(questionNumber, true);
    wordPrompt(questionNumber, true);
    correctAnswers++;
  } else if (!isInside(location, point)) {
    colorRectangle(location, false);
    colorWord(questionNumber, false);
    wordPrompt(questionNumber, false);
  } else console.log("erorrsrsr");
}
function getUserAnswer(answer) {
  return [answer.latLng.lat(), answer.latLng.lng()];
}
function showQuestion(i) {
  if (i < locations.length) {
    var q = document.getElementById("q" + i);
    q.style.display = "block";
  }
}
function isInside(box, point) {
  if (
    point[0] <= box[0] &&
    point[0] >= box[1] &&
    point[1] <= box[2] &&
    point[1] >= box[3]
  )
    return true;
  else return false;
}

function wordPrompt(i, isCorrect) {
  var w = document.getElementById("a" + i);
  if (isCorrect) {
    w.innerHTML = "CORRECT!";
  } else if (!isCorrect) {
    w.innerHTML = "WRONG!";
  }
}
function colorWord(i, isCorrect) {
  if (i < locations.length) {
    var w = document.getElementById("a" + i);
    if (isCorrect) {
      w.style.background = ColorCorrect;
    } else if (!isCorrect) {
      w.style.background = ColorWrong;
    } else console.log("errorrss");
  }
}
function colorRectangle(location, isCorrect) {
  if (isCorrect) {
    var library = new google.maps.Rectangle({
      strokeColor: ColorCorrect,
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: ColorCorrect,
      fillOpacity: 0.3,
      map: map,
      bounds: {
        north: location[0],
        south: location[1],
        east: location[2],
        west: location[3],
      },
    });
  } else if (!isCorrect) {
    var library = new google.maps.Rectangle({
      strokeColor: ColorWrong,
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: ColorWrong,
      fillOpacity: 0.3,
      map: map,
      bounds: {
        north: location[0],
        south: location[1],
        east: location[2],
        west: location[3],
      },
    });
  }
}

/////TIMER FUNCTIONS
var min = 0,
  sec = 0,
  hun = 0,
  timer = 0;
var timerIsOn = false;
const theTimer = document.querySelector(".timer");

function leadingNum() {
  if (hun < 10) hun = "0" + hun;
  if (sec < 10) sec = "0" + sec;
  if (min < 10) min = "0" + min;
}

function add() {
  hun++;
  if (hun == 100) {
    hun = 0;
    sec++;
    if (sec == 60) {
      sec = 0;
      min++;
    }
  }
  theTimer.innerHTML = min + ":" + sec + ":" + hun;
}

function startTimer() {
  timerIsOn = true;
  timer = setInterval(add, 10);
}

window.onload = initMap;
