/**
 * AutoPes V2 - Site Oficial
 * Autor: Misael Andrejezieski
 * Versão: 2.0.0
 */

(function() {
    'use strict';

    console.log('%c⚡ AutoPes V2 - Site Oficial', 'color: #00f3ff; font-size: 14px;');
    console.log('%cproduzido por Misa', 'color: #00ff88; font-size: 12px;');

    // DOM Elements
    const DOM = {
        temas: null,
        perguntas: null,
        downloadBtn: null
    };

    // Utils
    const Utils = {
        log(message, type = 'info') {
            const styles = {
                info: 'color: #00f3ff;',
                success: 'color: #00ff88;',
                error: 'color: #ff006e;',
                warning: 'color: #ffbe0b;'
            };
            
            const prefix = {
                info: 'ℹ️',
                success: '✅',
                error: '❌',
                warning: '⚠️'
            };
            
            console.log(`%c${prefix[type]} [AutoPes V2] ${message}`, styles[type] || styles.info);
        },
        
        validateNumberInput(input, min, max) {
            let value = parseInt(input.value, 10);
            if (isNaN(value)) value = min;
            if (value < min) value = min;
            if (value > max) value = max;
            input.value = value;
            return value;
        }
    };

    // Event Handlers
    const EventHandlers = {
        onTemasChange() {
            const value = Utils.validateNumberInput(DOM.temas, 1, 10);
            Utils.log(`Temas alterado para: ${value}`, 'info');
        },
        
        onPerguntasChange() {
            const value = Utils.validateNumberInput(DOM.perguntas, 1, 6);
            Utils.log(`Perguntas por tema alterado para: ${value}`, 'info');
        },
        
        onDownloadClick() {
            Utils.log('Iniciando download do AutoPesV2.exe', 'success');
        }
    };

    // Init
    function init() {
        Utils.log('=====================================', 'info');
        Utils.log('AutoPes V2 Web carregado com sucesso!', 'success');
        Utils.log('=====================================', 'info');
        
        DOM.temas = document.getElementById('temas');
        DOM.perguntas = document.getElementById('perguntas');
        DOM.downloadBtn = document.querySelector('.btn--success');
        
        if (DOM.temas) {
            DOM.temas.addEventListener('change', EventHandlers.onTemasChange);
            EventHandlers.onTemasChange();
        }
        
        if (DOM.perguntas) {
            DOM.perguntas.addEventListener('change', EventHandlers.onPerguntasChange);
            EventHandlers.onPerguntasChange();
        }
        
        if (DOM.downloadBtn) {
            DOM.downloadBtn.addEventListener('click', EventHandlers.onDownloadClick);
        }
        
        Utils.log('Site pronto para uso!', 'success');
    }
    
    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();