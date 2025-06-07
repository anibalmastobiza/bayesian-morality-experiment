# Survey de Moralidad Bayesiana

Este proyecto implementa un survey online para estudiar juicios morales bajo incertidumbre, inspirado en la investigación de Tenenbaum, Cushman, y Ullman sobre cognición moral bayesiana.

## Características

- **Framework**: jsPsych 7.3.1 para experimentos psicológicos
- **Escenarios**: 4 escenarios de moralidad bayesiana con diferentes tipos de incertidumbre
- **Medidas**: Juicios morales, estimaciones de probabilidad, confianza, inferencia causal
- **Integración**: Configurado para Prolific con tracking de participantes
- **Responsive**: Diseño adaptativo para desktop y móvil

## Estructura del Proyecto

```
bayesian-morality-survey/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   └── experiment.js       # Lógica del experimento
├── data/
│   └── data-handler.js     # Manejo y almacenamiento de datos
├── stimuli/                # Material de estímulos (futuro)
└── README.md               # Este archivo
```

## Escenarios Implementados

### 1. El Problema del Tranvía con Incertidumbre
- Decisión moral bajo incertidumbre sobre el número de víctimas
- Mide: juicio moral, probabilidad de corrección, confianza

### 2. Responsabilidad Causal Incierta
- Escenario médico con información genética desconocida
- Mide: responsabilidad moral, juicio ético, atribución causal

### 3. Inferencia de Intención
- Dilema ético en desarrollo de tecnología
- Mide: aceptabilidad moral, inferencia de intención, culpabilidad probabilística

### 4. Probabilidades de Resultados Morales
- Decisión humanitaria con diferentes perfiles de riesgo
- Mide: corrección moral, dependencia del resultado, evaluación retrospectiva

## Configuración para Prolific

El survey está configurado para recibir parámetros de Prolific:

- `PROLIFIC_PID`: ID del participante
- `STUDY_ID`: ID del estudio  
- `SESSION_ID`: ID de la sesión

### URL de ejemplo:
```
https://tu-usuario.github.io/bayesian-morality-survey/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
```

## Despliegue en GitHub Pages

1. Sube el código a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona "Deploy from branch: main"
4. Tu survey estará disponible en: `https://tu-usuario.github.io/nombre-repositorio`

## Configuración en Prolific

1. **Tipo de estudio**: External study
2. **URL del estudio**: Tu URL de GitHub Pages con parámetros
3. **Código de finalización**: Configura un código personalizado
4. **Duración estimada**: 15-20 minutos
5. **Compensación**: Basada en tiempo estimado

## Recolección de Datos

Los datos se recolectan en formato JSON y incluyen:

- Información demográfica
- Respuestas a cada escenario
- Metadatos de sesión (timestamps, user agent, etc.)
- IDs de Prolific para matching

### Formato de datos:
```javascript
{
  "participant": {
    "prolific_pid": "xxx",
    "study_id": "xxx", 
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "trials": [
    {
      "scenario_id": "trolley_uncertainty",
      "question_type": "moral_judgment",
      "response": 4,
      "rt": 2500
    }
  ]
}
```

## Personalización

### Agregar nuevos escenarios:
1. Añade el escenario al array `scenarios` en `experiment.js`
2. Define las preguntas con sus tipos correspondientes
3. El sistema generará automáticamente los trials

### Modificar escalas:
Las escalas Likert se pueden personalizar en cada pregunta del escenario.

### Cambiar estilos:
Modifica `css/styles.css` para personalizar la apariencia.

## Consideraciones Éticas

- Consentimiento informado incluido en las instrucciones
- Datos completamente anónimos
- Opción de abandono en cualquier momento
- Información de contacto del investigador

## Análisis de Datos

El archivo incluye funciones para:
- Validación de datos
- Exportación a CSV
- Procesamiento para análisis bayesiano
- Cálculo de estadísticas descriptivas

## Soporte

Para preguntas sobre implementación técnica o modificaciones, consulta la documentación de jsPsych: https://www.jspsych.org/

## Licencia

Este proyecto es para uso académico. Cita apropiadamente si usas este código en tu investigación.

## Referencias

- Cushman, F. (2020). Rationalization is rational. Behavioral and Brain Sciences, 43.
- Gerstenberg, T., & Tenenbaum, J. B. (2017). Intuitive theories. Oxford handbook of causal reasoning.
- Ullman, T. D., et al. (2017). Mind games: Game engines as an architecture for intuitive physics. Trends in cognitive sciences.