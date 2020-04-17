from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()

@app.route("/get-statuses")
@json_response
def get_statuses():
    """
        RETURNS ALL THE STATUSES
    """
    return data_handler.get_statuses()

@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)

@app.route("/get-all-cards")
@json_response
def get_all_cards():
    return data_handler.get_all_cards()

@app.route("/create-board", methods=['GET', 'POST'])
def create_board():
    if request.method == 'POST':
        boardName = request.json
        data_handler.insert_board(boardName)
        return boardName

@app.route("/delete-board/<board_id>",methods=['GET','POST'])
def delete_board(board_id):
    if request.method == 'POST':
        board_id = request.json
        data_handler.delete_board(board_id)
        return board_id


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
