//import { convertFile } from './media-convert.js';
import { triggerDownload, toggleContrast, setInitialContrast } from '../../scripts/utils.js';
import { loadFFmpeg } from './client.js';

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('bownloadBtn');
const contrastBtn = document.getElementById('darkModeBtn');

document.body.classList.add("no-transition");

var contrastToggle = setInitialContrast();

setTimeout(() => {
    document.body.classList.remove("no-transition");
}, 10);

let convertedFileData = null;

const ffmpegPromise = loadFFmpeg(); // start loading ffmpeg as soon as possible

// convert button

convertBtn.addEventListener('click', async() => {
    const file = fileInput.files[0];  // get selected file
    const outputFormat = fileFormat.value; // get current value

    // check if file exists
    if (!file) {
        statusMessage.textContent = 'No media selected.';
        return;
    }

    const inputType = file.type;  // get MIME type of the file
    console.log('Selected media type:', inputType);

    downloadBtn.disabled = true; // disable download button until conversion is done
    statusMessage.textContent = 'Reading media...';
    convertBtn.disabled = true; // prevent multiple uploads

    
    try{
        
    }
    catch(error){
        console.error('Conversion error:', error);
        statusMessage.textContent = 'Conversion failed: ' + error.message;
    }finally{
        convertBtn.disabled = false;
    }
});

// download button
downloadBtn.addEventListener('click', () => {
    if (convertedFileData) {
        triggerDownload(convertedFileData.data, convertedFileData.fileName);
    } else {
        statusMessage.textContent = 'No converted file available for download.';
    }
});

contrastBtn.addEventListener('click', () => {
    contrastToggle = toggleContrast(contrastToggle);
    localStorage.setItem('contrastToggle', contrastToggle);
});
