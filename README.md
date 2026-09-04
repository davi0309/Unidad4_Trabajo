# Panem: Tablero Táctico y con musica
### Instrumento Audiovisual Interactivo basado en el Modelo de Sincronización de Kuramoto

Bienvenido al repositorio oficial de **Panem: Matriz Sónica 3D**, un instrumento digital interactivo que combina la física matemática del **Modelo de Osciladores Acoplados de Kuramoto** con la estética cinematográfica de **Los Juegos del Hambre (*The Hunger Games*)**.

El proyecto permite explorar en tiempo real cómo el orden colectivo, la dispersión armónica y la rebelión de los 12 Distritos de Panem se traducen en sonido sintetizado con la **Web Audio API** y gráficos volumétricos en **p5.js WebGL 3D**.

---

## 📸 Galería Visual de la Evolución del Proyecto

A lo largo del proceso de desarrollo, el proyecto experimentó una transformación radical desde un prototipo 2D básico hasta una sala de guerra holográfica táctica en 3D:

| Fase / Vista | Captura | Descripción |
| :--- | :---: | :--- |
| **1. Versión Inicial (2D Plano)** | ![Versión Inicial 2D](<img width="1600" height="729" alt="imagen" src="https://github.com/user-attachments/assets/2403e073-729d-4204-b415-45e5c7cd2c75" />
) | Nodos circulares básicos con iconos planos agrupados en el centro de la pantalla. |
| **2. Matriz Territorial 3D** | ![Matriz Táctica 4x3](<img width="1600" height="743" alt="imagen" src="https://github.com/user-attachments/assets/718f1298-2aa1-4125-a6b4-19720d0ca7f1" />
) | Malla militar 4x3 con esculturas 3D emblemáticas, placas de nombre y barras de fase ($R = 1.00$). |
| **3. Avenida de los Tributos (Cenital)** | ![Avenida Cenital](<img width="1600" height="754" alt="imagen" src="https://github.com/user-attachments/assets/2673a098-b955-4c41-95e0-3c9d82644b5d" />
) | Vista de planta (Top-down) mostrando las dos columnas paralelas de 6 distritos flanqueando el bulevar central. |
| **4. Avenida de los Tributos (Frontal)** | ![Avenida Frontal](<img width="1600" height="748" alt="imagen" src="https://github.com/user-attachments/assets/1fa4a3ef-1789-47e3-b723-bcb8a69ad4d4" />
) | Perspectiva a nivel del suelo con desniveles en Z, osciloscopio lineal y monolito central del Sinsajo ($R = 0.63$). |
| **5. Estado de Rebelión y Caos** | ![Rebelión Total](<img width="1600" height="767" alt="imagen" src="https://github.com/user-attachments/assets/995e2cd0-fcb7-45b5-b2a8-5f4d5d85d36a" />
) | Desfase masivo ($R = 0.34$), distritos rebeldes emitiendo brasas y partículas de fuego ascendentes. |

---

## 📝 Bitácora de Desarrollo: Prompts, Problemas y Soluciones

A continuación se detalla la memoria técnica cronológica de todas las iteraciones realizadas en conjunto con el asistente Antigravity:

### 🔹 Hito 1: Planteamiento del Proyecto y Análisis del Concepto Inicial
* **Prompt del Usuario:**
  > *"hola antigravity necesito que me ayudes con este proyecto mira la idea es un instrumento digital que funciona con el modelo de kuramoto, y asi se hace sonido mi tematica es los juegos del hambre pero no se esta muy simple todo y quiero como aumentar lo visual que se ve como suena, mejorar muchas cosas, creo que todo esta funcionando desde el index para que me ayudes"*
* **Diagnóstico Inicial:**
  * La aplicación residía en un archivo `index.html` en 2D.
  * Los 12 distritos eran simples círculos con iconos gráficos bidimensionales.
  * El sonido era monofónico básico y las interacciones visuales eran estáticas.
* **Propuesta de Mejora:**
  * Diseñar un motor sonoro con escalas modales cinematográficas (Sol Dórico) y timbres acústicos distintivos.
  * Incorporar un osciloscopio reactivo en tiempo real conectado al analizador FFT (`AnalyserNode`).
  * Implementar el emblemático **Silbido de Rue (4 notas)** como detonador sonoro interactivo.

---

### 🔹 Hito 2: Problema de Concentración en el Centro
* **Prompt del Usuario:**
  > *"como hago que se muevan ps por que todas estan en el centro?"*
* **Problema Identificado:**
  * Los nodos de los distritos se inicializaban en coordenadas indistintas o colapsaban hacia el centro debido a fuerzas de atracción sin anclajes espaciales definidos.
* **Solución Implementada:**
  * Se diseñó un algoritmo de distribución radial instantáneo que desplegaba a los 12 distritos en los 12 sectores horarios de la Arena Reloj (*Catching Fire*).
  * Se introdujo una función de oscilación elástica local acoplada a la fase $\theta_i$ de cada oscilador y un slider para graduar la amplitud del movimiento.

---

### 🔹 Hito 3: El Bug Crítico de Congelamiento y Silencio
* **Prompt del Usuario:**
  > *"mira hay un bug el juego se queda quieto y no se mueve ni suenan los agentes por si solos, si presiono espacio si suena pero el resto esta bug"*
* **Problemas Críticos Detectados en Consola:**
  1. **Excepción Fatal de Formato de Color en p5.js:**
     * En la función de renderizado, la llamada `stroke(this.isIsolated ? '#ef4444' : 'rgb(...)', this.pulse * 255)` combinaba un string hexadecimal con un canal alfa numérico. p5.js lanzaba la excepción:
       ```
       [object Arguments] is not a valid color representation
       ```
       Esto provocaba que al dispararse el primer pulso sonoro, el bucle `draw()` se detuviera indefinidamente, congelando la animación.
  2. **Bloqueo de Audio por Políticas de Autoplay:**
     * Los navegadores modernos suspenden el `AudioContext` si no existe un gesto previo del usuario en la página.
  3. **Fallas de Carga de CDN:**
     * Al abrir el archivo localmente con `file:///`, la biblioteca `p5.min.js` fallaba en resolverse vía CDN remota.
* **Soluciones Aplicadas:**
  * **Corrección de Color:** Se reescribieron todas las llamadas de estilo a argumentos puramente numéricos `stroke(r, g, b, alpha)` y `fill(r, g, b, alpha)`.
  * **Descarga Offline de p5.js:** Se descargó `p5.min.js` (1.02 MB) directamente al repositorio local, permitiendo ejecución offline inmediata y sin latencia.
  * **Pantalla de Bienvenida (Overlay de Audio):** Se añadió un modal introductorio con el botón *"INGRESAR A LA ARENA"* que ejecuta `audioCtx.resume()` y desbloquea el sintetizador de forma limpia.
  * **Autonomía Sonora:** Se calibraron las ganancias de ataque (`0.24`) y las frecuencias de corte para que los 12 distritos generaran sus ritmos y notas de manera autónoma y continua.

---

### 🔹 Hito 4: Migración a 3D, Cero Círculos y Sincronización Progresiva
* **Prompt del Usuario:**
  > *"puedes hacer que el indicador de cada distrito no sea un circulo eso es muy comun, hazle uno diferente para cada distrito, y quiero que sea 3D todo el sistema, ademas cambiale la figura para que no sea circular por que se ve muy simple, y que con el silbido los otros distritos se vayan poco a poco ordenando"*
* **Soluciones Desarrolladas:**
  1. **Motor WebGL 3D:**
     * Inicialización del lienzo en `createCanvas(windowWidth, windowHeight, WEBGL)` con iluminación tridimensional (`ambientLight`, `directionalLight`, `pointLight`) y materiales reflectantes (`specularMaterial`, `shininess`).
  2. **Coliseo Dodecagonal 3D:**
     * Sustitución del suelo circular por un dodecágono regular de 12 lados con 12 pilares monolíticos coronados por capiteles cúbicos luminosos.
  3. **Estratificación Social en el Eje Z:**
     * Los distritos se escalonaron verticalmente según su estatus en Panem: el Distrito 1 (Lujo) en la cumbre superior ($Z = +48\text{ px}$) descendiendo hasta el Distrito 12 (Minería) en la fosa subterránea ($Z = -54\text{ px}$).
  4. **Armonización Progresiva con el Silbido de Rue:**
     * El silbido de 4 notas (`Sol4 - Si♭4 - La4 - Re4`) activa un temporizador de ~9 segundos (`isWhistlingHarmonization = true`).
     * Durante este intervalo, la ecuación diferencial de Kuramoto incorpora un término atractor hacia la fase media colectiva:
       $$\Delta \theta_i \propto \sin(\psi - \theta_i)$$
     * Las frecuencias intrínsecas $\omega_i$ se reajustan hacia la media colectiva y los distritos rebeldes se reintegran gradualmente, elevando el parámetro de orden $R$ de $0.15$ a más de $0.95$ de forma visible y audible.
  5. **Navegación 3D Orbital:**
     * Integración de `orbitControl()` (arrastrar ratón para orbitar en 360°, rueda para zoom) y tres botones de acceso rápido a cámaras (*Perspectiva*, *Cenital*, *Frontal*).

---

### 🔹 Hito 5: Eliminación Total de Órbitas / Modelo "Sistema Solar"
* **Prompt del Usuario:**
  > *"Ahora no quiero que esten en orbita como en un sistema solar, diseña otra manera de organizacion, ya que se pide explicitamente que no hayan orbitan ni en el orden de los distritos ni en el indicador de cada distrito al hacer un sonido"*
* **Desafío Conceptual:**
  * La disposición circular alrededor de un centro y los aros orbitales que indicaban la fase daban la impresión de planetas girando en torno al sol.
* **Soluciones Tácticas Implementadas:**
  1. **Tablero Táctico Territorial de Panem (Cuadrícula Militar):**
     * Sustitución del coliseo circular por un mapa militar ortogonal en 3D dividido en cuadrantes geográficos.
     * Incorporación de un botón en el HUD (`🗺️ Formación`) para conmutar entre 3 disposiciones no-orbitales:
       * **Matriz 4x3 (Por Defecto):** Distribución geográfica por sectores (Costas al norte, Núcleo industrial al centro, Minas y fábricas al sur).
       * **Avenida de los Tributos (2x6):** Dos columnas monumentales de 6 bastiones flanqueando un bulevar iluminado.
       * **Ciudadela Escalonada:** Terrazas rectangulares concéntricas en zigurat.
  2. **Pistón de Levitación Vertical en Z:**
     * Se eliminó el movimiento orbital en $X/Y$ (`cos(theta), sin(theta)`). Los distritos oscilan exclusivamente de forma vertical en el eje Z como pistones acústicos guiados por $\sin(\theta_i)$.
  3. **Barra Vertical de Energía (Indicador Lineal No-Orbital):**
     * Se eliminaron el aro toroidal y la esfera orbitante. En su lugar, cada distrito cuenta con una columna prismática que se llena verticalmente de abajo hacia arriba del $0\%$ al $100\%$ conforme la fase $\theta_i$ recorre $[0, 2\pi)$.
     * Al sonar la nota, el nodo dispara un haz lineal de luz vertical hacia el cielo.
  4. **Ondas Prismáticas Angulares (`SonicPrism3D`):**
     * En reemplazo de los anillos toroidales expansivos, los pulsos sonoros emiten cajas y diamantes en alambre volumétrico que se expanden linealmente y se disuelven.

---

### 🔹 Hito 6: Placas de Identificación y Esculturas 3D Hiper-Representativas
* **Prompts del Usuario:**
  > *"agregale que tengan el nombre del distrito abajo de su figura representativa"*  
  > *"las figuras que representan a los distritos podrian ser mas representativas osea una figura que represente mas lo que hace cada distrito como si fuera el icono de antes pero 3D"*
* **Modelado Escultórico Figurativo 3D:**
  Se reemplazaron las geometrías abstractas por 12 esculturas tridimensionales detalladas y fieles a la labor de cada distrito:
  1. **D1 (Lujo):** Diamante tallado brillante con corona octagonal, faja central, pabellón afilado y destellos dorados.
  2. **D2 (Armas):** Dos espadas de combate cruzadas con hojas de doble filo biseladas, guardas, empuñaduras y pomos.
  3. **D3 (Tecnología):** Microchip procesador CPU con sustrato cerámico, placa central de silicio (IHS), 16 pines perimetrales y pulso láser de datos.
  4. **D4 (Pesca):** Tridente de Poseidón / Finnick Odair con asta cilíndrica, punta central larga y púas curvadas.
  5. **D5 (Energía):** Rayo eléctrico en zig-zag 3D con quiebres angulares y punta de descarga incandescente.
  6. **D6 (Transporte):** Locomotora de tren bala maglev aerodinámica con cabina de parabrisas tintado, faros gemelos y patines magnéticos.
  7. **D7 (Madera):** Dos hachas de leñador cruzadas (mangos de madera de fresno y cabezas de acero) clavadas en un tocón de árbol.
  8. **D8 (Textil):** Tijeras de sastre profesionales abiertas con hojas de corte, ojales para dedos y lazo de tela rosa.
  9. **D9 (Cereales):** Gavilla de espigas de trigo con granos esculpidos abrazada por una hoz curva de siega.
  10. **D10 (Ganado):** Cráneo frontal de toro Longhorn con cuencas oculares y astas masivas curvadas hacia arriba.
  11. **D11 (Agricultura):** Tallo botánico con dos hojas verdes curvadas y un fruto maduro de huerto coronando la cúspide.
  12. **D12 (Minería):** Dos picos de minero cruzados sobre un bloque de carbón de antracita con núcleo de lava ardiente.
* **Rótulos Holográficos 3D:**
  * Generación procedural mediante lienzo offscreen (`createGraphics(256, 80)`) con tipografía de alta definición.
  * Montados sobre pedestales de obsidiana inclinados ergonómicamente hacia la cámara para garantizar su lectura desde cualquier ángulo.

---

## 🧮 Fundamento Matemático: El Modelo de Kuramoto

El comportamiento colectivo del instrumento está gobernado por la ecuación diferencial clásica de **Yoshiki Kuramoto (1975)** para osciladores de fase no lineales débilmente acoplados:

$$\frac{d\theta_i}{dt} = \omega_i + \frac{K}{N} \sum_{j=1}^{N} w_{ij} \sin(\theta_j - \theta_i)$$

Donde:
* $\theta_i$: Fase instantánea del oscilador del Distrito $i$ en el intervalo $[0, 2\pi)$.
* $\omega_i$: Frecuencia natural intrínseca de oscilación sonora de cada distrito.
* $K$: Parámetro de acoplamiento global, regulado en el HUD mediante el slider **"Fuerza del Capitolio ($K$)"**.
* $w_{ij}$: Matriz de pesos espaciales calculada en función de la distancia euclidiana 3D:
  $$w_{ij} = \max\left(0, 1 - \frac{d_{ij}}{R_{\text{resonancia}}}\right)$$
* $N = 12$: Número total de Distritos de Panem.

### Parámetro de Orden Macroscópico ($R$)
El nivel de sincronización global se cuantifica mediante el vector complejo de orden:

$$R e^{i\psi} = \frac{1}{N} \sum_{j=1}^{N} e^{i\theta_j}$$

* **$R \in [0, 1]$**: Magnitud del orden.
  * $R \to 1.0$: **Hegemonía Absoluta del Capitolio**. Todas las barras verticales y pistones en Z se mueven al unísono, detonando un acorde orquestal consonante y rayo láser dorado unificado.
  * $R < 0.45$: **Rebelión / Resistencia Activa**. Los distritos vibran a frecuencias discordantes, generando polirritmias acústicas complejas, destellos rojos y brasas de fuego ascendentes.
* **$\psi$**: Fase media colectiva del sistema, representada analógicamente en la **Brújula de Fase** del HUD.

---

## 🔊 Arquitectura de Audio (Web Audio API)

El motor sónico fue desarrollado sin librerías externas de audio para asegurar latencia cero y compatibilidad web:

* **Afinación Modal en Sol Dórico (G Dorian):**
  * D12 (Minería): Sol2 ($98.0\text{ Hz}$) – Subgraves telúricos y yunque.
  * D10 (Ganado): Si♭2 ($116.5\text{ Hz}$) – Resonador cálido.
  * D8 (Textil): Do3 ($130.8\text{ Hz}$) – Pulso de telar rítmico.
  * D7 (Madera): Re3 ($146.8\text{ Hz}$) – Resonancia de madera.
  * D6 (Transporte): Fa3 ($174.6\text{ Hz}$) – Zumbido electromagnético.
  * D5 (Energía): Sol3 ($196.0\text{ Hz}$) – Pulso de plasma FM.
  * D4 (Pesca): La3 ($220.0\text{ Hz}$) – Tono acuático puro.
  * D3 (Tecnología): Si♭3 ($246.9\text{ Hz}$) – Onda triangular computarizada.
  * D2 (Armas): Do4 ($261.6\text{ Hz}$) – Impacto metálico balístico.
  * D9 (Cereales): Re4 ($293.7\text{ Hz}$) – Tono pastoral de cosecha.
  * D11 (Agricultura): Fa4 ($349.2\text{ Hz}$) – Tono orgánico de flauta.
  * D1 (Lujo): Sol4 ($392.0\text{ Hz}$) – Campana de cristal brillante con armónicos agudos.
* **Reverberación Convolutiva Procedural:** Simula la acústica monumental de la arena mediante síntesis matemática estéreo de ruido con decaimiento exponencial.
* **Melodía de Rue (Katniss Whistle):** Ejecuta las 4 notas melódicas icónicas con oscilador senoidal, LFO de vibrato natural a $5.5\text{ Hz}$ y envolvente ADSR de flauta.

---

## 🎮 Guía de Controles e Interacción

| Acción | Control | Descripción |
| :--- | :---: | :--- |
| **Rotación de Cámara 3D** | `Arrastrar Clic Izquierdo` | Rota la perspectiva espacial en 360° alrededor del mapa táctico. |
| **Zoom 3D** | `Rueda del Ratón` | Acerca o aleja la cámara para inspeccionar los detalles de cada escultura. |
| **Silbido del Sinsajo (Rue)** | `[Barra Espaciadora]` o botón HUD | Toca las 4 notas y activa la armonización progresiva ($R \to 0.95+$). |
| **Alternar Formación** | Botón `🗺️ Formación` | Conmuta entre **Matriz 4x3**, **Avenida de los Tributos** y **Zigurat**. |
| **Pulso del Capitolio** | Tecla `[C]` o botón HUD | Dispara un golpe instantáneo forzando resonancia de fase unificada. |
| **Caos Táctico** | Botón `💥 Caos Táctico` | Perturba y dispersa aleatoriamente las fases de todos los osciladores. |
| **Rebelión Total** | Botón `🔥 Rebelión Total` | Aísla a todos los distritos, acelerando su frecuencia y desatando llamas. |
| **Presets de Cámara** | Botones `Perspectiva` / `Cenital` / `Frontal` | Cambia al instante el ángulo de cámara a vistas preconfiguradas. |

---

## 📁 Estructura del Directorio

```
trabajo/
├── index.html         # Aplicación principal WebGL 3D autocontenida
├── p5.min.js          # Librería p5.js local offline (1.02 MB)
├── README.md          # Bitácora técnica y documentación completa
├── audio.js           # Módulo complementario de Web Audio API
├── kuramoto.js        # Módulo complementario de dinámica de osciladores
├── visual.js          # Módulo complementario de renderizado
├── main.js            # Módulo orquestador
├── style.css          # Estilos del HUD y diseño cinematográfico
└── assets/            # Capturas de pantalla y evidencias del proyecto
    ├── 01_version_inicial_2d.png
    ├── 02_matriz_tactica_3d.png
    ├── 03_avenida_cenital_3d.png
    ├── 04_avenida_frontal_3d.png
    └── 05_rebelion_caos_3d.png
```

---

## 🚀 Cómo Ejecutar el Proyecto

1. Clona o descarga el repositorio en tu máquina local.
2. Abre directamente el archivo **`index.html`** con doble clic en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
3. Haz clic en el botón **"INGRESAR A LA MATRIZ 3D"** para inicializar el motor de audio y gráficos.
4. Presiona la **Barra Espaciadora** para activar el Silbido de Rue y disfrutar de la armonización en tiempo real.
