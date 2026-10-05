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


const mapBackgroundImage = new Image();
mapBackgroundImage.src = './img/map.png';

const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

let telemetryFile = null;
let telemetryPrecision = 50;
let telemetryDataKind = 'position';


/**
 * telemetry precision 3:
 *  0 1 2
 *  3 4 5
 *  6 7 8
 */
function getSectionNumber(telemetryItem) {
    const x = (telemetryItem.positionX - BOUNDARY_LEFT) / (BOUNDARY_RIGHT - BOUNDARY_LEFT);
    const z = (telemetryItem.positionZ - BOUNDARY_TOP) / (BOUNDARY_BOTTOM - BOUNDARY_TOP);

    const column = Math.floor(x * telemetryPrecision);
    const row = Math.floor(z * telemetryPrecision);

    return row * telemetryPrecision + column;
}

async function* readLines() {
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

function accumulateTelemetryItem(accumulator, telemetryItem) {
    switch (telemetryDataKind) {
        case 'position': {
            // Number of times the player was in that section.
            return (accumulator ?? 0) + 1;
        }

        case 'rotation': {
            // Sum of the direction vectors, for the circular mean.
            accumulator ??= { sumSin: 0, sumCos: 0 };
            accumulator.sumSin += Math.sin(telemetryItem.rotation);
            accumulator.sumCos += Math.cos(telemetryItem.rotation);
            return accumulator;
        }

        case 'speed': {
            // Sum and count of the speeds, for the average speed.
            accumulator ??= { sum: 0, count: 0 };
            accumulator.sum += telemetryItem.speedMPH;
            accumulator.count++;
            return accumulator;
        }
    }

    return null;
}

async function accumulateTelemetryBySection() {
    if (!telemetryFile) {
        return {};
    }

    const accumulators = {};

    for await (const line of readLines()) {
        if (line.length === 0) {
            continue;
        }

        const telemetryItem = new TelemetryItem(line);
        const section = getSectionNumber(telemetryItem);
        accumulators[section] = accumulateTelemetryItem(accumulators[section], telemetryItem);
    }

    return accumulators;
}

function getSectionValue(accumulator) {
    switch (telemetryDataKind) {
        case 'position': {
            return accumulator;
        }

        case 'rotation': {
            // Circular mean.
            const averageRotation = Math.atan2(accumulator.sumSin, accumulator.sumCos);

            // atan2 returns -pi to pi, bring it back to the 0 to 2 pi range
            return (averageRotation + 2 * Math.PI) % (2 * Math.PI);
        }

        case 'speed': {
            return accumulator.sum / accumulator.count;
        }
    }

    return null;
}

async function drawTelementryData() {
    canvasContext.drawImage(mapBackgroundImage, 0, 0, canvas.width, canvas.height);

    const accumulators = await accumulateTelemetryBySection();

    const sectionWidth = canvas.width / telemetryPrecision;
    const sectionHeight = canvas.height / telemetryPrecision;

    const sectionValues = {};
    for (const [section, accumulator] of Object.entries(accumulators)) {
        sectionValues[section] = getSectionValue(accumulator);
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
telemetryFileInput.addEventListener('change', e => {
    telemetryFile = telemetryFileInput.files[0];
    drawTelementryData();
});

const telemetryPrecisionInput = document.querySelector('#telemetry-precision');
telemetryPrecisionInput.value = telemetryPrecision;
telemetryPrecisionInput.addEventListener('input', e => {
    telemetryPrecision = Number(telemetryPrecisionInput.value);
    drawTelementryData();
});

const telemetryDataKindSelect = document.querySelector('#telemetry-data-kind');
telemetryDataKindSelect.value = telemetryDataKind;
telemetryDataKindSelect.addEventListener('change', e => {
    telemetryDataKind = telemetryDataKindSelect.value;
    drawTelementryData();
});

drawTelementryData();
