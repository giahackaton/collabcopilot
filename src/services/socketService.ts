
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// Configuración del servidor Socket.IO
// Usamos un servidor Socket.IO público para pruebas si no hay una URL definida
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://chat-demo.lovable.dev';

interface SocketOptions {
  meetingId: string;
  userId: string;
  userName: string;
}

class SocketService {
  private socket: Socket | null = null;
  private meetingId: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private participantHandlers: ((data: any) => void)[] = [];
  private connectionHandlers: ((status: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
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
          // Si fallamos en conectar al servidor configurado, intentamos con el demo
          if (this.socket) {
            this.socket.disconnect();
            
            // Conectar al servidor demo
            setTimeout(() => {
              this.socket = io('https://chat-demo.lovable.dev', {
                query: {
                  meetingId: this.meetingId,
                  userId: this.userId,
                  userName: this.userName
                },
                reconnection: true
              });
              
              this.setupEventHandlers();
            }, 1000);
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
          resolve(false);
        }
      }, 10000);
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
      this.meetingId = null;
      this.userId = null;
      this.userName = null;
      this.notifyConnectionStatus(false);
    }
  }

  // Enviar un mensaje
  sendMessage(message: any): boolean {
    if (!this.socket?.connected) {
      console.error('No se puede enviar mensaje: Socket no conectado');
      toast.error('Error de conexión. No se pudo enviar el mensaje.');
      return false;
    }

    try {
      console.log('Enviando mensaje:', message);
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
    if (!this.socket?.connected) {
      console.error('No se puede registrar participante: Socket no conectado');
      return false;
    }

    try {
      console.log('Registrando participante:', participant);
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
