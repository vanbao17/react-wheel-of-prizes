function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var WheelComponent = function WheelComponent(_ref) {
  var segments = _ref.segments,
      segColors = _ref.segColors,
      winningSegment = _ref.winningSegment,
      onFinished = _ref.onFinished,
      _ref$primaryColor = _ref.primaryColor,
      primaryColor = _ref$primaryColor === void 0 ? 'black' : _ref$primaryColor,
      _ref$contrastColor = _ref.contrastColor,
      contrastColor = _ref$contrastColor === void 0 ? 'white' : _ref$contrastColor,
      _ref$buttonText = _ref.buttonText,
      buttonText = _ref$buttonText === void 0 ? 'Spin' : _ref$buttonText,
      _ref$isOnlyOnce = _ref.isOnlyOnce,
      isOnlyOnce = _ref$isOnlyOnce === void 0 ? true : _ref$isOnlyOnce,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? window.innerWidth : _ref$size,
      _ref$upDuration = _ref.upDuration,
      upDuration = _ref$upDuration === void 0 ? 100 : _ref$upDuration,
      _ref$downDuration = _ref.downDuration,
      downDuration = _ref$downDuration === void 0 ? 5000 : _ref$downDuration,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? 'proxima-nova' : _ref$fontFamily,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? '1em' : _ref$fontSize,
      _ref$outlineWidth = _ref.outlineWidth,
      outlineWidth = _ref$outlineWidth === void 0 ? 10 : _ref$outlineWidth;

  var randomString = function randomString() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var length = 8;
    var str = '';

    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }

    return str;
  };

  var canvasId = React.useRef("canvas-" + randomString());
  var wheelId = React.useRef("wheel-" + randomString());
  var dimension = (size + 20) * 2;
  var currentSegment = '';
  var isStarted = false;

  var _useState = React.useState(false),
      isFinished = _useState[0],
      setFinished = _useState[1];

  var timerHandle = 0;
  var timerDelay = segments.length;
  var angleCurrent = 0;
  var angleDelta = 0;
  var canvasContext = null;
  var extraSpins = 10; // Number of extra spins
  var totalSegments = segments.length;
  var maxSpeed = Math.PI / totalSegments;
  var upTime = totalSegments * upDuration;
  var downTime = totalSegments * (downDuration + extraSpins * 1000); // Adjusted downTime for extra spins
  var spinStart = 0;
  var frames = 0;
  var centerX = size + 20;
  var centerY = size + 20;
  React.useEffect(function () {
    wheelInit();
    setTimeout(function () {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  var wheelInit = function wheelInit() {
    initCanvas();
    wheelDraw();
  };

  console.log(winningSegment);

  var initCanvas = function initCanvas() {
    var _canvas, _canvas2;

    var canvas = document.getElementById(canvasId.current);

    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      var _document$getElementB;

      canvas = document.createElement('canvas');
      canvas.setAttribute('width', "" + dimension);
      canvas.setAttribute('height', "" + dimension);
      canvas.setAttribute('id', canvasId.current);
      (_document$getElementB = document.getElementById(wheelId.current)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.appendChild(canvas);
    }

    (_canvas = canvas) === null || _canvas === void 0 ? void 0 : _canvas.addEventListener('click', spin, false);
    canvasContext = (_canvas2 = canvas) === null || _canvas2 === void 0 ? void 0 : _canvas2.getContext('2d');
  };

  var spin = function spin() {
    isStarted = true;

    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / totalSegments;
      frames = 0;
      timerHandle = window.setInterval(onTimerTick, timerDelay);
    }
  };

  var onTimerTick = function onTimerTick() {
    frames++;
    draw();
    var duration = new Date().getTime() - spinStart;
    var progress = 0;
    var finished = false;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > totalSegments * (1 + extraSpins)) {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
      }

      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;

    while (angleCurrent >= Math.PI * 2) {
      angleCurrent -= Math.PI * 2;
    }

    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  var wheelDraw = function wheelDraw() {
    clear();
    drawWheel();
    drawNeedle();
  };

  var draw = function draw() {
    clear();
    drawWheel();
    drawNeedle();
  };

  var drawSegment = function drawSegment(key, lastAngle, angle) {
    if (!canvasContext) {
      return false;
    }

    var ctx = canvasContext;
    var value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor;
    ctx.font = "bold " + fontSize + " " + fontFamily;
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  var drawWheel = function drawWheel() {
    if (!canvasContext) {
      return false;
    }

    var ctx = canvasContext;
    var lastAngle = angleCurrent;
    var len = segments.length;
    var PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1em ' + fontFamily;

    for (var i = 1; i <= len; i++) {
      var angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor;
    ctx.fill();
    ctx.font = 'bold 1em ' + fontFamily;
    ctx.fillStyle = contrastColor;
    ctx.textAlign = 'center';
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  var drawNeedle = function drawNeedle() {
    if (!canvasContext) {
      return false;
    }

    var ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    var change = angleCurrent + Math.PI / 2;
    var i = segments.length - Math.floor(change / (Math.PI * 2) * segments.length) - 1;
    if (i < 0) i = i + segments.length;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 1.5em ' + fontFamily;
    currentSegment = segments[i];
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  var clear = function clear() {
    if (!canvasContext) {
      return false;
    }

    var ctx = canvasContext;
    ctx.clearRect(0, 0, dimension, dimension);
  };

  return React__default.createElement("div", {
    id: wheelId.current
  }, React__default.createElement("canvas", {
    id: canvasId.current,
    width: dimension,
    height: dimension,
    style: {
      pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
    }
  }));
};

module.exports = WheelComponent;
//# sourceMappingURL=index.js.map
