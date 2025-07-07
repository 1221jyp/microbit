const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const path = require('path');

const app = express();
const port = 3000;

// 데이터베이스 대신 서버 메모리에 투표 데이터를 저장합니다.
// 서버가 재시작되면 초기화됩니다.
let votes = {
    good: 0,
    bad: 0
};

// --- 마이크로비트 시리얼 포트 설정 ---
// 윈도우의 '장치 관리자' -> '포트 (COM & LPT)'에서
// 마이크로비트가 연결된 포트 이름(예: COM3, COM4)을 확인하고 아래 'COMx'를 수정해주세요.
const portName = 'COM5';

try {
    const serialPort = new SerialPort({ path: portName, baudRate: 115200 });
    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' })); // 이스케이프 문자 수정

    console.log(`마이크로비트 연결을 위해 ${portName} 포트를 열었습니다. 기다리는 중...`);

    parser.on('data', (data) => {
        const vote = data.toString().trim();
        if (vote === 'A') {
            votes.good++;
            console.log(`[긍정] '맛있다' 투표가 들어왔습니다. 현재 득표 현황:`, votes);
        } else if (vote === 'B') {
            votes.bad++;
            console.log(`[부정] '맛없다' 투표가 들어왔습니다. 현재 득표 현황:`, votes);
        }
    });

    serialPort.on('error', (err) => {
      console.error('시리얼 포트 에러:', err.message);
    });

} catch (err) {
    console.error(`'${portName}' 포트를 여는데 실패했습니다. 포트 이름을 확인했는지, 마이크로비트가 올바르게 연결되었는지 확인해주세요.`);
    console.error('에러 상세 정보:', err.message);
    console.log('웹 서버는 마이크로비트 연동 없이 실행됩니다.');
}
// ------------------------------------

// 웹사이트의 기본 페이지(index.html)를 제공합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 현재 투표 현황 데이터를 JSON 형태로 제공하는 API 엔드포인트
app.get('/stats', (req, res) => {
    res.json(votes);
});

app.listen(port, () => {
    console.log(`급식 평가 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});