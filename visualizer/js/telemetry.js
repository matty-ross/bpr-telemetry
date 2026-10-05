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

async function groupTelemetryItemsBySection() {
    if (!telemetryFile) {
        return {};
    }

    const groups = {};

    const content = await telemetryFile.text();
    const telemetryItems = content.split('\n').filter(line => line.length !== 0).map(line => new TelemetryItem(line));
    for (const telemetryItem of telemetryItems) {
        const section = getSectionNumber(telemetryItem);
        if (!groups[section]) {
            groups[section] = [];
        }
        groups[section].push(telemetryItem);
    }

    return groups;
}

function getSectionValue(telemetryItems) {
    switch (telemetryDataKind) {
        case 'position': {
            // Number of times the player was in that section.
            return telemetryItems.length;
        }

        case 'rotation': {
            // Circular mean.
            const sumSin = telemetryItems.reduce((sum, telemetryItem) => sum + Math.sin(telemetryItem.rotation), 0);
            const sumCos = telemetryItems.reduce((sum, telemetryItem) => sum + Math.cos(telemetryItem.rotation), 0);
            const averageRotation = Math.atan2(sumSin, sumCos);

            // atan2 returns -pi to pi, bring it back to the 0 to 2 pi range
            return (averageRotation + 2 * Math.PI) % (2 * Math.PI);
        }

        case 'speed': {
            // Average speed of the player in that section.
            return telemetryItems.reduce((sum, telemetryItem) => sum + telemetryItem.speedMPH, 0) / telemetryItems.length;
        }
    }

    return null;
}

async function drawTelementryData() {
    canvasContext.drawImage(mapBackgroundImage, 0, 0, canvas.width, canvas.height);

    const groups = await groupTelemetryItemsBySection();

    const sectionWidth = canvas.width / telemetryPrecision;
    const sectionHeight = canvas.height / telemetryPrecision;

    const sectionValues = {};
    for (const [section, telemetryItems] of Object.entries(groups)) {
        sectionValues[section] = getSectionValue(telemetryItems);
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
