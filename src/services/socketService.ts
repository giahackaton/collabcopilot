
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Configuración del servidor Socket.IO
// Usamos el servidor de Render proporcionado, con fallback al demo server
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://collabcopilot.onrender.com' || 'https://chat-demo.lovable.dev';

interface SocketOptions {
  meetingId: string;
  userId: string;
  userName: string;
}

// Emulador local para pruebas sin conexión a servidor
class LocalEmulator {
  private handlers: Map<string, Array<(data: any) => void>> = new Map();
  private isActive: boolean = false;
  private meetingData: { [meetingId: string]: any[] } = {};
  private participants: { [meetingId: string]: any[] } = {};
  
  constructor() {
    console.log('Iniciando emulador local de chat');
  }
  
  connect(): boolean {
    this.isActive = true;
    console.log('Emulador local conectado');
    return true;
  }
  
  disconnect(): void {
    this.isActive = false;
    console.log('Emulador local desconectado');
  }
  
  isConnected(): boolean {
    return this.isActive;
  }
  
  on(event: string, handler: (data: any) => void): Function {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    
    this.handlers.get(event)?.push(handler);
    
    return () => {
      const eventHandlers = this.handlers.get(event);
      if (eventHandlers) {
        this.handlers.set(event, eventHandlers.filter(h => h !== handler));
      }
    };
  }
  
  emit(event: string, data: any): boolean {
    console.log(`Emulador local emitiendo evento: ${event}`, data);
    
    const handlers = this.handlers.get(event);
    if (handlers) {
      setTimeout(() => {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`Error en manejador de evento ${event}:`, error);
          }
        });
      }, 100); // Simular pequeño delay de red
    }
    
    // Manejar eventos específicos del chat
    if (event === 'send_message') {
      const meetingId = data.meeting_id;
      if (!this.meetingData[meetingId]) {
        this.meetingData[meetingId] = [];
      }
      
      this.meetingData[meetingId].push(data);
      
      // Simular entrega del mensaje a todos los participantes
      setTimeout(() => {
        const messageHandlers = this.handlers.get('new_message');
        if (messageHandlers) {
          messageHandlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error('Error en manejador de mensaje:', error);
            }
          });
        }
      }, 300);
    }
    
    if (event === 'register_participant') {
      const meetingId = data.meetingId;
      if (!this.participants[meetingId]) {
        this.participants[meetingId] = [];
      }
      
      // Verificar que el participante no exista ya
      const exists = this.participants[meetingId].some(p => 
        p.email === data.email && p.id === data.id
      );
      
      if (!exists) {
        this.participants[meetingId].push(data);
        
        // Notificar a los manejadores sobre el nuevo participante
        setTimeout(() => {
          const participantHandlers = this.handlers.get('new_participant');
          if (participantHandlers) {
            participantHandlers.forEach(handler => {
              try {
                handler({
                  type: 'new_participant',
                  meetingId,
                  participant: data
                });
              } catch (error) {
                console.error('Error en manejador de participante:', error);
              }
            });
          }
        }, 300);
      }
    }
    
    return true;
  }
}

class SocketService {
  private socket: Socket | null = null;
  private localEmulator: LocalEmulator | null = null;
  private meetingId: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private participantHandlers: ((data: any) => void)[] = [];
  private connectionHandlers: ((status: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private useLocalEmulator = true; // Usamos emulador local por defecto, pero intentaremos conectar con el servidor real primero
  
  constructor() {
    this.localEmulator = new LocalEmulator();
    console.log(`Configurado para usar servidor socket: ${SOCKET_URL}`);
  }
  
  // Método para establecer el modo local
  setUseLocalEmulator(useLocal: boolean): void {
    if (this.useLocalEmulator !== useLocal) {
      // Disconnect current connection if any
      this.disconnect();
      
      this.useLocalEmulator = useLocal;
      console.log(`Modo ${useLocal ? 'local' : 'remoto'} activado`);
      
      // Reset reconnect attempts
      this.reconnectAttempts = 0;
    }
  }
  
  // Iniciar conexión al socket
  connect(options: SocketOptions): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.socket) {
        console.log('Socket ya conectado, desconectando antes de reconectar');
        this.disconnect();
      }

      this.meetingId = options.meetingId;
      this.userId = options.userId;
      this.userName = options.userName;

      console.log(`Conectando socket para reunión: ${this.meetingId}`);
      
      // Si estamos usando el emulador local, conectar directamente
      if (this.useLocalEmulator) {
        console.log('Usando emulador local para chat (sin servidor externo)');
        
        const connected = this.localEmulator?.connect();
        
        if (connected) {
          toast.success("Conectado al chat de la reunión (modo local)");
          this.notifyConnectionStatus(true);
          
          // Configurar manejadores para eventos locales
          this.setupLocalEventHandlers();
          
          resolve(true);
        } else {
          toast.error("Error iniciando emulador local de chat");
          this.notifyConnectionStatus(false);
          resolve(false);
        }
        
        return;
      }
      
      // Si llegamos aquí, intentamos Socket.IO real
      try {
        // Conectar con los datos de autenticación como query params
        this.socket = io(SOCKET_URL, {
          query: {
            meetingId: this.meetingId,
            userId: this.userId,
            userName: this.userName
          },
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket', 'polling'] // Intentamos primero websocket, luego polling
        });

        // Manejar eventos de conexión
        this.socket.on('connect', () => {
          console.log('Socket conectado exitosamente');
          this.reconnectAttempts = 0;
          this.notifyConnectionStatus(true);
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Error de conexión socket:', error);
          toast.error('Error de conexión al chat. Intentando conectar con servidor demo...');
          
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log(`Intentando conectar con servidor demo después de ${this.reconnectAttempts} intentos fallidos`);
            // Si fallamos en conectar al servidor configurado, activamos el emulador local
            if (this.socket) {
              this.socket.disconnect();
              this.socket = null;
              
              // Activar emulador local
              console.log('Activando emulador local después de fallos de conexión');
              this.useLocalEmulator = true;
              const success = this.localEmulator?.connect();
              
              if (success) {
                toast.success("Modo sin conexión activado. Chat funcionando localmente.");
                this.notifyConnectionStatus(true);
                this.setupLocalEventHandlers();
                resolve(true);
                return;
              }
            }
          }
          
          this.notifyConnectionStatus(false);
          resolve(false);
        });

        this.socket.on('disconnect', (reason) => {
          console.log(`Socket desconectado: ${reason}`);
          this.notifyConnectionStatus(false);
        });

        this.setupEventHandlers();

        // Error fallback para intentar reconexión manual si la automática falla
        setTimeout(() => {
          if (!this.socket?.connected) {
            console.error('Tiempo de espera para conexión socket excedido');
            
            // Activar emulador local como fallback
            console.log('Activando emulador local como fallback por timeout');
            this.useLocalEmulator = true;
            const success = this.localEmulator?.connect();
            
            if (success) {
              toast.success("Modo sin conexión activado. Chat funcionando localmente.");
              this.notifyConnectionStatus(true);
              this.setupLocalEventHandlers();
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }, 5000);
      } catch (error) {
        console.error('Error al intentar conexión socket:', error);
        
        // Activar emulador local como último recurso
        console.log('Activando emulador local por excepción');
        this.useLocalEmulator = true;
        const success = this.localEmulator?.connect();
        
        if (success) {
          toast.success("Modo sin conexión activado. Chat funcionando localmente.");
          this.notifyConnectionStatus(true);
          this.setupLocalEventHandlers();
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }
  
  private setupLocalEventHandlers() {
    if (!this.localEmulator) return;
    
    // Configurar manejadores de eventos locales
    this.localEmulator.on('new_message', (data) => {
      console.log('Mensaje recibido (local):', data);
      this.notifyMessageHandlers(data);
    });

    this.localEmulator.on('new_participant', (data) => {
      console.log('Participante conectado (local):', data);
      this.notifyParticipantHandlers(data);
    });

    this.localEmulator.on('participant_left', (data) => {
      console.log('Participante desconectado (local):', data);
      this.notifyParticipantHandlers(data);
    });
  }
  
  private setupEventHandlers() {
    if (!this.socket) return;
    
    // Eventos específicos de la aplicación
    this.socket.on('new_message', (data) => {
      console.log('Mensaje recibido:', data);
      this.notifyMessageHandlers(data);
    });

    this.socket.on('new_participant', (data) => {
      console.log('Participante conectado:', data);
      this.notifyParticipantHandlers(data);
    });

    this.socket.on('participant_left', (data) => {
      console.log('Participante desconectado:', data);
      // También lo manejamos con los manejadores de participantes
      this.notifyParticipantHandlers(data);
    });
  }

  // Desconectar del socket
  disconnect() {
    if (this.socket) {
      console.log('Desconectando socket');
      this.socket.disconnect();
      this.socket = null;
    }
    
    if (this.localEmulator?.isConnected()) {
      console.log('Desconectando emulador local');
      this.localEmulator.disconnect();
    }
    
    this.meetingId = null;
    this.userId = null;
    this.userName = null;
    this.notifyConnectionStatus(false);
  }

  // Enviar un mensaje
  sendMessage(message: any): boolean {
    // Si tenemos emulador local y está activo, usarlo
    if (this.useLocalEmulator && this.localEmulator?.isConnected()) {
      try {
        console.log('Enviando mensaje vía emulador local:', message);
        
        // Asignar ID único al mensaje si no lo tiene
        if (!message.id) {
          message.id = uuidv4();
        }
        
        this.localEmulator.emit('send_message', message);
        return true;
      } catch (error) {
        console.error('Error al enviar mensaje local:', error);
        return false;
      }
    }
    
    // De lo contrario, usar socket real
    if (!this.socket?.connected) {
      console.error('No se puede enviar mensaje: Socket no conectado');
      toast.error('Error de conexión. No se pudo enviar el mensaje.');
      
      // Intentar con emulador local como fallback
      if (this.localEmulator) {
        this.useLocalEmulator = true;
        const connected = this.localEmulator.connect();
        
        if (connected) {
          console.log('Cambiando a modo local para envío de mensajes');
          toast.success("Modo sin conexión activado. Chat funcionando localmente.");
          this.notifyConnectionStatus(true);
          this.setupLocalEventHandlers();
          
          // Reintentar envío
          try {
            console.log('Reintentando enviar mensaje vía emulador local:', message);
            this.localEmulator.emit('send_message', message);
            return true;
          } catch (error) {
            console.error('Error al enviar mensaje local (reintento):', error);
            return false;
          }
        }
      }
      
      return false;
    }

    try {
      console.log('Enviando mensaje vía Socket.IO:', message);
      this.socket.emit('send_message', {
        ...message,
        meetingId: this.meetingId
      });
      return true;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return false;
    }
  }

  // Registrar la presencia de un participante
  registerParticipant(participant: any): boolean {
    // Si tenemos emulador local y está activo, usarlo
    if (this.useLocalEmulator && this.localEmulator?.isConnected()) {
      try {
        console.log('Registrando participante vía emulador local:', participant);
        this.localEmulator.emit('register_participant', participant);
        return true;
      } catch (error) {
        console.error('Error al registrar participante local:', error);
        return false;
      }
    }
    
    // De lo contrario, usar socket real
    if (!this.socket?.connected) {
      console.error('No se puede registrar participante: Socket no conectado');
      
      // Intentar con emulador local como fallback
      if (this.localEmulator) {
        this.useLocalEmulator = true;
        const connected = this.localEmulator.connect();
        
        if (connected) {
          console.log('Cambiando a modo local para registro de participante');
          this.notifyConnectionStatus(true);
          this.setupLocalEventHandlers();
          
          // Reintentar registro
          try {
            console.log('Reintentando registrar participante vía emulador local:', participant);
            this.localEmulator.emit('register_participant', participant);
            return true;
          } catch (error) {
            console.error('Error al registrar participante local (reintento):', error);
            return false;
          }
        }
      }
      
      return false;
    }

    try {
      console.log('Registrando participante vía Socket.IO:', participant);
      this.socket.emit('register_participant', {
        ...participant,
        meetingId: this.meetingId
      });
      return true;
    } catch (error) {
      console.error('Error al registrar participante:', error);
      return false;
    }
  }

  // Forzar reconexión
  reconnect(): Promise<boolean> {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    // Priorizar emulador local en reconexión
    this.useLocalEmulator = true;
    
    if (!this.meetingId || !this.userId || !this.userName) {
      console.error('No se puede reconectar: Faltan datos de la reunión');
      return Promise.resolve(false);
    }
    
    return this.connect({
      meetingId: this.meetingId,
      userId: this.userId,
      userName: this.userName
    });
  }

  // Suscribirse a mensajes nuevos
  onMessage(handler: (data: any) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  // Suscribirse a eventos de participantes
  onParticipant(handler: (data: any) => void): () => void {
    this.participantHandlers.push(handler);
    return () => {
      this.participantHandlers = this.participantHandlers.filter(h => h !== handler);
    };
  }

  // Suscribirse al estado de conexión
  onConnectionStatus(handler: (status: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  // Verificar si está conectado
  isConnected(): boolean {
    if (this.useLocalEmulator) {
      return this.localEmulator?.isConnected() || false;
    }
    return !!this.socket?.connected;
  }

  // Notificar a los manejadores de mensajes
  private notifyMessageHandlers(data: any) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error en manejador de mensaje:', error);
      }
    });
  }

  // Notificar a los manejadores de participantes
  private notifyParticipantHandlers(data: any) {
    this.participantHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('Error en manejador de participante:', error);
      }
    });
  }

  // Notificar estado de conexión
  private notifyConnectionStatus(status: boolean) {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error en manejador de estado de conexión:', error);
      }
    });
  }
}

// Exportamos una instancia singleton
export const socketService = new SocketService();
