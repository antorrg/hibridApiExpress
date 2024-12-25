Para implementar un light/dark mode con Bootstrap, tienes varias opciones. Te mostraré un enfoque simple y efectivo:

1. Estructura básica (React):
```jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [theme, setTheme] = useState('light');

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Efecto para aplicar el tema al cargar y cambiar
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <div className={`app ${theme}-mode`}>
      <button 
        onClick={toggleTheme} 
        className="btn btn-outline-secondary"
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      
      {/* Resto de tu contenido */}
      <div className="container">
        <div className="card">
          <div className="card-body">
            Este es un ejemplo de contenido con tema {theme}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

2. Mejora con persistencia:
```jsx
function App() {
  // Recuperar tema guardado o usar light por defecto
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Resto del código igual...
}
```

3. Opcional - Tema por defecto del sistema:
```jsx
function App() {
  const [theme, setTheme] = useState(() => {
    // Prioridad: localStorage > sistema > light
    return localStorage.getItem('theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // Resto del código igual...
}
```

Puntos clave:
- Usa el atributo `data-bs-theme` de Bootstrap
- Guarda la preferencia en localStorage
- Usa un botón para cambiar
- Respeta (opcionalmente) la preferencia del sistema

Consejos adicionales:
- Puedes personalizar colores en tu CSS
- Añade transiciones suaves
- Considera iconos o toggle switches más elaborados

¿Quieres que profundice en alguno de estos aspectos?

<hr>
sin borde :

className="btn btn-sm btn-secondary rounded-circle position-fixed top-0 end-0 m-3 d-flex justify-content-center align-items-center"
  style={{ width: '40px', height: '40px', border: 'none' }}


<hr>

## con pug:

Sí, puedes hacer que el botón del navbar funcione para alternar entre temas de Bootstrap (como entre "light mode" y "dark mode"). A continuación, te doy una solución que combina cambios en tu código de Pug con un script JavaScript para manejar el cambio de tema dinámicamente.

### Modifica tu Layout de Pug
Agrega un atributo `id` al botón para seleccionarlo fácilmente desde JavaScript:

```pug
button#themeToggleBtn.btn.btn-outline-secondary(
  type="button"
) #{theme === "light" ? '🌙 Dark Mode' : '☀️ Light Mode'}
```

Asegúrate de que el cuerpo tenga una clase por defecto que determine el tema inicial (por ejemplo, `light` o `dark`):

```pug
body(class=theme === "light" ? "light" : "dark")
```

### Agrega el Script para Cambiar el Tema
Incluye un script en el archivo que se ejecutará al cargar la página. Este script se encargará de cambiar el tema al hacer clic en el botón:

```pug
script.
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    // Lee el tema inicial del almacenamiento local o establece un predeterminado
    const storedTheme = localStorage.getItem('theme') || 'light';
    body.className = storedTheme;
    themeToggleBtn.textContent = storedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';

    // Cambia el tema cuando se haga clic en el botón
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.className;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      body.className = newTheme; // Cambia la clase del cuerpo
      themeToggleBtn.textContent = newTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';

      localStorage.setItem('theme', newTheme); // Guarda el tema en el almacenamiento local
    });
  });
```

### Personaliza los Estilos
Configura los estilos de Bootstrap para reflejar el tema seleccionado. Por ejemplo, usa las clases predefinidas de Bootstrap o aplica tus propios estilos CSS:

```css
/* Estilos para temas */
body.light {
  background-color: white;
  color: black;
}

body.dark {
  background-color: #343a40;
  color: white;
}

.navbar.dark {
  background-color: #212529 !important;
}

.navbar.light {
  background-color: #f8f9fa !important;
}
```

### Resultado
Con esto, el botón en el navbar cambiará dinámicamente el tema de tu aplicación entre "light" y "dark". El tema seleccionado también se guardará en el almacenamiento local, lo que permitirá que el usuario conserve su preferencia incluso si recarga la página.