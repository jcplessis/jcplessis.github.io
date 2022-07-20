class Input {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.content = Array(height). fill(null). map(() => Array(width).fill(" "))
    }
    
    get_element(x, y){
        if(y < 0 || y >= this.content.length) return null;
        if(x < 0 || x >= this.content[y].length) return null;
        return this.content[y][x];
    }
    
    set_element(x, y, value){
        this.content[y][x] = value;
    }
    
    contains(value){
        for(const row of this.content){
            if(row.includes(value)){
                return true;
            }
        }
        return false;
    }
    
    count(value){
        var result = 0;
        for(const row of this.content){
            for(const cell of row){
                if(cell == value){
                    result ++;
                }
            }
        }
        return result;
    }
    
    find_neighbours(value, selection_function){
        var result = [];
        for(var y = 0; y < this.content.length; y ++){
            for(var x = 0; x < this.content.length; x ++){
                if(this.get_element(x,y) == value){
                    result = result.concat(selection_function(x,y));
                }
            }
        }
        result = [...new Set(result)]
        return result.filter(e => e!= null);
    }
    
    get_all_neighbours(value){
        return this.find_neighbours(value, (x,y) => [
                this.get_element(x-1,y),
                this.get_element(x+1,y),
                
                this.get_element(x,y-1),
                this.get_element(x,y+1)
            ]
        );
    }
    
    get_aboves(value){
        return this.find_neighbours(value, (x,y) => [
                this.get_element(x,y-1)
            ]
        );
    }
    
    get_rights(value){
        return this.find_neighbours(value, (x,y) => [
                this.get_element(x+1,y)
            ]
        );
    }
    
    get_horse_jumps(value){
        return this.find_neighbours(value, (x,y) => [
                this.get_element(x-2,y-1),
                this.get_element(x-2,y+1),
                
                this.get_element(x+2,y-1),
                this.get_element(x+2,y+1),
                
                this.get_element(x+1,y-2),
                this.get_element(x-1,y-2),
                
                this.get_element(x+1,y+2),
                this.get_element(x-1,y+2)
                
            ]
        );
    }
}

assertEquals("Input - can initialize with width", 5, new Input(5,10).width);
assertEquals("Input - can initialize with height", 10, new Input(5,10).height);
assertEquals("Input - is initialized with spaces", " ", new Input(5,10).get_element(0,0));
assertEquals("Input - get element with negative y should return null", null, new Input(5,10).get_element(0,-1));
assertEquals("Input - get element with negative x should return null", null, new Input(5,10).get_element(-1,0));


i = new Input(5,10);
i.set_element(1,1, "*");
assertEquals("Input - can set element", "*", i.get_element(1,1));
assertEquals("Input - contains ", true, i.contains("*"));
assertEquals("Input - does not contain", false, i.contains("+"));

assertEquals("Input - count element - none", 0, i.count("D"));
assertEquals("Input - count element - got one", 1, i.count("*"));
i.set_element(1,3, "*");
assertEquals("Input - count element - got two", 2, i.count("*"));

assertObjectsEquals("Input - get neighbours - element not found", [], i.get_all_neighbours("G"));
assertObjectsEquals("Input - get neighbours - element found - no neighbours", [" "], i.get_all_neighbours("*"));
i.set_element(0,1, "D");
assertObjectsEquals("Input - get neighbours - element found - one neighbour", ["D", " "], i.get_all_neighbours("*"));
assertObjectsEquals("Input - get neighbours - element found - neighbour from the border", ["*", " "], i.get_all_neighbours("D"));
i.set_element(4,9, "Z");
i.set_element(4,8, "V");
assertObjectsEquals("Input - get neighbours - element found - neighbour other border", [" ", "V"], i.get_all_neighbours("Z"));

assertObjectsEquals("Input - get aboves - element not found", [], i.get_aboves("!"));
assertObjectsEquals("Input - get aboves - element found - no above", [" "], i.get_aboves("*"));
i.set_element(1,0, "P");
assertObjectsEquals("Input - get aboves - element found - above found", ["P", " "], i.get_aboves("*"));

assertObjectsEquals("Input - get rights - element not found", [], i.get_rights("!"));
assertObjectsEquals("Input - get rights - element found", ["*"], i.get_rights("D"));

i = new Input(5,5);
i.set_element(2,1, "*");
i.set_element(0,0, "A");
i.set_element(0,2, "B");
i.set_element(1,3, "C");
i.set_element(3,3, "D");
i.set_element(4,2, "E");
i.set_element(4,0, "F");
assertObjectsEquals("Input - get horse jumps - ", ["A", "B", "F", "E", "D", "C"], i.get_horse_jumps("*"));