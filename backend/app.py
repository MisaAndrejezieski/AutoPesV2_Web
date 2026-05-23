"""
AutoPes V2 - Backend API
Autor: Misael Andrejezieski
Versão: 2.0.0
"""

import os
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

from automacao import Automacao

# Configuração do app
app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Configurações
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Estado da aplicação
automacao = Automacao()
status_atual = {
    'executando': False,
    'logs': [],
    'progresso': ''
}

def adicionar_log(msg, tipo='info'):
    """Adiciona mensagem ao log"""
    status_atual['logs'].append({'msg': msg, 'tipo': tipo})
    # Manter apenas últimas 50 mensagens
    if len(status_atual['logs']) > 50:
        status_atual['logs'] = status_atual['logs'][-50:]

def callback_ui(tipo, msg):
    """Callback recebido da automação"""
    if tipo == 'progresso':
        status_atual['progresso'] = msg
        adicionar_log(msg, 'info')
    else:
        adicionar_log(msg, tipo)

# ============================================
# ROTAS DA API
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Verifica se a API está online"""
    return jsonify({
        'status': 'ok',
        'service': 'AutoPes V2 API',
        'version': '2.0.0'
    })

@app.route('/iniciar', methods=['POST'])
def iniciar():
    """Inicia a automação"""
    global status_atual
    
    if status_atual['executando']:
        return jsonify({
            'status': 'error',
            'message': 'Automação já em execução'
        })
    
    data = request.json
    temas = data.get('temas', 2)
    perguntas = data.get('perguntas', 2)
    
    # Resetar status
    status_atual = {
        'executando': True,
        'logs': [],
        'progresso': ''
    }
    
    adicionar_log(f"Iniciando com {temas} tema(s) e {perguntas} pergunta(s)", 'info')
    
    def run():
        try:
            sucesso = automacao.executar(temas, perguntas, callback_ui)
            status_atual['executando'] = False
            status_atual['progresso'] = 'concluido' if sucesso else 'erro'
            
            if sucesso:
                adicionar_log("Automação concluída com sucesso!", 'success')
            else:
                adicionar_log("Automação concluída com falhas", 'warning')
                
        except Exception as e:
            status_atual['executando'] = False
            status_atual['progresso'] = 'erro'
            adicionar_log(str(e), 'error')
    
    thread = threading.Thread(target=run)
    thread.start()
    
    return jsonify({
        'status': 'ok',
        'message': 'Automação iniciada'
    })

@app.route('/status', methods=['GET'])
def status():
    """Retorna o status atual da automação"""
    ultimo_log = status_atual['logs'][-1] if status_atual['logs'] else None
    
    return jsonify({
        'status': 'executando' if status_atual['executando'] else status_atual['progresso'],
        'progresso': status_atual['progresso'],
        'log': ultimo_log['msg'] if ultimo_log else None,
        'tipo': ultimo_log['tipo'] if ultimo_log else None
    })

@app.route('/parar', methods=['POST'])
def parar():
    """Para a automação em execução"""
    if status_atual['executando']:
        automacao.parar()
        adicionar_log("Parando automação...", 'warning')
        status_atual['executando'] = False
        status_atual['progresso'] = 'parado'
        return jsonify({'status': 'ok', 'message': 'Automação parada'})
    
    return jsonify({'status': 'error', 'message': 'Nenhuma automação em execução'})

@app.route('/logs', methods=['GET'])
def logs():
    """Retorna todos os logs"""
    return jsonify({'logs': status_atual['logs']})

# ============================================
# INICIALIZAÇÃO
# ============================================

if __name__ == '__main__':
    print("=" * 50)
    print("⚡ AutoPes V2 - Backend API")
    print("=" * 50)
    print(f"🔧 Modo: {'DEBUG' if DEBUG else 'PRODUÇÃO'}")
    print(f"🌐 Servidor: http://localhost:5000")
    print(f"📋 Health check: http://localhost:5000/health")
    print("=" * 50)
    print("Pressione Ctrl+C para parar")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000)),
        debug=DEBUG
    )