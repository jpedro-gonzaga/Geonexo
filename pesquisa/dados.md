# Dados candidatos

O WAID (Wellbore Acoustic Image Database) da Petrobras contém imagens acústicas e perfis convencionais de cinco poços do pré-sal carbonático brasileiro. Os nomes e as profundidades originais foram mascarados. Identificadores publicados: ANTILOPE-37, TATU-22, BOTOROSA-47, COALA-88 e ANTILOPE-25.

- Começar com amplitude acústica (AMP), por exemplo TATU-22 para exploração.
- Conferir o arquivo do conjunto selecionado, o eixo de profundidade, a ordem dos setores, as unidades e a representação de ausências antes de converter. O repositório descreve CSV brasileiro com separador ponto e vírgula e vírgula decimal.
- Guardar a versão ou commit da fonte e a máscara original. Manter dados brutos fora do Git. Publicar transformações, parâmetros, licença e atribuição dos recortes que forem usados.
- Separar poços para avaliação antes de ajustar parâmetros. Usar uma semente fixa e guardar as máscaras aplicadas especificamente para o teste.
- A Petrobras declara CC BY 4.0 para os CSV em `dataset/` e Apache 2.0 para o código do WAID. [Petrobras — WAID](https://github.com/petrobras/waid)

Fontes complementares. [Acervo técnico da ANP](https://www.gov.br/anp/pt-br/assuntos/exploracao-e-producao-de-oleo-e-gas/dados-tecnicos/acervo-de-dados) · [ImageLogViewer](https://github.com/Rodrigo-P/ImageLogViewer)
