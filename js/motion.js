(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('[data-framer-name="Hero"]');
  const shoe = $('.framer-695nz-container');
  const title = $('.framer-f0rlmn');
  const swatches = $$('.framer-yuht6y [data-framer-name="Color Swatch"]');
  const choices = [
    {name:'Beige', figure:'.framer-1cjsvng', tint:'#e5d7c1', title:'#e5d3b5', filter:'none'},
    {name:'Azul', figure:'.framer-ni8e0d', tint:'#ccecff', title:'#a5d6f4', filter:'hue-rotate(155deg) saturate(.6)'},
    {name:'Naranja', figure:'.framer-7tjcp5', tint:'#ffc37a', title:'#ffc175', filter:'saturate(1.6)'}
  ];
  let selected = 0;
  function selectColor(index) {
    selected = (index + choices.length) % choices.length;
    const choice = choices[selected];
    hero.style.setProperty('--stockeo-tint', choice.tint);
    hero.style.setProperty('--stockeo-title', choice.title);
    const pedestal = $('.framer-zwncuu',hero);
    const tones = [['#e6dcc5','#d0c09d','#f3ebd9'],['#c5e6f6','#9dc4df','#e2f3fc'],['#e6c39c','#d19f66','#f7dcbe']][selected];
    if(pedestal)pedestal.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 795"><path fill="'+tones[0]+'" d="M0 54 206 121.5 206 794.5 0 713.5Z"/><path fill="'+tones[1]+'" d="M205 121.5 459 51 457.5 713.5 205 794.5Z"/><path fill="'+tones[2]+'" d="M0 54 235 0 459.5 51 205 121.5Z"/></svg>');
    $$('.framer-p0m89 figure', hero).forEach(figure => {
      const active = figure.matches(choice.figure);
      figure.style.opacity = active ? '1' : '0';
      figure.setAttribute('aria-hidden', String(!active));
    });
    swatches.forEach((swatch, i) => swatch.setAttribute('aria-pressed', String(i === selected)));
    const label = $('.framer-58erhv p', hero);
    if (label) label.textContent = choice.name;
  }
  swatches.forEach((swatch, index) => {
    swatch.setAttribute('role','button');
    swatch.setAttribute('aria-label',`Ver color ${choices[index].name}`);
    swatch.addEventListener('click',() => selectColor(index));
    swatch.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectColor(index); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); selectColor(selected + (e.key === 'ArrowRight' ? 1 : -1)); swatches[selected].focus();
      }
    });
  });
  selectColor(0);
  let pointerX = null;
  shoe.addEventListener('pointerdown', e => { pointerX = e.clientX; });
  shoe.addEventListener('pointerup', e => {
    if (pointerX !== null && Math.abs(e.clientX - pointerX) > 40) selectColor(selected + (e.clientX < pointerX ? 1 : -1));
    pointerX = null;
  });
  shoe.addEventListener('pointercancel', () => { pointerX = null; });
  const answers = [
    'Sí. Consulta nuestras políticas de envío para conocer las paqueterías y confirma el costo y plazo de tu pedido con ventas.',
    'El catálogo muestra precios de mayoreo a partir de 3 piezas. Confirma con ventas las condiciones de cada producto antes de pagar.',
    'Cada producto incluye su precio de mayoreo y precio sugerido de menudeo. Tu ganancia depende del precio de venta y de tus gastos.',
    'Consulta la página de Garantías y confirma con ventas la cobertura correspondiente a tu producto.',
    'Agrega productos al pedido y abre Cotizar. Desde ahí puedes preparar tu solicitud por WhatsApp; ventas confirma disponibilidad y forma de pago.',
    'Contacta a WhatsApp Ventas para consultar el acceso y la disponibilidad de la comunidad de mayoristas.'
  ];
  const rows = $$('.framer-gOi2b');
  rows.forEach((row,index) => {
    $('.framer-k81muf',row)?.remove();
    const text = $('.framer-1ta5z3d',row);
    const answer = document.createElement('div');
    answer.className='stockeo-answer'; answer.id=`faq-answer-${index}`;
    const inner = document.createElement('div'); const p = document.createElement('p');
    p.textContent=answers[index];inner.append(p);answer.append(inner);text.append(answer);
    row.setAttribute('role','button');row.setAttribute('aria-controls',answer.id);
    row.setAttribute('aria-label',$('.framer-1s3nm6c',row).textContent);
    $$('[tabindex]',row).forEach(e=>e.removeAttribute('tabindex'));
    function toggle(){ const open=row.getAttribute('aria-expanded')!=='true';rows.forEach(other=>setOpen(other,other===row&&open)); }
    row.addEventListener('click',toggle);
    row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
  function setOpen(row,open){
    row.setAttribute('aria-expanded',String(open));
    const answer=$('.stockeo-answer',row);answer.setAttribute('aria-hidden',String(!open));
    const img=$('img',row);img.src=`assets/reference/${open?'9shKdUJnYLbJBUHmdJrBFVzkA4s':'D6NkFPuo8d4TEmjIyT3KDPlVDw'}.png`;
    img.alt='';
  }
  rows.forEach((row,index)=>setOpen(row,index===0));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('stockeo-reveal');observer.unobserve(entry.target);}});
  },{threshold:.12});
  $$('main h2,.framer-kweyv2>div,.framer-gOi2b').forEach(e=>observer.observe(e));
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const motionTargets = [
    ['.framer-1cxydv4',40,0,''],
    ['.framer-1805o0f',0,-260,''],
    ['.framer-19bpks7',40,20,'translate(-50%,-50%)',12],
    ['.framer-1ocq9fk',40,20,'translate(-50%,-50%)',-12],
    ['.framer-1e7k166',40,10,'translate(-50%,-50%)',34],
    ['.framer-1ryxzvp',30,30,'translate(-50%,-50%)',-8],
    ['.framer-13fxww1',40,10,'',-8],
    ['.framer-92cbqa',40,10,'',-47],
    ['.framer-1oo7nd9',-20,0,'translate(-50%,-50%)'],
    ['.framer-1u5y6mq',40,0,'',5],
    ['.framer-7zez3v',30,0,'translate(-50%,-50%)',19],
    ['.framer-dm9eio',-30,0,'translate(-50%,-50%)',166]
  ].map(([selector,y,x,base,rotate=0])=>({element:$(selector),y,x,base,rotate})).filter(t=>t.element);
  let pending=false;
  function updateScroll(){
    pending=false;const vh=innerHeight;const progress=clamp(-hero.getBoundingClientRect().top/vh);
    if(!reduced.matches){
      title.style.transform=`translate(-50%,-50%) translateY(${progress*vh*.3}px)`;
      title.style.opacity=String(1-progress);
      for(const target of motionTargets){
        const section=target.element.closest('section,.framer-hyutv2,.framer-1eezr0r-container');
        if(!section)continue;
        const rect=section.getBoundingClientRect();
        if(rect.bottom<0||rect.top>vh)continue;
        const p=clamp((vh-rect.top)/(vh+rect.height));
        const wave=Math.sin(p*Math.PI);
        target.element.style.transform=`${target.base} translate(${target.x*(1-wave)}px,${target.y*(1-2*wave)}px) rotate(${target.rotate*(1-wave*.65)}deg)`;
      }
    }
  }
  function requestScroll(){if(!pending){pending=true;requestAnimationFrame(updateScroll);}}
  addEventListener('scroll',requestScroll,{passive:true});addEventListener('resize',requestScroll,{passive:true});
  let floating=[];
  function startMotion(){
    floating.forEach(a=>a.cancel());floating=[];
    if(reduced.matches){title.style.transform='translate(-50%,-50%)';motionTargets.forEach(t=>t.element.style.transform=t.base||'none');return;}
    floating.push(shoe.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-10px) rotate(-2deg)'},{transform:'translateY(0) rotate(0)'}],{duration:6000,iterations:Infinity,easing:'ease-in-out'}));
    const shadow=$('.framer-qyuvuf');
    floating.push(shadow.animate([{transform:'translateX(-50%) scale(1)',opacity:.8},{transform:'translateX(-50%) scale(.86)',opacity:.6},{transform:'translateX(-50%) scale(1)',opacity:.8}],{duration:6000,iterations:Infinity,easing:'ease-in-out'}));
    title.animate([{opacity:0,translate:`0 ${Math.min(innerHeight,880)}px`},{opacity:1,translate:'0 0'}],{duration:1500,easing:'cubic-bezier(.16,1,.3,1)'});
    ['.framer-hgqndl','.framer-diff9p','.framer-1gfggbi'].forEach((selector,i)=>$(selector)?.animate([{transform:`translateY(-${i===1?880:220}px)`},{transform:'none'}],{duration:1800,easing:'cubic-bezier(.16,1,.3,1)'}));
    requestScroll();
  }
  new IntersectionObserver(([entry])=>floating.forEach(a=>entry.isIntersecting&&!document.hidden?a.play():a.pause()),{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>floating.forEach(a=>document.hidden?a.pause():hero.getBoundingClientRect().bottom>0?a.play():a.pause()));
  reduced.addEventListener('change',startMotion);startMotion();

  const grid = $('#dynamic-wholesale-grid');
  function buildFeatured(){
    const cards=$$('.wholesale-card',grid).slice(0,4);
    if(!cards.length)return false;
    const section=document.createElement('section');section.className='stockeo-featured';section.setAttribute('aria-label','Productos destacados');
    const header=document.createElement('div');header.className='stockeo-featured-header';
    const heading=document.createElement('h2');heading.textContent='Productos destacados';header.append(heading);
    const controls=document.createElement('div');const previous=document.createElement('button');previous.textContent='←';previous.setAttribute('aria-label','Productos anteriores');
    const next=document.createElement('button');next.textContent='→';next.setAttribute('aria-label','Productos siguientes');controls.append(previous,next);header.append(controls);
    const rail=document.createElement('div');rail.className='stockeo-featured-rail';rail.tabIndex=0;rail.setAttribute('role','region');rail.setAttribute('aria-label','Carrusel de productos destacados');
    cards.forEach(card=>rail.append(card.cloneNode(true)));section.append(header,rail);$('.framer-1mt72c6').before(section);
    function move(direction){rail.scrollBy({left:direction*(rail.firstElementChild.getBoundingClientRect().width+16),behavior:reduced.matches?'instant':'smooth'});}
    previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    function update(){previous.disabled=rail.scrollLeft<=2;next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;}
    rail.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(rail);update();
    rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
    return true;
  }
  if(grid&&!buildFeatured()){const catalogObserver=new MutationObserver(()=>{if(buildFeatured())catalogObserver.disconnect();});catalogObserver.observe(grid,{childList:true});}

  const drawer=$('#cart-drawer-overlay');
  drawer?.setAttribute('role','dialog');drawer?.setAttribute('aria-modal','true');
  let previousFocus=null;
  if(drawer)new MutationObserver(()=>{
    const open=drawer.style.display==='flex';
    document.body.style.overflowY=open?'hidden':'';
    if(open){previousFocus=document.activeElement;drawer.querySelector('button')?.focus();}
    else if(previousFocus){previousFocus.focus();previousFocus=null;}
  }).observe(drawer,{attributes:true,attributeFilter:['style']});
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||drawer?.style.display!=='flex')return;
    const controls=[...drawer.querySelectorAll('button,a[href],input')].filter(el=>!el.disabled);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  });drawer?.setAttribute('aria-label','Cotizar pedido de mayoreo');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer?.style.display==='flex'){window.toggleCartModal(false);$('#open-cart-btn')?.focus();}});
})();
