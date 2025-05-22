import plotly.express as px
import pandas as pd
import mysql.connector
import sys

usuario_id = int(sys.argv[1])

con = mysql.connector.connect(
    host="localhost",
    user="root",
    password="555",
    database="financas",
    port="3306"
)

query = """
        SELECT data_transacao, tipo, valor
        FROM transacoes
        WHERE usuario_id = %s
"""

df = pd.read_sql(query, con, parms=(usuario_id,))

df['data_transacao'] = pd.to_datetime(df['data_transacao']).dt.date
df_grouped = df.groupby(['data_transacao', 'tipo']).sum().reset_index()

flg = px.bar(df_grouped, x='data_transacao', y='valor', color='tipo', title='transações por dia', barmode='group')

flg.write_html(f'public/graficos/transacoes_{usuario_id}.html')

con.close()