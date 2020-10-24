const name = getCookieValue("name"), fieldName = document.getElementById("username");
fieldName && (fieldName.innerHTML = name ? "Witaj, " + name + "!" : "Witaj, użytkowniku!");
const target = document.getElementById("gauge");
if (target) {
    const e = {
        angle: 0,
        staticLabels: {
            font: "12px sans-serif",
            labels: [0, 1500, 2e3, 3e3, 3500, 5e3],
            color: "#ffffff",
            fractionDigits: 0
        },
        staticZones: [{strokeStyle: "#F03E3E", min: 1, max: 1500}, {
            strokeStyle: "#FFDD00",
            min: 1501,
            max: 2e3
        }, {strokeStyle: "#30B32D", min: 2001, max: 3e3}, {
            strokeStyle: "#FFDD00",
            min: 3001,
            max: 3500
        }, {strokeStyle: "#F03E3E", min: 3501, max: 5e3}],
        lineWidth: .24,
        radiusScale: 1,
        pointer: {length: .56, strokeWidth: .086, color: "#ffffff"},
        limitMax: !1,
        limitMin: !1,
        colorStart: "#6FADCF",
        colorStop: "#8FC0DA",
        strokeColor: "#E0E0E0",
        generateGradient: !0,
        highDpiSupport: !0
    }, t = document.getElementById("gauge"), n = new Gauge(t).setOptions(e);
    n.setTextField(document.getElementById("gauge-value"), 2), n.maxValue = 5e3, n.setMinValue(0), n.animationSpeed = 32;
    const i = {
        storeItem: function (e) {
            let t;
            (t = null === localStorage.getItem("items") ? [] : JSON.parse(localStorage.getItem("items"))).push(e), localStorage.setItem("items", JSON.stringify(t));
        }, getItemsFromStorage: function () {
            let e = [];
            return e = null === localStorage.getItem("items") ? [] : JSON.parse(localStorage.getItem("items"));
        }, updateItemStorage: function (e) {
            let t = JSON.parse(localStorage.getItem("items"));
            t.forEach(function (n, i) {
                e.id === n.id && t.splice(i, 1, e);
            }), localStorage.setItem("items", JSON.stringify(t));
        }, deleteItemFromStorage: function (e) {
            let t = JSON.parse(localStorage.getItem("items"));
            t.forEach(function (n, i) {
                e === n.id && t.splice(i, 1);
            }), localStorage.setItem("items", JSON.stringify(t));
        }, clearAllFromStorage: function () {
            localStorage.removeItem("items");
        }
    }, o = function () {
        const e = function (e, t, n) {
            this.id = e, this.name = t, this.calories = n;
        }, t = {items: i.getItemsFromStorage(), currentItem: null, totalCalories: 0};
        return {
            getItems: function () {
                return t.items;
            }, addItem: function (n, i) {
                let o;
                o = t.items.length > 0 ? t.items[t.items.length - 1].id + 1 : 0, i = parseInt(i);
                const a = new e(o, n, i);
                return t.items.push(a), a;
            }, getItemById: function (e) {
                let n = null;
                return t.items.forEach(function (t) {
                    t.id === e && (n = t);
                }), n;
            }, updateItem: function (e, n) {
                n = parseInt(n);
                let i = null;
                return t.items.forEach(function (o) {
                    o.id === t.currentItem.id && (o.name = e, o.calories = n, i = o);
                }), i;
            }, deleteItem: function (e) {
                ids = t.items.map(function (e) {
                    return e.id;
                });
                const n = ids.indexOf(e);
                t.items.splice(n, 1);
            }, clearAllItems: function () {
                t.items = [];
            }, setCurrentItem: function (e) {
                t.currentItem = e;
            }, getCurrentItem: function () {
                return t.currentItem;
            }, getTotalCalories: function () {
                let e = 0;
                return t.items.forEach(function (t) {
                    e += t.calories;
                }), t.totalCalories = e, t.totalCalories;
            }, logData: function () {
                return t;
            }
        };
    }(), a = function () {
        const e = {
            itemList: document.querySelector("#item-list"),
            listItems: "#item-list li",
            addBtn: document.querySelector(".add-btn"),
            updateBtn: document.querySelector(".update-btn"),
            deleteBtn: document.querySelector(".delete-btn"),
            backBtn: document.querySelector(".back-btn"),
            clearBtn: document.querySelector(".clear-btn"),
            itemNameInput: document.querySelector("#item-name"),
            itemCaloriesInput: document.querySelector("#item-calories"),
            totalCalories: document.querySelector(".total-calories")
        };
        return {
            populateItemList: function (t) {
                let n = "";
                t.forEach(function (e) {
                    n += `<li class="collection-item" id="item-${e.id}">\n            <strong>${e.name}: </strong><em>${e.calories}</em>\n            <a href="#" class="secondary-content">\n              <i class="edit-item fas fa-edit"></i>\n            </a>\n          </li>\n        `;
                }), e.itemList.innerHTML = n;
            }, getItemInput: function () {
                return {name: e.itemNameInput.value, calories: e.itemCaloriesInput.value};
            }, addListItem: function (t) {
                e.itemList.style.display = "block";
                const n = document.createElement("li");
                n.className = "collection-item", n.id = `item-${t.id}`, n.innerHTML = `\n        <strong>${t.name}: </strong><em>${t.calories}</em>\n        <a href="#" class="secondary-content">\n          <i class="edit-item fas fa-edit"></i>\n        </a>`, e.itemList.insertAdjacentElement("beforeend", n);
            }, updateListItem: function (t) {
                let n = document.querySelectorAll(e.listItems);
                (n = Array.from(n)).forEach(function (e) {
                    const n = e.getAttribute("id");
                    n === `item-${t.id}` && (document.querySelector(`#${n}`).innerHTML = `\n            <strong>${t.name}: </strong><em>${t.calories}</em>\n            <a href="#" class="secondary-content">\n              <i class="edit-item fas fa-edit"></i>\n            </a>`);
                });
            }, deleteListItem: function (e) {
                const t = `#item-${e}`;
                document.querySelector(t).remove();
            }, clearInput: function () {
                e.itemNameInput.value = "", e.itemCaloriesInput.value = "";
            }, addItemToForm: function () {
                e.itemNameInput.value = o.getCurrentItem().name, e.itemCaloriesInput.value = o.getCurrentItem().calories, a.showEditState();
            }, removeListItems: function () {
                let t = document.querySelectorAll(e.listItems);
                (t = Array.from(t)).forEach(function (e) {
                    e.remove();
                });
            }, hideList: function () {
                e.itemList.style.display = "none";
            }, showTotalCalories: function (e) {
                n.set(e);
            }, clearEditState: function () {
                a.clearInput(), e.updateBtn.style.display = "none", e.deleteBtn.style.display = "none", e.backBtn.style.display = "none", e.addBtn.style.display = "inline";
            }, showEditState: function () {
                e.updateBtn.style.display = "inline", e.deleteBtn.style.display = "inline", e.backBtn.style.display = "inline", e.addBtn.style.display = "none";
            }, getSelectors: function () {
                return e;
            }
        };
    }();
    (function (e, t, n) {
        const i = function (i) {
            const o = t.getItemInput();
            if ("" !== o.name && "" !== o.calories) {
                const i = e.addItem(o.name, o.calories);
                t.addListItem(i);
                const a = e.getTotalCalories();
                t.showTotalCalories(a), n.storeItem(i), t.clearInput();
            }
            i.preventDefault();
        }, o = function (n) {
            if (n.preventDefault(), n.target.classList.contains("edit-item")) {
                const i = n.target.parentNode.parentNode.id.split("-"), o = parseInt(i[1]), a = e.getItemById(o);
                e.setCurrentItem(a), t.addItemToForm();
            }
        }, a = function (i) {
            i.preventDefault();
            const o = t.getItemInput(), a = e.updateItem(o.name, o.calories);
            t.updateListItem(a);
            const l = e.getTotalCalories();
            t.showTotalCalories(l), n.updateItemStorage(a), t.clearEditState();
        }, l = function (i) {
            i.preventDefault();
            const o = e.getCurrentItem();
            e.deleteItem(o.id), t.deleteListItem(o.id);
            const a = e.getTotalCalories();
            t.showTotalCalories(a), n.deleteItemFromStorage(o.id), t.clearEditState();
        }, r = function (e) {
            e.preventDefault(), t.clearEditState();
        }, s = function (i) {
            i.preventDefault(), e.clearAllItems();
            const o = e.getTotalCalories();
            t.showTotalCalories(o), t.removeListItems(), n.clearAllFromStorage(), t.hideList(), t.clearEditState();
        };
        return {
            init: function () {
                t.clearEditState();
                const n = e.getItems();
                0 === n.length ? t.hideList() : t.populateItemList(n);
                const c = e.getTotalCalories();
                t.showTotalCalories(c), function () {
                    const e = t.getSelectors();
                    e.addBtn.addEventListener("click", i), e.itemList.addEventListener("click", o), e.updateBtn.addEventListener("click", a), e.deleteBtn.addEventListener("click", l), e.backBtn.addEventListener("click", r), e.clearBtn.addEventListener("click", s), document.addEventListener("keypress", function (e) {
                        if (13 === e.keyCode || 13 === e.which) return e.preventDefault(), !1;
                    });
                }();
            }
        };
    })(o, a, i).init();
}