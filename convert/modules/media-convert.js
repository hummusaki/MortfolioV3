// Updated path to point to the media folder for assets
import { fetchFile } from '../media/public/ffmpeg/util/dist/esm/index.js';

function getMimeType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const map = {
        mp4: 'video/mp4',
        mp3: 'audio/mp3',
        mov: 'video/mov',
        webm: 'video/webm'
    };
    return map[extension] || 'application/octet-stream';
}

export async function transcode( ffmpeg, file, args, outputName, outputElement ) {
    const { name: inputName } = file;

    // write to virtual fs
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // run ffmpeg
    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
}