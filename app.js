//neco jako calss nedostanes se k funkcim ve vnitr nebo k promenim jako je x nebo add
//lekce 68 pro "Closures" kdibis netusil jak to funguje

//back end
var bugetController = (function(){
    //private
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    //publick
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            // new id
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
            // new item
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            // push it to array
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        }, 
        
        testing: function(){
            console.log(data);
        }
    };
    
})();

//front end
var UIController = (function() {
    //Private
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    //Publick
    return{
        getinput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, //Will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        
        addListItem: function (obj, type){
            var html, newHtml, element;
            // create html sting whiyt palace holder tex
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
                console.log(html);
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
            }
            
            // replace place holder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //inseert the html into the dom
            //vibere element a vztvori novi emement do seynamu na insertAdjacentHTML je dokumentace
            //beforeend element bude vztvoren jako dite bud income__list nebo expenses__list ale prida se na konec
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);  
            //musime to volat takto protoze slice ocekava array a vraci jeho kopiji
            fieldsArr = Array.prototype.slice.call(fields);
            //neji to  jako normani funkce ale jako metoda pro Array (foreach)
            //array == fieldsArr
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            //vibere prvni element v fieldsArr a nastavi ho na focus
            fieldsArr[0].focus();
        },
        
        //preda DOMstrings nekomu kdo bude volata tuto verejnou funkci
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
})();


//propojovac mezi front and back
var controller = (function(bugetCtrl, UICtrl){ //argumety pro funkci
    
    //Private
    //construktor nebo neco podobneho inicializace potrebnich promenich
    var setupEventListeners = function(){
        var DOMstrings = UICtrl.getDOMstrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
        //starsi brpusry pouyivaji "event.whitch === 13" nebo "event.keyCode === 13" 
            if (event.key === "Enter"){
                ctrlAddItem();
            }
        });
    };
    
    var ctrlAddItem = function (){
        var input, newItem;
        
        //1. get the fled input data
        input = UICtrl.getinput();
        
        //2. add the item to the budget controller
        newItem = bugetCtrl.addItem(input.type, input.description, input.value);
        
        //3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        //4. clear the filds
        UICtrl.clearFields();
        
        //5. calculate the budget
        //6. displaz the bufget on the UI
    }
    //Publick
    return{
        //inicializace vola construktor
        init: function(){
            setupEventListeners();
        }
    }
    
})(bugetController, UIController); //predane argumenty


controller.init();
