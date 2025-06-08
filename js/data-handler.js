// Manejador de datos para el survey de moralidad bayesiana

class DataHandler {
    constructor() {
        this.data = [];
        this.participantData = {
            prolific_pid: this.getUrlParameter('PROLIFIC_PID'),
            study_id: this.getUrlParameter('STUDY_ID'),
            session_id: this.getUrlParameter('SESSION_ID'),
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_width: screen.width,
            screen_height: screen.height
        };
    }

    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) || 'not_provided';
    }

    addTrialData(trialData) {
        const enrichedData = {
            ...trialData,
            ...this.participantData,
            trial_timestamp: new Date().toISOString()
        };
        this.data.push(enrichedData);
    }

    // Guardar datos localmente (backup)
    saveToLocalStorage() {
        try {
            localStorage.setItem('bayesian_morality_data', JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Recuperar datos del localStorage
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('bayesian_morality_data');
            if (stored) {
                this.data = JSON.parse(stored);
                return true;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return false;
    }

    // Enviar datos al servidor (implementar según tu backend)
    async sendToServer(endpoint = '/api/save-data') {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    participant: this.participantData,
                    trials: this.data
                })
            });

            if (response.ok) {
                console.log('Data sent successfully');
                return true;
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending data to server:', error);
            // Guardar localmente como backup
            this.saveToLocalStorage();
            return false;
        }
    }

    // Exportar datos como CSV para análisis
    exportToCSV() {
        if (this.data.length === 0) return '';

        const headers = Object.keys(this.data[0]);
        const csvContent = [
            headers.join(','),
            ...this.data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escapar comillas y envolver en comillas si contiene comas
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        return csvContent;
    }

    // Descargar datos como archivo CSV
    downloadCSV(filename = 'bayesian_morality_data.csv') {
        const csvContent = this.exportToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Procesar datos para análisis bayesiano
    processForAnalysis() {
        const processed = {
            demographics: {},
            scenarios: {},
            summary: {
                total_trials: this.data.length,
                completion_time: null,
                participant_id: this.participantData.prolific_pid
            }
        };

        // Extraer datos demográficos
        const demoTrial = this.data.find(trial => trial.trial_type === 'survey-html-form');
        if (demoTrial && demoTrial.response) {
            processed.demographics = demoTrial.response;
        }

        // Procesar datos de escenarios
        this.data.forEach(trial => {
            if (trial.scenario_id) {
                if (!processed.scenarios[trial.scenario_id]) {
                    processed.scenarios[trial.scenario_id] = {};
                }
                
                const key = `${trial.question_type}_${trial.question_index}`;
                processed.scenarios[trial.scenario_id][key] = trial.response;
            }
        });

        // Calcular tiempo de completado
        const timestamps = this.data.map(trial => new Date(trial.trial_timestamp));
        if (timestamps.length > 0) {
            const start = Math.min(...timestamps);
            const end = Math.max(...timestamps);
            processed.summary.completion_time = end - start;
        }

        return processed;
    }

    // Validar datos antes del envío
    validateData() {
        const errors = [];

        // Verificar que tenemos datos
        if (this.data.length === 0) {
            errors.push('No trial data found');
        }

        // Verificar datos demográficos
        const demoTrial = this.data.find(trial => trial.trial_type === 'survey-html-form');
        if (!demoTrial) {
            errors.push('No demographic data found');
        }

        // Verificar que todos los escenarios tienen respuestas
        const scenarioIds = ['trolley_uncertainty', 'causal_uncertainty', 'intent_inference', 'outcome_probability'];
        scenarioIds.forEach(id => {
            const scenarioTrials = this.data.filter(trial => trial.scenario_id === id);
            if (scenarioTrials.length === 0) {
                errors.push(`No data for scenario: ${id}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Obtener estadísticas de progreso
    getProgress() {
        const totalExpectedTrials = 20; // Aproximado
        const completedTrials = this.data.length;
        return {
            completed: completedTrials,
            total: totalExpectedTrials,
            percentage: Math.min(100, (completedTrials / totalExpectedTrials) * 100)
        };
    }
}

// Instancia global del manejador de datos
const dataHandler = new DataHandler();

// Función para integrar con jsPsych
function setupJsPsychDataCollection(jsPsych) {
    jsPsych.data.addProperties(dataHandler.participantData);
    
    // Guardar después de cada trial
    jsPsych.on('trial-finish', function(data) {
        dataHandler.addTrialData(data);
        dataHandler.saveToLocalStorage(); // Backup continuo
    });

    // Enviar datos al finalizar
    jsPsych.on('experiment-finish', function() {
        const validation = dataHandler.validateData();
        if (validation.isValid) {
            dataHandler.sendToServer();
        } else {
            console.error('Data validation failed:', validation.errors);
            // Aún así guardamos localmente
            dataHandler.saveToLocalStorage();
        }
    });
}

// Exportar para uso en el experimento principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataHandler, dataHandler, setupJsPsychDataCollection };
}

// Para uso directo en el navegador
window.DataHandler = DataHandler;
window.dataHandler = dataHandler;
window.setupJsPsychDataCollection = setupJsPsychDataCollection;