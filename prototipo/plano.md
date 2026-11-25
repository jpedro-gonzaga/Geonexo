# Plano do protótipo

O fluxo da demo percorre um único poço, da imagem original à fila de revisão. O mapa distingue dado observado, lacuna, estimativa e intervalo inconclusivo. A decisão geológica cabe ao especialista.

| Ordem | Entrega inicial | Critério de aceite |
| --- | --- | --- |
| 1 | Leitor de amplitude e visualizador de profundidade × azimute | Carregar um poço compatível. Mostrar escala, orientação e valores ausentes. |
| 2 | Reconstrução com referência simples | Comparar interpolação e um método circular ou ajuste senoidal no mesmo trecho; preservar todas as amostras fora da máscara. |
| 3 | Evidência e incerteza | Mostrar divergência entre estimativas na máscara. Manter a lacuna sinalizada quando a evidência for insuficiente. |
| 4 | Fila de revisão | Ordenar intervalos por sinais como proporção de lacuna, divergência ou anomalia de textura; informar o motivo e navegar até o intervalo. |
| 5 | Validação e demo | Ocultar um recorte observado, reconstruir, revelar a referência e registrar erro, tempo e exemplos de abstenção. |

O chat propôs Python, NumPy, Pandas, Plotly e Streamlit. SciPy ou OpenCV são candidatos para o primeiro comparativo. PyTorch/U-Net, ensemble ou Monte Carlo Dropout e Isolation Forest entram se adicionarem evidência diante da referência simples. React/FastAPI apareceu como possível evolução. Estas são opções, sem dependências instaladas nesta base de documentação.

## Validação

- Compare métodos nas mesmas máscaras e relate MAE dentro da lacuna, SSIM em recortes equivalentes, continuidade de feições e latência. Verifique a igualdade dos valores medidos fora da máscara.
- Faça testes com lacunas estreitas, largas e atravessando 0°/360°. Preserve as lacunas naturais como uma classe separada da avaliação com referência conhecida.
- Compare faixas de divergência com o erro observado e registre casos de concordância entre métodos com erro alto. Use escala de divergência até obter evidência de calibração.
- Compare tarefas manuais e assistidas em recortes equivalentes, alterne a ordem entre participantes e conte tempo ativo, regiões omitidas e falsos alertas. Relate tamanho da amostra e variação.
- Registre cada resultado com versão da base, poço anonimizado, intervalo, máscara e configuração dos métodos.
