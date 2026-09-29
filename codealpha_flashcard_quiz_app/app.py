from flask import Flask, jsonify, render_template, request
import sqlite3
from pathlib import Path

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "flashcards.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL
        )
    """)

    conn.commit()

    count = conn.execute(
        "SELECT COUNT(*) FROM flashcards"
    ).fetchone()[0]

    if count == 0:

        sample_cards = [
            (
                "What is Artificial Intelligence?",
                "Artificial Intelligence is the field of creating systems that can perform tasks that normally require human intelligence."
            ),
            (
                "What is Machine Learning?",
                "Machine Learning is a branch of AI where systems learn patterns from data and use them to make predictions or decisions."
            ),
            (
                "What is Python?",
                "Python is a high-level programming language known for its simple syntax and large ecosystem."
            )
        ]

        conn.executemany(
            "INSERT INTO flashcards (question, answer) VALUES (?, ?)",
            sample_cards
        )

        conn.commit()

    conn.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/flashcards")
def get_flashcards():

    conn = get_db()

    rows = conn.execute(
        "SELECT id, question, answer FROM flashcards ORDER BY id"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


@app.post("/api/flashcards")
def create_flashcard():

    data = request.get_json(silent=True) or {}

    question = str(
        data.get("question", "")
    ).strip()

    answer = str(
        data.get("answer", "")
    ).strip()

    if not question or not answer:
        return jsonify({
            "error": "Question and answer are required."
        }), 400

    conn = get_db()

    cursor = conn.execute(
        """
        INSERT INTO flashcards (question, answer)
        VALUES (?, ?)
        """,
        (question, answer)
    )

    conn.commit()

    card_id = cursor.lastrowid

    row = conn.execute(
        """
        SELECT id, question, answer
        FROM flashcards
        WHERE id = ?
        """,
        (card_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(row)), 201


@app.put("/api/flashcards/<int:card_id>")
def update_flashcard(card_id):

    data = request.get_json(silent=True) or {}

    question = str(
        data.get("question", "")
    ).strip()

    answer = str(
        data.get("answer", "")
    ).strip()

    if not question or not answer:
        return jsonify({
            "error": "Question and answer are required."
        }), 400

    conn = get_db()

    existing = conn.execute(
        "SELECT id FROM flashcards WHERE id = ?",
        (card_id,)
    ).fetchone()

    if existing is None:
        conn.close()

        return jsonify({
            "error": "Flashcard not found."
        }), 404

    conn.execute(
        """
        UPDATE flashcards
        SET question = ?, answer = ?
        WHERE id = ?
        """,
        (question, answer, card_id)
    )

    conn.commit()

    row = conn.execute(
        """
        SELECT id, question, answer
        FROM flashcards
        WHERE id = ?
        """,
        (card_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(row))


@app.delete("/api/flashcards/<int:card_id>")
def delete_flashcard(card_id):

    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM flashcards WHERE id = ?",
        (card_id,)
    )

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "error": "Flashcard not found."
        }), 404

    return jsonify({
        "message": "Flashcard deleted successfully."
    })


if __name__ == "__main__":
    init_db()

    app.run(debug=True)