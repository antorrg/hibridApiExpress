export const colorModes = () => {
    const getStoredTheme = () => {
      const theme = localStorage.getItem('theme');
      //console.log('Stored theme:', theme);
      return theme;
    };
  
    const setStoredTheme = (theme) => {
      //console.log('Setting theme in localStorage:', theme);
      localStorage.setItem('theme', theme);
    };
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme) {
        return storedTheme;
      }
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      //console.log('Preferred theme:', preferredTheme);
      return preferredTheme;
    };
  
    const setTheme = (theme) => {
      //console.log('Setting theme:', theme);
      if (theme === 'auto') {
        document.documentElement.setAttribute(
          'data-bs-theme',
          window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        );
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
      }
    };
  
    const updateDropdownIcon = (theme) => {
      const themeToggleBtn = document.getElementById('themeToggleBtn');
      //console.log('Updating dropdown icon for theme:', theme);
      switch (theme) {
        case 'light':
          themeToggleBtn.textContent = '☀️';
          break;
        case 'dark':
          themeToggleBtn.textContent = '🌙';
          break;
        case 'auto':
        default:
          themeToggleBtn.textContent = '☀️/🌙';
          break;
      }
    };
  
    const showActiveTheme = (theme, focus = false) => {
      //console.log('Showing active theme:', theme);
      const themeSwitcher = document.querySelector('#bd-theme');
  
      if (!themeSwitcher) {
        return;
      }
  
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
      if (!btnToActive) return;
  
      document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
        element.classList.remove('active');
        element.setAttribute('aria-pressed', 'false');
      });
  
      btnToActive.classList.add('active');
      btnToActive.setAttribute('aria-pressed', 'true');
  
      if (focus) {
        themeSwitcher.focus();
      }
    };
  
    // Initialize the theme
    const initializeTheme = () => {
      const preferredTheme = getPreferredTheme();
      setTheme(preferredTheme);
      updateDropdownIcon(preferredTheme);
      showActiveTheme(preferredTheme);
    };
  
    // Add event listeners
    const setupEventListeners = () => {
      const themeOptions = document.querySelectorAll('[data-bs-theme-value]');
      themeOptions.forEach((option) => {
        option.addEventListener('click', () => {
          const theme = option.getAttribute('data-bs-theme-value');
          setStoredTheme(theme);
          setTheme(theme);
          updateDropdownIcon(theme);
          showActiveTheme(theme, true);
        });
      });
  
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
          const newTheme = getPreferredTheme();
          setTheme(newTheme);
          updateDropdownIcon(newTheme);
        }
      });
    };
  
    // Initialize on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
      //console.log('DOMContentLoaded event fired');
      initializeTheme();
      setupEventListeners();
    });
  };
  