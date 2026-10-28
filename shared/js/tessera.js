// Fills every <canvas data-tessera> with a seeded triangle tessellation (a nod to stepped pyramids and Italian mosaic).
(function(){
  function rnd(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function draw(c){
    var dpr=Math.min(2,window.devicePixelRatio||1),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;
    c.width=w*dpr;c.height=h*dpr;var g=c.getContext('2d');g.scale(dpr,dpr);
    var r=rnd(+c.dataset.seed||3),cols=(c.dataset.colors||'#22264A,#E0A83A,#B8553A,#6F7A3A,#2F7F86,#F7F0E1').split(','),
        s=+c.dataset.size||36,bg=c.dataset.bg||'#F7F0E1',density=+(c.dataset.density||.75);
    g.fillStyle=bg;g.fillRect(0,0,w,h);
    for(var y=0;y<h;y+=s)for(var x=0;x<w;x+=s){
      var flip=((x/s+y/s)|0)%2;
      for(var k=0;k<2;k++){
        if(r()>density)continue;
        g.fillStyle=cols[(r()*cols.length)|0];g.beginPath();
        if(flip){if(k){g.moveTo(x,y);g.lineTo(x+s,y);g.lineTo(x,y+s)}else{g.moveTo(x+s,y);g.lineTo(x+s,y+s);g.lineTo(x,y+s)}}
        else{if(k){g.moveTo(x,y);g.lineTo(x+s,y);g.lineTo(x+s,y+s)}else{g.moveTo(x,y);g.lineTo(x+s,y+s);g.lineTo(x,y+s)}}
        g.closePath();g.fill();
      }
      if(r()<.06){g.fillStyle=bg;g.beginPath();g.arc(x+s/2,y+s/2,s*.22,0,7);g.fill()}
    }
  }
  function all(){document.querySelectorAll('canvas[data-tessera]').forEach(draw)}
  window.addEventListener('resize',function(){clearTimeout(all.t);all.t=setTimeout(all,150)});
  all();
})();
