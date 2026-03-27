/**
 * Mock Data Service
 * Provides sample data for all entities in development without database
 *
 * Users:
 * - usuario@example.com / senha123 (USER role)
 * - admin@example.com / admin123 (ADMIN role)
 */

import { User } from "@/core/domain/entities/user.entity";
import { Aggressor } from "@/core/domain/entities/aggressor.entity";
import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import { Notification } from "@/core/domain/entities/notification.entity";

// ============================================================================
// USERS
// ============================================================================

export const MOCK_USERS: Record<string, User> = {
  "user-1": new User({
    id: "user-1",
    email: "usuario@example.com",
    name: "João Silva",
    password:
      "$2b$10$uyJy9VrUfPGjKzLn7GYKNeMVc7mxL7pK7LzPqLz7LzPqLz7LzPqL6", // senha123
    role: "USER",
    cpf: "12345678901",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-03-20T15:45:00Z"),
  }),
  "admin-1": new User({
    id: "admin-1",
    email: "admin@example.com",
    name: "Maria Santos",
    password:
      "$2b$10$wPJy9VrUfPGjKzLn7GYKNeMVc7mxL7pK7LzPqLz7LzPqLz7LzPqL7", // admin123
    role: "ADMIN",
    cpf: "98765432109",
    createdAt: new Date("2024-01-01T08:00:00Z"),
    updatedAt: new Date("2024-03-25T11:20:00Z"),
  }),
};

// ============================================================================
// AGGRESSORS
// ============================================================================

export const MOCK_AGGRESSORS: Record<string, Aggressor> = {
  "aggressor-1": new Aggressor({
    id: "aggressor-1",
    name: "Carlos Alberto Oliveira",
    cpf: "11122233344",
  }),
  "aggressor-2": new Aggressor({
    id: "aggressor-2",
    name: "Pedro Gomes Santos",
    cpf: "55566677788",
  }),
};

// ============================================================================
// EMERGENCY CONTACTS
// ============================================================================

export const MOCK_EMERGENCY_CONTACTS: Record<string, any> = {
  "contact-1": {
    id: "contact-1",
    name: "Mãe - Regina Silva",
    phone: "+5511987654321",
    userId: "user-1",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-03-20T15:45:00Z"),
  },
  "contact-2": {
    id: "contact-2",
    name: "Irmã - Ana Silva",
    phone: "+5511987654322",
    userId: "user-1",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-03-20T15:45:00Z"),
  },
  "contact-3": {
    id: "contact-3",
    name: "Delegacia Polícia Civil",
    phone: "190",
    userId: "user-1",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-03-20T15:45:00Z"),
  },
};

// ============================================================================
// NOTES
// ============================================================================

export const MOCK_NOTES: Record<string, any> = {
  "note-1": {
    id: "note-1",
    title: "Encontro com o agressor",
    content:
      "Vi o Carlos próximo ao meu trabalho. Ele estava parado na frente do prédio às 14:30",
    userId: "user-1",
    occurrenceId: null,
    createdAt: new Date("2024-03-20T14:30:00Z"),
    updatedAt: new Date("2024-03-20T14:30:00Z"),
  },
  "note-2": {
    id: "note-2",
    title: "Consulta com advogado",
    content:
      "Reunião com Dr. Rafael sobre processo de proteção. Próxima audiência: 10 de abril",
    userId: "user-1",
    occurrenceId: null,
    createdAt: new Date("2024-03-18T10:00:00Z"),
    updatedAt: new Date("2024-03-18T10:00:00Z"),
  },
  "note-3": {
    id: "note-3",
    title: "Medicação atualizada",
    content: "Novos remédios prescritos pelo psiquiatra. Tomar conforme instruções",
    userId: "user-1",
    occurrenceId: null,
    createdAt: new Date("2024-03-15T09:00:00Z"),
    updatedAt: new Date("2024-03-15T09:00:00Z"),
  },
};

// ============================================================================
// OCCURRENCES
// ============================================================================

export const MOCK_OCCURRENCES: Record<string, Occurrence> = {
  "occurrence-1": new Occurrence({
    id: "occurrence-1",
    description: "Encontro casual no shopping - Rua das Flores",
    latitude: -23.5505,
    longitude: -46.6333,
    userId: "user-1",
    aggressorId: "aggressor-1",
  }),
  "occurrence-2": new Occurrence({
    id: "occurrence-2",
    description: "Tentativa de contato telefônico em horário de trabalho",
    latitude: -23.5506,
    longitude: -46.6334,
    userId: "user-1",
    aggressorId: "aggressor-1",
  }),
  "occurrence-3": new Occurrence({
    id: "occurrence-3",
    description: "Mensagem suspeita recebida no WhatsApp",
    latitude: -23.5507,
    longitude: -46.6335,
    userId: "user-1",
    aggressorId: null,
  }),
};

// ============================================================================
// EMERGENCY ALERTS
// ============================================================================

export const MOCK_EMERGENCY_ALERTS: Record<string, any> = {
  "alert-1": {
    id: "alert-1",
    latitude: -23.5505,
    longitude: -46.6333,
    createdAt: new Date("2024-03-20T15:30:00Z"),
    status: "PENDING",
    address: "Avenida Paulista, 1000 - São Paulo, SP",
    userId: "user-1",
    cancellationReason: null,
  },
  "alert-2": {
    id: "alert-2",
    latitude: -23.5506,
    longitude: -46.6334,
    createdAt: new Date("2024-03-19T14:20:00Z"),
    status: "ACKNOWLEDGED",
    address: "Rua das Flores, 500 - São Paulo, SP",
    userId: "user-1",
    cancellationReason: null,
  },
  "alert-3": {
    id: "alert-3",
    latitude: -23.5507,
    longitude: -46.6335,
    createdAt: new Date("2024-03-18T10:15:00Z"),
    status: "RESOLVED",
    address: "Praça da República, 200 - São Paulo, SP",
    userId: "user-1",
    cancellationReason: "Falso alarme - nenhuma ameaça detectada",
  },
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const MOCK_NOTIFICATIONS: Record<string, Notification> = {
  "notification-1": new Notification({
    id: "notification-1",
    title: "Novo Alerta de Emergência",
    body: "Um novo alerta de emergência foi criado em sua localização",
    category: "ALERT",
    targetId: "alert-1",
    read: false,
    createdAt: new Date("2024-03-20T15:30:00Z"),
  }),
  "notification-2": new Notification({
    id: "notification-2",
    title: "Rede de Apoio Disponível",
    body: "Seus contatos de emergência foram atualizados com sucesso",
    category: "SUCCESS",
    targetId: null,
    read: true,
    createdAt: new Date("2024-03-19T10:00:00Z"),
  }),
  "notification-3": new Notification({
    id: "notification-3",
    title: "Check-in de Segurança",
    body: "Você não fez seu check-in de segurança. Está tudo bem?",
    category: "WARNING",
    targetId: null,
    read: false,
    createdAt: new Date("2024-03-20T18:00:00Z"),
  }),
};

// ============================================================================
// CREDENTIALS FOR LOGIN
// ============================================================================

export const MOCK_LOGIN_CREDENTIALS = {
  USER: {
    email: "usuario@example.com",
    password: "senha123",
    name: "João Silva",
    role: "USER",
  },
  ADMIN: {
    email: "admin@example.com",
    password: "admin123",
    name: "Maria Santos",
    role: "ADMIN",
  },
};
