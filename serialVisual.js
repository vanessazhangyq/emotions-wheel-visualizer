var writer;
var reader;
var port;
var inputDone;
var writableStreamClosed;
let cursor; // DOM element representing the cursor

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
  // Assuming data is in the format:
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

    // Log the potentiometer and button state to console
    console.log(`Button: ${data.buttonState}, Potentiometer: ${data.potValue}`);

    // Update the visual readout
    document.getElementById("value").innerText = `Button: ${data.buttonState}, Potentiometer: ${data.potValue}, Joystick X: ${data.xVal}, Joystick Y: ${data.yVal}, Joystick Z: ${data.zVal}`;
  }
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
