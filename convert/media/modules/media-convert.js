import { fetchFile } from '../public/ffmpeg/util/dist/esm/index.js';

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

    console.log("break 1")
    // write to virtual fs and update status
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // run ffmpeg
    await ffmpeg.exec(args);
    console.log("break 2")

    // result
    const data = await ffmpeg.readFile(outputName);
    outputElement.src = URL.createObjectURL(new Blob([data.buffer], {type: getMimeType(outputName)}));
}