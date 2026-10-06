const BOUNDARY_LEFT = -4159;
const BOUNDARY_RIGHT = 6055;
const BOUNDARY_TOP = -5688;
const BOUNDARY_BOTTOM = 3680;


class TelemetryItem {
    constructor (line) {
        const items = line.split(',');

        this.positionX = Number(items[0]);
        this.positionY = Number(items[1]);
        this.positionZ = Number(items[2]);
        this.rotation = Number(items[3]);
        this.speedMPH = Number(items[4]);
    }
}

class SectionTelemetryData {
    count = 0;
    sumSpeed = 0;
    sumSin = 0;
    sumCos = 0;
}


const mapBackgroundImage = new Image();
mapBackgroundImage.src = './img/map.png';

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

let telemetryFile = null;
let telemetryPrecision = 50;
let telemetryDataKind = 'position';

let telemetryData = {};


/**
 * telemetry precision 3:
 *  0 1 2
 *  3 4 5
 *  6 7 8
 */
function getSection(telemetryItem) {
    const x = (telemetryItem.positionX - BOUNDARY_LEFT) / (BOUNDARY_RIGHT - BOUNDARY_LEFT);
    const z = (telemetryItem.positionZ - BOUNDARY_TOP) / (BOUNDARY_BOTTOM - BOUNDARY_TOP);

    const column = Math.floor(x * telemetryPrecision);
    const row = Math.floor(z * telemetryPrecision);

    return row * telemetryPrecision + column;
}

async function* readTelemetryFile() {
    const reader = telemetryFile.stream().pipeThrough(new TextDecoderStream()).getReader();

    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        buffer += value;

        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop(); // a chunk can end in the middle of a line, keep that part for the next chunk
        yield* lines;
    }

    if (buffer.length !== 0) {
        yield buffer; // last line without a trailing newline
    }
}

async function fillTelemetryData() {
    telemetryData = {};

    if (!telemetryFile) {
        return;
    }

    for await (const line of readTelemetryFile()) {
        if (line.length === 0) {
            continue;
        }

        const telemetryItem = new TelemetryItem(line);
        const section = getSection(telemetryItem);

        telemetryData[section] ??= new SectionTelemetryData();
        telemetryData[section].count++;
        telemetryData[section].sumSpeed += telemetryItem.speedMPH;
        telemetryData[section].sumSin += Math.sin(telemetryItem.rotation);
        telemetryData[section].sumCos += Math.cos(telemetryItem.rotation);
    }
}

function getSectionValue(sectionTelemetryData) {
    switch (telemetryDataKind) {
        case 'position': {
            // Number of times in that section.
            return sectionTelemetryData.count;
        }

        case 'rotation': {
            // Circular mean.
            const circularMean = Math.atan2(sectionTelemetryData.sumSin, sectionTelemetryData.sumCos);

            // atan2 returns -pi to pi, bring it back to the 0 to 2 pi range
            return (circularMean + 2 * Math.PI) % (2 * Math.PI);
        }

        case 'speed': {
            // Average speed.
            return sectionTelemetryData.sumSpeed / sectionTelemetryData.count;
        }
    }

    return null;
}

function drawTelementryData() {
    canvasContext.drawImage(mapBackgroundImage, 0, 0, canvas.width, canvas.height);

    const sectionWidth = canvas.width / telemetryPrecision;
    const sectionHeight = canvas.height / telemetryPrecision;

    const sectionValues = {};
    for (const [section, sectionTelemetryData] of Object.entries(telemetryData)) {
        sectionValues[section] = getSectionValue(sectionTelemetryData);
    }

    const values = Object.values(sectionValues);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    for (const [section, value] of Object.entries(sectionValues)) {
        const column = section % telemetryPrecision;
        const row = Math.floor(section / telemetryPrecision);

        const ratio = maxValue === minValue ? 0 : (value - minValue) / (maxValue - minValue);

        canvasContext.fillStyle = `hsl(${240 * (1 - ratio)}deg 100% 50% / 75%)`;
        canvasContext.fillRect(column * sectionWidth, row * sectionHeight, sectionWidth, sectionHeight);
    }
}


const telemetryFileInput = document.querySelector('#telemetry-file');
telemetryFileInput.addEventListener('change', async e => {
    telemetryFile = telemetryFileInput.files[0];
    await fillTelemetryData();
    drawTelementryData();
});

const telemetryPrecisionInput = document.querySelector('#telemetry-precision');
telemetryPrecisionInput.value = telemetryPrecision;
telemetryPrecisionInput.addEventListener('input', async e => {
    telemetryPrecision = Number(telemetryPrecisionInput.value);
    await fillTelemetryData();
    drawTelementryData();
});

const telemetryDataKindSelect = document.querySelector('#telemetry-data-kind');
telemetryDataKindSelect.value = telemetryDataKind;
telemetryDataKindSelect.addEventListener('change', e => {
    telemetryDataKind = telemetryDataKindSelect.value;
    drawTelementryData();
});

drawTelementryData();
