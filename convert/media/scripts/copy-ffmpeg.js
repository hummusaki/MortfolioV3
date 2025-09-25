// copy runtimes from node_modules to public folder
// so client can use and run ffmpeg.wasm
// (browser can't access node_modules directly)

const fs = require('fs'); // filesystem
const path = require('path'); // path module

const srcDistDir = path.join(__dirname, '..', 'node_modules', '@ffmpeg', 'core', 'dist'); // source directory
const outRootDir = path.join(__dirname, '..', 'public', 'ffmpeg'); // output directory

// creates output directory and copies files and subdirs recursively
function copyDirRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true }); // check that directory exists

    const entries = fs.readdirSync(src, { withFileTypes: true }); // read directory entries

    for (const ent of entries) {
        const srcPath = path.join(src, ent.name); // source path for entry
        const destPath = path.join(dest, ent.name); // destination path for entry
        if (ent.isDirectory()) {
            copyDirRecursive(srcPath, destPath); // reuse and copy its contents
        } else if (ent.isFile()) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`); // log it
        }
    }
}

//make sure the root dir exists
fs.mkdirSync(outRootDir, { recursive: true });

// start copying over esm and umd subdirs
const subdirsToCopy = ['esm', 'umd'];

for (const subdir of subdirsToCopy) {
    const srcSub = path.join(srcDistDir, subdir); // source subdirectory
    const outSub = path.join(outRootDir, subdir); // output subdirectory
    if (fs.existsSync(srcSub) && fs.statSync(srcSub).isDirectory()) {
        copyDirRecursive(srcSub, outSub);
    } else {
        console.log('skip: ${srcSub} does not exist or is not a directory');
    }
}

console.log('ffmpeg core copy complete, check for esm and/or umd folders');