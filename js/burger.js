const menuBtn = document.querySelector('[data-js-header-burger-button]');
const menu = document.querySelector('[data-js-header-menu]');
const links = document.querySelectorAll('.header__nav-link')

if (menuBtn && menu) {
   menuBtn.addEventListener('click', () => {
      document.body.classList.toggle('is-lock');
      menu.classList.toggle('active');
      menuBtn.classList.toggle('active');
   })

   links.forEach(link => {
      link.addEventListener('click', () => {
         document.body.classList.remove('is-lock');
         menu.classList.remove('active');
         menuBtn.classList.remove('active');
      })
   })
}


