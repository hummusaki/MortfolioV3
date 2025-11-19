// IMPORTS - All from one folder now
import { triggerDownload, toggleContrast, setInitialContrast } from './modules/utils.js';
import { convertFile as convertImageFile } from './modules/image-convert.js';
import { transcode } from './modules/media-convert.js'; 
import { loadFFmpeg } from './modules/client.js'; 

// CONFIG
const SUPPORTED_FORMATS = {
    // Images
    'image/png': ['JPG', 'WEBP', 'PDF'],
    'image/jpeg': ['PNG', 'WEBP', 'PDF'],
    'image/webp': ['PNG', 'JPG', 'PDF'],
    'application/pdf': ['PNG', 'JPG', 'WEBP'],
    
    // Audio
    'audio/mpeg': ['WAV', 'OGG', 'AAC'], // MP3
    'audio/wav': ['MP3', 'OGG', 'AAC'],
    'audio/x-m4a': ['MP3', 'WAV'],
    
    // Video
    'video/mp4': ['MP3', 'GIF', 'AVI', 'MOV'],
    'video/quicktime': ['MP4', 'MP3', 'GIF'], // MOV
    'video/webm': ['MP4', 'MP3', 'GIF'],
    
    'default': [] 
};

// STATE
let currentFile = null;
let convertedResult = null; 
let ffmpegInstance = null;

// DOM ELEMENTS
const fileInput = document.getElementById('file-input');
const formatSelect = document.getElementById('format-select');
const sidebar = document.getElementById('options-sidebar');
const fileInfoText = document.getElementById('file-info-text');
const statusText = document.getElementById('status-text');
const convertBtn = document.getElementById('run-convert-btn');
const downloadBtn = document.getElementById('download-btn');

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    setInitialContrast();
    document.getElementById('theme-toggle').addEventListener('click', toggleContrast);
    
    fileInput.addEventListener('change', handleFileSelect);
    formatSelect.addEventListener('change', () => convertBtn.disabled = false);
    convertBtn.addEventListener('click', handleConvertClick);
    downloadBtn.addEventListener('click', handleDownloadClick);
});

// CORE FUNCTIONS

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFile = file;
    convertedResult = null;
    downloadBtn.classList.add('disabled');
    statusText.textContent = '';

    // UI Text
    fileInfoText.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

    // Determine Formats
    const typeKey = SUPPORTED_FORMATS[file.type] ? file.type : 'default';
    let options = SUPPORTED_FORMATS[typeKey];
    
    // Fallback
    if (options.length === 0) {
        if (file.type.startsWith('image/')) options = ['PNG', 'JPG', 'PDF'];
        else if (file.type.startsWith('video/')) options = ['MP4', 'MP3'];
        else if (file.type.startsWith('audio/')) options = ['MP3', 'WAV'];
    }

    // Populate Dropdown
    formatSelect.innerHTML = '<option value="" disabled selected>Select format</option>';
    options.forEach(fmt => {
        const opt = document.createElement('option');
        opt.value = fmt.toLowerCase();
        opt.textContent = fmt;
        formatSelect.appendChild(opt);
    });

    // Open Sidebar
    sidebar.classList.add('active');
    convertBtn.disabled = true; 

    // Load FFmpeg for media
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        if (!ffmpegInstance) {
            statusText.textContent = "Initializing engine...";
            try {
                ffmpegInstance = await loadFFmpeg({ textContent: '' }); 
                statusText.textContent = "Engine ready.";
                
                ffmpegInstance.on('progress', ({ progress }) => {
                    statusText.textContent = `Converting: ${(progress * 100).toFixed(0)}%`;
                });
            } catch (e) {
                console.error(e);
                statusText.textContent = "Engine failed to load.";
            }
        }
    }
}

async function handleConvertClick() {
    if (!currentFile) return;

    const inputType = currentFile.type;
    const outputFormat = formatSelect.value;
    
    convertBtn.disabled = true;
    statusText.textContent = "Processing...";

    try {
        // === IMAGE / PDF ===
        if (inputType.startsWith('image/') || inputType === 'application/pdf') {
            const fileBuffer = await currentFile.arrayBuffer();
            const resultData = await convertImageFile(fileBuffer, inputType, outputFormat);

            if (resultData) {
                const newName = replaceExtension(currentFile.name, outputFormat);
                convertedResult = { data: resultData, fileName: newName };
                finishConversion();
            } else {
                throw new Error("Conversion returned no data");
            }
        } 
        // === AUDIO / VIDEO ===
        else if (inputType.startsWith('video/') || inputType.startsWith('audio/')) {
            if (!ffmpegInstance) throw new Error("FFmpeg engine not loaded");

            const outputName = `output.${outputFormat}`;
            const args = ['-i', currentFile.name, outputName];

            await transcode(ffmpegInstance, currentFile, args, outputName, {});

            const data = await ffmpegInstance.readFile(outputName);
            const newName = replaceExtension(currentFile.name, outputFormat);
            convertedResult = { data: data, fileName: newName };
            finishConversion();
        } else {
            statusText.textContent = "File type not supported.";
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = "Error: " + error.message;
        convertBtn.disabled = false;
    }
}

function finishConversion() {
    statusText.textContent = "Done!";
    downloadBtn.classList.remove('disabled');
    convertBtn.disabled = false;
}

function handleDownloadClick() {
    if (convertedResult) {
        triggerDownload(convertedResult.data, convertedResult.fileName);
    }
}

function replaceExtension(filename, newExt) {
    return filename.substring(0, filename.lastIndexOf('.')) + '.' + newExt;
}