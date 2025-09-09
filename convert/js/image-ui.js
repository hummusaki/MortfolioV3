const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format').value;

import { convertFile } from './image-convert.js';


fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];  // get selected file
    const inputType = file.type;  // get MIME type of the file
    console.log('Selected file type:', inputType);

    if (!file) {
        statusMessage.textContent = 'No file selected.';
        return;
    }

    statusMessage.textContent = 'File selected: ' + file.name + '. Reading file...';

    const reader = new FileReader();
    reader.onload = (e) => {
        const fileContent = e.target.result;

        // Pass file content to conversion function
        console.log('File read, prepping for conversion');
        convertFile(fileContent, inputType, fileFormat);
    }

    reader.onerror = (e) => {
        statusMessage.textContent = 'Error reading file.';
        console.error('File reading error:', e);
    }

    reader.readAsArrayBuffer(file);  // read file as ArrayBuffer
});