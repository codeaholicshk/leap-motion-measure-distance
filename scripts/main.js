var enableGestures = false;
var measureMode = false;
var currentHandId = -1;
var handMoved = false;
var startPoint = [null, null, null];
var previousFrame = null;

Leap.loop({enableGestures: enableGestures}, function(frame) {
  if (frame.hands.length == 1) {
    if (!measureMode && notCurrentHandId(frame) && isStartGesture(frame)) {
      measureMode = true;
      setCurrentHandId(frame);
      resetResult();
      setStartPoint(frame);
    }

    if (measureMode) {
      if (!handMoved) {
        handMoved = isHandMoved(frame);
      } else if (isEndGesture(frame)) {
        measureMode = false;
        setEndPoint(frame);
        displayResult();
      }
    }
  } else {
    measureMode = false;
    resetResult();
  }

  displayHandsDetected(frame);
  displayCurrentMeasureMode();

  if (frame.hands.length == 1) {
    previousVelocity = frame.hands[0].palmVelocity;
  } else {
    previousVelocity = null;
  }

})

function resetResult() {
  startPoint = [null, null, null];
  endPoint = [null, null, null];
  handMoved = false;
}

function isStartGesture(frame) {
  console.log("isStartGesture");
  if (previousVelocity != null && frame.hands.length == 1) {
    var velocity = frame.hands[0].palmVelocity;
    return isHandSteady(velocity);
  } else {
    return false;
  }
}

function isHandMoved(frame) {
  console.log("isHandMoved");
  if(frame.hands.length == 1) {
    var velocity = frame.hands[0].palmVelocity;
    return isHandMoving(velocity);
  } else {
    return false;
  }
}

function isEndGesture(frame) {
  console.log("isEndGesture");
  if (previousVelocity != null && frame.hands.length == 1) {
    var velocity = frame.hands[0].palmVelocity;
    return isHandSteady(velocity);
  } else {
    return false;
  }
}

function setStartPoint(frame) {
  startPoint = frame.hands[0].palmPosition;
}

function setEndPoint(frame) {
  endPoint = frame.hands[0].palmPosition;
}

function displayHandsDetected(frame) {
  var messageMeasureMode = document.getElementById("message-measure-mode");

  var messageHandsDetected = document.getElementById("message-hands-detected");
  if (frame.hands.length == 1) {
    messageHandsDetected.innerHTML = "One hand detected";

    messageMeasureMode.style.display = "block";
  } else if (frame.hands.length == 2) {
    messageHandsDetected.innerHTML = "Only one hand supported";

    messageMeasureMode.style.display = "none";
  } else {
    messageHandsDetected.innerHTML = "No hands detected";

    messageMeasureMode.style.display = "none";
  }
}

function displayCurrentMeasureMode() {
  var messageMeasureMode = document.getElementById("message-measure-mode");

  if (measureMode) {
    messageMeasureMode.innerHTML = "Measuring ...";
  } else {
    messageMeasureMode.innerHTML = "Keep your palm above the sensor to start";
  }
}

function displayResult() {
  var messageMeasureMode = document.getElementById("message-measure-result");
  messageMeasureMode.innerHTML = "<div>Started at: " + vectorToString(startPoint) + "</div>" +
    "<div>Ended at: " + vectorToString(endPoint) + "</div>" +
    "<div>Distance: " + distance(startPoint, endPoint).toFixed(2) + " millimeters</div>" +
    "<div>Vertical Distance: " + (endPoint[1] - startPoint[1]).toFixed(2) + " millimeters</div>" +
    "<div>Horizontal Distance: " + (endPoint[0] - startPoint[0]).toFixed(2) + " millimeters</div>";
}

function isHandMoving(velocity) {
  return !isVelocityWithinThreshold(velocity, 500);
}

function isHandSteady(velocity) {
  return isVelocityWithinThreshold(velocity, 1);
}

function isVelocityWithinThreshold(velocity, magnitude) {
  return Math.abs(velocity[0]) < magnitude && Math.abs(velocity[1]) < magnitude && Math.abs(velocity[2]) < magnitude;
}

function notCurrentHandId(frame) {
  return frame.hands.length == 1 && currentHandId != frame.hands[0].id;
}

function setCurrentHandId(frame) {
  currentHandId = frame.hands[0].id;
}

function distance(pointA, pointB) {
  return Math.sqrt( Math.pow(pointB[1] - pointA[1], 2) + Math.pow(pointB[0] - pointA[0], 2));
}

function vectorToString(vector) {
  return "(" + vector[0].toFixed(2) + ", "
             + vector[1].toFixed(2) + ", "
             + vector[2].toFixed(2) + ")";
}
