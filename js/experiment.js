// Experimento de Moralidad Bayesiana inspirado en Tenenbaum, Cushman, Ullman

// Obtener parámetros de URL para Prolific
const urlParams = new URLSearchParams(window.location.search);
const prolificPID = urlParams.get('PROLIFIC_PID') || 'no_id';
const studyID = urlParams.get('STUDY_ID') || 'no_study';
const sessionID = urlParams.get('SESSION_ID') || 'no_session';

// Inicializar jsPsych
const jsPsych = initJsPsych({
    display_element: 'jspsych-target',
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function(data) {
        // Redirigir a Prolific al completar
        if (prolificPID !== 'no_id') {
            window.location = `https://app.prolific.co/submissions/complete?cc=CJXZ6K4V`;
        }
    }
});

// Escenarios de moralidad bayesiana basados en la literatura
const scenarios = [
    {
        id: 'trolley_uncertainty',
        title: 'El Problema del Tranvía con Incertidumbre',
        text: `Juan ve un tranvía fuera de control dirigiéndose hacia cinco personas en las vías. 
        Puede tirar de una palanca que desvíe el tranvía a una vía lateral donde hay una persona. 
        Sin embargo, Juan no está completamente seguro de cuántas personas hay en cada vía:
        
        • Vía principal: Probablemente 5 personas (90% seguro)
        • Vía lateral: Probablemente 1 persona (70% seguro)
        
        Juan tiene que decidir rápidamente si tirar de la palanca.`,
        questions: [
            {
                type: 'moral_judgment',
                prompt: '¿Qué tan moralmente aceptable es que Juan tire de la palanca?',
                scale: ['Completamente inaceptable', 'Muy inaceptable', 'Algo inaceptable', 'Neutral', 'Algo aceptable', 'Muy aceptable', 'Completamente aceptable']
            },
            {
                type: 'probability_judgment',
                prompt: '¿Cuál es la probabilidad de que la acción de Juan sea moralmente correcta?',
                min: 0,
                max: 100,
                step: 1
            },
            {
                type: 'confidence',
                prompt: '¿Qué tan confiado estás en tu juicio moral?',
                scale: ['Nada confiado', 'Poco confiado', 'Algo confiado', 'Bastante confiado', 'Muy confiado']
            }
        ]
    },
    {
        id: 'causal_uncertainty',
        title: 'Responsabilidad Causal Incierta',
        text: `María es doctora en un hospital. Un paciente llega en estado crítico y necesita un 
        medicamento específico inmediatamente. María tiene dos opciones:
        
        • Medicamento A: 80% de probabilidad de curar al paciente, 5% de efectos secundarios graves
        • Medicamento B: 60% de probabilidad de curar al paciente, 1% de efectos secundarios graves
        
        María elige el Medicamento A. Desafortunadamente, el paciente desarrolla efectos secundarios graves.
        Más tarde se descubre que había un factor genético raro (presente en 2% de la población) 
        que María no conocía y que aumentaba el riesgo de efectos secundarios.`,
        questions: [
            {
                type: 'moral_judgment',
                prompt: '¿Qué tan moralmente responsable es María por los efectos secundarios?',
                scale: ['No responsable', 'Ligeramente responsable', 'Algo responsable', 'Moderadamente responsable', 'Muy responsable', 'Completamente responsable']
            },
            {
                type: 'probability_judgment',
                prompt: '¿Cuál es la probabilidad de que María haya actuado éticamente?',
                min: 0,
                max: 100,
                step: 1
            },
            {
                type: 'causal_judgment',
                prompt: '¿En qué medida fue María la causa de los efectos secundarios?',
                scale: ['No fue causa', 'Causa mínima', 'Causa menor', 'Causa moderada', 'Causa mayor', 'Causa principal', 'Única causa']
            }
        ]
    },
    {
        id: 'intent_inference',
        title: 'Inferencia de Intención',
        text: `Carlos trabaja en una empresa de tecnología. Descubre que el software que está desarrollando 
        podría usarse para vigilancia masiva si cae en manos equivocadas. Carlos tiene información limitada:
        
        • 30% de probabilidad de que la empresa venda el software a gobiernos autoritarios
        • 70% de probabilidad de que se use solo para seguridad legítima
        • Carlos podría filtrar información para alertar al público, arriesgando su trabajo
        • Si no actúa y el software se usa mal, miles podrían verse afectados
        
        Carlos decide no filtrar la información y continuar con el proyecto.`,
        questions: [
            {
                type: 'moral_judgment',
                prompt: '¿Qué tan moralmente aceptable es la decisión de Carlos?',
                scale: ['Completamente inaceptable', 'Muy inaceptable', 'Algo inaceptable', 'Neutral', 'Algo aceptable', 'Muy aceptable', 'Completamente aceptable']
            },
            {
                type: 'intent_judgment',
                prompt: '¿Cuál crees que fue la principal intención de Carlos?',
                options: ['Proteger su trabajo', 'Evitar causar pánico innecesario', 'Confiar en su empresa', 'No querer responsabilizarse', 'Otra razón']
            },
            {
                type: 'probability_judgment',
                prompt: 'Si el software se usa para vigilancia masiva, ¿cuál es la probabilidad de que Carlos sea moralmente culpable?',
                min: 0,
                max: 100,
                step: 1
            }
        ]
    },
    {
        id: 'outcome_probability',
        title: 'Probabilidades de Resultados Morales',
        text: `Elena es directora de una ONG de ayuda humanitaria. Debe decidir cómo distribuir fondos limitados:
        
        Opción A: Programa de vacunación
        • 90% probabilidad de salvar 100 vidas
        • 10% probabilidad de fallo del programa (0 vidas salvadas)
        
        Opción B: Programa de agua potable  
        • 100% probabilidad de salvar 80 vidas
        • Sin riesgo de fallo
        
        Elena elige la Opción A, pero el programa falla y no se salva ninguna vida.`,
        questions: [
            {
                type: 'moral_judgment',
                prompt: '¿Qué tan moralmente correcta fue la decisión original de Elena?',
                scale: ['Muy incorrecta', 'Incorrecta', 'Algo incorrecta', 'Neutral', 'Algo correcta', 'Correcta', 'Muy correcta']
            },
            {
                type: 'probability_judgment',
                prompt: 'Antes de saber el resultado, ¿cuál era la probabilidad de que Elena tomara la decisión moralmente correcta?',
                min: 0,
                max: 100,
                step: 1
            },
            {
                type: 'outcome_dependence',
                prompt: '¿Cambia tu evaluación moral sabiendo que el programa falló?',
                scale: ['Mucho peor', 'Algo peor', 'Ligeramente peor', 'No cambia', 'Ligeramente mejor', 'Algo mejor', 'Mucho mejor']
            }
        ]
    }
];

// Preguntas demográficas
const demographics = {
    type: jsPsychSurveyHtmlForm,
    preamble: '<h3>Información Demográfica</h3><p>Por favor, proporciona la siguiente información:</p>',
    html: `
        <p>Edad: <input type="number" name="age" min="18" max="100" required></p>
        <p>Género: 
            <select name="gender" required>
                <option value="">Selecciona...</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="non-binary">No binario</option>
                <option value="prefer-not">Prefiero no responder</option>
            </select>
        </p>
        <p>Nivel de educación:
            <select name="education" required>
                <option value="">Selecciona...</option>
                <option value="high-school">Secundaria</option>
                <option value="bachelors">Licenciatura</option>
                <option value="masters">Maestría</option>
                <option value="phd">Doctorado</option>
                <option value="other">Otro</option>
            </select>
        </p>
        <p>¿Has estudiado filosofía o ética? 
            <select name="philosophy_background" required>
                <option value="">Selecciona...</option>
                <option value="none">No</option>
                <option value="some">Algo (cursos introductorios)</option>
                <option value="moderate">Moderado (varios cursos)</option>
                <option value="extensive">Extenso (especialización)</option>
            </select>
        </p>
    `
};

// Instrucciones
const instructions = {
    type: jsPsychInstructions,
    pages: [
        `<h2>Bienvenido al Estudio sobre Moralidad Bayesiana</h2>
         <p>En este estudio exploraremos cómo las personas hacen juicios morales en situaciones de incertidumbre.</p>
         <p>Leerás varios escenarios y responderás preguntas sobre ellos.</p>
         <p>No hay respuestas correctas o incorrectas. Nos interesa tu opinión sincera.</p>`,
        
        `<h3>Instrucciones</h3>
         <ul>
         <li>Lee cada escenario cuidadosamente</li>
         <li>Responde basándote en tu primera impresión</li>
         <li>Algunas preguntas te pedirán estimar probabilidades (0-100%)</li>
         <li>Otras te pedirán evaluar en escalas</li>
         <li>El estudio toma aproximadamente 15-20 minutos</li>
         </ul>`,
         
        `<h3>Confidencialidad</h3>
         <p>Todas tus respuestas son completamente anónimas.</p>
         <p>Los datos se usarán únicamente para investigación académica.</p>
         <p>Puedes abandonar el estudio en cualquier momento.</p>
         <p><strong>Haz clic en "Siguiente" para comenzar.</strong></p>`
    ],
    show_clickable_nav: true,
    button_label_next: 'Siguiente',
    button_label_previous: 'Anterior'
};

// Función para crear trials de escenarios
function createScenarioTrial(scenario) {
    const trials = [];
    
    // Mostrar el escenario
    trials.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <div class="scenario-text fade-in">
                <h3>${scenario.title}</h3>
                <p>${scenario.text}</p>
            </div>
            <p><em>Presiona ESPACIO para continuar</em></p>
        `,
        choices: [' '],
        data: {
            scenario_id: scenario.id,
            phase: 'presentation'
        }
    });
    
    // Crear preguntas para el escenario
    scenario.questions.forEach((question, index) => {
        if (question.type === 'moral_judgment' || question.type === 'confidence' || question.type === 'causal_judgment' || question.type === 'outcome_dependence') {
            trials.push({
                type: jsPsychSurveyLikert,
                questions: [
                    {
                        prompt: `<div class="question-title">${question.prompt}</div>`,
                        labels: question.scale,
                        required: true
                    }
                ],
                data: {
                    scenario_id: scenario.id,
                    question_type: question.type,
                    question_index: index
                }
            });
        } else if (question.type === 'probability_judgment') {
            trials.push({
                type: jsPsychSurveyHtmlForm,
                preamble: `<div class="question-title">${question.prompt}</div>`,
                html: `
                    <div class="probability-scale">
                        <input type="range" name="probability" min="${question.min}" max="${question.max}" 
                               step="${question.step}" value="50" id="prob-slider" required>
                        <div class="scale-labels">
                            <span>0% (Imposible)</span>
                            <span id="slider-value">50%</span>
                            <span>100% (Seguro)</span>
                        </div>
                    </div>
                    <script>
                        document.getElementById('prob-slider').oninput = function() {
                            document.getElementById('slider-value').innerHTML = this.value + '%';
                        }
                    </script>
                `,
                data: {
                    scenario_id: scenario.id,
                    question_type: question.type,
                    question_index: index
                }
            });
        } else if (question.type === 'intent_judgment') {
            trials.push({
                type: jsPsychSurveyMultiChoice,
                questions: [
                    {
                        prompt: `<div class="question-title">${question.prompt}</div>`,
                        options: question.options,
                        required: true
                    }
                ],
                data: {
                    scenario_id: scenario.id,
                    question_type: question.type,
                    question_index: index
                }
            });
        }
    });
    
    return trials;
}

// Construir la línea temporal del experimento
let timeline = [];

// Agregar instrucciones
timeline.push(instructions);

// Agregar datos demográficos
timeline.push(demographics);

// Randomizar orden de escenarios
const shuffledScenarios = jsPsych.randomization.shuffle(scenarios);

// Agregar cada escenario
shuffledScenarios.forEach(scenario => {
    timeline = timeline.concat(createScenarioTrial(scenario));
});

// Pantalla de finalización
const debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <h2>¡Gracias por participar!</h2>
        <p>Has completado el estudio sobre moralidad bayesiana.</p>
        <p>Tus respuestas han sido guardadas y son completamente anónimas.</p>
        <p>Si tienes preguntas sobre este estudio, puedes contactar al investigador principal.</p>
        <p><strong>Presiona cualquier tecla para finalizar</strong></p>
    `,
    choices: "ALL_KEYS",
    data: {
        phase: 'debrief',
        prolific_pid: prolificPID,
        study_id: studyID,
        session_id: sessionID
    }
};

timeline.push(debrief);

// Configurar recolección de datos
if (typeof setupJsPsychDataCollection === 'function') {
    setupJsPsychDataCollection(jsPsych);
}

// Ejecutar el experimento
jsPsych.run(timeline);