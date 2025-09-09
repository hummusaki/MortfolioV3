import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.esm.js';
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.mjs';

const statusMessage = document.getElementById('status');

export function convertFile(fileContent, inputMimeType, outputFormat) // MIME Type is the input format, a media type string like application/pdf
{

    // is the input an image?
    if (inputMimeType.startsWith('image/')) {
        // what should the output format be?
        if (outputFormat === 'pdf') {
            return imageToPdf(fileContent, inputMimeType);
        } 
        // check for duplicate formats
        else if (outputFormat == inputMimeType.endsWith(outputFormat)){ 
            statusMessage.textContent = 'Input and output formats are the same.';
            return;
        }
        else {
            const mimeType = `image/${outputFormat}`;
            return imageToImage(fileContent, mimeType);
        }
    }

    // is the input a PDF?
    else if (inputMimeType === 'application/pdf') {
        //what should the output format be?

        // check for duplicate formats
        if (outputFormat === 'pdf') {
            statusMessage.textContent = 'Input and output formats are the same.';
            return;
        }
        else {
            return pdfToImage(fileContent, outputFormat);
        }
    }

    else {
        statusMessage.textContent = 'Unsupported input format: ' + inputMimeType;
        return;
    }
}

