import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

def get_db():
    return mysql.connector.connect(
        host=os.environ.get("MYSQLHOST"),
        user=os.environ.get("MYSQLUSER"),
        password=os.environ.get("MYSQLPASSWORD"),
        database=os.environ.get("MYSQLDATABASE"),
        port=int(os.environ.get("MYSQLPORT")),
        autocommit=True
    )

app = Flask(__name__)
CORS(app)

@app.route("/products", methods=["GET"])
def get_products():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(products)

@app.route("/sales", methods=["GET"])
def get_sales():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sales ORDER BY id DESC")
    sales = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(sales)

@app.route("/sales", methods=["POST"])
def add_sale():
    try:
        data = request.json

        valid_items = [
            row for row in data["items"]
            if row["item"] != "" and row["qty"] != ""
        ]

        order_total = sum(
            float(row["qty"]) * float(row["price"])
            for row in valid_items
        )

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT credit_limit FROM parties WHERE party_name=%s",
            (data["party"],)
        )
        party_data = cursor.fetchone()

        if party_data:
            credit_limit = float(party_data["credit_limit"])

            cursor.execute(
                "SELECT COALESCE(SUM(total_amount),0) AS total FROM sales WHERE party=%s",
                (data["party"],)
            )
            outstanding = float(cursor.fetchone()["total"])

            if outstanding + order_total > credit_limit:
                cursor.close()
                db.close()
                return jsonify({
                    "error": f"Credit Limit Exceeded. Limit ₹{credit_limit}, Outstanding ₹{outstanding}"
                }), 400

        cursor.execute("SELECT COUNT(*) AS total FROM sales")
        count = cursor.fetchone()["total"]
        do_number = f"DO-{1001 + count}"

        cursor.execute("""
            INSERT INTO sales
            (do_number, party, address, total_amount)
            VALUES (%s,%s,%s,%s)
        """, (
            do_number,
            data["party"],
            data["address"],
            order_total
        ))

        sale_id = cursor.lastrowid

        for row in valid_items:
            cursor.execute("""
                INSERT INTO sales_items
                (sale_id, item, qty, price)
                VALUES (%s,%s,%s,%s)
            """, (
                sale_id,
                row["item"],
                int(row["qty"]),
                float(row["price"])
            ))

            cursor.execute("""
                UPDATE products
                SET virtual_stock = virtual_stock - %s
                WHERE name = %s
            """, (
                int(row["qty"]),
                row["item"]
            ))

        cursor.close()
        db.close()

        return jsonify({
            "message": "D.O Added Successfully",
            "do_number": do_number
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dispatch", methods=["POST"])
def dispatch_order():
    try:
        data = request.json
        do_number = data["do_number"]

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT * FROM sales WHERE do_number=%s", (do_number,))
        sale = cursor.fetchone()

        if not sale:
            cursor.close()
            db.close()
            return jsonify({"message": "D.O not found"}), 404

        cursor.execute(
            "SELECT item, qty, price FROM sales_items WHERE sale_id=%s",
            (sale["id"],)
        )
        items = cursor.fetchall()

        for row in items:
            cursor.execute("""
                UPDATE products
                SET actual_stock = actual_stock - %s
                WHERE name = %s
            """, (
                int(row["qty"]),
                row["item"]
            ))

        cursor.execute("""
            UPDATE sales
            SET vehicle=%s, driver_contact=%s
            WHERE do_number=%s
        """, (
            data["vehicle"],
            data["driver_contact"],
            do_number
        ))

        sale["items"] = items
        sale["vehicle"] = data["vehicle"]
        sale["driver_contact"] = data["driver_contact"]

        cursor.close()
        db.close()

        return jsonify({
            "message": "Dispatch completed",
            "sale": sale
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dashboard", methods=["GET"])
def dashboard_data():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
        SUM(actual_stock) AS actual_stock,
        SUM(virtual_stock) AS virtual_stock
        FROM products
    """)
    stock = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) AS total_sales FROM sales")
    sales_count = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) AS dispatched FROM sales WHERE vehicle IS NOT NULL")
    dispatched = cursor.fetchone()

    actual = stock["actual_stock"] or 0
    virtual = stock["virtual_stock"] or 0

    cursor.close()
    db.close()

    return jsonify({
        "actual_stock": actual,
        "virtual_stock": virtual,
        "total_sales": sales_count["total_sales"],
        "dispatched": dispatched["dispatched"],
        "pending_dispatch": actual - virtual
    })

@app.route("/latest-sale", methods=["GET"])
def latest_sale():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM sales ORDER BY id DESC LIMIT 1")
    sale = cursor.fetchone()

    if not sale:
        cursor.close()
        db.close()
        return jsonify({})

    cursor.execute(
        "SELECT item, qty, price FROM sales_items WHERE sale_id=%s",
        (sale["id"],)
    )
    sale["items"] = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(sale)

@app.route("/admin-sales", methods=["GET"])
def admin_sales():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM sales ORDER BY id DESC")
    sales_data = cursor.fetchall()

    for sale in sales_data:
        cursor.execute(
            "SELECT item, qty, price FROM sales_items WHERE sale_id=%s",
            (sale["id"],)
        )
        sale["items"] = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(sales_data)

@app.route("/parties", methods=["GET"])
def get_parties():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM parties ORDER BY party_name")
    parties = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(parties)

@app.route("/update-limit", methods=["POST"])
def update_limit():
    try:
        data = request.json

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            UPDATE parties
            SET credit_limit=%s
            WHERE party_name=%s
        """, (
            data["credit_limit"],
            data["party_name"]
        ))

        cursor.close()
        db.close()

        return jsonify({"message": "Limit Updated"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)