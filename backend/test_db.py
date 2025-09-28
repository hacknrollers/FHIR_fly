import os
from dotenv import load_dotenv
import psycopg2

# Load environment variables
load_dotenv()

print('Environment variables:')
print('DB_HOST:', os.getenv('DB_HOST'))
print('DB_PORT:', os.getenv('DB_PORT'))
print('DB_NAME:', os.getenv('DB_NAME'))
print('DB_USER:', os.getenv('DB_USER'))
print('DB_PASSWORD set:', 'Yes' if os.getenv('DB_PASSWORD') else 'No')
print('DB_SSLMODE:', os.getenv('DB_SSLMODE'))

try:
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        sslmode=os.getenv('DB_SSLMODE')
    )
    print('✅ Database connection successful!')
    
    # Test a simple query
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f'PostgreSQL version: {version[0]}')
    
    conn.close()
except Exception as e:
    print(f'❌ Database connection failed: {e}')
