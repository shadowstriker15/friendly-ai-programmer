// Brainfuck JS interpreter that supports error exceptions and maximum iteration limits 
export default function brainfuck(code){
    code = code.replace(/[^<>+\-.,\[\]]/g, "");
    
    var count = 0; // Used to break out of infinite loops
    var max_iteration = 5000;
    var output = "";
    var input = "";
    var input_index = 0;
    var brace_map = buildBraceMap(code);

    var cells = [0];
    var codeptr = 0;
    var cellptr = 0;
    while(codeptr < code.length && count < max_iteration){
        let command = code[codeptr];

        if(command=='>'){
            cellptr += 1;
            if(cellptr==cells.length) cells.push(0); // Add another cell
        }

        else if(command=='<'){
            if(cellptr == 0) break; // Invalid operation
            else cellptr -= 1;
        }

        else if(command=='+'){
            if(cells[cellptr] < 255) cells[cellptr]++;
            else cells[cellptr] = 0;
        }

        else if(command=='-'){
            if(cells[cellptr] > 0) cells[cellptr]--;
            else cells[cellptr] = 255;
        }

        else if(command=='['){
            if(codeptr in brace_map){
                if(cells[cellptr]==0) codeptr = brace_map[codeptr];
            }else break; // Missing a closing bracket
        }
        else if(command==']'){
            if(codeptr in brace_map){
                if(cells[cellptr]!=0) codeptr = brace_map[codeptr]; 
            }else break; // Missing a starting bracket
        }
        else if(command=='.'){ output += String.fromCharCode(cells[cellptr]);
        }
        else if(command==',') cells[cellptr] = (input[input_index++] ? input[input_index - 1] : String.fromCharCode(0)).charCodeAt();

        codeptr++;
        count++;
    }
    return output;
}

function buildBraceMap(code){
    var brace_map = {};
    var temp_bracestack = [];
    for (let i = 0; i < code.length; i++) {
        if(code[i]=='[') temp_bracestack.push(i);
        else if(code[i]==']'){
            if(temp_bracestack.length){
                let start = temp_bracestack.pop();
                brace_map[start] = i;
                brace_map[i] = start;
            }
        }
    }
    return brace_map;
}