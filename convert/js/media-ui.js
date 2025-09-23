// import { convertFile } from "../js/media-convert.js";
import { triggerDownload, toggleContrast } from '../js/utils.js';

const fileInput = document.getElementById('fileInput');
const statusMessage = document.getElementById('status');
const fileFormat = document.getElementById('format');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const contrastBtn = document.getElementById('darkModeBtn');

var contrastToggle = false;




contrastBtn.addEventListener('click', () => {
    contrastToggle = toggleContrast(contrastToggle);
});