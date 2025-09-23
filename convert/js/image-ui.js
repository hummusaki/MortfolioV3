import { convertFile } from './image-convert.js';
import { triggerDownload, toggleContrast } from './utils.js';

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('bownloadBtn');
const contrastBtn = document.getElementById('darkModeBtn');

document.body.classList.add("no-transition");

const getInitialState = () => {
    const savedState = localStorage.getItem('contrastToggle');
    if (savedState == null) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (savedState === 'true') {
        document.body.classList.add("dark-mode");
        return true;
    } else {
        document.body.classList.remove("dark-mode");
        return false;
    }
}

var contrastToggle = getInitialState();

setTimeout(() => {
    document.body.classList.remove("no-transition");
}, 10);

let convertedFileData = null;

// convert button
convertBtn.addEventListener('click', async() => {
    const file = fileInput.files[0];  // get selected file
    const outputFormat = fileFormat.value; // get current value

    // check if file exists
    if (!file) {
        statusMessage.textContent = 'No file selected.';
        return;
    }

    const inputType = file.type;  // get MIME type of the file
    console.log('Selected file type:', inputType);

    downloadBtn.disabled = true; // disable download button until conversion is done
    statusMessage.textContent = 'Reading file...';
    convertBtn.disabled = true; // prevent multiple uploads

    try{
        const fileContent = await readFileAsArrayBuffer(file);
        const convertedData = await convertFile(fileContent, inputType, outputFormat); // returns the converted data or undefined if error

        statusMessage.textContent = 'File read. Converting...';

        // Pass file content to conversion function
        console.log('File output type: ', outputFormat);
        console.log('File read, prepping for conversion');

        if (convertedData) {
            const outputFileName = file.name.split('.').slice(0, -1).join('.') + '.' + outputFormat; // change file extension
            convertedFileData = { data: convertedData, fileName: outputFileName}
            statusMessage.textContent = 'Conversion complete.';
            downloadBtn.disabled = false;
        }

        else {
            statusMessage.textContent = 'Input and output formats are the same. No conversion needed.';
        }

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

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}