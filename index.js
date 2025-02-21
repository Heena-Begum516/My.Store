let products = [];
let orders = [];
let cart = {};
let users = [];
let user = {};
let total = 0;
const addToCart = (id) => {
  if (!cart[id]) cart[id] = 1;
  showCart();
};
const increment = (id) => {
  cart[id] = cart[id] + 1;
  showCart();
};
const decrement = (id) => {
  cart[id] = cart[id] - 1;
  cart[id] < 1 && delete cart[id];
  console.log(cart);
  showCart();
};
const showTotal = () => {
  total = products.reduce((sum, value) => {
    return sum + value.price * (cart[value.id] ? cart[value.id] : 0);
  }, 0);

  divTotal.innerHTML = `Order Value: $${total}`;
};

const showOrders = () => {
  let str = "<div style='padding:30px'><h3>My Orders</h1>";
  orders.map((value) => {
    if (value.customer === user.email) {
      str += `
      <div>
      ${value.customer}-
      ${value.orderValue}-
      ${Object.keys(value.items).length}-
      ${value.status}
      </div>
      `;
    }
  });
  divProducts.innerHTML = str + "</div>"
};

const showMain = () => {
  let str = `
  <div class="container">
      <div class="header">
        <h1>My Store</h1>
        <div class='menu'>
         <li onclick='showProducts()'>Home</li>
          <li onclick='showOrders()'>Orders</li>
          <li onclick="displayCart()">Cart:<span id="items"></span></li>
          <li onclick='showLogin()'>Logout</li>
        </div>
      </div>
      <div class="productBlock">
        <div id="divProducts"></div>
      </div>
      <div id="divCartBlock" class="cartBlock">
        <h3>My Cart</h3>
        <div id="divCart"></div>
        <div id="divTotal"></div>
        <button onclick="hideCart()">Close</button>
      </div>
        <hr>
    <h4>@Copyright 2025. All rights reserved.</h4>
    </div>
  `;
  root.innerHTML = str;
  showProducts();
};

const placeOrder = () => {
  //create an object and push into orders array
  const obj = {
    customer: user.email,
    items: cart,
    orderValue: total,
    status: "pending",
  };
  orders.push(obj);
  cart = {};
  showCart()
  hideCart()
  showOrders();
  console.log(orders);
};

const showCart = () => {
  let str = "";
  products.map((value) => {
    if (cart[value.id]) {
      str += `
        <li>${value.name}-$${value.price}-<button onclick='decrement(${
        value.id
      })'>-</button>${cart[value.id]}<button onclick='increment(${
        value.id
      })'>+</button>-$${value.price * cart[value.id]}</li>
     
        `;
    }
  });
  str += `<button onclick='placeOrder()'>Place Order</button>`;
  divCart.innerHTML = str;
  let count = Object.keys(cart).length;
  items.innerHTML = count;
  showTotal();
};
const displayCart = () => {
  divCartBlock.style.left = "80%";
};
const hideCart = () => {
  divCartBlock.style.left = "100%";
};

function showLogin() {
  let str = `
  <div class='login' style="background-color:pink;">
      <h2>Login Form</h2>
      <div id='msg'></div>
      <p style="background-color: pink;"><input id="email" type="text" placeholder="Email"></p>
      <p style="background-color: pink;"><input id="password" type="password" placeholder="Password"></p>
      <button onclick='chkUser()' style="background-color: rgb(47, 31, 166); color: white; border-radius: 10px; width: 50%;">Log In</button>
      <p><button onclick='showForm()' style="border-radius: 10px; width: 50%;">Create Account</button></p>
  </div>
  `;
  root.innerHTML = str;
}

function showForm() {
  let str = `<div class='registration' style="background-color:pink;">
  <h2>Registration Form</h2>
  <p><input type="text" id="name" placeholder="Name" style= "width: 50%;"></p>
  <p><input type="text" id="email" placeholder="Email" style= "width: 50%;"></p>
  <p><input type="password" id="password" placeholder="Password" style= "width: 50%;"></p>
  <p><input type="date" id="dob" style="border-radius: 10px; width: 50%;"></p>
  <p><button onclick='addUser()' style="border-radius: 10px; width: 25%;">Submit</button></p>
  <p>Already a member?<button onclick='showLogin()' style="border-radius: 10px; width: 25%; background-color: rgb(47, 31, 166);">Login Here</button></p>
  `;
  root.innerHTML = str + "</div>";
}

function chkUser() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email && users[i].password == password) {
      // useremail = email;
      // username = users[i].name;
      // currBalance = users[i].balance;
      user = users[i];
      showMain();
      break;
    } else {
      msg.innerHTML = "Access Denied";
    }
  }
}

function addUser() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let dob = document.getElementById("dob").value;
  let user = {
    name: name,
    email: email,
    password: password,
    dob: dob,
    balance: 0,
  };
  users.push(user);
  showLogin();
}

const showProducts = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => (products = data))
    .then(() => {
      let str = "<div class='row'>";
      products.map((value) => {
        str += `
          <div class='box'>
          
          <img src="${value.image}" alt="${value.name}" style="width:300px; height:400px; object-fit: cover; border-radius: 10px; object-position: center; display: block; margin: auto;">
          
          <h3 style="display:block; margin: auto; text-align: center; justify-content: center;">${value.name}</h3>
          <p style="display:block; margin: auto; text-align: center; justify-content: center;">${value.desc}</p>
          <h4 style="display:block; margin: auto; text-align: center; justify-content: center;">$${value.price}</h4>
          <button onclick="addToCart(${value.id})" style="display:block; margin: auto; text-align: center; justify-content: center;">Add to Cart</button>
          </div>
          `;
      });
      divProducts.innerHTML = str + "</div>";
    });
};