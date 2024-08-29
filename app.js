const button            = document.getElementById('save');
const list              = document.querySelector('.list')
const amountField       = document.getElementById('amount');
const descriptionField  = document.getElementById('description');
const incomesField      = document.getElementById('income-total');
const expensesField     = document.getElementById('expense-total');
const balanceField      = document.getElementById('balance-total');

button.addEventListener('click', saveRegister)
list.addEventListener('click', deleteItem)

class Budget {
    constructor(){
        this.incomes        = [];
        this.expenses       = [];
        this.balance        = 0;
        this.totalIncomes   = 0;
        this.totalExpenses  = 0;
    }
    getBalance(){
        this.totalIncomes   = this.incomes.reduce((total, item) => total + Number(item.amount), 0 );
        this.totalExpenses  = this.expenses.reduce((total, item) => total + Number(item.amount), 0 );
        this.balance        = this.totalIncomes - this.totalExpenses;

        console.log(`El balance es: ${this.balance}`);
    }
    getValidations(){
        const value50 = this.totalIncomes * 0.50
        const value25 = this.totalIncomes * 0.25
        let color = 'black'

        if (this.balance > value25 && this.balance <= value50)
            color = 'orange'
        else if(this.balance <= value25 )
            color = 'red'

        return color;
    }
    addRecord(record, type){
        if(type === 'income')
            this.incomes = [...this.incomes, record]
        else if(type === 'expense')
            this.expenses = [...this.expenses, record]
        
        this.getBalance()
    }
    removeRecord(id, type){
        if(type === 'income')
            this.incomes = this.incomes.filter(item => item.id != id )
        else if(type === 'expense')
            this.expenses = this.expenses.filter(item => item.id != id)
        
        this.getBalance()
    }
}

class UI {
    addRowToHtml(record){
        const nameClass = record.type == 'income' ? 'bg-success-25' : 'bg-danger-25'
        const string    = record.type == 'income' ? `S/. ${record.amount}` : `- S/. ${record.amount} `
        const row       = `
            <li class="item-list list-group-item ${nameClass}" data-id="${record.id}" data-type="${record.type}">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <p class="m-0">${record.description}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="m-0 text-end"> ${string} </p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="btn btn-danger delete-item">Eliminar</button>
                    </div>
                </div>
            </li>
        `
        list.insertAdjacentHTML('beforeend', row)
        this.updateSummary()
    }
    removeRowToHtml(id){
        document.querySelector(`li[data-id="${id}"]`).remove()
    }
    updateSummary( incomes, expenses, balance ){
        incomesField.innerHTML  = `S/. ${incomes}`
        expensesField.innerHTML = `S/. ${expenses}`
        balanceField.innerHTML  = `S/. ${balance}`
    }
    updateBackgroundBalance(color){
        const el = document.querySelector("#balance-total")
        el.closest('div.row').style.color = `${color}` 
    }
} 

let budget  = new Budget();
let ui      = new UI();

function saveRegister(){
    const type          = document.querySelector('input[name="type"]:checked').value.trim();
    const amount        = amountField.value.trim();
    const description   = descriptionField.value.trim();

    const record        = { description, amount, type , id: Date.now() }

    budget.addRecord(record, type)
    ui.addRowToHtml(record)
    clearFields();

    const { totalIncomes, totalExpenses, balance } = budget;
    ui.updateSummary(totalIncomes, totalExpenses, balance)

    let className = budget.getValidations();
    ui.updateBackgroundBalance(className)
}

function deleteItem(e) {
    if (e.target.classList.contains('delete-item')) {
        const li    = e.target.closest('li')
        const id    = li.getAttribute('data-id')
        const type  = li.getAttribute('data-type')

        budget.removeRecord(id, type)

        let className = budget.getValidations();
        ui.updateBackgroundBalance(className)
        
        const { totalIncomes, totalExpenses, balance } = budget;
        ui.updateSummary(totalIncomes, totalExpenses, balance)
        ui.removeRowToHtml(id)
    }
}

function clearFields() {
    amountField.value = '';
    descriptionField.value = '';
}