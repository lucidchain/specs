document.addEventListener('DOMContentLoaded', function () {
  const logButton = document.querySelector('a[href="javascript:void(0);"]');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
      document.body.setAttribute('data-theme', savedTheme);
  } else {
      const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.body.setAttribute('data-theme', currentTheme);
  }

  if (logButton) {
    logButton.addEventListener('click', function() {
      const currentTheme = document.body.getAttribute('data-theme');
      
      if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
});
