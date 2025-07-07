const { SerialPort } = require('serialport');

SerialPort.list().then(ports => {
  console.log('Available Serial Ports:');
  ports.forEach(port => {
    console.log(`  Path: ${port.path}`);
    console.log(`    PnP ID: ${port.pnpId || 'N/A'}`);
    console.log(`    Manufacturer: ${port.manufacturer || 'N/A'}`);
    console.log(`    Serial Number: ${port.serialNumber || 'N/A'}`);
    console.log(`    Vendor ID: ${port.vendorId || 'N/A'}`);
    console.log(`    Product ID: ${port.productId || 'N/A'}`);
    console.log('---');
  });
}).catch(err => {
  console.error('Error listing serial ports:', err);
});
