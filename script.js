const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_COUNT: 'todo-count',
  TODO_LIST: 'todo-list',
  TODO_DELETE: 'todo-delete button',
}

const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const e = React.createElement;
const r = ReactDOM.render;


//Component to hold the operations
class CreateToDo extends React.Component {

  constructor(){
    super();
    this.count = 0;
    this.state = {
      toDos: [],
      unCheckedToDo: 0
    }
  }

  //Render updated Counts
  componentDidUpdate = () => {
    r(
      e('p',{ className: classNames.TODO_COUNT }, this.state.toDos.length),
      itemCountSpan
    );
    
    r(
      e('p',{ className: classNames.TODO_COUNT }, this.state.unCheckedToDo), 
      uncheckedCountSpan
    );
  }

  //Generate unique keys 
  getKey = () => {
    return this.count++;
  }

  //Handle insertion of toDos
  handleAddition = () => {
    const addToDo = this.state.toDos.splice(0);
    addToDo.push({id: `${this.getKey()}`});
    this.setState({
      toDos: addToDo,
      unCheckedToDo: ++this.state.unCheckedToDo
    });
  }

  //Track uncheked count
  handleChecked = (checked) => {
   let unchecked = this.state.unCheckedToDo; 
   if(checked){
    unchecked--;
   }else{
    unchecked++;
   }
   this.setState({unCheckedToDo: unchecked});
  }

  //Handle Delete of Todos
  handleDelete = (toDoId, checked) => {
    const deleteToDo = this.state.toDos.filter(toDo => toDo.id !== toDoId);
    let unchecked = this.state.unCheckedToDo; 
    if(!checked){
      unchecked--;
     }
    this.setState({
      toDos: deleteToDo,
      unCheckedToDo: unchecked
    });
  }

  render(){

    return e(ToDos, {
      onAddition: this.handleAddition,
      onDelete:   this.handleDelete,
      onCheck:    this.handleChecked,
      toDos:      this.state.toDos
      }
    );
  }
}


//Component to Hold the List
class ToDos extends React.Component {
  render(){
    return e('div', { className: classNames.TODO_LIST },
        this.props.toDos.map(toDo => {
          return e(ToDo, {
            key: toDo.id,
            toDo,
            onAddition: () => this.props.onAddition(toDo),
            onDelete: (e) => this.props.onDelete(toDo.id, e),
            onCheck: (e) => this.props.onCheck(e)
          })
        })
    )
  }
}

//Component to hold the Elements in the list
class ToDo extends React.Component {

  render(){
    return e('div', {} , [e('input', {
      key: `checkbox-${this.props.toDo.id}`,
      id: `checkbox-${this.props.toDo.id}`,
      type: 'checkbox',
      ref: 'checkbox',
      onChange: () => this.props.onCheck(this.refs.checkbox.checked),
      className: classNames.TODO_CHECKBOX
    }),
    e('input', {
      key:  `text-${this.props.toDo.id}`,
      type: 'text',
      placeholder: 'Enter Todo',
      className: classNames.TODO_TEXT
    }),
    e('button', {
      key: `button-${this.props.toDo.id}`,
      onClick: () => this.props.onDelete(this.refs.checkbox.checked),
      className: classNames.TODO_DELETE
    }, 'Delete')]
    );
  }
}

//Render Todo List
newTodo = () => {
  const reactDom = r(
    React.createElement(CreateToDo), 
    list
  );
  reactDom.handleAddition();
}