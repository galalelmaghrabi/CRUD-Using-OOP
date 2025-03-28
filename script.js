/* =============== User Crud Operation =============== */
const main = document.querySelector("#main");
const edit_page = document.querySelector("#edit");
const edit_form = document.querySelector("#edit-form");
const form = document.querySelector("form");
const table_body = document.querySelector("tbody");

//  open edit page
const open_page = () => {
  main.style.display = "none";
  edit_page.style.display = "block";
};

// create Array
let user_array = localStorage.getItem("users_array")
  ? JSON.parse(localStorage.getItem("users_array"))
  : [];

// when window loaded (read users)
window.onload = () => {
  User.render_users(user_array);
};

// create User object
class User {
  constructor(name, email, phone) {
    this.id = Math.floor(Math.random() * 10000000);
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  static new_user(name, email, phone) {
    const new_user = new User(name, email, phone);
    console.log(new_user);
    user_array = [...user_array, new_user];
    User.render_users(user_array);
    User.set_storage(user_array);
  }

  static empty_input(name, email, phone) {
    name.value = email.value = phone.value = "";
  }

  static render_users(arr) {
    arr.sort((a, b) => a.id - b.id);
    let users_item = arr.map((user) => {
      return `          
            <tr>
            <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>
                <button class="edit-btn" data-id="${
                  user.id
                }" data-edit="${true}">Edit</button>
                <button class="delete-btn" data-id="${
                  user.id
                }" data-del="${true}">Delete</button>
              </td>
            </tr>`;
    });
    table_body.innerHTML = users_item.join("");
  }

  static set_storage(arr) {
    return localStorage.setItem("users_array", JSON.stringify(arr));
  }

  static delete_user(id) {
    return (user_array = user_array.filter((user) => user.id != +id));
  }

  static get_user(id, id_input, arr, name, email, phone) {
    arr.map((item) => {
      if (item.id == +id) {
        localStorage.setItem("user_id", item.id);
        id_input.value = item.id;
        name.value = item.name;
        email.value = item.email;
        phone.value = item.phone;
      }
    });
  }

  static edit_user(data) {
    // delete the old user
    User.delete_user(data.id);

    // push new user
    user_array.push(data);

    // save user
    User.set_storage(user_array);
  }
}

// add user
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let name_input = window.name_input;
  let email_input = window.email_input;
  let phone_input = window.phone_input;

  User.new_user(name_input.value, email_input.value, phone_input.value);

  User.empty_input(name_input, email_input, phone_input);
});

// delete & render edit user
table_body.addEventListener("click", (e) => {
  let id = e.target.dataset.id;

  let del_is_true = e.target.dataset.del;

  let edit_is_true = e.target.dataset.edit;

  if (del_is_true) {
    User.delete_user(id);

    User.set_storage(user_array);

    User.render_users(user_array);
  }

  if (edit_is_true) {
    let id_input_edit = window.id_input_edit;
    let name_input_edit = window.name_input_edit;
    let email_input_edit = window.email_input_edit;
    let phone_input_edit = window.phone_input_edit;

    open_page();

    User.get_user(
      id,
      id_input_edit,
      user_array,
      name_input_edit,
      email_input_edit,
      phone_input_edit
    );
  }
});

// save edit user
edit_page.addEventListener("submit", (e) => {
  e.preventDefault();
  let id_input_edit = window.id_input_edit.value;
  let name_input_edit = window.name_input_edit.value;
  let email_input_edit = window.email_input_edit.value;
  let phone_input_edit = window.phone_input_edit.value;

  User.edit_user({
    id: id_input_edit,
    name: name_input_edit,
    email: email_input_edit,
    phone: phone_input_edit,
  });

  window.location.reload()
});
