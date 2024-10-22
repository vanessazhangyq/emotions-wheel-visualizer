var writer;
var reader;
var port;
var inputDone;
var writableStreamClosed;
let cursor; 
let stickerArea;
let wiper;

// Called when user clicks Serial Connect button
const serialConnect = async () => {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  let decoder = new TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;
  reader = inputStream.getReader();
  handleSerial();

  const textEncoder = new TextEncoderStream();
  writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
  writer = textEncoder.writable.getWriter();

  cursor = document.getElementById("cursor");
  stickerArea = document.getElementById("sticker-area");
  wiper = document.getElementById("wiper");
};

async function handleSerial() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    if (value) {
      const data = parseSerialData(value);
      updateUI(data);
    }
  }
}

// Parse incoming serial data
function parseSerialData(data) {
  // Data is in the format:
  // Button: 1, Potentiometer: 2048, Joystick: 512, 512, 0
  const match = data.match(/Button: (\d+), Potentiometer: (\d+), Joystick: (\d+),(\d+),(\d+)/);
  if (match) {
    return {
      buttonState: Number(match[1]),
      potValue: Number(match[2]),
      xVal: Number(match[3]),
      yVal: Number(match[4]),
      zVal: Number(match[5])
    };
  }
  return null;
}

// Update UI elements with the parsed serial data
function updateUI(data) {
  if (data) {
    // Update cursor position based on joystick values
    const xPos = mapRange(data.xVal, 0, 4095, 0, window.innerWidth);
    const yPos = mapRange(data.yVal, 0, 4095, 0, window.innerHeight);
    cursor.style.left = `${xPos}px`;
    cursor.style.top = `${yPos}px`;

    // Map potentiometer value to a color (0-4095 mapped to hue)
    const hue = mapRange(data.potValue, 0, 4095, 0, 360);
    const color = `hsl(${hue}, 100%, 50%)`;
    cursor.style.backgroundColor = color;

    // Move the wiper based on potentiometer value
    const wiperPosition = mapRange(data.potValue, 0, 4095, 0, document.getElementById("color-bar").offsetWidth - wiper.offsetWidth);
    wiper.style.left = `${wiperPosition}px`;

    console.log(`Button: ${data.buttonState}, Potentiometer: ${data.potValue}`);

    document.getElementById("value").innerText = `Button: ${data.buttonState}, Potentiometer: ${data.potValue}, Joystick X: ${data.xVal}, Joystick Y: ${data.yVal}, Joystick Z: ${data.zVal}`;

    // If the button is pressed, create a new circle sticker at the joystick position
    if (data.buttonState === 0) {
      createSticker(xPos, yPos, color);
    }
  }
}

// Create a circle sticker at the given position with the given color
function createSticker(x, y, color) {
  const sticker = document.createElement("div");
  sticker.classList.add("sticker");
  sticker.style.left = `${x - 22}px`;
  sticker.style.top = `${y - 774}px`;
  sticker.style.backgroundColor = color;
  stickerArea.appendChild(sticker);
}

// Utility function to map joystick values to screen coordinates
function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const serialWrite = async () => {
  let message = document.getElementById("message").value;
  console.log("message: ", message);
  await writer.write(message);
};

const serialDisconnect = async() => {
  reader.cancel();
  await inputDone.catch(() => {});
  writer.close();
  await writableStreamClosed;
  await port.close();
  document.getElementById("content").style.visibility = "hidden";
};
