(function(){
    try{
        var saved = localStorage.getItem('contrastToggle');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // ensure classes are applied to <html> before paint
        document.documentElement.classList.add('no-transition');
        if (saved === 'true' || (saved === null && prefersDark)) {
            document.documentElement.classList.add('dark-mode');
        }
        // remove the no-transition after load to re-enable animations
        if (document.readyState === 'complete') {
            setTimeout(function(){ document.documentElement.classList.remove('no-transition'); }, 50);
        } else {
            window.addEventListener('load', function(){ setTimeout(function(){ document.documentElement.classList.remove('no-transition'); }, 50); });
        }
    }catch(e){ /* ignore */ }
})();
