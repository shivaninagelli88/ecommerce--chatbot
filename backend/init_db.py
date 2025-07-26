from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB_NAME = 'ecommerce.db'

def run_query(query, params=()):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return rows

# Endpoint 1: Top 5 most sold products
@app.route('/top-products', methods=['GET'])
def top_products():
    query = '''
        SELECT p.product_name, SUM(o.quantity) as total_sold
        FROM orders o
        JOIN products p ON o.product_id = p.product_id
        GROUP BY o.product_id
        ORDER BY total_sold DESC
        LIMIT 5
    '''
    result = run_query(query)
    return jsonify(result)

# Endpoint 2: Check order status by ID
@app.route('/order-status/<int:order_id>', methods=['GET'])
def order_status(order_id):
    query = '''
        SELECT order_id, order_status, order_date, customer_id
        FROM orders
        WHERE order_id = ?
    '''
    result = run_query(query, (order_id,))
    if result:
        return jsonify(result[0])
    else:
        return jsonify({"error": "Order ID not found"}), 404

# Endpoint 3: Check product stock by name
@app.route('/stock', methods=['GET'])
def check_stock():
    product_name = request.args.get('product_name')
    query = '''
        SELECT p.product_name, i.stock_quantity
        FROM products p
        JOIN inventory i ON p.product_id = i.product_id
        WHERE p.product_name LIKE ?
    '''
    result = run_query(query, ('%' + product_name + '%',))
    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
