import { FFmpeg } from '../public/ffmpeg/esm/index.js';

// creates and loads an ffmpeg instance
export async function loadFFmpeg(statusMessage) {
    const ffmpeg = new FFmpeg({
        log: true,
        corePath: '/convert/media/public/ffmpeg/esm/ffmpeg-core.js'
    });
    await ffmpeg.load();
    console.log('FFmpeg loaded and ready');
    return ffmpeg;
}