import { ProjectBlueprint } from './types';

/**
 * Generates a clean, judge-facing, print-ready presentation layout for the Project Blueprint.
 * Opens a print-configured window for direct PDF export or downloads a standalone shareable HTML presentation.
 */
export async function exportBlueprintToPDF(blueprint: ProjectBlueprint): Promise<{ success: boolean; mode: 'print' | 'download'; error?: string }> {
  try {
    const currentTheme = typeof window !== 'undefined' 
      ? (document.documentElement.getAttribute('data-theme') || 'forge') 
      : 'forge';

    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Color definitions per theme for print/pitch deck aesthetics
    const themeStyles = {
      forge: {
        bg: '#0a0a0c',
        cardBg: '#141419',
        border: '#2a2a35',
        primary: '#ff5722',
        secondary: '#ff7043',
        text: '#f4f4f6',
        textMuted: '#9e9ea7',
        accentBg: 'rgba(255, 87, 34, 0.1)',
        badgeBg: 'rgba(255, 87, 34, 0.2)',
      },
      blueprint: {
        bg: '#090d16',
        cardBg: '#0f172a',
        border: '#1e293b',
        primary: '#00e5ff',
        secondary: '#38bdf8',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        accentBg: 'rgba(0, 229, 255, 0.1)',
        badgeBg: 'rgba(0, 229, 255, 0.2)',
      },
      cyberpunk: {
        bg: '#0c0714',
        cardBg: '#150d24',
        border: '#2d1b4d',
        primary: '#ff007f',
        secondary: '#00f0ff',
        text: '#ffffff',
        textMuted: '#b8a9cf',
        accentBg: 'rgba(255, 0, 127, 0.12)',
        badgeBg: 'rgba(255, 0, 127, 0.25)',
      },
    }[currentTheme] || {
      bg: '#0a0a0c',
      cardBg: '#141419',
      border: '#2a2a35',
      primary: '#ff5722',
      secondary: '#ff7043',
      text: '#f4f4f6',
      textMuted: '#9e9ea7',
      accentBg: 'rgba(255, 87, 34, 0.1)',
      badgeBg: 'rgba(255, 87, 34, 0.2)',
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(blueprint.title || 'Project Blueprint')} — Pitch Presentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: ${themeStyles.bg};
      color: ${themeStyles.text};
      line-height: 1.5;
      padding: 40px 30px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
    }

    /* Print Specific Tweaks */
    @media print {
      body {
        padding: 20px 10px;
        background-color: #0b0e14 !important;
        color: #ffffff !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: ${themeStyles.cardBg};
      border: 1px solid ${themeStyles.border};
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .action-btn {
      background: ${themeStyles.primary};
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s;
    }
    .action-btn:hover {
      opacity: 0.9;
    }

    .header-card {
      background: linear-gradient(135deg, ${themeStyles.cardBg} 0%, ${themeStyles.bg} 100%);
      border: 1px solid ${themeStyles.border};
      border-top: 4px solid ${themeStyles.primary};
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 28px;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: ${themeStyles.badgeBg};
      color: ${themeStyles.primary};
      margin-bottom: 12px;
    }

    .title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: ${themeStyles.text};
      margin-bottom: 8px;
    }

    .tagline {
      font-size: 18px;
      font-weight: 500;
      color: ${themeStyles.secondary};
      margin-bottom: 16px;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 13px;
      color: ${themeStyles.textMuted};
      border-top: 1px solid ${themeStyles.border};
      padding-top: 16px;
      margin-top: 16px;
    }

    .section {
      background: ${themeStyles.cardBg};
      border: 1px solid ${themeStyles.border};
      border-radius: 14px;
      padding: 26px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: ${themeStyles.text};
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid ${themeStyles.border};
      padding-bottom: 10px;
    }

    .section-title span.icon {
      color: ${themeStyles.primary};
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    .highlight-box {
      background: ${themeStyles.accentBg};
      border: 1px solid ${themeStyles.border};
      border-left: 4px solid ${themeStyles.primary};
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .highlight-box h4 {
      font-size: 14px;
      font-weight: 700;
      color: ${themeStyles.primary};
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .highlight-box p {
      font-size: 14px;
      color: ${themeStyles.text};
    }

    .arch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
    }

    .arch-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid ${themeStyles.border};
      border-radius: 10px;
      padding: 16px;
    }

    .arch-card .cat {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${themeStyles.primary};
      margin-bottom: 4px;
    }

    .arch-card .tech {
      font-size: 15px;
      font-weight: 700;
      color: ${themeStyles.text};
      margin-bottom: 6px;
    }

    .arch-card .desc {
      font-size: 12px;
      color: ${themeStyles.textMuted};
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 10px;
    }

    .table th {
      text-align: left;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.04);
      color: ${themeStyles.secondary};
      border-bottom: 1px solid ${themeStyles.border};
      font-weight: 600;
    }

    .table td {
      padding: 10px 12px;
      border-bottom: 1px solid ${themeStyles.border};
      color: ${themeStyles.text};
    }

    .milestone-item {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid ${themeStyles.border};
    }

    .milestone-item:last-child {
      border-bottom: none;
    }

    .milestone-week {
      min-width: 80px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: ${themeStyles.primary};
      background: ${themeStyles.accentBg};
      padding: 4px 8px;
      border-radius: 6px;
      text-align: center;
      height: fit-content;
    }

    .milestone-content h5 {
      font-size: 14px;
      font-weight: 700;
      color: ${themeStyles.text};
    }

    .milestone-content p {
      font-size: 13px;
      color: ${themeStyles.textMuted};
      margin-top: 4px;
    }

    .steps-list {
      margin-top: 6px;
      padding-left: 20px;
      font-size: 12px;
      color: ${themeStyles.textMuted};
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: ${themeStyles.textMuted};
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid ${themeStyles.border};
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Action bar (Hidden when printed to PDF) -->
    <div class="action-bar no-print">
      <div>
        <strong style="color: ${themeStyles.text}; font-size: 15px;">Pitch Deck Blueprint Ready</strong>
        <p style="color: ${themeStyles.textMuted}; font-size: 12px;">Judge-facing one-pager generated by IdeaForge Copilot</p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="action-btn" onclick="window.print()">
          🖨️ Save as PDF / Print
        </button>
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-card">
      <span class="badge">Innovation Pitch Deck Blueprint</span>
      <h1 class="title">${escapeHtml(blueprint.title || 'Untitled Project')}</h1>
      <p class="tagline">${escapeHtml(blueprint.tagline || '')}</p>

      <div class="meta-row">
        <span>📅 Generated: <strong>${generatedDate}</strong></span>
        <span>⏱️ Dev Estimate: <strong>${blueprint.timeline?.totalEstimatedWeeks || 4} Weeks (${blueprint.timeline?.totalEstimatedHours || 64} hrs)</strong></span>
        <span>⚡ Theme: <strong style="text-transform: capitalize;">${currentTheme}</strong></span>
      </div>
    </div>

    <!-- Executive Summary & UVP -->
    <div class="section">
      <h2 class="section-title"><span class="icon">🎯</span> Executive Summary & Value Proposition</h2>
      
      <div class="highlight-box">
        <h4>Unique Value Proposition (UVP)</h4>
        <p>${escapeHtml(blueprint.uniqueValueProposition || 'High impact technological solution solving critical industry pain points.')}</p>
      </div>

      <div class="grid-2">
        <div>
          <h4 style="font-size: 13px; color: ${themeStyles.secondary}; margin-bottom: 6px; text-transform: uppercase;">Problem Statement</h4>
          <p style="font-size: 13.5px; color: ${themeStyles.text};">${escapeHtml(blueprint.problemStatement || 'Identified market and technical friction point.')}</p>
        </div>
        <div>
          <h4 style="font-size: 13px; color: ${themeStyles.secondary}; margin-bottom: 6px; text-transform: uppercase;">Executive Solution</h4>
          <p style="font-size: 13.5px; color: ${themeStyles.text};">${escapeHtml(blueprint.executiveSummary || 'Architected technical pipeline designed for scale and rapid deployment.')}</p>
        </div>
      </div>
    </div>

    <!-- System Architecture Canvas -->
    <div class="section">
      <h2 class="section-title"><span class="icon">🏗️</span> System Architecture Blueprint</h2>
      <div class="arch-grid">
        ${(blueprint.architectureNodes || []).map((node) => `
          <div class="arch-card">
            <div class="cat">${escapeHtml(node.category)}</div>
            <div class="tech">${escapeHtml(node.tech)}</div>
            <div class="desc">${escapeHtml(node.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tech Stack Recommendations -->
    <div class="section">
      <h2 class="section-title"><span class="icon">⚡</span> Recommended Tech Stack & Rationale</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Chosen Technology</th>
            <th>Rationale</th>
            <th>Alternatives Considered</th>
          </tr>
        </thead>
        <tbody>
          ${(blueprint.techStack || []).map((item) => `
            <tr>
              <td><strong>${escapeHtml(item.category)}</strong></td>
              <td><span style="color: ${themeStyles.primary}; font-weight: 600;">${escapeHtml(item.chosen)}</span></td>
              <td>${escapeHtml(item.rationale)}</td>
              <td style="color: ${themeStyles.textMuted};">${escapeHtml((item.alternatives || []).join(', '))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Development Timeline & Milestones -->
    <div class="section page-break">
      <h2 class="section-title"><span class="icon">📅</span> Execution Timeline & Key Milestones</h2>
      <p style="font-size: 13px; color: ${themeStyles.textMuted}; margin-bottom: 16px;">
        <strong>Critical Execution Path:</strong> ${escapeHtml(blueprint.timeline?.criticalPath || 'Core Engine → AI Reasoning → Integration Webhooks')}
      </p>

      <div>
        ${(blueprint.milestones || []).map((m) => `
          <div class="milestone-item">
            <div class="milestone-week">Week ${m.week}</div>
            <div class="milestone-content">
              <h5>${escapeHtml(m.title)} (${escapeHtml(m.duration)})</h5>
              <ul class="steps-list">
                ${(m.actionableSteps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
              </ul>
              ${m.potentialRisk ? `<p style="font-size: 11px; color: #ff7043; margin-top: 4px;">⚠️ Risk: ${escapeHtml(m.potentialRisk)}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Recommended APIs & Datasets -->
    ${(blueprint.apisAndDatasets && blueprint.apisAndDatasets.length > 0) ? `
      <div class="section">
        <h2 class="section-title"><span class="icon">🔌</span> Key APIs & Dataset Resources</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Type</th>
              <th>Use Case</th>
              <th>License / Tier</th>
            </tr>
          </thead>
          <tbody>
            ${blueprint.apisAndDatasets.map((api) => `
              <tr>
                <td><strong>${escapeHtml(api.name)}</strong></td>
                <td><span class="badge" style="font-size: 10px; margin: 0;">${escapeHtml(api.type)}</span></td>
                <td>${escapeHtml(api.useCase)}</td>
                <td style="color: ${themeStyles.textMuted};">${escapeHtml(api.licenseOrTier)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <div class="footer">
      IdeaForge AI Research & Innovation Copilot • Pitch Presentation Blueprint Export
    </div>

  </div>
</body>
</html>`;

    // Attempt to open a popup window for printing
    const printWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Trigger print after resources load
      setTimeout(() => {
        try {
          printWindow.focus();
        } catch {
          // ignore focus errors
        }
      }, 300);

      return { success: true, mode: 'print' };
    } else {
      // Fallback: Popup blocked. Trigger direct HTML blob download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${(blueprint.title || 'ideaforge-blueprint').toLowerCase().replace(/[^a-z0-9-_]/g, '-')}-pitch.html`;
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, mode: 'download' };
    }
  } catch (err: any) {
    console.error('Failed to export blueprint PDF:', err);
    return { success: false, mode: 'download', error: err?.message || 'Failed to export presentation blueprint PDF.' };
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
