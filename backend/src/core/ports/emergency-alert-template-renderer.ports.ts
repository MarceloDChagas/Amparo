export interface RenderEmergencyAlertTemplateInput {
  userName: string;
  locationLink: string;
  time: string;
  address?: string;
}

export interface EmergencyAlertTemplateRendererPort {
  renderEmergencyAlert(input: RenderEmergencyAlertTemplateInput): string;
}

export const EMERGENCY_ALERT_TEMPLATE_RENDERER = Symbol(
  "EmergencyAlertTemplateRenderer",
);
