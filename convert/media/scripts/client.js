import { FFmpeg } from '../public/ffmpeg/esm/index.js';

// creates and loads an ffmpeg instance
export async function loadFFmpeg() {
    const ffmpeg = new FFmpeg({
        log: true,
        corePath: '/convert/media/public/ffmpeg/umd/ffmpeg-core.js' // path to the core script
    });

    // start logging
    ffmpeg.on('log', ({ message }) => { console.log(message); });

    await ffmpeg.load();
    console.log('FFmpeg loaded and ready');
    return ffmpeg;
}

export async function encode(ffmpeg) {
    await ffmpeg.writeFile('input.webm', await fetchFile('/convert/media/public/sample.webm'));
    
}