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

let telemetryItems = [];
let regionSize = 50;
let telemetryDataKind = 'position';


function groupTelemetryItemsByRegion() {
    // TODO: group them
    return telemetryItems;
}

function drawTelementryData() {
    canvasContext.drawImage(mapBackgroundImage, 0, 0, canvas.width, canvas.height);
    
    const groupedTelemetryItemsByRegion = groupTelemetryItemsByRegion();
    for (const telemetryItem of groupedTelemetryItemsByRegion) {
        const x = ((telemetryItem.positionX - BOUNDARY_LEFT) / (BOUNDARY_RIGHT - BOUNDARY_LEFT)) * canvas.width;
        const z = ((telemetryItem.positionZ - BOUNDARY_TOP) / (BOUNDARY_BOTTOM - BOUNDARY_TOP)) * canvas.height;
        
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(
            x - regionSize / 2,
            z - regionSize / 2,
            regionSize,
            regionSize
        );
    }
}


const telemetryFileInput = document.querySelector('#telemetry-file');
telemetryFileInput.addEventListener('change', async e => {
    const content = await telemetryFileInput.files[0].text();
    telemetryItems = content.split('\n').map(line => new TelemetryItem(line));
    drawTelementryData();
});

const regionSizeInput = document.querySelector('#region-size');
regionSizeInput.value = regionSize;
regionSizeInput.addEventListener('input', e => {
    regionSize = Number(regionSizeInput.value);
    drawTelementryData();
});

const telemetryDataKindSelect = document.querySelector('#telemetry-data-kind');
telemetryDataKindSelect.value = telemetryDataKind;
telemetryDataKindSelect.addEventListener('change', e => {
    telemetryDataKind = telemetryDataKindSelect.value;
    drawTelementryData();
});

drawTelementryData();
