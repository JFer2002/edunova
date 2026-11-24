'use strict';

/* ==========================================================================
   EduNova — Lógica de interfaz (JavaScript Vanilla)
   Archivo: app.js (raíz del proyecto)
   Módulos: tema, validación, catálogo, ficha de curso y simulaciones.
   ========================================================================== */

(function () {
  const CLAVE_TEMA = 'edunova-tema';
  const CLAVE_CORREO = 'edunova-correo-recordado';
  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const CUENTAS_DEMO = [
    { correo: 'estudiante@edunova.edu', contrasena: 'Estudiante2026', rol: 'estudiante', etiqueta: 'Estudiante' },
    { correo: 'instructor@edunova.edu', contrasena: 'Instructor2026', rol: 'instructor', etiqueta: 'Instructor' },
    { correo: 'admin@edunova.edu', contrasena: 'Admin2026', rol: 'administrador', etiqueta: 'Administrador' }
  ];

  const qs = function (selector, contexto) {
    return (contexto || document).querySelector(selector);
  };

  const qsa = function (selector, contexto) {
    return Array.from((contexto || document).querySelectorAll(selector));
  };

  const normalizar = function (texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  };

  const leerAlmacen = function (clave) {
    try {
      return window.localStorage.getItem(clave);
    } catch (error) {
      return null;
    }
  };

  const guardarAlmacen = function (clave, valor) {
    try {
      if (valor === null) {
        window.localStorage.removeItem(clave);
      } else {
        window.localStorage.setItem(clave, valor);
      }
    } catch (error) {
      /* Almacenamiento no disponible: la interfaz sigue funcionando. */
    }
  };

  /* ------------------------------------------------------------------------
     Tema claro / oscuro
     ------------------------------------------------------------------------ */

  const temaActual = function () {
    return document.documentElement.getAttribute('data-tema') === 'oscuro' ? 'oscuro' : 'claro';
  };

  const actualizarBotonesTema = function (tema) {
    qsa('[data-accion="alternar-tema"]').forEach(function (boton) {
      const oscuro = tema === 'oscuro';
      boton.setAttribute('aria-pressed', String(oscuro));
      boton.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
      boton.textContent = oscuro ? 'Modo claro' : 'Modo oscuro';
    });
  };

  const aplicarTema = function (tema) {
    if (tema === 'oscuro') {
      document.documentElement.setAttribute('data-tema', 'oscuro');
    } else {
      document.documentElement.removeAttribute('data-tema');
    }
    actualizarBotonesTema(tema);
  };

  const alternarTema = function () {
    const siguiente = temaActual() === 'oscuro' ? 'claro' : 'oscuro';
    guardarAlmacen(CLAVE_TEMA, siguiente);
    aplicarTema(siguiente);
  };

  const temaPreferido = function () {
    const guardado = leerAlmacen(CLAVE_TEMA);
    if (guardado === 'oscuro' || guardado === 'claro') {
      return guardado;
    }
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
    } catch (error) {
      return 'claro';
    }
  };

  aplicarTema(temaPreferido());

  try {
    const consulta = window.matchMedia('(prefers-color-scheme: dark)');
    const manejarCambioSistema = function (evento) {
      if (!leerAlmacen(CLAVE_TEMA)) {
        aplicarTema(evento.matches ? 'oscuro' : 'claro');
      }
    };
    if (consulta.addEventListener) {
      consulta.addEventListener('change', manejarCambioSistema);
    } else if (consulta.addListener) {
      consulta.addListener(manejarCambioSistema);
    }
  } catch (error) {
    /* matchMedia no disponible. */
  }

  /* ------------------------------------------------------------------------
     Mensajes y validación
     ------------------------------------------------------------------------ */

  const mostrarMensaje = function (contenedor, tipo, titulo, texto, enlace) {
    if (!contenedor) {
      return;
    }
    contenedor.replaceChildren();
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje mensaje--' + tipo;

    const tituloEl = document.createElement('p');
    tituloEl.className = 'mensaje__titulo';
    tituloEl.textContent = titulo;
    mensaje.append(tituloEl);

    if (texto) {
      const textoEl = document.createElement('p');
      textoEl.textContent = texto;
      mensaje.append(textoEl);
    }

    if (enlace) {
      const parrafo = document.createElement('p');
      const a = document.createElement('a');
      a.href = enlace.href;
      a.textContent = enlace.texto;
      parrafo.append(a);
      mensaje.append(parrafo);
    }

    contenedor.append(mensaje);
  };

  const limpiarMensaje = function (contenedor) {
    if (contenedor) {
      contenedor.replaceChildren();
    }
  };

  const mostrarErrorCampo = function (campo, mensaje) {
    const contenedor = document.getElementById(campo.id + '-error');
    if (contenedor) {
      const texto = contenedor.querySelector('.campo__error');
      if (texto) {
        texto.textContent = mensaje;
      }
      contenedor.hidden = false;
    }
    campo.setAttribute('aria-invalid', 'true');
  };

  const limpiarErrorCampo = function (campo) {
    const contenedor = document.getElementById(campo.id + '-error');
    if (contenedor) {
      contenedor.hidden = true;
      const texto = contenedor.querySelector('.campo__error');
      if (texto) {
        texto.textContent = '';
      }
    }
    campo.removeAttribute('aria-invalid');
  };

  const validarCampo = function (campo) {
    const reglas = (campo.dataset.validacion || '').split(/\s+/).filter(Boolean);
    const esCasilla = campo.type === 'checkbox';
    const valor = esCasilla ? campo.checked : campo.value.trim();
    let mensaje = '';

    for (let i = 0; i < reglas.length; i += 1) {
      const regla = reglas[i];

      if (regla === 'requerido' && !esCasilla && valor === '') {
        mensaje = 'Este campo es obligatorio.';
      } else if (regla === 'rol' && valor === '') {
        mensaje = 'Selecciona tu rol.';
      } else if (regla === 'nombre' && valor !== '' && valor.length < 3) {
        mensaje = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
      } else if (regla === 'correo' && valor !== '' && !REGEX_CORREO.test(valor)) {
        mensaje = 'Ingresa un correo válido (ejemplo@dominio.com).';
      } else if (regla === 'contrasena' && valor !== '' && valor.length < 8) {
        mensaje = 'La contraseña debe tener al menos 8 caracteres.';
      } else if (regla === 'confirmacion' && valor !== '') {
        const otro = document.getElementById(campo.dataset.coincideCon || '');
        if (otro && valor !== otro.value.trim()) {
          mensaje = 'Las contraseñas no coinciden.';
        }
      } else if (regla === 'terminos' && !campo.checked) {
        mensaje = 'Debes aceptar los términos y condiciones.';
      } else if (regla === 'nota' && valor !== '') {
        const valorNumerico = Number(valor);
        if (!Number.isFinite(valorNumerico) || valorNumerico < 0 || valorNumerico > 100) {
          mensaje = 'Ingresa una nota entre 0 y 100.';
        }
      } else if (regla === 'archivo' && !esCasilla) {
        const inputEvidencia = document.getElementById(campo.dataset.evidenciaGrupo || '');
        const enlaceEvidencia = document.getElementById(campo.dataset.evidenciaEnlace || '');
        if (inputEvidencia && enlaceEvidencia && inputEvidencia.files.length === 0 && enlaceEvidencia.value.trim() === '') {
          mensaje = 'Adjunta un archivo o ingresa un enlace de repositorio.';
        }
      } else if (regla === 'enlace' && valor !== '' && !/^https?:\/\//.test(valor)) {
        mensaje = 'Ingresa un enlace válido que empiece con http:// o https://';
      }

      if (mensaje) {
        break;
      }
    }

    if (mensaje) {
      mostrarErrorCampo(campo, mensaje);
      return false;
    }

    limpiarErrorCampo(campo);
    return true;
  };

  const marcarInvalido = function (campo, mensaje) {
    if (campo) {
      mostrarErrorCampo(campo, mensaje);
    }
  };

  const enfocarPrimerError = function (formulario) {
    const primero = formulario.querySelector('[aria-invalid="true"]');
    if (primero) {
      primero.focus();
    }
  };

  const procesarLogin = function (formulario, contenedor) {
    const rol = qs('#login-rol', formulario);
    const correo = qs('#login-correo', formulario);
    const contrasena = qs('#login-contrasena', formulario);
    const recordar = qs('#login-recordar', formulario);
    const correoNormalizado = correo.value.trim().toLowerCase();
    const cuenta = CUENTAS_DEMO.find(function (item) {
      return item.correo === correoNormalizado;
    });

    if (!cuenta || cuenta.contrasena !== contrasena.value) {
      marcarInvalido(correo, 'Correo o contraseña incorrectos.');
      marcarInvalido(contrasena, 'Correo o contraseña incorrectos.');
      mostrarMensaje(
        contenedor,
        'error',
        'No pudimos iniciar sesión',
        'Revisa el correo y la contraseña. Puedes usar una de las cuentas de demostración.'
      );
      if (contenedor) {
        contenedor.focus();
      }
      return;
    }

    if (cuenta.rol !== rol.value) {
      marcarInvalido(rol, 'El rol seleccionado no coincide con la cuenta.');
      mostrarMensaje(
        contenedor,
        'error',
        'Rol incorrecto',
        'La cuenta ' + cuenta.correo + ' corresponde al rol ' + cuenta.etiqueta + '.'
      );
      rol.focus();
      return;
    }

    guardarAlmacen(CLAVE_CORREO, recordar && recordar.checked ? correoNormalizado : null);
    mostrarMensaje(
      contenedor,
      'exito',
      'Ingreso correcto',
      'Bienvenido, ' + cuenta.etiqueta + '. Redirección simulada al panel de ' + cuenta.etiqueta + '.',
      { href: 'index.html', texto: 'Volver a la portada' }
    );
    if (contenedor) {
      contenedor.focus();
    }
  };

  const procesarRegistro = function (formulario, contenedor) {
    const correo = qs('#registro-correo', formulario);
    const rol = qs('#registro-rol', formulario);
    const correoNormalizado = correo.value.trim().toLowerCase();

    if (CUENTAS_DEMO.some(function (item) { return item.correo === correoNormalizado; })) {
      marcarInvalido(correo, 'Este correo ya está registrado en la demostración.');
      mostrarMensaje(
        contenedor,
        'error',
        'Correo no disponible',
        'El correo ingresado pertenece a una cuenta de demostración. Prueba con otro correo.'
      );
      correo.focus();
      return;
    }

    const opcion = rol.options[rol.selectedIndex];
    const nombreRol = opcion ? opcion.text : 'Estudiante';
    mostrarMensaje(
      contenedor,
      'exito',
      'Cuenta creada correctamente',
      'Registro simulado como ' + nombreRol + '. Ya puedes iniciar sesión con tu correo y contraseña.',
      { href: 'login.html', texto: 'Ir a iniciar sesión' }
    );
    if (contenedor) {
      contenedor.focus();
    }
  };

  const inicializarValidacion = function () {
    qsa('form[data-formulario]').forEach(function (formulario) {
      const tipo = formulario.dataset.formulario;
      const contenedor = qs('[data-mensaje-formulario]', formulario);
      const campos = qsa('input, select, textarea', formulario).filter(function (campo) {
        return campo.dataset.validacion;
      });

      campos.forEach(function (campo) {
        campo.addEventListener('blur', function () {
          validarCampo(campo);
        });

        campo.addEventListener('input', function () {
          if (campo.getAttribute('aria-invalid') === 'true') {
            validarCampo(campo);
          }
        });

        campo.addEventListener('change', function () {
          if (campo.getAttribute('aria-invalid') === 'true' || campo.tagName === 'SELECT' || campo.type === 'checkbox') {
            validarCampo(campo);
          }
        });
      });

      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        limpiarMensaje(contenedor);

        // Se reconsultan los campos en cada envío para incluir los módulos
        // añadidos dinámicamente después de la carga inicial.
        const camposActuales = qsa('input, select, textarea', formulario).filter(function (campo) {
          return campo.dataset.validacion;
        });

        const resultados = camposActuales.map(function (campo) {
          return validarCampo(campo);
        });

        if (resultados.indexOf(false) !== -1) {
          mostrarMensaje(
            contenedor,
            'error',
            'Revisa la información',
            'Hay campos que necesitan corrección antes de continuar.'
          );
          enfocarPrimerError(formulario);
          return;
        }

        if (tipo === 'login') {
          procesarLogin(formulario, contenedor);
        } else if (tipo === 'registro') {
          procesarRegistro(formulario, contenedor);
        } else if (tipo === 'evidencia') {
          procesarEvidencia(formulario, contenedor);
        } else if (tipo === 'curso') {
          procesarCreacionCurso(formulario, contenedor);
        } else if (tipo === 'calificacion') {
          procesarCalificacion(formulario, contenedor);
        } else if (tipo === 'usuario') {
          procesarRegistroUsuario(formulario, contenedor);
        }
      });
    });
  };

  const procesarEvidencia = function (formulario, contenedor) {
    const boton = qs('button[type="submit"]', formulario);
    mostrarMensaje(
      contenedor,
      'exito',
      'Evidencia enviada correctamente',
      'Tu entrega ha sido registrada en modo demostración. El instructor recibirá una notificación para calificarla.',
      { href: 'mis-cursos.html', texto: 'Ver mis cursos' }
    );
    if (contenedor) {
      contenedor.focus();
    }
    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Evidencia enviada';
    }
    formulario.reset();
  };

  const procesarCreacionCurso = function (formulario, contenedor) {
    const boton = qs('button[type="submit"]', formulario);
    mostrarMensaje(
      contenedor,
      'exito',
      'Curso creado correctamente',
      'El curso ha sido enviado a moderación. Una vez aprobado por el administrador, aparecerá en el catálogo público.',
      { href: 'panel-instructor.html', texto: 'Volver al panel' }
    );
    if (contenedor) {
      contenedor.focus();
    }
    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Curso enviado';
    }
    formulario.reset();
  };

  const procesarCalificacion = function (formulario, contenedor) {
    const boton = qs('button[type="submit"]', formulario);
    const nota = qs('#nota-calificacion', formulario);
    const resultado = qs('#resultado-calificacion', formulario);
    const opcionResultado = resultado ? resultado.options[resultado.selectedIndex] : null;
    const etiquetaResultado = opcionResultado ? opcionResultado.text : 'Aprobado';

    mostrarMensaje(
      contenedor,
      'exito',
      'Calificación registrada',
      'Se guardó la nota ' + nota.value + '/100 con resultado «' + etiquetaResultado + '» en modo demostración. El estudiante verá la retroalimentación en su panel.',
      { href: 'panel-instructor.html', texto: 'Volver al panel' }
    );
    if (contenedor) {
      contenedor.focus();
    }
    if (boton) {
      boton.disabled = true;
      boton.textContent = 'Calificación guardada';
    }
  };

  const manejarGeneradorModulos = function () {
    const contenedor = qs('#contenedor-modulos');
    const botonAgregar = qs('#agregar-modulo');
    if (!contenedor || !botonAgregar) {
      return;
    }

    let contadorModulos = qsa('.modulo-item', contenedor).length;

    botonAgregar.addEventListener('click', function (evento) {
      evento.preventDefault();
      contadorModulos += 1;

      const modulo = document.createElement('div');
      modulo.className = 'modulo-item';
      modulo.innerHTML = `
        <div class="modulo-item__numero">${contadorModulos}</div>
        <div class="formulario">
          <div class="campo">
            <label class="campo__etiqueta" for="modulo-titulo-${contadorModulos}">Título del módulo <span class="campo__requerido" aria-hidden="true">*</span></label>
            <input class="campo__control" id="modulo-titulo-${contadorModulos}" name="modulo_titulo[]" type="text" required data-validacion="requerido nombre" aria-describedby="modulo-titulo-${contadorModulos}-error" placeholder="Ej. Introducción a variables">
            <div id="modulo-titulo-${contadorModulos}-error" hidden><p class="campo__error"></p></div>
          </div>
          <div class="campo">
            <label class="campo__etiqueta" for="modulo-detalle-${contadorModulos}">Detalle o semanas</label>
            <input class="campo__control" id="modulo-detalle-${contadorModulos}" name="modulo_detalle[]" type="text" placeholder="Ej. Semanas 1-2 · Conceptos básicos">
          </div>
        </div>
        <button type="button" class="boton boton--peligro boton--sm" data-accion="eliminar-modulo" aria-label="Eliminar módulo ${contadorModulos}">Eliminar</button>
      `;

      contenedor.appendChild(modulo);
    });

    contenedor.addEventListener('click', function (evento) {
      const botonEliminar = evento.target.closest('[data-accion="eliminar-modulo"]');
      if (botonEliminar) {
        evento.preventDefault();
        botonEliminar.closest('.modulo-item').remove();
        // Recalcular números
        qsa('.modulo-item', contenedor).forEach(function (item, indice) {
          const numero = item.querySelector('.modulo-item__numero');
          if (numero) {
            numero.textContent = indice + 1;
          }
        });
        contadorModulos = qsa('.modulo-item', contenedor).length;
      }
    });
  };

  const inicializarLogin = function () {
    const formulario = qs('#formulario-login');
    if (!formulario) {
      return;
    }
    const correo = qs('#login-correo', formulario);
    const recordar = qs('#login-recordar', formulario);
    const guardado = leerAlmacen(CLAVE_CORREO);
    if (guardado && correo && recordar) {
      correo.value = guardado;
      recordar.checked = true;
    }
  };

  /* ------------------------------------------------------------------------
     Catálogo: búsqueda y filtro por categoría
     ------------------------------------------------------------------------ */

  const inicializarCatalogo = function () {
    const lista = qs('#lista-cursos');
    if (!lista) {
      return;
    }

    const buscador = qs('#busqueda-cursos');
    const categoria = qs('#filtro-categoria');
    const resumen = qs('#resumen-resultados');
    const sinResultados = qs('#sin-resultados');
    const formulario = qs('#formulario-filtros');
    const limpiar = qs('#limpiar-filtros');
    const tarjetas = qsa('[data-curso]', lista);
    const total = tarjetas.length;

    const parametros = new URLSearchParams(window.location.search);
    if (buscador && parametros.get('buscar')) {
      buscador.value = parametros.get('buscar');
    }
    if (categoria && parametros.get('categoria')) {
      categoria.value = parametros.get('categoria');
    }

    const aplicarFiltros = function () {
      const texto = normalizar(buscador ? buscador.value : '');
      const categoriaElegida = categoria ? categoria.value : '';
      let visibles = 0;

      tarjetas.forEach(function (tarjeta) {
        const contenido = normalizar([
          tarjeta.dataset.titulo,
          tarjeta.dataset.categoria,
          tarjeta.dataset.nivel,
          tarjeta.dataset.instructor,
          tarjeta.dataset.palabras,
          tarjeta.textContent
        ].join(' '));

        const coincideTexto = !texto || contenido.indexOf(texto) !== -1;
        const coincideCategoria = !categoriaElegida || tarjeta.dataset.categoria === categoriaElegida;
        const visible = coincideTexto && coincideCategoria;

        tarjeta.hidden = !visible;
        if (visible) {
          visibles += 1;
        }
      });

      if (resumen) {
        resumen.textContent = visibles === 0
          ? 'No hay cursos que coincidan con los filtros.'
          : 'Mostrando ' + visibles + ' de ' + total + ' cursos.';
      }
      if (sinResultados) {
        sinResultados.hidden = visibles !== 0;
      }
    };

    if (buscador) {
      buscador.addEventListener('input', aplicarFiltros);
    }
    if (categoria) {
      categoria.addEventListener('change', aplicarFiltros);
    }
    if (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aplicarFiltros();
      });
    }
    if (limpiar) {
      limpiar.addEventListener('click', function () {
        if (buscador) {
          buscador.value = '';
        }
        if (categoria) {
          categoria.value = '';
        }
        aplicarFiltros();
        if (buscador) {
          buscador.focus();
        }
      });
    }

    aplicarFiltros();
  };

  /* ------------------------------------------------------------------------
     Gestión de usuarios (Administrador): búsqueda, filtros y acciones
     ------------------------------------------------------------------------ */

  let reaplicarFiltrosUsuarios = null;

  const inicializarUsuarios = function () {
    const lista = qs('#lista-usuarios');
    if (!lista) {
      return;
    }

    const buscador = qs('#buscar-usuario');
    const rol = qs('#filtro-rol-usuario');
    const estado = qs('#filtro-estado-usuario');
    const resumen = qs('#resumen-usuarios');
    const formulario = qs('#formulario-filtros-usuarios');
    const limpiar = qs('#limpiar-filtros-usuarios');
    const filas = qsa('[data-usuario]', lista);
    const total = filas.length;

    const aplicarFiltros = function () {
      const texto = normalizar(buscador ? buscador.value : '');
      const rolElegido = rol ? rol.value : '';
      const estadoElegido = estado ? estado.value : '';
      let visibles = 0;

      filas.forEach(function (fila) {
        const contenido = normalizar([fila.dataset.nombre, fila.dataset.correo].join(' '));
        const coincideTexto = !texto || contenido.indexOf(texto) !== -1;
        const coincideRol = !rolElegido || fila.dataset.rol === rolElegido;
        const coincideEstado = !estadoElegido || fila.dataset.estado === estadoElegido;
        const visible = coincideTexto && coincideRol && coincideEstado;

        fila.hidden = !visible;
        if (visible) {
          visibles += 1;
        }
      });

      if (resumen) {
        resumen.textContent = visibles === 0
          ? 'No hay usuarios que coincidan con los filtros.'
          : 'Mostrando ' + visibles + ' de ' + total + ' usuarios.';
      }
    };

    reaplicarFiltrosUsuarios = aplicarFiltros;

    if (buscador) {
      buscador.addEventListener('input', aplicarFiltros);
    }
    if (rol) {
      rol.addEventListener('change', aplicarFiltros);
    }
    if (estado) {
      estado.addEventListener('change', aplicarFiltros);
    }
    if (formulario) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aplicarFiltros();
      });
    }
    if (limpiar) {
      limpiar.addEventListener('click', function () {
        if (buscador) {
          buscador.value = '';
        }
        if (rol) {
          rol.value = '';
        }
        if (estado) {
          estado.value = '';
        }
        aplicarFiltros();
        if (buscador) {
          buscador.focus();
        }
      });
    }

    aplicarFiltros();
  };

  const procesarRegistroUsuario = function (formulario, contenedor) {
    const nombre = qs('#usuario-nombre', formulario);
    const correo = qs('#usuario-correo', formulario);
    const rol = qs('#usuario-rol', formulario);
    const opcionRol = rol ? rol.options[rol.selectedIndex] : null;
    const nombreRol = opcionRol ? opcionRol.text : 'Estudiante';

    mostrarMensaje(
      contenedor,
      'exito',
      'Usuario creado correctamente',
      'La cuenta de ' + nombre.value.trim() + ' (' + correo.value.trim() + ') se registró como ' + nombreRol + ' en modo demostración.'
    );
    if (contenedor) {
      contenedor.focus();
    }
    formulario.reset();
    if (nombre) {
      nombre.focus();
    }
  };

  /* ------------------------------------------------------------------------
     Ficha de curso
     ------------------------------------------------------------------------ */

  const CURSOS = {
    'desarrollo-web-full-stack': {
      titulo: 'Desarrollo Web Full Stack',
      categoria: 'Programación',
      nivel: 'Intermedio',
      duracion: '24 semanas',
      instructor: 'Laura Méndez',
      instructorBio: 'Desarrolladora full stack con más de 10 años de experiencia en productos web y formación de equipos técnicos.',
      resumen: 'Aprende a construir aplicaciones web completas, desde la interfaz hasta la base de datos, con proyectos prácticos y acompañamiento.',
      descripcion: 'Este curso te lleva paso a paso por el desarrollo web moderno. Trabajarás con HTML5 semántico, CSS3, JavaScript, APIs, bases de datos y despliegue. Cada módulo combina conceptos clave con retos prácticos y una entrega evaluable.',
      requisitos: [
        'Manejo básico de computador y navegador.',
        'Ganas de practicar con proyectos reales.',
        'No se requiere experiencia previa en programación.'
      ],
      modulos: [
        { titulo: 'Fundamentos de HTML5 y accesibilidad', detalle: 'Semanas 1-2 · Estructura semántica, formularios y buenas prácticas.' },
        { titulo: 'CSS3 moderno y diseño responsivo', detalle: 'Semanas 3-5 · Flexbox, Grid, variables y adaptación a móviles.' },
        { titulo: 'JavaScript esencial', detalle: 'Semanas 6-9 · DOM, eventos, funciones y validaciones.' },
        { titulo: 'Consumo de APIs y asincronía', detalle: 'Semanas 10-13 · Fetch, JSON, promesas y manejo de errores.' },
        { titulo: 'Backend y bases de datos', detalle: 'Semanas 14-19 · Rutas, autenticación y persistencia.' },
        { titulo: 'Proyecto final y despliegue', detalle: 'Semanas 20-24 · Construcción, pruebas y publicación.' }
      ]
    },
    'diseno-ux-ui': {
      titulo: 'Diseño UX/UI de Productos Digitales',
      categoria: 'Diseño',
      nivel: 'Principiante',
      duracion: '12 semanas',
      instructor: 'Camila Restrepo',
      instructorBio: 'Diseñadora de producto especializada en investigación de usuarios y sistemas de diseño accesibles.',
      resumen: 'Diseña experiencias digitales claras, útiles y accesibles, desde la investigación hasta el prototipo final.',
      descripcion: 'Aprenderás a investigar necesidades, definir flujos, construir wireframes y prototipos, y validar tus decisiones con usuarios. El curso pone especial énfasis en accesibilidad, consistencia visual y colaboración con equipos de desarrollo.',
      requisitos: [
        'Interés por el diseño de productos digitales.',
        'Computador con acceso a internet.',
        'No se requiere experiencia previa.'
      ],
      modulos: [
        { titulo: 'Investigación de usuarios', detalle: 'Semanas 1-2 · Entrevistas, observación y definición del problema.' },
        { titulo: 'Arquitectura de información', detalle: 'Semanas 3-4 · Flujos, mapas de navegación y wireframes.' },
        { titulo: 'Diseño de interfaces', detalle: 'Semanas 5-7 · Jerarquía, tipografía, color y componentes.' },
        { titulo: 'Prototipado y pruebas', detalle: 'Semanas 8-10 · Prototipos navegables y validación con usuarios.' },
        { titulo: 'Sistema de diseño y entrega', detalle: 'Semanas 11-12 · Documentación y handoff.' }
      ]
    },
    'analisis-datos-python': {
      titulo: 'Análisis de Datos con Python',
      categoria: 'Datos',
      nivel: 'Intermedio',
      duracion: '16 semanas',
      instructor: 'Andrés Salazar',
      instructorBio: 'Analista de datos con experiencia en educación, salud y productos digitales.',
      resumen: 'Convierte datos en decisiones usando Python, visualización y buenas prácticas de análisis.',
      descripcion: 'El curso combina fundamentos de programación con técnicas de limpieza, exploración y visualización de datos. Trabajarás con conjuntos de datos realistas y aprenderás a comunicar hallazgos con claridad.',
      requisitos: [
        'Lógica básica o experiencia inicial en programación.',
        'Computador con acceso a internet.',
        'Disposición para practicar con datos.'
      ],
      modulos: [
        { titulo: 'Python para análisis', detalle: 'Semanas 1-3 · Tipos de datos, estructuras y funciones.' },
        { titulo: 'Limpieza y preparación', detalle: 'Semanas 4-6 · Valores faltantes, formatos y calidad de datos.' },
        { titulo: 'Análisis exploratorio', detalle: 'Semanas 7-9 · Estadísticas descriptivas y patrones.' },
        { titulo: 'Visualización de datos', detalle: 'Semanas 10-13 · Gráficos claros y narrativa visual.' },
        { titulo: 'Proyecto de análisis', detalle: 'Semanas 14-16 · Preguntas, hallazgos y presentación.' }
      ]
    },
    'marketing-digital-growth': {
      titulo: 'Marketing Digital y Growth',
      categoria: 'Negocios',
      nivel: 'Principiante',
      duracion: '10 semanas',
      instructor: 'Valentina Ríos',
      instructorBio: 'Especialista en crecimiento digital y estrategias de contenido para proyectos educativos.',
      resumen: 'Construye estrategias de marketing digital medibles y centradas en las personas.',
      descripcion: 'Aprenderás a definir audiencias, diseñar embudos, crear contenido y medir resultados. El curso incluye ejercicios para planificar campañas realistas y tomar decisiones basadas en datos.',
      requisitos: [
        'Interés por el marketing y los negocios digitales.',
        'Computador con acceso a internet.',
        'No se requiere experiencia previa.'
      ],
      modulos: [
        { titulo: 'Audiencia y propuesta de valor', detalle: 'Semanas 1-2 · Investigación y posicionamiento.' },
        { titulo: 'Contenido y canales', detalle: 'Semanas 3-4 · Calendario editorial y formatos.' },
        { titulo: 'Embudos y conversión', detalle: 'Semanas 5-6 · Atracción, activación y retención.' },
        { titulo: 'Métricas y experimentación', detalle: 'Semanas 7-8 · Indicadores, pruebas y aprendizaje.' },
        { titulo: 'Plan de crecimiento', detalle: 'Semanas 9-10 · Estrategia integrada y presentación.' }
      ]
    },
    'ciberseguridad-defensiva': {
      titulo: 'Ciberseguridad Defensiva',
      categoria: 'Seguridad',
      nivel: 'Avanzado',
      duracion: '20 semanas',
      instructor: 'Diego Torres',
      instructorBio: 'Consultor en seguridad ofensiva y defensiva con experiencia en entornos críticos.',
      resumen: 'Protege sistemas y datos con prácticas defensivas, análisis de riesgos y respuesta a incidentes.',
      descripcion: 'Este curso aborda los fundamentos de la seguridad defensiva: gestión de identidades, endurecimiento de sistemas, monitoreo y respuesta ante incidentes. Incluye laboratorios guiados y estudios de caso.',
      requisitos: [
        'Conocimientos de redes y sistemas operativos.',
        'Familiaridad básica con línea de comandos.',
        'Experiencia previa en TI recomendada.'
      ],
      modulos: [
        { titulo: 'Fundamentos de seguridad', detalle: 'Semanas 1-3 · Amenazas, vulnerabilidades y riesgos.' },
        { titulo: 'Identidades y accesos', detalle: 'Semanas 4-6 · Autenticación, permisos y mínimo privilegio.' },
        { titulo: 'Endurecimiento de sistemas', detalle: 'Semanas 7-9 · Configuración segura y parches.' },
        { titulo: 'Monitoreo y detección', detalle: 'Semanas 10-13 · Registros, alertas y análisis.' },
        { titulo: 'Respuesta a incidentes', detalle: 'Semanas 14-17 · Contención, erradicación y recuperación.' },
        { titulo: 'Laboratorio integrador', detalle: 'Semanas 18-20 · Caso práctico y informe.' }
      ]
    },
    'gestion-proyectos-agiles': {
      titulo: 'Gestión de Proyectos Ágiles',
      categoria: 'Negocios',
      nivel: 'Intermedio',
      duracion: '8 semanas',
      instructor: 'Mateo Cárdenas',
      instructorBio: 'Gestor de proyectos ágiles y coach de equipos multidisciplinarios.',
      resumen: 'Planifica, prioriza y entrega valor con marcos ágiles aplicados a proyectos reales.',
      descripcion: 'Aprenderás a facilitar equipos, priorizar el trabajo y medir el avance con prácticas ágiles. El curso incluye plantillas, dinámicas de colaboración y simulaciones de planificación.',
      requisitos: [
        'Experiencia básica en trabajo en equipo.',
        'Interés por la gestión de proyectos.',
        'Computador con acceso a internet.'
      ],
      modulos: [
        { titulo: 'Principios ágiles', detalle: 'Semanas 1-2 · Valores, roles y marcos de trabajo.' },
        { titulo: 'Planificación y priorización', detalle: 'Semanas 3-4 · Historias, backlog y estimación.' },
        { titulo: 'Ejecución y seguimiento', detalle: 'Semanas 5-6 · Tableros, métricas y ceremonias.' },
        { titulo: 'Mejora continua', detalle: 'Semanas 7-8 · Retrospectivas y entrega de valor.' }
      ]
    },
    'fundamentos-ia': {
      titulo: 'Fundamentos de Inteligencia Artificial',
      categoria: 'Datos',
      nivel: 'Intermedio',
      duracion: '14 semanas',
      instructor: 'Sofía Herrera',
      instructorBio: 'Investigadora en inteligencia artificial aplicada a la educación y la salud.',
      resumen: 'Comprende cómo funcionan los sistemas de inteligencia artificial y cómo aplicarlos con criterio.',
      descripcion: 'El curso introduce los conceptos centrales de la inteligencia artificial: datos, modelos, entrenamiento y evaluación. También reflexiona sobre sesgos, privacidad y uso responsable de la tecnología.',
      requisitos: [
        'Conocimientos básicos de matemáticas y lógica.',
        'Familiaridad inicial con Python recomendada.',
        'Computador con acceso a internet.'
      ],
      modulos: [
        { titulo: '¿Qué es la inteligencia artificial?', detalle: 'Semanas 1-2 · Historia, alcances y límites.' },
        { titulo: 'Datos y representación', detalle: 'Semanas 3-4 · Calidad, features y preparación.' },
        { titulo: 'Modelos y aprendizaje', detalle: 'Semanas 5-8 · Entrenamiento y evaluación.' },
        { titulo: 'Aplicaciones prácticas', detalle: 'Semanas 9-11 · Casos de uso y prototipos.' },
        { titulo: 'Ética y uso responsable', detalle: 'Semanas 12-14 · Sesgos, privacidad y transparencia.' }
      ]
    },
    'ingles-tecnico': {
      titulo: 'Inglés Técnico para Tecnología',
      categoria: 'Idiomas',
      nivel: 'Principiante',
      duracion: '12 semanas',
      instructor: 'Julián Pardo',
      instructorBio: 'Docente de inglés técnico con experiencia en equipos de tecnología y soporte.',
      resumen: 'Comunícate con confianza en entornos tecnológicos usando inglés técnico claro y práctico.',
      descripcion: 'El curso desarrolla vocabulario, lectura y comunicación oral para contextos técnicos. Trabajarás con documentación, correos, reuniones y presentaciones propias del sector tecnológico.',
      requisitos: [
        'Conocimientos básicos de inglés.',
        'Interés por la comunicación técnica.',
        'Computador con acceso a internet.'
      ],
      modulos: [
        { titulo: 'Vocabulario técnico esencial', detalle: 'Semanas 1-3 · Herramientas, procesos y roles.' },
        { titulo: 'Lectura de documentación', detalle: 'Semanas 4-6 · Manuales, guías y artículos.' },
        { titulo: 'Comunicación escrita', detalle: 'Semanas 7-9 · Correos, reportes y mensajes.' },
        { titulo: 'Reuniones y presentaciones', detalle: 'Semanas 10-12 · Conversación y exposición.' }
      ]
    }
  };

  const actualizarTexto = function (selector, texto) {
    qsa(selector).forEach(function (elemento) {
      elemento.textContent = texto;
    });
  };

  const renderizarModulos = function (modulos) {
    const lista = qs('#lista-modulos');
    if (!lista) {
      return;
    }
    lista.replaceChildren();
    modulos.forEach(function (modulo, indice) {
      const item = document.createElement('li');
      item.className = 'lista-agenda__item';

      const numero = document.createElement('span');
      numero.className = 'etiqueta etiqueta--solida';
      numero.textContent = String(indice + 1).padStart(2, '0');

      const titulo = document.createElement('span');
      titulo.className = 'lista-agenda__titulo';
      titulo.textContent = modulo.titulo;

      const detalle = document.createElement('span');
      detalle.className = 'lista-agenda__meta';
      detalle.textContent = modulo.detalle;

      item.append(numero, titulo, detalle);
      lista.append(item);
    });
  };

  const renderizarRequisitos = function (requisitos) {
    const lista = qs('#lista-requisitos');
    if (!lista) {
      return;
    }
    lista.replaceChildren();
    requisitos.forEach(function (requisito) {
      const item = document.createElement('li');
      item.className = 'lista-agenda__item lista-agenda__item--neutro';
      const texto = document.createElement('span');
      texto.className = 'lista-agenda__meta';
      texto.textContent = requisito;
      item.append(texto);
      lista.append(item);
    });
  };

  const inicializarDetalleCurso = function () {
    const titulo = qs('#titulo-curso');
    if (!titulo) {
      return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const solicitado = parametros.get('curso') || 'desarrollo-web-full-stack';
    const curso = CURSOS[solicitado] || CURSOS['desarrollo-web-full-stack'];
    const aviso = qs('#aviso-curso');

    if (!CURSOS[solicitado] && aviso) {
      mostrarMensaje(
        aviso,
        'alerta',
        'Curso no encontrado',
        'No encontramos el curso solicitado. Te mostramos la ficha de Desarrollo Web Full Stack.'
      );
    }

    actualizarTexto('[data-curso-titulo]', curso.titulo);
    actualizarTexto('[data-curso-categoria]', curso.categoria);
    actualizarTexto('[data-curso-nivel]', curso.nivel);
    actualizarTexto('[data-curso-duracion]', curso.duracion);
    actualizarTexto('[data-curso-instructor]', curso.instructor);
    actualizarTexto('[data-curso-instructor-bio]', curso.instructorBio);
    actualizarTexto('[data-curso-resumen]', curso.resumen);
    actualizarTexto('[data-curso-descripcion]', curso.descripcion);

    document.title = curso.titulo + ' — EduNova';
    renderizarModulos(curso.modulos);
    renderizarRequisitos(curso.requisitos);
  };

  /* ------------------------------------------------------------------------
     Acciones simuladas
     ------------------------------------------------------------------------ */

  const inscribirCurso = function (boton) {
    if (boton.disabled) {
      return;
    }
    const titulo = qs('#titulo-curso');
    const nombre = titulo ? titulo.textContent.trim() : 'el curso';
    const contenedor = qs('#mensaje-inscripcion');

    mostrarMensaje(
      contenedor,
      'exito',
      'Inscripción registrada',
      'Tu inscripción a "' + nombre + '" se registró en modo demostración. Para guardar tu avance, inicia sesión.',
      { href: 'login.html', texto: 'Iniciar sesión' }
    );

    if (contenedor) {
      contenedor.focus();
    }
    boton.disabled = true;
    boton.textContent = 'Inscripción registrada';
    boton.classList.remove('boton--primario');
    boton.classList.add('boton--secundario');
  };

  const simularEnvioEvidencia = function (boton) {
    const panel = boton.closest('[data-panel-accion]') || boton.closest('form');
    const contenedor = panel
      ? panel.querySelector('[data-mensaje-accion]')
      : qs('#mensaje-evidencia');
    const archivo = panel ? panel.querySelector('input[type="file"]') : null;
    const enlace = panel ? panel.querySelector('input[type="url"]') : null;
    const notas = panel ? panel.querySelector('textarea') : null;
    const tieneContenido =
      (archivo && archivo.files && archivo.files.length > 0) ||
      (enlace && enlace.value.trim() !== '') ||
      (notas && notas.value.trim() !== '');

    if (panel && !tieneContenido) {
      mostrarMensaje(
        contenedor,
        'error',
        'Evidencia incompleta',
        'Adjunta un archivo, agrega un enlace o escribe una nota antes de enviar.'
      );
      if (archivo) {
        archivo.focus();
      } else if (enlace) {
        enlace.focus();
      } else if (notas) {
        notas.focus();
      }
      return;
    }

    mostrarMensaje(
      contenedor,
      'exito',
      'Evidencia enviada',
      'La evidencia se registró correctamente en modo demostración.'
    );
    boton.textContent = 'Evidencia enviada';
    boton.disabled = true;
  };

  const simularCalificacion = function (boton) {
    const panel = boton.closest('[data-panel-accion]') || boton.closest('form');
    const contenedor = panel
      ? panel.querySelector('[data-mensaje-accion]')
      : qs('#mensaje-calificacion');
    const nota = panel
      ? panel.querySelector('[data-nota], input[name="nota"]')
      : null;

    if (nota) {
      const valor = Number(nota.value);
      if (nota.value.trim() === '' || !Number.isFinite(valor) || valor < 0 || valor > 100) {
        mostrarMensaje(
          contenedor,
          'error',
          'Calificación no válida',
          'Ingresa una nota entre 0 y 100.'
        );
        nota.focus();
        return;
      }
      mostrarMensaje(
        contenedor,
        'exito',
        'Calificación registrada',
        'Se registró una calificación de ' + valor + '/100 en modo demostración.'
      );
    } else {
      mostrarMensaje(
        contenedor,
        'exito',
        'Calificación registrada',
        'La calificación se registró en modo demostración.'
      );
    }

    boton.textContent = 'Calificación registrada';
  };

  const simularCambioEstadoUsuario = function (boton) {
    const fila = boton.closest('[data-usuario]');
    if (!fila) {
      return;
    }

    const estadoActual = fila.dataset.estado === 'activo' ? 'activo' : 'inactivo';
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    fila.dataset.estado = nuevoEstado;

    const etiqueta = fila.querySelector('[data-estado-usuario]');
    if (etiqueta) {
      etiqueta.textContent = nuevoEstado === 'activo' ? 'Activo' : 'Inactivo';
      etiqueta.classList.remove('etiqueta--exito', 'etiqueta--error', 'etiqueta--info');
      etiqueta.classList.add(nuevoEstado === 'activo' ? 'etiqueta--exito' : 'etiqueta--error');
    }

    boton.textContent = nuevoEstado === 'activo' ? 'Desactivar' : 'Activar';

    const contenedor = fila.querySelector('[data-mensaje-accion]') || qs('#mensaje-usuarios');
    mostrarMensaje(
      contenedor,
      'exito',
      'Estado actualizado',
      'El usuario ' + (fila.dataset.nombre || '') + ' quedó ' + (nuevoEstado === 'activo' ? 'activo' : 'inactivo') + ' en modo demostración.'
    );

    // Si hay filtros activos, se vuelven a aplicar para que la fila
    // respete el filtro de estado vigente tras el cambio.
    if (typeof reaplicarFiltrosUsuarios === 'function') {
      reaplicarFiltrosUsuarios();
    }
  };

  const moderarCurso = function (boton, aprobado) {
    const fila = boton.closest('[data-moderacion-fila]');
    if (!fila) {
      return;
    }

    const nombre = boton.dataset.curso || 'El curso';
    const contenedor = qs('#mensaje-moderacion');

    if (fila.parentNode) {
      fila.remove();
    }

    mostrarMensaje(
      contenedor,
      aprobado ? 'exito' : 'alerta',
      aprobado ? 'Curso aprobado' : 'Curso rechazado',
      aprobado
        ? '«' + nombre + '» se aprobó y ya está disponible en el catálogo público (modo demostración).'
        : '«' + nombre + '» se rechazó y se notificó al instructor para que realice ajustes (modo demostración).'
    );
    if (contenedor) {
      contenedor.focus();
    }

    const restantes = qsa('[data-moderacion-fila]').length;
    const contador = qs('#moderacion-cursos .etiqueta--alerta');
    if (contador) {
      contador.textContent = restantes === 1
        ? '1 pendiente de revisión'
        : restantes + ' pendientes de revisión';
    }
  };

  const inicializarAcciones = function () {
    document.addEventListener('click', function (evento) {
      if (!(evento.target instanceof Element)) {
        return;
      }
      const boton = evento.target.closest('[data-accion]');
      if (!boton) {
        return;
      }

      const accion = boton.dataset.accion;
      if (accion === 'alternar-tema') {
        evento.preventDefault();
        alternarTema();
      } else if (accion === 'inscribir-curso') {
        evento.preventDefault();
        inscribirCurso(boton);
      } else if (accion === 'enviar-evidencia') {
        evento.preventDefault();
        simularEnvioEvidencia(boton);
      } else if (accion === 'calificar') {
        evento.preventDefault();
        simularCalificacion(boton);
      } else if (accion === 'cambiar-estado-usuario') {
        evento.preventDefault();
        simularCambioEstadoUsuario(boton);
      } else if (accion === 'aprobar-curso') {
        evento.preventDefault();
        moderarCurso(boton, true);
      } else if (accion === 'rechazar-curso') {
        evento.preventDefault();
        moderarCurso(boton, false);
      } else if (accion === 'descargar-certificado') {
        evento.preventDefault();
        mostrarMensaje(qs('#mensaje-certificado'), 'exito', 'Descarga iniciada', 'Se está generando el archivo PDF del certificado...');
      } else if (accion === 'copiar-verificacion') {
        evento.preventDefault();
        mostrarMensaje(qs('#mensaje-certificado'), 'info', 'Enlace copiado', 'El enlace de verificación se copió al portapapeles (simulado).');
      } else if (accion === 'guardar-borrador') {
        evento.preventDefault();
        mostrarMensaje(
          qs('#mensaje-curso'),
          'info',
          'Borrador guardado',
          'El curso se guardó como borrador en modo demostración. Puedes continuar editándolo antes de enviarlo a moderación.'
        );
      }
    });
  };

  const iniciar = function () {
    actualizarBotonesTema(temaActual());
    inicializarValidacion();
    inicializarLogin();
    inicializarCatalogo();
    inicializarUsuarios();
    inicializarDetalleCurso();
    manejarGeneradorModulos();
    inicializarAcciones();
  };

  document.addEventListener('DOMContentLoaded', iniciar);
})();
