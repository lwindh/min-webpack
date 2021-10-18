const year = '2021'; 
const month = '10'; 
const day = '18'; 

let template = '{{year}}-{{month}}-{{day}}';
let context = { year, month, day };

const str = render(template)({year,month,day}); 

console.log(str)

function render(template) {
    return function(context) {
        const reg = /\{\{(.*?)\}\}/g
        return template.replace(reg, (match, key) => context[key])
    }
}