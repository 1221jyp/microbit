const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');

// Express 앱 설정
const app = express();
const port = 3000;

// 시리얼 포트 설정
const portPath = '/dev/tty.usbmodem1402'; // 방금 찾은 경로
const serialPort = new SerialPort({
  path: portPath,
  baudRate: 115200, // 마이크로비트 코드에 설정된 값과 일치해야 함
});

// 파서 설정: 줄 단위로 데이터 읽기
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// 시리얼 포트 연결 에러 처리
serialPort.on('error', (err) => {
  console.error('SerialPort Error: ', err.message);
});

// 데이터 수신 처리
parser.on('data', (data) => {
  console.log(`Data from micro:bit: ${data}`);
});

// 기본 웹 서버 라우트
app.get('/', (req, res) => {
  res.send('Hello World! Check the console for micro:bit data.');
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('Waiting for data from micro:bit...');
});