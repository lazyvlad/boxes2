/**
 * defaults that can be overriden by passing an object to the constructor
 */
const defaults = {
    difficulty : 'easy',
	tile_form: "circle",
    moves : 0,
    player : 'Random Internet Guy'

};
/**
 * Flipper will create a board of X*X tiles and randomly flip a few.
 * Each time a tile is flipped by clicking on it, all neighbour tiles will be flipped opposite.
 * The goal of the game is to clear the board. I think.
 *
 */
class Flipper {
	#gridRow = (tileRender = "" , i) => {
		return `<div class="row" data-row="${i}">${tileRender}</div>`;
	};
	#gridTile = (insideTile = "", tile_form = "",tile_selected="", position) => {
		return `<div class="tile ${tile_form} ${tile_selected}" data-position="${position[0]},${position[1]}" data-row="${position[0]}" data-column="${position[1]}">${insideTile}</div>`;
	};
    /**
     * 
     * @param {Array} tile - an array of two element (i,j) that explains the position of the tile
     * @param {Array} full - an array of array of two elements describing all selected positions
     * @returns Array | false
     */
    #tileFlipped = (tile,full) => {

        let found_element = full.find((position)=>{
            if((position[0] === tile[0]) && (position[1] === tile[1])){
                return position
            }
        }); 
        
        return (found_element) ? found_element : false;

    };
    /**
     * Setup the starting grid. This function builds our HTML for the grid;
     */
	#setupGrid = () => {
		let grid_tile_render;
		let grid_column_render;
		let full_grid = ``;

		for (let i = 0; i < this.params.size; i++) {
			grid_tile_render = ``;
			for (let j = 0; j < this.params.size; j++) {
				
                let tile_selected = '';
                if(this.#tileFlipped([i,j],this.#selectedTiles)){
                    tile_selected = 'selected'
                }

				grid_tile_render += this.#gridTile("", this.params.tile_form,tile_selected,[i,j]);

			}
			grid_column_render = this.#gridRow(grid_tile_render , i);
			full_grid += grid_column_render;
		}

		this.grid.innerHTML = full_grid;

        this.totalElement = this.params.size**2;

	};
    /**
     * Setup grid events. When called will attach events to flipper controls
     */
    #setupGridEvents = () => {

        this.grid.addEventListener('click', (event) => {
            if(this.disableClick)
                return;

            if(event.target.classList.contains('tile')){                
                this.#flipEventHandler(event.target);
            }
            else{
                event.preventDefault();
                return;
            }
        });

        this.restart_button.addEventListener('click', (event) => {
            this.restartGame();
        })


    };
    /**
     * Find a dom element by it's coordinate via the data-position attribute and FLIP it
     * @param {Array} pos 
     */
    #doAFlipo = (pos) => {

        let query_selector = `[data-position="${pos[0]},${pos[1]}"]`;
        let tile_at_pos = document.querySelector(query_selector);


        if(tile_at_pos.classList.contains('selected'))
            tile_at_pos.classList.remove('selected')
        else
            tile_at_pos.classList.add('selected')        

    };
    /**
     * Event handler function that handles the fliping of tiles by click
     * @param {Element} target - the clicked element
     * @returns void
     */
    #flipEventHandler = (target) => {
        if (!(target instanceof Element)){
			console.log(
				`%c Tile needs to be an Element`,
				"background:#333;color:red"
			);
			return;
        }

        this.params.moves++;
        document.querySelector('#moves').innerHTML = this.params.moves;

        //get the position of the clicked element by grabbing it from the attributes of that element
        let current_position = [+target.getAttribute('data-row'),+target.getAttribute('data-column')];
        //run findNeighbours which will find the elements in a cross like way from the current position
        let neighbours = this.#findNeighbours(current_position);

        //flip the current positions
        this.#doAFlipo(current_position);

        //flip the neighbours
        neighbours.forEach((pos) => {
               this.#doAFlipo(pos);
        });
        
        //WIN AT THE GAME!!!!
        if(this.grid.querySelectorAll(':scope .tile.selected').length === 0){
            //WINNER
            this.results_area.classList.add('shown');
            this.disableClick = true;

        }

    };
    /**
     * Find the neighours of the given position by doing a cross.
     * @param {Array} target_position 2 - element array that describes the position in the grid
     * @returns Array of positions
     */
    #findNeighbours = (target_position) => {
        let all_candidates = []

        let up_down = target_position[0];
        let left_right = target_position[1];

        //go up from current position
        if(up_down - 1 >= 0){
            //if up is ok add that tile
            all_candidates.push([up_down - 1,left_right]);
        }
        //go down from position
        if(up_down + 1 < this.params.size ){
            all_candidates.push([up_down + 1, left_right]);
        }

        if(left_right - 1 >= 0){
            all_candidates.push([up_down, left_right - 1]);
        }

        if(left_right + 1 < this.params.size){
            all_candidates.push([up_down, left_right + 1]);
        }

        return all_candidates;
    };
    /**
     * Fills the starting grid with all selected files. We use this to create possible starting positions, by first filling the whole field and then clicking randomly
     * @returns Array of positions representing the full grid
     */
    #fillGrid = () => {

        let fullMatrix = [];
        for (let i = 0; i < this.params.size; i++) {
            for (let j = 0; j < this.params.size; j++) {
                fullMatrix.push([i,j]);                
            }            
        }
        
        return fullMatrix;
    };
    /**
     * Randomize selected tiles. This essentialy creates the first starting position, by clicking randomly on the previously filled board
     */
    #doRandomSelectedTiles = () => {

        let random_points = Math.floor(Math.random() * 7 + 4)

        // console.log(`random points: ${random_points}`)
        for (let index = 0; index < random_points; index++) {
            let i = Math.floor(Math.random() * this.params.size);
            let j = Math.floor(Math.random() * this.params.size);
            let current_position = [i,j]
            let neighbours = this.#findNeighbours(current_position);
            this.#doAFlipo(current_position);
            neighbours.forEach((pos) => {
                   this.#doAFlipo(pos);
            });        
        }
        
    }
	#selectedTiles = [];
	/**
	 *
	 * @constructor
	 * @param {Element} o - instance of a DOM element
	 * @param {object} params - key : value pairs of params that will override default settings
	 *
	 */
	constructor(o, params) {

		if (!o || !(o instanceof Element)) {
			console.log(
				`%c Container must be an existing DOM element`,
				"background:#333;color:red"
			);
			return;
		}

		this.grid = o;

        this.disableClick = false;

        this.restart_button = document.querySelector('#restart-game');
        this.results_area = document.querySelector('#fliper-results');
        if(!this.restart_button || this.restart_button.length===0){
			console.log(
				`%c There is no restart button element`,
				"background:#333;color:red"
			);            
        }
		this.params = Object.assign({}, defaults, params);

        this.changeDifficulty(this.params.difficulty);
        this.changeTileForm(this.params.tile_form);

		this.#selectedTiles = this.#fillGrid();

		this.#setupGrid();
        this.#doRandomSelectedTiles();
        this.#setupGridEvents();
	}
	/**
	 *
	 * @returns #selectedTiles
	 *
	 */
	getSelectedTiles() {
		return this.#selectedTiles;
	}
    /**
     * Restart the game board, draws a new grid, does randomization of tiles, enables clicking tiles and hides notification
     */
    restartGame(){

		this.#selectedTiles = this.#fillGrid();

		this.#setupGrid();
        this.#doRandomSelectedTiles();
        this.results_area.classList.remove('shown');
        this.disableClick = false;
        this.params.moves = 0;
        document.querySelector('#moves').innerHTML = this.params.moves
    }
    /**
     * Based on the level of difficulty we create the grid size
     * @param {enum} difficulty  level of dificulty [easy,hard,nightmare]
     */
    changeDifficulty(difficulty){
        this.params.difficulty = difficulty;

        switch (this.params.difficulty) {
            case 'easy':
                this.params.size = 4
                break;
            case 'hard':
                this.params.size = 5
                break;
            case 'nightmare':
                this.params.size = 6
                break;
            default:
                this.params.size = 4
                break;
        }        
    }
    changeTileForm(tile_form){
        this.params.tile_form = tile_form;
    }
    setPlayerName(player_name){
        this.params.player_name = player_name;
    }
    getPlayerName(){
        return this.params.player_name;
    }
}

export default Flipper;
