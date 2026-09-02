(function () {
  const defaults = {
    brand: {
      name: 'باب البرنس',
      tagline: 'خدمتك مرتبة على وقتك',
      city: 'الرياض',
      district: 'حي الملز',
      phone: '',
      whatsapp: '',
      address: 'حي الملز، الرياض',
      hours: 'يوميًا — تُحدَّد ساعات العمل من لوحة التحكم',
      heroTitle: 'عناية رجالية مرتبة، بسعر واضح وحجز أسهل',
      heroText: 'اختر خدمتك، حدّد موعدك، وأكمل الحجز في دقائق. حلاقة رجالية، خدمات منزلية وعضوية شهرية مصممة للعميل الذي يقدّر وقته.'
    },
    settings: {
      schoolTransportEnabled: false,
      onlinePaymentEnabled: true,
      homeServiceDistrict: 'حي الملز',
      currency: 'ر.س'
    },
    services: [
      {id:'haircut', category:'barber', name:'قص شعر', priceMin:15, priceMax:20, duration:'25–35 دقيقة', description:'قص مرتب حسب الشكل المطلوب مع إنهاء نظيف ومناسب للإطلالة اليومية.', active:true, featured:true},
      {id:'beard', category:'barber', name:'تهذيب / حلاقة ذقن', priceMin:15, priceMax:15, duration:'15–20 دقيقة', description:'تهذيب أو حلاقة الذقن مع ضبط الحواف للحصول على مظهر أنيق ومتوازن.', active:true, featured:true},
      {id:'hair-beard', category:'barber', name:'شعر + ذقن', priceMin:35, priceMax:35, duration:'40–50 دقيقة', description:'جلسة متكاملة للشعر والذقن في موعد واحد وبسعر واضح.', active:true, featured:true},
      {id:'kids', category:'barber', name:'حلاقة أطفال', priceMin:15, priceMax:20, duration:'25–30 دقيقة', description:'حلاقة أطفال بطريقة مرتبة وسريعة ضمن موعد محدد.', active:true, featured:false},
      {id:'face-clean', category:'barber', name:'تنظيف وجه سريع', priceMin:10, priceMax:10, duration:'15 دقيقة', description:'تنظيف سريع يكمّل جلسة العناية ويمنح الوجه مظهرًا أكثر انتعاشًا.', active:true, featured:false},
      {id:'complete-care', category:'barber', name:'شعر + ذقن + تنظيف سريع', priceMin:60, priceMax:60, duration:'55–65 دقيقة', description:'العناية الأساسية كاملة في جلسة واحدة: شعر، ذقن وتنظيف سريع للوجه.', active:true, featured:true},
      {id:'home-barber', category:'home', name:'حلاقة منزلية — شعر + ذقن + تنظيف البشرة', priceMin:130, priceMax:130, duration:'30–60 دقيقة', description:'خدمة حلاقة منزلية داخل نطاق الخدمة. يلزم حجز مسبق وتأكيد الموقع.', active:true, featured:true},
      {id:'massage-60', category:'massage', name:'جلسة استرخاء منزلية', priceMin:200, priceMax:200, duration:'60 دقيقة', description:'جلسة استرخاء منزلية تصل إلى موقعك داخل نطاق الخدمة بعد التحقق من التوفر.', active:true, featured:true},
      {id:'massage-120', category:'massage', name:'جلسة استرخاء ممتدة', priceMin:350, priceMax:350, duration:'120 دقيقة', description:'جلسة ممتدة لمن يفضّل وقتًا أطول للاسترخاء في المنزل.', active:true, featured:false}
    ],
    packages: [
      {id:'prince-basic', type:'membership', name:'باقة البرنس الأساسية', price:75, period:'30 يوم', visits:'زيارتان + زيارة مجانية', includes:'قص شعر + ذقن + تنظيف بشرة', note:'حجز مسبق', active:true, featured:true}
    ],
    products: [],
    faqs: [
      {q:'هل أحتاج إلى الحجز مسبقًا؟', a:'نعم. الحجز المسبق يساعد على تثبيت وقت الزيارة وتقليل الانتظار، وهو إلزامي للخدمات المنزلية.'},
      {q:'هل الأسعار المعروضة واضحة قبل الحجز؟', a:'نعم. يظهر سعر الخدمة الأساسية قبل تسجيل الطلب، وأي إضافة اختيارية يجب توضيحها قبل التأكيد.'},
      {q:'ما نطاق الخدمات المنزلية؟', a:'النطاق الحالي المستهدف هو حي الملز في الرياض، ويمكن تعديل نطاق التغطية لاحقًا من لوحة التحكم.'},
      {q:'كيف تعمل باقة البرنس الأساسية؟', a:'الباقة صالحة لمدة 30 يومًا وتتضمن زيارتين للخدمات المحددة بالإضافة إلى زيارة مجانية، مع الحجز المسبق لكل زيارة.'},
      {q:'هل الحلاقة المنزلية لها سعر مختلف؟', a:'نعم، لأنها تتضمن انتقال مقدم الخدمة إلى موقع العميل وتحتاج إلى تأكيد الموقع ونطاق التغطية قبل تثبيت الموعد.'},
      {q:'كيف يتم حجز المساج المنزلي؟', a:'اختر مدة الجلسة، ثم التاريخ والوقت، وأدخل موقعك. يُراجع الطلب للتأكد من توفر المختص ونطاق الخدمة.'},
      {q:'هل يمكن تغيير الموعد بعد الحجز؟', a:'يمكن طلب تغيير الموعد وفق سياسة المواعيد والإلغاء المعتمدة، ويفضل إرسال الطلب مبكرًا لإتاحة وقت بديل.'},
      {q:'هل توجد منتجات عناية في المتجر؟', a:'قسم المتجر جاهز فنيًا، وتظهر المنتجات فور إضافتها من لوحة التحكم بأسمائها وأسعارها الحقيقية.'}
    ]
  };

  const clone = obj => JSON.parse(JSON.stringify(obj));
  function getData(){
    try {
      const stored = localStorage.getItem('babAlPrinceData');
      if(!stored) return clone(defaults);
      const parsed = JSON.parse(stored) || {};
      const base = clone(defaults);
      return {
        ...base,
        ...parsed,
        brand: {...base.brand, ...(parsed.brand||{})},
        settings: {...base.settings, ...(parsed.settings||{})},
        services: Array.isArray(parsed.services) ? parsed.services : base.services,
        packages: Array.isArray(parsed.packages) ? parsed.packages : base.packages,
        products: Array.isArray(parsed.products) ? parsed.products : base.products,
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : base.faqs
      };
    } catch(e){ return clone(defaults); }
  }
  function setData(data){ localStorage.setItem('babAlPrinceData', JSON.stringify(data)); }
  function resetData(){ setData(clone(defaults)); return getData(); }
  function getBookings(){
    try { return JSON.parse(localStorage.getItem('babAlPrinceBookings') || '[]'); }
    catch(e){ return []; }
  }
  function setBookings(items){ localStorage.setItem('babAlPrinceBookings', JSON.stringify(items)); }
  function addBooking(item){
    const items = getBookings();
    items.unshift(item);
    setBookings(items);
    return item;
  }
  window.BAP = { defaults, getData, setData, resetData, getBookings, setBookings, addBooking };
})();
