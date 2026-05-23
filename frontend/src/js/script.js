/**
 * AutoPes V2 - Site Oficial (versão simplificada)
 * 
 * JavaScript: Linguagem que RODA NO NAVEGADOR
 * Diferente do Python que roda no servidor, JS roda no computador do usuário
 * 
 * Autor: Misael Andrejezieski
 * Versão: 2.0.0
 */

/**
 * IIFE - Immediately Invoked Function Expression
 * 
 * (function() { ... })()
 * 
 * Isso cria uma função e a EXECUTA IMEDIATAMENTE
 * 
 * Por quê? Para criar um ESCOPO PRIVADO
 * As variáveis dentro NÃO vazam para o escopo global
 * Evita conflitos com outros scripts
 */
(function() {
    'use strict';
    // 
    // 'use strict': Modo estrito do JavaScript
    // Torna os erros mais visíveis e impede más práticas
    // Ex: não permite usar variável sem declarar
    //

    /**
     * CONSOLE.LOG
     * 
     * Mostra mensagens no CONSOLE DO NAVEGADOR
     * (F12 → aba Console)
     * 
     * Usado para DEPURAÇÃO (entender o que o código está fazendo)
     * Os usuários finais NÃO veem isso
     */
    console.log('%c⚡ AutoPes V2 - Site Oficial', 'color: #00f3ff; font-size: 14px;');
    // 
    // %c: Permite aplicar CSS no console
    // 'color: #00f3ff; font-size: 14px;' estiliza a mensagem
    //
    
    console.log('%cproduzido por Misa', 'color: #00ff88; font-size: 12px;');

    /**
     * FUNÇÃO SIMPLES
     * 
     * function nome(parâmetros) { código }
     * 
     * É um bloco de código reutilizável
     */
    function log(message) {
        // message: parâmetro (valor que a função recebe)
        console.log(`[AutoPes V2] ${message}`);
        // Template string: `texto ${variável}` - insere variável no texto
    }

    /**
     * RASTREAMENTO DE DOWNLOAD
     * 
     * trackDownload: função que será chamada quando usuário clicar no botão
     */
    function trackDownload() {
        log('Download do AutoPesV2.exe iniciado');
        // 
        // EM PRODUÇÃO: Aqui poderia enviar para Google Analytics
        // Para saber quantas pessoas baixaram
        // Ex: ga('send', 'event', 'download', 'exe');
        //
    }

    /**
     * DOM - Document Object Model
     * 
     * Representação da página HTML como objetos JavaScript
     * Permite MANIPULAR a página dinamicamente
     * 
     * document.querySelector('.btn-download'):
     *   Procura o PRIMEIRO elemento com a classe "btn-download"
     *   Retorna o elemento (ou null se não encontrar)
     */
    const downloadBtn = document.querySelector('.btn-download');
    // 
    // const: variável que NÃO MUDA (constante)
    // let: variável que pode mudar
    // var: jeito antigo (evitar)
    //

    /**
     * CONDICIONAL IF
     * 
     * if (condição) { código }
     * 
     * Só executa se a condição for verdadeira
     */
    if (downloadBtn) {
        // Se encontrou o botão...
        
        /**
         * addEventListener: Fica ESCUTANDO eventos
         * 
         * Parâmetros:
         *   1. 'click': tipo de evento (clique do mouse)
         *   2. trackDownload: função a executar quando clicar
         * 
         * Quando usuário clicar, trackDownload() será chamada
         */
        downloadBtn.addEventListener('click', trackDownload);
        
        log('Botão de download configurado');
    } else {
        // Se NÃO encontrou o botão (fallback)
        log('Aviso: Botão de download não encontrado', 'warning');
    }

    /**
     * MENSAGENS DE INICIALIZAÇÃO
     */
    log('Site carregado com sucesso!');
    log('Baixe o .exe e execute na sua máquina');

    /**
     * NOTA SOBRE EVENTOS:
     * 
     * O código acima NÃO executa trackDownload() agora
     * Ele apenas REGISTRA a função para executar DEPOIS
     * Quando o usuário clicar, o navegador chama a função
     * 
     * Isso é chamado de "programação assíncrona" ou "callback"
     */

})();  // Os parênteses finais EXECUTAM a função imediatamente