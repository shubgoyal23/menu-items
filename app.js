const displayContainer = document.querySelector(".items");
const displayAllbtn = document.querySelector(".list-btn");
const modal = document.querySelector(".modal");
const checkOutDiv = document.querySelector(".checkout-container")
const cartValueDisplay = document.querySelector("#cart-value")

const cart = {};
const discountPercentage = 0.15

window.addEventListener("DOMContentLoaded", () => {
    displayFoodItems("all");
    displaybtn(menu);

    const btn = document.querySelectorAll(".btn");
    btn.forEach((button) => {
        button.addEventListener("click", (event) => {
            displayFoodItems(event.target.id);
        });
    });
});

const btnAvailable = ["all"];

function displaybtn(menu) {
    menu.map((items) => {
        if (!btnAvailable.includes(items.category)) {
            btnAvailable.push(items.category);
        }
    });
    let btns = btnAvailable.map((items) => {
        return `<button class="btn" id="${items}">${items}</button>`;
    });
    btns = btns.join("");
    displayAllbtn.innerHTML = btns;
}

function displayFoodItems(categorySelected) {
    displayContainer.innerHTML = "";
    menu.map((item) => {
        if (item.category === categorySelected || categorySelected === "all") {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("item-container");
            itemContainer.id = item.id;

            const imgContainer = document.createElement("div");
            imgContainer.classList.add("img-div");

            const image = document.createElement("img");
            image.src = item.img;
            image.alt = item.title;

            imgContainer.appendChild(image);

            const descriptionContainer = document.createElement("div");
            descriptionContainer.classList.add("description-div");

            const headDiv = document.createElement("div");
            headDiv.classList.add("head");

            const headName = document.createElement("h5");
            headName.innerHTML = item.title;

            const priceDisplay = document.createElement("h4");
            priceDisplay.innerHTML = `$${item.price}`;

            headDiv.appendChild(headName);
            headDiv.appendChild(priceDisplay);

            const description = document.createElement("p");
            description.innerText = item.desc;

            descriptionContainer.appendChild(headDiv);
            descriptionContainer.appendChild(description);

            itemContainer.appendChild(imgContainer);
            itemContainer.appendChild(descriptionContainer);

            displayContainer.appendChild(itemContainer);
        }
    });
}

function openDetails(event) {
    modal.classList.add("hidden");
    let itemNo = event.target.closest(".item-container").id;
    if (itemNo) {
        menu.map((item) => {
            if (item.id == itemNo) {
                openModal(item);
            }
        });
    }
}

function openModal(item) {
    checkOutDiv.classList.add("hidden");
    modal.classList.remove("hidden");
    modal.innerHTML = `<button class="btn-close">X</button>
    <div class="modal-item-container">
        <div class="modal-img">
            <img src=${item.img} alt=${item.title}>
        </div>
        <div class="modal-desc">
                <h5>${item.title}</h5>
                <h4><span>$${(
            Number(item.price) +
            Number(item.price) * discountPercentage
        ).toFixed(2)}</span> $${item.price}</h4>
                <button class="add-to-cart-btn">Add To Cart</button>
            <p>${item.desc}</p>
        </div>
    </div>`;
    document.querySelector(".btn-close").addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
        document.querySelector(".add-to-cart-btn").innerHTML = `Added TO Cart`;
        if (cart[item.id]) {
            cart[item.id].qty += 1;
        } else {
            cart[item.id] = { name: item.title, price: item.price, qty: 1 };
        }
        cartValueDisplay.innerHTML = Object.keys(cart).length
    });
}

displayContainer.addEventListener("click", openDetails);

function calculateTotalCartValue() {
    checkOutDiv.classList.remove("hidden");
    modal.classList.add("hidden");
    if (Object.keys(cart).length) {
        let total = 0;
        let listItems = "";
        for (const key in cart) {
            listItems += `<div class="checkout-items" id=${key}>
        <h5>${cart[key].name}</h5>
        <p>Qty ${cart[key].qty}</p>
        <h4>$${(cart[key].price * cart[key].qty).toFixed(2)}</h4>
        <button class="remove-item-from-checkout">-</button>
        <button class="add-item-from-checkout">+</button>
    </div>`;
            total += cart[key].price * cart[key].qty;
        }

        document.querySelector("#cartValue").innerHTML = `Total: $${total.toFixed(2)}`;
        document.querySelector(".checkout-container-list").innerHTML = listItems;
        document
        .querySelectorAll(".remove-item-from-checkout")
            .forEach((btn) => btn.addEventListener("click", removeItemFromList));
        document
            .querySelectorAll(".add-item-from-checkout")
            .forEach((btn) => btn.addEventListener("click", addItemFromList));
    } else {
        document.querySelector(
            ".checkout-container-list"
            ).innerHTML = `<div>Cart it empty</div>`;
            document.querySelector("#cartValue").innerHTML = `Total: $0`;
    }
    cartValueDisplay.innerHTML = Object.keys(cart).length
}

document.getElementById("checkout").addEventListener("click", calculateTotalCartValue);

function removeItemFromList(e) {
    let id = e.target.closest(".checkout-items").id;
    if (cart[id].qty > 1) {
        cart[id].qty -= 1;
    } else {
        delete cart[id];
    }
    calculateTotalCartValue();
    cartValueDisplay.innerHTML = Object.keys(cart).length
}
function addItemFromList(e) {
    let id = e.target.closest(".checkout-items").id;
    cart[id].qty += 1;

    calculateTotalCartValue();
    cartValueDisplay.innerHTML = Object.keys(cart).length
}

document.getElementById("close-checkout").addEventListener("click", () => {
    checkOutDiv.classList.add("hidden");
});
