/**
 * Cookie Manager - Sistema de gerenciamento de cookies com LGPD compliance
 * Versão: 1.0.0
 */

(function() {
  'use strict';

  const CookieManager = {
    // Configurações
    config: {
      cookieName: 'cookie_consent',
      cookieExpireDays: 365,
      essentialCookies: ['cookie_consent', 'session_id'],
      bannerDelay: 1000 // delay para mostrar o banner (ms)
    },

    // Estado atual dos cookies
    state: {
      essential: true,
      analytics: false,
      marketing: false
    },

    /**
     * Inicializa o gerenciador de cookies
     */
    init() {
      // Verifica se já existe consentimento
      const consent = this.getConsent();
      
      if (!consent) {
        // Mostra banner se não houver consentimento
        setTimeout(() => this.showBanner(), this.config.bannerDelay);
      } else {
        // Aplica preferências salvas
        this.state = consent;
        this.applyConsent();
      }

      // Bind eventos globais
      this.bindEvents();
    },

    /**
     * Cria e exibe o banner de cookies
     */
    showBanner() {
      if (document.getElementById('cookieBanner')) return;

      const banner = document.createElement('div');
      banner.id = 'cookieBanner';
      banner.innerHTML = `
        <div class="cookie-banner">
          <div class="cookie-content">
            <div class="cookie-text">
              <h3>🍪 Cookies e Privacidade</h3>
              <p>Usamos cookies essenciais para o funcionamento do site. Você pode gerenciar suas preferências a qualquer momento.</p>
            </div>
            <div class="cookie-actions">
              <button id="cookieSettings" class="btn-secondary">Configurar</button>
              <button id="cookieAccept" class="btn-primary">Aceitar</button>
            </div>
          </div>
        </div>
      `;

      // Adiciona estilos
      this.injectStyles();
      
      // Adiciona ao DOM
      document.body.appendChild(banner);

      // Bind eventos do banner
      document.getElementById('cookieAccept').addEventListener('click', () => {
        this.acceptAll();
        this.hideBanner();
      });

      document.getElementById('cookieSettings').addEventListener('click', () => {
        this.showSettings();
      });

      // Animação de entrada
      setTimeout(() => banner.classList.add('show'), 100);
    },

    /**
     * Mostra modal de configurações
     */
    showSettings() {
      if (document.getElementById('cookieSettings')) {
        const existing = document.getElementById('cookieSettingsModal');
        if (existing) existing.remove();
      }

      const modal = document.createElement('div');
      modal.id = 'cookieSettingsModal';
      modal.innerHTML = `
        <div class="cookie-modal-overlay">
          <div class="cookie-modal">
            <div class="cookie-modal-header">
              <h3>Configurações de Cookies</h3>
              <button class="cookie-close" id="closeSettings">×</button>
            </div>
            <div class="cookie-modal-body">
              <div class="cookie-option">
                <div class="cookie-option-header">
                  <label>
                    <input type="checkbox" checked disabled>
                    <span class="cookie-option-title">Cookies Essenciais</span>
                  </label>
                  <span class="cookie-badge">Obrigatório</span>
                </div>
                <p class="cookie-option-desc">Necessários para o funcionamento básico do site.</p>
              </div>

              <div class="cookie-option">
                <div class="cookie-option-header">
                  <label>
                    <input type="checkbox" id="analyticsCheck" ${this.state.analytics ? 'checked' : ''}>
                    <span class="cookie-option-title">Cookies de Análise</span>
                  </label>
                  <span class="cookie-badge optional">Opcional</span>
                </div>
                <p class="cookie-option-desc">Nos ajudam a entender como você usa o site.</p>
              </div>

              <div class="cookie-option">
                <div class="cookie-option-header">
                  <label>
                    <input type="checkbox" id="marketingCheck" ${this.state.marketing ? 'checked' : ''}>
                    <span class="cookie-option-title">Cookies de Marketing</span>
                  </label>
                  <span class="cookie-badge optional">Opcional</span>
                </div>
                <p class="cookie-option-desc">Usados para personalizar anúncios e conteúdo.</p>
              </div>
            </div>
            <div class="cookie-modal-footer">
              <button id="saveSettings" class="btn-primary">Salvar Preferências</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('show'), 100);

      // Bind eventos
      document.getElementById('closeSettings').addEventListener('click', () => {
        this.hideSettings();
      });

      document.getElementById('saveSettings').addEventListener('click', () => {
        this.saveSettings();
      });

      modal.querySelector('.cookie-modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('cookie-modal-overlay')) {
          this.hideSettings();
        }
      });
    },

    /**
     * Salva configurações do usuário
     */
    saveSettings() {
      this.state.analytics = document.getElementById('analyticsCheck').checked;
      this.state.marketing = document.getElementById('marketingCheck').checked;
      
      this.saveConsent(this.state);
      this.applyConsent();
      this.hideSettings();
      this.hideBanner();
      
      // Feedback visual
      this.showToast('Preferências salvas com sucesso!');
    },

    /**
     * Aceita todos os cookies
     */
    acceptAll() {
      this.state = {
        essential: true,
        analytics: true,
        marketing: true
      };
      this.saveConsent(this.state);
      this.applyConsent();
    },

    /**
     * Aplica consentimento carregando scripts necessários
     */
    applyConsent() {
      // Cookies essenciais sempre ativos
      
      // Analytics
      if (this.state.analytics) {
        this.loadAnalytics();
      }

      // Marketing
      if (this.state.marketing) {
        this.loadMarketing();
      }
    },

    /**
     * Carrega scripts de analytics (exemplo com Google Analytics)
     */
    loadAnalytics() {
      console.log('Analytics cookies enabled');
      // Exemplo: Adicionar Google Analytics
      // const script = document.createElement('script');
      // script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      // document.head.appendChild(script);
    },

    /**
     * Carrega scripts de marketing
     */
    loadMarketing() {
      console.log('Marketing cookies enabled');
      // Exemplo: Adicionar Facebook Pixel, etc.
    },

    /**
     * Salva consentimento no cookie
     */
    saveConsent(consent) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (this.config.cookieExpireDays * 24 * 60 * 60 * 1000));
      document.cookie = `${this.config.cookieName}=${JSON.stringify(consent)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    },

    /**
     * Recupera consentimento do cookie
     */
    getConsent() {
      const name = this.config.cookieName + '=';
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
          try {
            return JSON.parse(cookie.substring(name.length));
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    },

    /**
     * Oculta banner
     */
    hideBanner() {
      const banner = document.getElementById('cookieBanner');
      if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
      }
    },

    /**
     * Oculta modal de configurações
     */
    hideSettings() {
      const modal = document.getElementById('cookieSettingsModal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    },

    /**
     * Mostra toast de feedback
     */
    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'cookie-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    },

    /**
     * Bind eventos globais
     */
    bindEvents() {
      // Adicionar link "Gerenciar Cookies" ao rodapé se necessário
      const footerLinks = document.querySelector('.legal-links');
      if (footerLinks && !document.getElementById('manageCookiesLink')) {
        const link = document.createElement('a');
        link.id = 'manageCookiesLink';
        link.href = '#';
        link.textContent = 'Gerenciar Cookies';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showSettings();
        });
        
        // Adicionar ao final dos links
        footerLinks.appendChild(document.createTextNode(' • '));
        footerLinks.appendChild(link);
      }
    },

    /**
     * Injeta estilos CSS
     */
    injectStyles() {
      if (document.getElementById('cookieStyles')) return;

      const style = document.createElement('style');
      style.id = 'cookieStyles';
      style.textContent = `
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          padding: 20px;
          z-index: 10000;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }

        #cookieBanner.show .cookie-banner {
          transform: translateY(0);
        }

        .cookie-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cookie-text h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #f9fafb;
        }

        .cookie-text p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        .cookie-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-primary, .btn-secondary {
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #9703D3;
          color: #f9fafb;
        }

        .btn-primary:hover {
          background: #DCBCE8;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        /* Modal */
        .cookie-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        #cookieSettingsModal.show .cookie-modal-overlay {
          opacity: 1;
        }

        .cookie-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        #cookieSettingsModal.show .cookie-modal {
          transform: scale(1);
        }

        .cookie-modal-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cookie-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #f9fafb;
        }

        .cookie-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .cookie-close:hover {
          background: #f3f4f6;
        }

        .cookie-modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .cookie-option {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .cookie-option:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .cookie-option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .cookie-option-header label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .cookie-option-header input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .cookie-option-title {
          font-weight: 600;
          color: #f9fafb;
          font-size: 15px;
        }

        .cookie-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          background: #10b981;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cookie-badge.optional {
          background: #6b7280;
        }

        .cookie-option-desc {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          margin-left: 28px;
        }

        .cookie-modal-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .cookie-modal-footer .btn-primary {
          width: 100%;
        }

        /* Toast */
        .cookie-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #f9fafb;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 10002;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        .cookie-toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .cookie-content {
            flex-direction: column;
            align-items: stretch;
          }

          .cookie-actions {
            width: 100%;
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }

          .cookie-modal {
            max-height: 90vh;
          }
        }
      `;

      document.head.appendChild(style);
    }
  };

  // Auto-inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CookieManager.init());
  } else {
    CookieManager.init();
  }

  // Exportar para uso global se necessário
  window.CookieManager = CookieManager;

})();