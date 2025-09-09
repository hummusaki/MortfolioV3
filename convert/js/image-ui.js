import { convertFile } from './image-convert.js';

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format');


convertBtn.addEventListener('click', async() => {
    const file = fileInput.files[0];  // get selected file
    const outputFormat = fileFormat.value; // get current value
    const inputType = file.type;  // get MIME type of the file
    console.log('Selected file type:', inputType);

    // check if file exists
    if (!file) {
        statusMessage.textContent = 'No file selected.';
        return;
    }

    statusMessage.textContent = 'File selected: ' + file.name + '. Reading file...';
    convertBtn.disabled = true;

    try{
        const fileContent = await readFileAsArrayBuffer(file);
        statusMessage.textContent = 'File read. Converting...';

        // Pass file content to conversion function
        console.log('File output type: ', outputFormat);
        console.log('File read, prepping for conversion');

        const convertedData = await convertFile(fileContent, inputType, outputFormat); // returns the converted data or undefined if error

        if (convertedData) {
            const outputFileName = file.name.split('.').slice(0, -1).join('.') + '.' + outputFormat; // change file extension
            triggerDownload(convertedData, outputFileName);
            statusMessage.textContent = 'Conversion complete.';
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

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

function triggerDownload(data, filename) {
    // wrap data in a Blob and create a download link
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    statusMessage.textContent = 'Download started: ' + filename;
}