export interface EmergencyAlertTemplateProps {
  victimName: string;
  locationLink: string;
  time: string;
  address?: string;
}

export const getEmergencyAlertTemplate = ({
  victimName,
  locationLink,
  time,
  address,
}: EmergencyAlertTemplateProps): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f0f1f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1a1d3a;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 32px;
      color: #1a1d3a;
    }
    .alert-banner {
      background-color: #ffe4e6;
      border-left: 4px solid #e63890;
      padding: 16px;
      margin-bottom: 24px;
      color: #881337;
      font-weight: bold;
    }
    .info-item {
      margin-bottom: 16px;
    }
    .label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .value {
      font-size: 16px;
      font-weight: 500;
    }
    .button {
      display: inline-block;
      background-color: #e63890;
      color: #ffffff;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 24px;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <h1>Amparo</h1>
      </div>
      <div class="content">
        <div class="alert-banner">
          ⚠️ PEDIDO DE SOCORRO
        </div>
        
        <p style="font-size: 16px; margin-bottom: 24px;">
          <strong>${victimName}</strong> acionou o botão de emergência e precisa de ajuda imediata.
        </p>

        <div class="info-item">
          <div class="label">Horário do alerta</div>
          <div class="value">${time}</div>
        </div>

        ${
          address
            ? `
        <div class="info-item">
          <div class="label">Endereço aproximado</div>
          <div class="value">${address}</div>
        </div>
        `
            : ""
        }

        <a href="${locationLink}" class="button" target="_blank">
          Ver Localização no Mapa
        </a>
      </div>
      <div class="footer">
        <p>Este é um alerta automático do sistema Amparo.</p>
        <p>Se você recebeu este e-mail por engano, por favor ignore.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
