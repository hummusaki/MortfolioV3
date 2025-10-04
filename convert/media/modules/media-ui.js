import { transcode } from './media-convert.js';
import { triggerDownload, toggleContrast, setInitialContrast } from '../../modules/utils.js';
import { loadFFmpeg } from './client.js';

// elements

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('bownloadBtn');
const contrastBtn = document.getElementById('darkModeBtn');

// dark mode setup

document.body.classList.add("no-transition");

var contrastToggle = setInitialContrast();

setTimeout(() => {
    document.body.classList.remove("no-transition");
}, 10);

// state variables

let convertedFileData = null;
let ffmpeg = null;

// ffmpeg instance + logging

if(!ffmpeg) {
    ffmpeg = await loadFFmpeg(statusMessage);
    ffmpeg.on('progress', ({ progress }) => {
        console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
    });
}

// convert button

convertBtn.addEventListener('click', async() => {
    const file = fileInput.files[0];  // get selected file

    // check if file exists
    if (!file) {
        statusMessage.textContent = 'No media selected.';
        return;
    }

    downloadBtn.disabled = true; // disable download button until conversion is done
    statusMessage.textContent = 'Reading media...';
    convertBtn.disabled = true; // prevent multiple uploads

    
    try{
        transcode(ffmpeg, file, ['-i', file.name, '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', '-b:a', '192k', '-movflags', 'faststart', `output.${fileFormat.value}`], `output.${fileFormat.value}`, document.getElementById('outputVideo'))
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
