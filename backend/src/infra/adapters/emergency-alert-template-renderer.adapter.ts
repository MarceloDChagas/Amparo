import { Injectable } from "@nestjs/common";

import {
  EmergencyAlertTemplateRendererPort,
  RenderEmergencyAlertTemplateInput,
} from "@/core/ports/emergency-alert-template-renderer.ports";
import { getEmergencyAlertTemplate } from "@/infra/services/email-templates/emergency-alert-template";

@Injectable()
export class EmergencyAlertTemplateRendererAdapter implements EmergencyAlertTemplateRendererPort {
  renderEmergencyAlert(input: RenderEmergencyAlertTemplateInput): string {
    return getEmergencyAlertTemplate(input);
  }
}
