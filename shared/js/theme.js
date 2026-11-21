/* Runtime theme switcher: sets data-theme on <html>. The choice is kept per site in localStorage
   and can be forced with ?theme=terra in the URL. Only colours change. */
(function(){
  var root=document.documentElement, key='theme-'+(root.dataset.site||'site'), themes=['primari','terra','verde','notte'];
  function apply(t){ if(themes.indexOf(t)<0) return; root.dataset.theme=t;
    document.querySelectorAll('[data-set-theme]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.setTheme===t))}); }
  var q=null; try{q=new URLSearchParams(location.search).get('theme')}catch(e){}
  var saved=null; try{saved=localStorage.getItem(key)}catch(e){}
  apply(q||saved||root.dataset.theme);
  document.addEventListener('click',function(e){var b=e.target.closest('[data-set-theme]'); if(!b) return;
    apply(b.dataset.setTheme); try{localStorage.setItem(key,b.dataset.setTheme)}catch(err){} });
  document.addEventListener('DOMContentLoaded',function(){apply(root.dataset.theme)});
})();
