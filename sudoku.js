var letters = "ABCDEFGHI";
var digits = "123456789";
var qv = "tttmmmbbb";
var qh = "lllcccrrr";
var puzzle = "008160090010004006726000000800951003507208901100476008000000562600300010050047800";
var squares = {};
var unitlist = {};
var units = {};
var peers = {};

Array.prototype.contains = function(v){
    return this.indexOf(v) >= 0;
}
String.prototype.contains = function(v){
    return this.indexOf(v) >= 0;
}

for(var i=0; i < letters.length; i++){
    for(var j=0; j< digits.length; j++){
        var row = letters[i];
        var col = digits[j];
        var name = row+col;
        squares[name] = true;
        unitlist[row] = (unitlist[row] || []).concat([name]);
        unitlist[col] = (unitlist[col] || []).concat([name]);
        unitlist[qv[i]+qh[j]] = (unitlist[qv[i]+qh[j]] || []).concat([name]);
    }
}

for (var s in squares){
    units[s] = [];
    for(var key in unitlist){
        if(unitlist[key].indexOf(s) >= 0){
            units[s].push(unitlist[key]);
        }
    }
}

for(var s in squares){
    peers[s] = [];
    units[s].forEach(function(unit){
        unit.forEach(function(p){
            if(p !==s && peers[s].indexOf(p)===-1){
                peers[s].push(p);
            }
        });
    });
}

function assign(values, s, d){
    var otherVals = values[s].replace(d,'');
    
    for (var i=0; i < otherVals.length;i++){
        if(!eliminate(values,s,otherVals[i])){
            return false;
        }
    }
    
    return values;
    
}

function parseGrid(grid){
    var values = {};
    
    for(var s in squares){
        values[s] = digits;
    }
    
    var gridVals = {};
    Object.keys(squares).forEach(function(s,i){
        gridVals[s] = grid[i];
    });
    
    for(var s in gridVals){
        if(digits.contains(gridVals[s])){
            if(!assign(values,s,gridVals[s])){
                return false;
            }
        }
    }  
    return values;
}

function eliminate(values,s,d){
    if (!values[s].contains(d)){
        return values;
    }
        values[s] = values[s].replace(d,"");
    if (values[s].length === 1){
        peers[s].forEach(function(peer){
            eliminate(values,peer,values[s]);
        });
    }
    return values;
}

function draw(values){
    for(var key in values){
        document.getElementById(key).innerHTML = values[key]; 
    }
}
var x = parseGrid(puzzle);
draw(x);