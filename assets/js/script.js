'use strict';

/**
 * دالة مساعدة لربط الأحداث
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * شاشة التحميل (Preloader) مع حماية ضد التجمد
 */
const preloader = document.querySelector("[data-preloader]");

const hidePreloader = function () {
  if (preloader) preloader.classList.add("loaded");
  document.body.classList.add("loaded");
}

window.addEventListener("load", hidePreloader);
// فك شاشة التحميل تلقائياً بعد ثانيتين كحد أقصى لضمان عدم تجمد الصفحة
setTimeout(hidePreloader, 2000);

/**
 * القائمة المتنقلة للجوال (Mobile Navbar)
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);

/**
 * الهيدر وزر الصعود للأعلى
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 100) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);

/**
 * تأثيرات الظهور التدريجي (Scroll Reveal)
 */
const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);
window.addEventListener("load", revealElementOnScroll);

/**
 * دالة تنظيف رقم الجوال السعودي وتحويل الأرقام المشرقية
 */
function cleanSaudiPhone(str) {
  const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let clean = str.replace(/[٠-٩]/g, d => arabicNums.indexOf(d)).replace(/[\s\-\+]/g, '');
  if (clean.startsWith('9665')) clean = '0' + clean.substring(3);
  else if (clean.startsWith('009665')) clean = '0' + clean.substring(5);
  return clean;
}

/**
 * معالجة نموذج طلب التمريض وإرساله إلى الواتساب
 */
const bookingForm = document.getElementById('nursingBookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    let phone = document.getElementById('clientPhone').value.trim();
    const nationality = document.getElementById('nurseNationality').value;
    const service = document.getElementById('serviceType').value;
    const shift = document.getElementById('shiftType').value;
    const city = document.getElementById('clientCity').value.trim();
    const notes = document.getElementById('patientNotes').value.trim();

    phone = cleanSaudiPhone(phone);
    if (!name || !/^05[0-9]{8}$/.test(phone)) {
      alert('الرجاء إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }

    let msg = `*طلب خدمة تمريض منزلي جديدة*\n`;
    msg += `────────────────────\n`;
    msg += `👤 *العميل / المريض:* ${name}\n`;
    msg += `📱 *الجوال:* ${phone}\n`;
    msg += `📍 *المدينة والحي:* ${city}\n`;
    msg += `🌍 *جنسية الممرضة المطلوبة:* ${nationality}\n`;
    msg += `🩺 *نوع الخدمة:* ${service}\n`;
    msg += `⏱️ *نظام وتوقيت العمل:* ${shift}\n`;
    if (notes) {
      msg += `📝 *ملاحظات وتفاصيل الحالة:*\n${notes}\n`;
    }
    msg += `────────────────────\n`;
    msg += `أرجو تأكيد توفر الكادر وإفادتي بالأسعار المتاحة.`;

    const whatsappNumber = "966531566203";
    const targetUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(msg);
    window.open(targetUrl, '_blank');
  });
}