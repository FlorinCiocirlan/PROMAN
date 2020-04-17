import connection


_cache = {}  # We store cached data in this dict to avoid multiple file readings



# def _get_data(data_type, file, force):
#     """
#     Reads defined type of data from file or cache
#     :param data_type: key where the data is stored in cache
#     :param file: relative path to data file
#     :param force: if set to True, cache will be ignored
#     :return: OrderedDict
#     """
#     if force or data_type not in _cache:
#         _cache[data_type] = _read_csv(file)
#     return _cache[data_type]

def get_all_boards():
    query = "SELECT * FROM board"
    data = connection.execute_select(query)
    _cache['all-boards'] = data
    return connection.execute_select(query)


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses():
    query = "SELECT * FROM status"
    data = connection.execute_select(query)
    _cache['all-statuses'] = data
    return connection.execute_select(query)


def get_cards_for_board(board_id):
    query = "SELECT * FROM card WHERE board_id='{id}'".format(id=board_id)
    data = connection.execute_select(query)
    _cache['cards'] = data
    return connection.execute_select(query)

def get_all_cards():
    query = "SELECT * FROM card"
    return connection.execute_select(query)

def insert_board(boardName):
    print("a intrat pe persistence")
    default_statuses_id = {0,1,2,3}
    query = "INSERT INTO board (title, statuses_id) VALUES('{boardName}','{statuses_id}')".format(boardName=boardName, statuses_id=default_statuses_id)
    connection.execute_dml_statement(query)

def delete_board(board_id):
    query = "DELETE FROM board WHERE id='{id}'".format(id=board_id)
    connection.execute_dml_statement(query)


# def get_statuses_for_boards():
# #     query = "select distinct status.title , status.id as status_id, board.id as board_id from status " \
# #                 "join card on status.id = card.status_id " \
# #                 "join board on card.board_id = board.id " \
# #                 "order by status_id asc; "
# #     return connection.execute_select(query)


# def get_boards(force=False):
#     return _get_data('boards', force)
#
#
# def get_cards(force=False):
#     return _get_data('cards', force)
