from flask import Flask, request, render_template
from flask.json import jsonify
from flask_cors.decorator import cross_origin
from main_wallet_create import MainWallet
from tatum_api_calls import *
from flask_cors import CORS

#Initialise flask app
app = Flask(__name__)
# CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'X-Api-Key'

#Initialise main wallet
wallet = MainWallet()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/initialize', methods=['GET'])
# @cross_origin()
def initialize():
    global wallet
    print(request.headers)
    if 'X-Api-Key' not in request.headers.keys():
        return jsonify({'response': 'error', 'message': 'no api key present'}), 401
    else:
        if wallet.key == "":
            wallet.key = request.headers['X-Api-Key']
            wallet.initialize_wallet()
        return jsonify({'response': 'OK', 'message': 'Initialized successfully'}), 200

@app.route('/server-state', methods=['GET'])
# @cross_origin()
def server_state():
    global wallet
    if wallet.key != "":
        return jsonify({'response': 'OK', 'message': 'Initialized successfully'}), 200
    else: 
        return jsonify({'response': 'error', 'message': 'server error'}), 400

#Application endpoints
@app.route('/user/<username>', methods=['GET'])
# @cross_origin()
def user(username):
    global wallet
    user = None
    print('request for user received')
    if (username.lower() in accounts_dict.keys()):
        user = accounts_dict[username].user
    else:
        print(username, wallet.key)
        user = create_user_account(username, wallet.key)
        account_top_up(user["account_id"], 100, wallet)
        
    response = {
            "result": "OK",
            "account_metadata": user
        }
    print("ready to return user")
    return jsonify(response), 200

@app.route('/contacts/<username>', methods=['GET'])
# @cross_origin()
def contacts(username):
    global wallet
    contacts = get_contacts(username)
    response = {
            "result": "OK",
            "user_contacts": contacts
        }
    print("ready to return user")
    return jsonify(response), 200

@app.route('/balance/<username>', methods=['GET'])
# @cross_origin()
def balance(username):
    global wallet
    account_id = accounts_dict[username].user["account_id"]
    balance_data = get_balance(username,account_id, wallet.key)
    response = {
        "result": "OK",
        "balance": balance_data
    }
    print("ready to return balance")
    return jsonify(response), 200

@app.route('/transactions/<username>', methods=['GET'])
# @cross_origin()
def transactions(username):
    global wallet
    account_id = accounts_dict[username].user["account_id"]
    transaction_data = get_transactions(account_id, wallet.key)
    response = {
        "result": "OK",
        "transactions": transaction_data
    }
    print("ready to return transactions")
    return jsonify(response), 200

@app.route('/top-up/<username>', methods=['POST'])
# @cross_origin()
def top_up(username):
    global wallet
    request_body = request.get_json(force=True)
    account_id = accounts_dict[username].user["account_id"]
    top_up_data = account_top_up(account_id, request_body['amount'], wallet)
    response = {
        "result": "OK",
        "transactions": top_up_data,
        "balance": get_balance(account_id, wallet.key)
    }
    print("ready to return top up")

    accounts_dict[username].user["tree_points"] += 2

    return jsonify(response), 200

@app.route('/payment/<username>', methods=['POST'])
# @cross_origin()
def payment(username):
    global wallet
    request_body = request.get_json(force=True)
    account_id = accounts_dict[username].user["account_id"]
    payment_data = payment_transfer(account_id, request_body, wallet.key)
    response = {
        "result": "OK",
        "transaction": payment_data,
        "balance": get_balance(account_id, wallet.key)
    }

    #Add as a contact to both parties:
    #Add to receiver
    payee = accounts_dict[username]
    payee_contacts = payee.add_contact(request_body['receiver'], request_body['username'])
    print('payee contacts: ', payee_contacts)
    #Add to sender
    payer = accounts_dict[request_body['username']]
    payer_contacts = payer.add_contact(account_id,username)
    print('Payer contacts: ', payer_contacts)

    print("ready to return payment")

    accounts_dict[username].user["tree_points"] += 2

    return jsonify(response), 200

@app.route('/escrow-pay/<username>', methods=['POST'])
# @cross_origin()
def escrow_pay(username):
    global wallet
    request_body = request.get_json(force=True)
    account_id = accounts_dict[username].user["account_id"]
    escrow_pay_data = escrow_payment(account_id, request_body, wallet.key)
    response = {
        "result": "OK",
        "transaction": escrow_pay_data,
        "balance": get_balance(account_id, wallet.key)
    }

    #Add as a contact to both parties:
    #Add to receiver
    payee = accounts_dict[username]
    payee_contacts = payee.add_contact(request_body['receiver'], request_body['username'])
    print('Payee contacts: ', payee_contacts)
    #Add to sender
    payer = accounts_dict[request_body['username']]
    payer_contacts = payer.add_contact(account_id,username)
    print('Payer contacts: ', payer_contacts)

    print("ready to return escrow data")

    accounts_dict[username].user["tree_points"] += 1

    return jsonify(response), 200

@app.route('/escrow-clear/<username>', methods=['POST'])
# @cross_origin()
def escrow_clear(username):
    global wallet
    request_body = request.get_json(force=True)
    account_id = accounts_dict[username].user["account_id"]
    escrow_clear_data = escrow_clear_amount(account_id, request_body, wallet.key)
    response = {
        "result": "OK",
        "transaction": escrow_clear_data,
        "balance": get_balance(account_id, wallet.key)
    }
    print("ready to return escrow clear")
    return jsonify(response), 200

@app.route('/stake/<username>', methods=['POST'])
def stake_funds(username):
    global wallet
    username=username.lower()
    request_body = request.get_json(force=True)
    request_response = stake_amount_to_main(username, accounts_dict[username].user["account_id"],request_body["amount"], wallet)
    response = {
        "result": "OK",
        "transaction": request_response,
        "balance": get_balance(accounts_dict[username].user["account_id"], wallet.key)
    }

    accounts_dict[username].user["tree_points"] += 5

    return jsonify(response), 200
    

@app.route('/borrow/<username>', methods=['POST'])
def borrow_funds(username):
    global wallet
    username=username.lower()
    request_body = request.get_json(force=True)
    request_response = borrow_amount_from_pool(username, accounts_dict[username].user["account_id"],request_body["amount"], wallet)
    response = {
        "result": "OK",
        "transaction": request_response,
        "balance": get_balance(accounts_dict[username].user["account_id"], wallet.key)
    }

    accounts_dict[username].user["tree_points"] += 5

    return jsonify(response), 200

#for local testing
def start_ngrok():
    from pyngrok import ngrok
    url = ngrok.connect(5000).public_url
    print(' * Tunnel URL:', url)

#main run function
if __name__ == "__main__":
    # start_ngrok()
    app.run(debug=False)
