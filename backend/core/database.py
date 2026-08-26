import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "curio.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password_hash TEXT,
        email TEXT,
        provider TEXT DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Create sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        topic TEXT,
        confidence INTEGER,
        status TEXT,
        turn_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Try altering sessions to add username column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE sessions ADD COLUMN username TEXT")
    except sqlite3.OperationalError:
        pass

    # Try altering sessions to add report column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE sessions ADD COLUMN report TEXT")
    except sqlite3.OperationalError:
        pass
        
    # Create user_tokens table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_tokens (
        token TEXT PRIMARY KEY,
        username TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users (username)
    )
    """)
    
    # Create messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        role TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (session_id)
    )
    """)
    
    conn.commit()
    conn.close()

# User Helpers
def create_db_user(username, password_hash, email=None, provider="local"):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash, email, provider) VALUES (?, ?, ?, ?)",
            (username.lower().strip(), password_hash, email, provider)
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_db_user(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username.lower().strip(),))
    user = cursor.fetchone()
    conn.close()
    if user:
        return dict(user)
    return None

# Session Helpers
def save_db_session(session_id, topic, confidence, status="active", turn_count=0, username=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO sessions (session_id, topic, confidence, status, turn_count, username) VALUES (?, ?, ?, ?, ?, ?)",
        (session_id, topic, confidence, status, turn_count, username)
    )
    conn.commit()
    conn.close()

def get_db_session(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def add_db_message(session_id, role, content):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
        (session_id, role, content)
    )
    conn.commit()
    conn.close()

def get_db_messages(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC", (session_id,))
    rows = cursor.fetchall()
    conn.close()
    return [{"role": r["role"], "content": r["content"]} for r in rows]

def increment_db_turn(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE sessions SET turn_count = turn_count + 1 WHERE session_id = ?",
        (session_id,)
    )
    conn.commit()
    
    # Retrieve new turn count
    cursor.execute("SELECT turn_count FROM sessions WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()
    conn.close()
    return row["turn_count"] if row else 0

def end_db_session(session_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE sessions SET status = 'completed' WHERE session_id = ?",
        (session_id,)
    )
    conn.commit()
    conn.close()

# Token Helpers
def create_user_token(token, username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO user_tokens (token, username) VALUES (?, ?)",
        (token, username.lower().strip())
    )
    conn.commit()
    conn.close()

def get_username_by_token(token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM user_tokens WHERE token = ?", (token,))
    row = cursor.fetchone()
    conn.close()
    return row["username"] if row else None

def delete_user_token(token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user_tokens WHERE token = ?", (token,))
    conn.commit()
    conn.close()

# Report Helper
def save_db_report(session_id, report):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE sessions SET report = ?, status = 'completed' WHERE session_id = ?",
        (report, session_id)
    )
    conn.commit()
    conn.close()

# Sessions list helper
def get_user_sessions(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM sessions WHERE username = ? ORDER BY created_at DESC",
        (username.lower().strip(),)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# Initialize database tables immediately
init_db()
