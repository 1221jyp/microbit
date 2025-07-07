
const { SerialPort } = require('serialport');

async function listPorts() {
  try {
    const ports = await SerialPort.list();
    if (ports.length === 0) {
      console.log('No serial ports found. Make sure the micro:bit is connected and running the correct program.');
      return;
    }
    console.log('Available ports:');
    ports.forEach(port => {
      console.log(`- ${port.path} (${port.manufacturer || 'No manufacturer'})`);
    });
  } catch (err) {
    console.error('Error listing serial ports:', err);
  }
}

listPorts();
