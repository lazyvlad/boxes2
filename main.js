import './style.css'
// import javascriptLogo from './javascript.svg'
import { qss,qsa } from './helpers/qol.js'

import Flipper from './flip.js'



const gridRow = (tileRender='') => { return `<div class="row">${tileRender}</div>`; }
const gridTile = (insideTile='',tile_form='') => { return `<div class="tile ${tile_form}">${insideTile}</div>`; } 


//define defaults and GLOBAL variables
let selectedTiles = []; //this is where we keep all the selected tiles (as DOM elements)
let disableClick = false; //this will tell us if clicking the elements is allowed(it should not be when emptying )
let allowedRows = 80; //how many rows do we allow, rows can be more because of the nature of screens, columns not that much
let allowedColumns = 8;
let unloadInterval; //the interval when it's clearing, I have issues with this one


//ELEMENTS
let $grid = document.querySelector('#grid');

const setupGrid = (rows,columns) => {

  let gridTileRender;
  let gridColumnRender;
  let fullGrid = ``;

  for (let index = 0; index < rows; index++) {
    //todo gonna do something with this
    gridTileRender = ``
    for (let j = 0; j < columns; j++) {
      //TODO: gonna do something with rows here

      // gridTileRender += gridTile(++tileNumber);

      let form = document.querySelector('[name="tile-form"]').value;
      form = (form=='square') ? '' : 'circle';
      gridTileRender += gridTile('',form);
      
    }

    // gridColumnRender = gridColumn(gridRow(gridTileRender));
    gridColumnRender = gridRow(gridTileRender);
    fullGrid += gridColumnRender;
    
  }

  $grid.innerHTML = fullGrid;
  showNotification(`Just drew a ${rows} X ${columns} grid of tiles`,'success',2000);


}
//helper functions (show a notification with the autohide options TODO doesn't work properly it seems)
const showNotification = (msg,type='success',autohide=2000) => {
    let $notification = document.querySelector('#notification');
    $notification.innerHTML = `<div class="message ${type}">${msg}</div>`;
    document.querySelector('#notification').classList.add('shown');

    autohide = (autohide) ? +autohide: 0;
    if(autohide){
      setTimeout(()=>{
        hideNotification('');
      },autohide);      
    }
}

const hideNotification = (msg) => {
  let $notification = document.querySelector('#notification');
  $notification.innerHTML = `<div class="message">${msg}</div>`;
  document.querySelector('#notification').classList.remove('shown');
}

const doUnload = (selectedList,direction='FIFO',delay=500) => {

  //direction currently can only be fifo and filo, but for future progress of this we will be doing other types too
  if(direction ==='FIFO'){
    
    //if the interval is not cleared but the selected list is clear, remove it (house keeping).
    if(unloadInterval && selectedList.length===0){
      clearInterval(unloadInterval)
    }
    //start an interval, TODO: lets see how we can do this without intervals and maybe timeouts? For a future project maybe have the tiles recolor themselves in the exact same way as they were clicked
    unloadInterval = setInterval(() => {
        //this is a learning point shift instead of pop will remove the first one
        const element = selectedList.shift();

        if(element){
          element.classList.remove('selected');
        }
        else{
          disableClick = false;
          return;
        }
        showNotification(`We still have ${selectedList.length} items left...`,'success');

        if(selectedList.length===0){
          clearInterval(unloadInterval)
          hideNotification('');
          disableClick = false;
        }
    },delay)


  }
  //filo is the same but we use pop, can't really have them in the same function or can we
  //TODO, make this a function call, the onlyh difference is the shift and the pop
  if(direction ==='FILO'){

    if(unloadInterval && selectedList.length===0){
      clearInterval(unloadInterval)
    }    

    unloadInterval= setInterval(() => {
      const element = selectedList.pop();
      if(element){
        element.classList.remove('selected')
      }
      else{
        disableClick = false;
        return;
      }
      showNotification(`We still have ${selectedList.length} items left...`,'success',2000);

      if (selectedList.length === 0){
        clearInterval(unloadInterval);
        hideNotification('');
        disableClick = false
      }
    }, delay)    

  }

}

//TODO define all the elements like the $grid element, so it will be easier to read the code
// EVENTS

$grid.addEventListener('click',(event) => {

  let totalTiles = document.querySelectorAll('.tile').length;

  if(event.target && event.target.classList.contains('tile')){
      if(disableClick) {
        showNotification(`Click is disabled for the moment`,'failed');
        return;
      }
      if(event.target.classList.contains('selected')) return;

        event.target.classList.add('selected');
        selectedTiles.push(event.target)

      if (selectedTiles.length === totalTiles) {
        //TODO start unloading
        disableClick = true;

        let direction = document.querySelector('[name="direction"]').value;
        let delay = document.querySelector('[name="delay"]').value;
        doUnload(selectedTiles,direction,delay)
      }

  }
})

//quickly change from square to circle
//TODO make it more independant and we should be able to add different types more easily (like triangles for example ? :D)
document.querySelector('[name="tile-form"]').addEventListener('change',(event)=>{

  //TODO this is a learning point, how they can add a class to all the matched elements without jquery
  if(event.target.value == 'circle'){
    //yes an example of array.from
    Array.from(document.querySelectorAll('.tile')).forEach((el)=>{el.classList.add('circle')});    
  }
  else{
    Array.from(document.querySelectorAll('.tile')).forEach((el)=>{
      el.classList.remove('circle')
    });
  }
})

//wrap the calls to doUnload in a function because we will be calling this twice in the event Function
const unloadWrap = () => {
  //need to disable the click when the unloading is happening
  disableClick = true;
  let direction = document.querySelector('[name="direction"]').value;
  let delay = document.querySelector('[name="delay"]').value;
  //call the thing for unload
  doUnload(selectedTiles,direction,delay)

}
//this one is a mess im still not sure why unloadInterval is not getting cleared but this is one way to handle it
document.querySelector('[name="unload-now"]').addEventListener('click',(event)=>{

  if(unloadInterval && selectedTiles.length > 0){
    showNotification(`Still busy unloading...`,'failed');

    if(selectedTiles.length===0){
      clearInterval(unloadInterval);
    }
    
    if(!disableClick){
      clearInterval(unloadInterval);
      unloadWrap();
    }
    
    return;      

  }


  if(!disableClick){
    unloadWrap()
  }    



});




document.querySelector('[name="new-grid-btn"]').addEventListener('click',(event)=>{


  if(event.target){
    const el = event.target;

    let rows = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="rows"]')[0].value;
    let columns = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="columns"]')[0].value;

    rows = (rows>0) ? Math.min(rows,allowedRows) : 1
    columns = (columns>0) ? Math.min(columns,allowedColumns) : 1

    setupGrid(rows,columns)
  }

  event.preventDefault()
})

document.querySelector('[name="rows"]').addEventListener('keyup',(event)=>{

  if(event.keyCode == 13){
    const el=event.target;
    let rows = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="rows"]')[0].value;

    if(rows===0){
      showNotification(`0 is not allowed as a valid <strong>rows</strong> number`,'failed');
      return;
    }
    let columns = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="columns"]')[0].value;
    
    rows = (rows>0) ? Math.min(rows,allowedRows) : 1
    columns = (columns>0) ? Math.min(columns,allowedColumns) : 1

    setupGrid(rows,columns)
  }
})


document.querySelector('[name="columns"]').addEventListener('keyup', (event) => {

  if (event.keyCode == 13) {

    const el = event.target;
    let rows = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="rows"]')[0].value;
    let columns = +el.closest('.multiple-controls').querySelectorAll(':scope > .control > [name="columns"]')[0].value;

    if (columns === 0) {
      showNotification(`0 is not allowed as a valid <strong>columns</strong> number`,'failed');
      return;
    }

    rows = (rows>0) ? Math.min(rows,allowedRows) : 1
    columns = (columns>0) ? Math.min(columns,allowedColumns) : 1

    setupGrid(rows, columns)
  }
})

let rows = document.querySelector('[name="rows"]').value;
let columns = document.querySelector('[name="columns"]').value;

setupGrid(rows,columns);


let $difficulty = document.querySelector('#difficulty');
let $tile_form = document.querySelector('#box2-tile-form');
let difficulty = $difficulty.value
let tile_form = $tile_form.value;

let flipper = new Flipper(document.querySelector('#flipper-grid'),{difficulty:difficulty,tile_form:tile_form,player_name:'Prince Charles'});

$tile_form.addEventListener('change',(event)=>{
  flipper.changeTileForm(event.target.value);
  flipper.restartGame();
})

$difficulty.addEventListener('change',(event)=>{ 

  flipper.changeDifficulty(event.target.value);
  flipper.restartGame();

})


/**Dialog stuff */
qss('#set-player-name').addEventListener('click', (event)=>{

  if (typeof qss('#name-dialog').showModal === "function") {
    qss('#name-dialog').showModal();
  } else {
    qss('output').value = "Sorry, the <dialog> API is not supported by this browser.";
  }

});


qss('#player-name').addEventListener('change', (e) => {
  qss('#set-player-name').value = e.target.value;
});


qss('#cancel-button').addEventListener('click', (event) => {

  qss('#set-player-name').value = '';
  event.target.value = 'true';
});

qss('#confirm-button').addEventListener('click', (event) => {
  qss('#cancel-button').value = 'false';

});

qss('#name-dialog').addEventListener('cancel', (event) => {
  qss('#cancel-button').value = 'true';
})

qss('#name-dialog').addEventListener('close', (event) => {

  if(qss('#cancel-button').value == 'true'){
    qss('output').value = `cancelled. Player name is still ${flipper.getPlayerName()}`;
  }
  else if(qss('#cancel-button').value == 'false'){

    console.log(`%c player name ${qss('#set-player-name').value}`,'background:black;color:white')

    flipper.setPlayerName(qss('#set-player-name').value)
    // qss('output').value = `${flipper.getPlayerName()} was set as a player  on - ${(new Date()).toString()}`;
    qss('output').value = `${flipper.getPlayerName()} was set as a player.`;

  }

});
/**oh boy this is long */
//TODO make this as a class that can be included anywhere





console.log(flipper.params.size);

console.log(flipper.getSelectedTiles())