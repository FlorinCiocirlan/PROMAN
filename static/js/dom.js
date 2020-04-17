// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';
        for(let board of boards){
                boardList += `
                    <div id="boardContainer" class="mb-5">
                        <div id="boardHeader_${board.id}" class="d-flex p-3 border rounded">              
                            <div id="boardTitle_${board.id} " class="mr-auto" >
                                <h3 contenteditable id="title_${board.id}">${board.title}</h3>
                            </div>
                            
                            <div class="mr-2">
                                <button id="delete_${board.id}"  class="btn btn-outline-dark btn-sm " type="button">DELETE BOARD</button>
                            </div>
                            
                            <div class="mr-2">
                                <button id="addStatus_${board.id}"  class="btn btn-outline-dark btn-sm " type="button">+ Add Status</button>
                            </div>  
                            
                             <div>
                                <button id="expandBoard_${board.id}" class="btn btn-outline-dark btn-sm" type="button">v</button>                       
                            </div>
                        </div>
                        <div id="boardContent_${board.id}" data-statuses-id="[${board.statuses_id}]" class="BoardContent" style="display: none">
                            <div class="row mr-auto ml-auto w-75">
                            
                            </div>
                        </div>
                    </div>
                `;

        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML ='';
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        dom.loadStatuses();
    },
    loadStatuses: function(){
        dataHandler.getStatuses(function(statuses){
            dom.appendStatuses(statuses)
        })
    },
    appendStatuses: function(statuses){
        let boardList = document.querySelectorAll('[id^="boardContent"]');
        let statusBody =``;
        for (let board of boardList){
           for(let eachStatus of statuses){
               if(board.dataset.statusesId.includes(eachStatus.id)){
                   let statusContainer = `
                                         <div class="statusContainer col-sm text-center bg-light m-2 p-0" id="statusContainer_${eachStatus.id}">
                                            <div id="StatusHeader_${eachStatus.id}" class="border rounded bg-white"><p>${eachStatus.title}</p></div>
                                            <div class="statusContent" id="statusContent_${eachStatus.id}" data-id="${eachStatus.id}" data-board-id="${board.id}"></div>
                                          </div>`;
                   board.firstElementChild.insertAdjacentHTML('beforeend',statusContainer)
               }
           }
       }
        dom.loadCards();
        // dom.createBoard();
    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        dataHandler.getAllCards(function(cards){
            dom.showCards(cards)
        })
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statusList = document.querySelectorAll('[id^="statusContent"]')
        for(let status of statusList){
            let boardId = parseInt(status.dataset.boardId.slice(13));
            let statusId = parseInt(status.dataset.id);
            for(let card of cards){
                if ((boardId === card.board_id) && (statusId === card.status_id)){
                    let cardHTML = `<div data-card-id="card_${card.id}" data-status-id="${statusId}" class="bg-dark text-white m-1 border-white rounded">
                                        ${card.title}
                                    </div>`
                    status.insertAdjacentHTML('beforeend', cardHTML)
                }
            }
        }
    // document.querySelector('body').style.fontFamily="Noto Serif JP, serif"
    //Call features after initializing and showing boards
    dom.expandBoard();
    dom.getDeleteBoardButtons();
    },
    expandBoard: function(){
        let buttonList = document.querySelectorAll('[id^="expandBoard_"]');
        for (let button of buttonList){
            button.addEventListener('click', function(){
                handleExpandBoard(button.id);
            })
        }
        let handleExpandBoard = function(fullBoardId){
            let boardId =  fullBoardId.slice(12);
            let boardContent = document.querySelector(`#boardContent_${boardId}`);
            if (boardContent.style.display === 'none'){
                boardContent.style.display = 'block'
            } else{
                boardContent.style.display = 'none'
            }

        }
    },
    createBoard: function(){
        let createBoardButton = document.querySelector('#createBoard')
        let boardName='New board';
        createBoardButton.addEventListener('click', function(){
            dataHandler.createNewBoard(boardName)
        });
    },

    // here comes more features
    getDeleteBoardButtons: function(){
        let deleteButtonList = document.querySelectorAll('[id^="delete_"]')
        for (let button of deleteButtonList){
            button.addEventListener('click',function(){
                handleDeleteClick(button.id)
            })
        }
        let handleDeleteClick = function(fullBoardId){
            let boardId = fullBoardId.slice(7)
            dataHandler.deleteBoard(boardId,function(){
                dom.afterDelete()
            })
        }
    },
    afterDelete: function(){
        dom.loadBoards();
    }
};
