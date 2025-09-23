export function triggerDownload(data, filename) {
    // wrap data in a Blob and create a download link
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function toggleContrast(contrastToggle) {
    contrastToggle = !contrastToggle;
    if (contrastToggle) {
        document.body.classList += "dark-mode";
        favicon.setAttribute("href", "../../assets/m.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m2.png');
    } else {
        document.body.classList.remove("dark-mode");
        favicon.setAttribute("href", "../../assets/m2.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m.png');
    }
    return contrastToggle;
}