// Import FFmpeg class
import { FFmpeg } from '../media/public/ffmpeg/esm/index.js';
import { toBlobURL } from '../media/public/ffmpeg/util/dist/esm/index.js';

export async function loadFFmpeg(statusElement) {
    const ffmpeg = new FFmpeg();
    
    // Point to the correct location of the assets in /media/public/
    const baseURL = '../media/public/ffmpeg/esm';

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/worker.js`, 'text/javascript'),
    });

    return ffmpeg;
}