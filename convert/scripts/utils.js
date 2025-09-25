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


// dark mode functions
export function toggleContrast(contrastToggle) {
    const favicon = document.getElementById('favicon');
    contrastToggle = !contrastToggle;
    if (contrastToggle) {
        document.body.classList.add("dark-mode");
        if (favicon) favicon.setAttribute("href", "../../assets/m.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m2.png');
    } else {
        document.body.classList.remove("dark-mode");
        if (favicon) favicon.setAttribute("href", "../../assets/m2.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m.png');
    }
    return contrastToggle;
}

export function setInitialContrast() {
    const favicon = document.getElementById('favicon');
    const savedState = localStorage.getItem('contrastToggle');
    let contrastToggle;
    if (savedState == null) {
        contrastToggle = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
        contrastToggle = savedState === 'true';
    }
    if (contrastToggle) {
        document.body.classList.add("dark-mode");
        if (favicon) favicon.setAttribute("href", "../../assets/m.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m2.png');
    } else {
        document.body.classList.remove("dark-mode");
        if (favicon) favicon.setAttribute("href", "../../assets/m2.png");
        const logo = document.querySelector('.ribbon-logo');
        if (logo) logo.setAttribute('src', '/assets/m.png');
    }
    return contrastToggle;
}