"""
AutoPes V2 - Módulo de Automação
Autor: Misael Andrejezieski
Versão: 2.0.0
"""

import time
import random
import subprocess
import pyautogui
import requests

class Automacao:
    """Classe responsável por toda a lógica de automação"""
    
    def __init__(self):
        self.executando = False
        self.resultados = []
        self.callback = None
        
        # Configurações
        self.timeouts = {
            'abrir_navegador': 3,
            'entre_teclas': 0.05,
            'minimo_pagina': 8,
            'entre_pesquisas': [5, 10],
            'tentativas': 3
        }
        
        # Temas e perguntas
        self.temas = [
            "tecnologia", "saude", "educacao", "esportes", 
            "ciencia", "musica", "filmes", "games"
        ]
        
        self.perguntas_base = [
            "O que é {tema}?",
            "Ultimas noticias sobre {tema}",
            "Impacto do {tema} na sociedade",
            "Futuro do {tema}",
            "Curiosidades sobre {tema}"
        ]
    
    def log(self, msg, tipo='info'):
        """Envia mensagem de log via callback"""
        if self.callback:
            self.callback(tipo, msg)
    
    def verificar_internet(self):
        """Verifica se há conexão com a internet"""
        try:
            requests.get('https://www.google.com', timeout=5)
            self.log("Internet OK", 'success')
            return True
        except:
            self.log("Sem conexão com internet!", 'error')
            return False
    
    def abrir_edge(self):
        """Abre o Microsoft Edge"""
        try:
            # Fechar Edge existente
            subprocess.run(['taskkill', '/IM', 'msedge.exe', '/F'], 
                         capture_output=True)
            time.sleep(1)
            
            # Abrir novo Edge
            subprocess.Popen(['start', 'msedge'], shell=True)
            time.sleep(self.timeouts['abrir_navegador'])
            
            self.log("Microsoft Edge aberto", 'success')
            return True
            
        except Exception as e:
            self.log(f"Erro ao abrir Edge: {e}", 'error')
            return False
    
    def fazer_pesquisa(self, pergunta):
        """Realiza uma única pesquisa"""
        try:
            # Nova aba
            pyautogui.hotkey('ctrl', 't')
            time.sleep(1)
            
            # Digitar pesquisa
            pyautogui.write(pergunta, interval=self.timeouts['entre_teclas'])
            time.sleep(0.5)
            pyautogui.press('enter')
            
            # Aguardar carregamento
            time.sleep(self.timeouts['minimo_pagina'])
            
            # Fechar aba
            pyautogui.hotkey('ctrl', 'w')
            
            return True
            
        except Exception as e:
            self.log(f"Erro na pesquisa: {e}", 'error')
            return False
    
    def fechar_edge(self):
        """Fecha o Microsoft Edge"""
        try:
            subprocess.run(['taskkill', '/IM', 'msedge.exe', '/F'], 
                         capture_output=True)
            self.log("Microsoft Edge fechado", 'info')
        except:
            pass
    
    def gerar_pesquisas(self, num_temas, num_perguntas):
        """Gera lista de pesquisas aleatórias"""
        # Limitar aos valores disponíveis
        num_temas = min(num_temas, len(self.temas))
        num_perguntas = min(num_perguntas, len(self.perguntas_base))
        
        # Escolher temas aleatórios
        temas_escolhidos = random.sample(self.temas, num_temas)
        pesquisas = []
        
        for tema in temas_escolhidos:
            # Escolher perguntas aleatórias para este tema
            perguntas = random.sample(self.perguntas_base, num_perguntas)
            for pergunta in perguntas:
                pesquisas.append({
                    'tema': tema,
                    'pergunta': pergunta.format(tema=tema)
                })
        
        return pesquisas
    
    def executar(self, num_temas, num_perguntas, callback):
        """Executa a automação completa"""
        self.callback = callback
        self.executando = True
        self.resultados = []
        
        self.log("=" * 40, 'info')
        self.log("Iniciando AutoPes V2", 'success')
        self.log("=" * 40, 'info')
        
        # Verificar internet
        self.log("Verificando conexão...", 'info')
        if not self.verificar_internet():
            return False
        
        # Abrir navegador
        self.log("Abrindo Microsoft Edge...", 'info')
        if not self.abrir_edge():
            return False
        
        # Gerar pesquisas
        pesquisas = self.gerar_pesquisas(num_temas, num_perguntas)
        total = len(pesquisas)
        self.log(f"Total de pesquisas: {total}", 'info')
        
        try:
            for idx, pesquisa in enumerate(pesquisas, 1):
                if not self.executando:
                    self.log("Automação interrompida", 'warning')
                    break
                
                # Atualizar progresso
                self.log(f"Pesquisa {idx}/{total}", 'progresso')
                self.log(f"Tema: {pesquisa['tema']}", 'info')
                
                # Realizar pesquisa
                sucesso = self.fazer_pesquisa(pesquisa['pergunta'])
                
                # Registrar resultado
                self.resultados.append({
                    'tema': pesquisa['tema'],
                    'pergunta': pesquisa['pergunta'],
                    'status': 'OK' if sucesso else 'FALHA'
                })
                
                if sucesso:
                    self.log(f"✓ Pesquisa concluída", 'success')
                else:
                    self.log(f"✗ Falha na pesquisa", 'error')
                
                # Aguardar entre pesquisas (exceto última)
                if idx < total and self.executando:
                    intervalo = random.uniform(*self.timeouts['entre_pesquisas'])
                    time.sleep(intervalo)
            
            # Estatísticas finais
            sucessos = len([r for r in self.resultados if r['status'] == 'OK'])
            self.log("=" * 40, 'info')
            self.log(f"Finalizado: {sucessos}/{total} pesquisas com sucesso", 'success')
            self.log("=" * 40, 'info')
            
            return sucessos == total
            
        except Exception as e:
            self.log(f"Erro durante execução: {e}", 'error')
            return False
            
        finally:
            # Sempre fechar o navegador
            self.fechar_edge()
            self.executando = False
    
    def parar(self):
        """Para a execução da automação"""
        self.executando = False
        self.log("Parando automação...", 'warning')