import { FFmpeg } from '../public/ffmpeg/esm/index.js';

export async function loadFFmpeg() {
    const ffmpeg = new FFmpeg({
        log: true,
        corePath: '/convert/media/public/ffmpeg/umd/ffmpeg-core.js' // path to the core script
    });

    await ffmpeg.load();
    console.log('FFmpeg loaded and ready');
    return ffmpeg;
}