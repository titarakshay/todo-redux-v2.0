const add = document.querySelector(".add");
const all = document.querySelector(".all");
const active = document.querySelector(".active");
const completed = document.querySelector(".completed");
const clear = document.querySelector(".clearcompleted");
const ul = document.querySelector(".list");
const arrow = document.querySelector(".img");
const itemsLeft = document.querySelector(".left");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const CLEAR_COMPLETED = "CLEAR_COMPLETED";
const EDIT_TODO = "EDIT_TODO";
const ARROW_SELECT = "ARROW_SELECT";
const CHANGE_TAB = "CHANGE_TAB";

const ACTIVE = "ACTIVE";
const COMPLETE = "COMPLETE";

let initialState = {
  allTodo: [],
  activeTab: "All",
};

let rootReducer = Redux.combineReducers({
  allTodo: allTodoReducer,
  activeTab: tabReducer,
});

let store = Redux.createStore(rootReducer);

function allTodoReducer(state = initialState.allTodo, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        { id: Date.now(), text: action.payload, isDone: false },
      ];
    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload);

    case TOGGLE_TODO:
      return state.map((todo) => {
        if (todo.id === action.payload) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
    case CLEAR_COMPLETED: {
      return state.filter((todo) => !todo.isDone);
    }
    case EDIT_TODO: {
      return state.map((todo) => {
        if (todo.id == action.load.id) {
          todo.text = action.load.text;
          return todo;
        }
        return todo;
      });
    }
    case ARROW_SELECT: {
      newList = state.filter((todo) => !todo.isDone);
      if (newList.length > 0) {
        return state.map((todo) => {
          todo.isDone = true;
          return todo;
        });
      } else {
        return state.map((todo) => {
          todo.isDone = false;
          return todo;
        });
      }
    }
    default:
      return state;
  }
}

function tabReducer(state = initialState.activeTab, action) {
  switch (action.type) {
    case CHANGE_TAB:
      return action.payload;
    default:
      return state;
  }
}

const handleEdit = (event, id) => {
  let text = event.target.innerText;
  const input = document.createElement("input");
  input.classList.add("edit-input");
  input.value = text;
  event.target.parentElement.replaceChild(input, event.target);
  input.focus();

  input.addEventListener("keyup", (event) => {
    if (event.keyCode == 13) {
      store.dispatch({
        type: EDIT_TODO,
        load: {
          id,
          text: input.value,
        },
      });
    }
  });
  input.addEventListener("blur", (event) => {
    store.dispatch({
      type: EDIT_TODO,
      load: {
        id,
        text: input.value,
      },
    });
  });
};

function filterTodo(tab, todos) {
  switch (tab) {
    case ACTIVE:
      return todos.filter((todo) => !todo.isDone);
    case COMPLETE:
      return todos.filter((todo) => todo.isDone);
    default:
      return todos;
  }
}

function createUi(ul, filterTodo) {
  ul.innerHTML = "";
  leftList = filterTodo.filter((todo) => !todo.isDone);
  itemsLeft.innerHTML = `${leftList.length} items left`;
  filterTodo.forEach((todo) => {
    let li = document.createElement("li");
    li.classList.add("li_styles");
    let p = document.createElement("p");
    p.classList.add("para");
    p.innerHTML = todo.text;
    p.addEventListener("dblclick", () => handleEdit(event, todo.id));
    let spanX = document.createElement("span");
    spanX.className = "remove_items";
    spanX.innerHTML = "X";
    spanX.addEventListener("click", () => {
      store.dispatch({
        type: DELETE_TODO,
        payload: todo.id,
      });
    });
    let checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.checked = todo.isDone;
    if (todo.isDone) p.style.textDecoration = "line-through";
    checkInput.addEventListener("click", () => {
      store.dispatch({
        type: TOGGLE_TODO,
        payload: todo.id,
      });
    });
    li.append(checkInput, p, spanX);
    ul.append(li);
  });
}

store.subscribe(() =>
  createUi(ul, filterTodo(store.getState().activeTab, store.getState().allTodo))
);

add.addEventListener("keyup", (event) => {
  if (event.keyCode === 13 && event.target.value.trim() !== "") {
    const text = event.target.value;
    store.dispatch({
      type: ADD_TODO,
      payload: text,
    });
    event.target.value = "";
  }
});

all.addEventListener("click", (event) => {
  store.dispatch({
    type: CHANGE_TAB,
    payload: "ALL",
  });
});

active.addEventListener("click", (event) => {
  store.dispatch({
    type: CHANGE_TAB,
    payload: ACTIVE,
  });
});

completed.addEventListener("click", (event) => {
  store.dispatch({
    type: CHANGE_TAB,
    payload: COMPLETE,
  });
});

clear.addEventListener("click", (event) => {
  store.dispatch({
    type: CLEAR_COMPLETED,
  });
});

arrow.addEventListener("click", (event) => {
  store.dispatch({
    type: ARROW_SELECT,
  });
});
