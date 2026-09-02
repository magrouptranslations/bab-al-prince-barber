(() => {
  const data = BAP.getData();
  const currency = data.settings.currency || 'ر.س';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const escapeHtml = str => String(str ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = s => s.priceMin === s.priceMax ? `${s.priceMin} ${currency}` : `${s.priceMin}–${s.priceMax} ${currency}`;
  const setText = (selector, value) => $$(selector).forEach(el => el.textContent = value ?? '');

  setText('[data-brand-name]', data.brand.name);
  setText('[data-brand-tagline]', data.brand.tagline);
  setText('[data-city]', data.brand.city);
  setText('[data-district]', data.brand.district);
  setText('[data-home-district]', data.settings.homeServiceDistrict || data.brand.district);
  setText('[data-hours]', data.brand.hours);
  setText('[data-address]', data.brand.address || `${data.brand.district}، ${data.brand.city}`);
  if($('#heroTitle')) $('#heroTitle').textContent = data.brand.heroTitle;
  if($('#heroText')) $('#heroText').textContent = data.brand.heroText;

  $$('[data-phone-text]').forEach(el => el.textContent = data.brand.phone || 'يُضاف من لوحة التحكم');
  $$('[data-whatsapp-text]').forEach(el => el.textContent = data.brand.whatsapp || 'يُضاف من لوحة التحكم');
  $$('[data-phone-link]').forEach(el => {
    if(data.brand.phone){ el.href = `tel:${data.brand.phone.replace(/\s+/g,'')}`; }
    else { el.setAttribute('aria-disabled','true'); el.addEventListener('click', e=>e.preventDefault()); }
  });
  $$('[data-whatsapp-link]').forEach(el => {
    if(data.brand.whatsapp){ const n=data.brand.whatsapp.replace(/\D/g,''); el.href=`https://wa.me/${n}`; el.target='_blank'; }
    else { el.setAttribute('aria-disabled','true'); el.addEventListener('click', e=>e.preventDefault()); }
  });

  const serviceCard = s => `
    <article class="card service-card ${s.featured?'featured':''}">
      <div class="service-top"><div class="icon-box">${s.category==='massage'?'◌':s.category==='home'?'⌂':'✂'}</div>${s.featured?'<span class="mini-badge">مقترحة</span>':''}</div>
      <h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.description)}</p>
      <div class="service-tags"><span>${escapeHtml(s.duration)}</span><span>${s.category==='barber'?'داخل المحل':'خدمة منزلية'}</span></div>
      <div class="meta"><div><div class="price">${money(s)}</div><div class="duration">السعر قبل أي إضافات اختيارية</div></div><button class="link-btn" data-service="${s.id}">احجز ←</button></div>
    </article>`;

  const barber = data.services.filter(x => x.active && x.category === 'barber');
  const home = data.services.filter(x => x.active && ['home','massage'].includes(x.category));
  if($('#servicesGrid')) $('#servicesGrid').innerHTML = barber.map(serviceCard).join('');
  if($('#allServicesGrid')) $('#allServicesGrid').innerHTML = barber.map(serviceCard).join('');
  if($('#featuredServicesGrid')) $('#featuredServicesGrid').innerHTML = barber.filter(s=>s.featured).slice(0,3).map(serviceCard).join('');
  if($('#homeGrid')) $('#homeGrid').innerHTML = home.map(serviceCard).join('');
  if($('#homeServicesGrid')) $('#homeServicesGrid').innerHTML = home.map(serviceCard).join('');

  if($('#pricingBody')){
    $('#pricingBody').innerHTML = barber.map(s=>`<tr><td><b>${escapeHtml(s.name)}</b></td><td>${escapeHtml(s.duration)}</td><td>${money(s)}</td><td><button class="table-book" data-service="${s.id}">احجز</button></td></tr>`).join('');
  }
  if($('#homePricingBody')){
    $('#homePricingBody').innerHTML = home.map(s=>`<tr><td><b>${escapeHtml(s.name)}</b></td><td>${escapeHtml(s.duration)}</td><td>${money(s)}</td><td><button class="table-book" data-service="${s.id}">احجز</button></td></tr>`).join('');
  }

  const activeProducts = (data.products||[]).filter(p=>p.active !== false);
  if($('#productsSection')) $('#productsSection').hidden = !activeProducts.length;
  if($('#productsGrid')){
    $('#productsGrid').innerHTML = activeProducts.length ? activeProducts.map(p=>`<article class="card product-card"><div class="product-visual">منتج عناية</div><div class="mini-badge">متوفر</div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'منتج عناية يضاف من لوحة التحكم.')}</p><div class="meta"><div class="price">${escapeHtml(p.price)} ${currency}</div><span class="muted">اسأل عن التوفر</span></div></article>`).join('') : '<div class="empty wide">المتجر جاهز. أضف المنتجات الفعلية من لوحة التحكم لتظهر هنا تلقائيًا.</div>';
  }
  if($('#shopEmpty')) $('#shopEmpty').hidden = !!activeProducts.length;
  if($('#shopProductsWrap')) $('#shopProductsWrap').hidden = !activeProducts.length;

  if(data.settings.schoolTransportEnabled && $('#schoolSection')) $('#schoolSection').hidden = false;

  const faqMarkup = data.faqs.map(f=>`<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`).join('');
  if($('#faqList')) $('#faqList').innerHTML = faqMarkup;
  if($('#faqListCompact')) $('#faqListCompact').innerHTML = faqMarkup.slice ? data.faqs.slice(0,5).map(f=>`<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`).join('') : faqMarkup;

  const pkg = (data.packages||[]).find(p=>p.active) || null;
  if(pkg){
    setText('[data-package-name]', pkg.name);
    setText('[data-package-price]', `${pkg.price} ${currency}`);
    setText('[data-package-period]', pkg.period);
    setText('[data-package-visits]', pkg.visits);
    setText('[data-package-includes]', pkg.includes);
  }

  // Booking modal shared by all public pages.
  const modal = $('#bookingModal');
  const form = $('#bookingForm');
  const serviceSelect = $('#serviceSelect');
  const locationField = $('#locationField');
  if(modal && form && serviceSelect){
    const bookable = data.services.filter(s=>s.active);
    function options(){
      serviceSelect.innerHTML = bookable.map(s=>`<option value="${s.id}">${escapeHtml(s.name)} — ${money(s)}</option>`).join('') +
      (data.packages||[]).filter(p=>p.active).map(p=>`<option value="pkg:${p.id}">${escapeHtml(p.name)} — ${p.price} ${currency}</option>`).join('');
    }
    options();
    function isHomeValue(v){ const s=data.services.find(x=>x.id===v); return s && ['home','massage'].includes(s.category); }
    function updateLocation(){
      if(!locationField) return;
      const homeValue=isHomeValue(serviceSelect.value);
      locationField.hidden = !homeValue;
      const inp=$('#customerLocation'); if(inp) inp.required=homeValue;
    }
    serviceSelect.addEventListener('change',updateLocation);
    function openBooking(value){
      const wrap=$('#bookingFormWrap'), success=$('#successBox');
      if(wrap) wrap.style.display='block'; if(success) success.classList.remove('show');
      if(value && [...serviceSelect.options].some(o=>o.value===value)) serviceSelect.value=value;
      updateLocation(); modal.classList.add('show'); document.body.style.overflow='hidden';
    }
    function closeBooking(){ modal.classList.remove('show'); document.body.style.overflow=''; }
    document.addEventListener('click',e=>{
      const svc=e.target.closest('[data-service]'); const book=e.target.closest('[data-book]'); const pkgBtn=e.target.closest('[data-package]'); const school=e.target.closest('[data-school]');
      if(svc) openBooking(svc.dataset.service); if(book) openBooking(); if(pkgBtn) openBooking('pkg:'+pkgBtn.dataset.package);
      if(e.target.closest('[data-close]')) closeBooking();
      if(school) alert('هذه الخدمة تحتاج نموذج اشتراك وتسعير حسب المسار، وتظل مخفية افتراضيًا حتى تفعيلها من لوحة التحكم.');
    });
    modal.addEventListener('click',e=>{ if(e.target===modal) closeBooking(); });
    const today=new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
    if($('#bookingDate')) $('#bookingDate').min=today.toISOString().slice(0,10);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const selected=serviceSelect.options[serviceSelect.selectedIndex];
      const booking={id:'BAP-'+Date.now().toString().slice(-8),serviceId:serviceSelect.value,serviceName:selected.textContent.split(' — ')[0],name:$('#customerName').value.trim(),phone:$('#customerPhone').value.trim(),date:$('#bookingDate').value,time:$('#bookingTime').value,location:$('#customerLocation').value.trim(),notes:$('#bookingNotes').value.trim(),status:'جديد',createdAt:new Date().toISOString()};
      BAP.addBooking(booking); form.reset(); options(); updateLocation();
      $('#bookingFormWrap').style.display='none'; $('#successBox').classList.add('show');
      $('#successText').textContent=`رقم الطلب ${booking.id}. يمكنك متابعة الطلب من خلال فريق باب البرنس.`;
    });
  }

  // Active navigation state.
  const page = document.body.dataset.page;
  if(page) $$(`[data-nav="${page}"]`).forEach(a=>a.classList.add('active'));
})();
