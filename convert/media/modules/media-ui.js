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
setTimeout(() => document.body.classList.remove("no-transition"), 10);

// state variables
let convertedFileData = null;
let ffmpeg = null;
let isConverting = false;

//funcs

// helper, retain base file name and replace extension
function withExtension(fileName, newExt) {
    newExt = newExt.replace(/^\./, ''); // remove dot
    const base = fileName.replace(/\.[^/.]+$/, '');
    return `${base}.${newExt}`;
}

// smart(ish) default based on file MIME type
function defaultFormat(file) {
    if(!file) return 'mp4'; //default
    if(file.type.startsWith('audio/')) return 'mp3';
    if(file.type.startsWith('video/')) return 'mp4';
    return 'mp4'; //default
}

// ffmpeg instance + logging
if(!ffmpeg) {
    ffmpeg = await loadFFmpeg(statusMessage);
    ffmpeg.on('progress', ({ progress }) => {
        console.log(`Progress: ${(progress * 100).toFixed(1)}%`);
    });
    ffmpeg.on('log', ({ message }) => {
        console.log(`ffmpeg: ${message}`);
    });
}


// convert button

convertBtn.addEventListener('click', async() => {
    // checks
    if (isConverting) return;
    const file = fileInput.files?.[0];
    if (!file) {
        statusMessage.textContent = 'No file selected.';
        return;
    }
    downloadBtn.disabled = true; // disable download button until conversion is done

    // avoid memory leaks
    if (convertedFileData?.url) {
        URL.revokeObjectURL(convertedFileData.url);
    }
    
    try{
        const selectedFormat = fileFormat.value; // default to mp4 
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
