
import { v4 as uuidv4 } from 'uuid';

// Tipos básicos para el guión
export interface ScriptMessage {
  id: string;
  content: string;
  isAI: boolean;
  isHighlighted?: boolean;
}

export interface ConversationScript {
  id: string;
  title: string;
  description: string;
  messages: ScriptMessage[];
  summary: string;
}

// Guiones predefinidos para diferentes tipos de reuniones
const scripts: ConversationScript[] = [
  {
    id: 'sprint-planning',
    title: 'Planificación de Sprint',
    description: 'Guión para una reunión de planificación de sprint ágil',
    messages: [
      {
        id: uuidv4(),
        content: "Bienvenidos al sprint planning. ¿Qué objetivos tenemos para este sprint?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Debemos finalizar el módulo de autenticación y comenzar con el dashboard de analíticas.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Cuántos puntos de historia estimamos para el módulo de autenticación?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Según nuestras estimaciones previas, el módulo de autenticación debería ser de 8 puntos de historia.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Y para el dashboard de analíticas?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "El dashboard de analíticas es más complejo, estimamos 13 puntos de historia.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Qué dependencias tenemos para estas tareas?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Para el dashboard necesitamos que la API de reportes esté lista, que está siendo trabajada por el equipo de backend.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Hay algún riesgo que debamos considerar?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "El principal riesgo es la integración con el nuevo proveedor de autenticación, podría requerir ajustes adicionales.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "Creame un resumen de lo que hablamos",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "He creado un resumen de la reunión con los puntos clave discutidos: objetivos del sprint, estimaciones de tareas, dependencias identificadas y riesgos potenciales.",
        isAI: true
      }
    ],
    summary: `# Resumen de Planificación de Sprint

## Objetivos del sprint
- Finalizar el módulo de autenticación
- Comenzar con el dashboard de analíticas

## Estimaciones
- Módulo de autenticación: 8 puntos de historia
- Dashboard de analíticas: 13 puntos de historia

## Dependencias identificadas
- La API de reportes del equipo de backend es necesaria para el dashboard

## Riesgos potenciales
- Integración con el nuevo proveedor de autenticación podría requerir ajustes adicionales

## Próximos pasos
- Asignar tareas específicas a los miembros del equipo
- Configurar el seguimiento del sprint en Jira
- Programar la reunión de revisión para dentro de dos semanas`
  },
  {
    id: 'design-review',
    title: 'Revisión de Diseño',
    description: 'Guión para una reunión de revisión de diseño de producto',
    messages: [
      {
        id: uuidv4(),
        content: "Vamos a revisar los nuevos diseños de la interfaz de usuario. ¿Podemos ver los mockups?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "He preparado los mockups para la nueva sección de perfil de usuario y configuración de cuenta.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "Los colores parecen diferentes a nuestra guía de estilo. ¿Podemos aclarar esto?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Tienes razón. Hemos actualizado la paleta de colores para mejorar el contraste y la accesibilidad según las directrices WCAG 2.1.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Cómo afecta esto a nuestra consistencia visual en todas las plataformas?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Hemos documentado la nueva paleta en Figma y creado componentes actualizados para web y móvil, garantizando consistencia en todas las plataformas.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Hemos realizado pruebas de usabilidad con los nuevos diseños?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Sí, realizamos pruebas con 8 usuarios y los resultados fueron positivos. La tasa de completado de tareas mejoró un 23% con el nuevo diseño.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "Creame un resumen de lo que hablamos",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "He elaborado un resumen detallado de nuestra revisión de diseño, incluyendo los cambios en la paleta de colores, las mejoras de accesibilidad, la documentación en Figma y los resultados de las pruebas de usabilidad.",
        isAI: true
      }
    ],
    summary: `# Resumen de Revisión de Diseño

## Mockups revisados
- Nueva sección de perfil de usuario
- Configuración de cuenta

## Cambios en la paleta de colores
- Actualizada para mejorar contraste
- Cumple con directrices de accesibilidad WCAG 2.1

## Documentación y consistencia
- Nueva paleta documentada en Figma
- Componentes actualizados para web y móvil
- Garantiza consistencia visual en todas las plataformas

## Pruebas de usabilidad
- Realizadas con 8 usuarios
- La tasa de completado de tareas mejoró un 23%
- Resultados generales positivos

## Próximos pasos
- Implementar los cambios en el sistema de diseño
- Actualizar la guía de estilo
- Programar capacitación para el equipo de desarrollo`
  },
  {
    id: 'project-status',
    title: 'Estado del Proyecto',
    description: 'Guión para una reunión de seguimiento del estado del proyecto',
    messages: [
      {
        id: uuidv4(),
        content: "Hagamos un repaso del estado actual del proyecto. ¿Cómo vamos con los tiempos de entrega?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Actualmente estamos un 15% adelantados en el cronograma para el desarrollo de backend, pero el frontend tiene un retraso del 8% debido a cambios en los requisitos.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Cuáles son los principales problemas que estamos enfrentando?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "El principal desafío es la integración con el sistema de pagos de terceros. Su API ha cambiado y necesitamos adaptar nuestro código.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Necesitamos recursos adicionales para cumplir con la fecha de entrega?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Recomendaría asignar un desarrollador más al equipo de frontend por las próximas dos semanas para compensar el retraso y mantener la fecha de entrega original.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "¿Cómo está el presupuesto del proyecto hasta ahora?",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "Estamos dentro del presupuesto, con un 62% utilizado y un 65% del proyecto completado, lo que nos da un ligero margen positivo.",
        isAI: true
      },
      {
        id: uuidv4(),
        content: "Creame un resumen de lo que hablamos",
        isAI: false,
        isHighlighted: true
      },
      {
        id: uuidv4(),
        content: "He preparado un resumen completo del estado del proyecto, incluyendo progreso, desafíos actuales, necesidades de recursos y situación presupuestaria.",
        isAI: true
      }
    ],
    summary: `# Resumen de Estado del Proyecto

## Progreso actual
- Backend: 15% adelantado en cronograma
- Frontend: 8% de retraso debido a cambios en requisitos
- Completado general: 65% del proyecto

## Desafíos principales
- Integración con sistema de pagos de terceros
- Cambios en la API externa requieren adaptación de código

## Recursos y recomendaciones
- Se recomienda asignar un desarrollador adicional al equipo frontend
- Periodo: próximas dos semanas
- Objetivo: compensar retraso y mantener fecha de entrega

## Estado del presupuesto
- 62% del presupuesto utilizado con 65% del proyecto completado
- Margen positivo en términos financieros
- Presupuesto dentro de lo planificado

## Próximos hitos
- Finalización de la integración de pagos: 2 semanas
- Entrega de versión beta para pruebas: 3 semanas
- Lanzamiento previsto: según cronograma original`
  }
];

class ScriptService {
  private activeScript: ConversationScript | null = null;
  private currentMessageIndex: number = 0;
  private scriptMessages: ScriptMessage[] = [];

  constructor() {
    // Inicializar con mensajes vacíos
    this.resetScript();
  }

  // Obtener todos los guiones disponibles
  getAllScripts(): ConversationScript[] {
    return scripts;
  }

  // Activar un guión específico por su ID
  activateScript(scriptId: string): boolean {
    const script = scripts.find(s => s.id === scriptId);
    if (!script) return false;

    this.activeScript = script;
    this.currentMessageIndex = 0;
    this.scriptMessages = [...script.messages];
    return true;
  }

  // Obtener el siguiente mensaje sugerido para el usuario
  getNextUserMessage(): ScriptMessage | null {
    if (!this.activeScript) return null;

    // Buscar el próximo mensaje destacado del usuario
    for (let i = this.currentMessageIndex; i < this.scriptMessages.length; i++) {
      const message = this.scriptMessages[i];
      if (!message.isAI && message.isHighlighted) {
        return message;
      }
    }
    return null;
  }

  // Procesar un mensaje enviado por el usuario y devolver la respuesta automática
  processUserMessage(content: string): ScriptMessage | null {
    if (!this.activeScript) return null;

    // Avanzar el índice actual
    let aiResponseIndex = -1;
    
    // Buscar el próximo mensaje destacado y su respuesta
    for (let i = this.currentMessageIndex; i < this.scriptMessages.length; i++) {
      const message = this.scriptMessages[i];
      
      if (!message.isAI && message.isHighlighted) {
        // Si encontramos un mensaje destacado de usuario, verificar si coincide con el contenido
        if (message.content.toLowerCase() === content.toLowerCase()) {
          // Buscar la respuesta de la IA (próximo mensaje de IA)
          for (let j = i + 1; j < this.scriptMessages.length; j++) {
            if (this.scriptMessages[j].isAI) {
              aiResponseIndex = j;
              this.currentMessageIndex = j + 1;
              break;
            }
          }
          break;
        }
      }
    }

    if (aiResponseIndex !== -1) {
      return this.scriptMessages[aiResponseIndex];
    }
    
    return null;
  }

  // Verificar si el último mensaje sugiere generar un resumen
  shouldGenerateSummary(lastMessage: string): boolean {
    return lastMessage.toLowerCase().includes('resumen de lo que hablamos');
  }

  // Obtener el resumen predefinido del guión actual
  getScriptSummary(): string {
    return this.activeScript?.summary || '';
  }

  // Obtener el título del guión activo
  getActiveScriptTitle(): string {
    return this.activeScript?.title || 'Reunión sin título';
  }

  // Reiniciar el estado del guión
  resetScript(): void {
    this.activeScript = null;
    this.currentMessageIndex = 0;
    this.scriptMessages = [];
  }

  // Verificar si hay un guión activo
  hasActiveScript(): boolean {
    return this.activeScript !== null;
  }
}

// Exportamos instancia singleton
export const scriptService = new ScriptService();
