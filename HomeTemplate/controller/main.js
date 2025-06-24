// Tạo getEle
const getEle = (id) => document.getElementById(id);
//improt
import { Service } from '../services/phoneList.js';
import { CartItem } from '../model/cartltem.js';
import { Product } from '../model/product.js';

const service = new Service();
let cart = [];
//Tạo renderList
const renderList = (phoneList) => {
    let content = '';
    phoneList.forEach((ele) => {
        content += ` <div class="col-lg-3 col-md-6">
    <div class="card text-black h-100">
    <div class="content-overlay"></div>
      <img src=${ele.img} class="card-img" alt="Phone Image" />
      <div class="content-details fadeIn-top">
      <h3 class ='pb-5'>Specifications</h3>
            <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Screen:</b></span>
          <span class='text-light'>&nbsp ${ele.screen}</span>
        </div>
        <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Back Camera:</b> ${ele.backCamera}</span>
        </div>
        <div class="d-flex justify-content-start py-1">
          <span class='text-light'><b>Front Camera:</b> ${ele.frontCamera}</span>
        </div>

        <p class = 'pt-5'><u>click here for more details</u></p>
      </div>
      <div class="card-body">
        <div class="text-center">
          <h5 class="card-title pt-3">${ele.name}</h5>
          <span class="text-muted mb-2">$${ele.price}</span>
          <span class="text-danger"><s>$${Number(ele.price) + 300}</s></span>
        </div>
        <div class="mt-3 brand-box text-center">
          <span>${ele.type}</span>
        </div>
        <div class="d-flex justify-content-start pt-3">
          <span><b>Description:</b> ${ele.desc}</span>
        </div>
        <div class="d-flex justify-content-between pt-3">
          <div class="text-warning">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
          </div>
          <span class = 'text-success'><b>In Stock</b></span>
        </div>
        <button type="button" class="btn btn-block w-50" onclick ="btnAddToCart('${ele.id
            }')">Add to cart</button>
      </div>
    </div>
  </div>`;
    });
    getEle('phoneList').innerHTML = content;
};
//Tạo renderCart
const renderCart = (cart) => {
    let content = '';
    cart.forEach((ele) => {
        content += `<div class="product">
  <div class="product__1">
    <div class="product__thumbnail">
      <img src=${ele.product.img} 
        alt="Italian Trulli">
    </div>
    <div class="product__details">
      <div style="margin-bottom: 8px;"><b>${ele.product.name}</b></div>
      <div style="font-size: 90%;">Screen: <span class="tertiary">${ele.product.screen
            }</span></div>
      <div style="font-size: 90%;">Back Camera: <span class="tertiary">${ele.product.backCamera
            }</span></div>
      <div style="font-size: 90%;">Front Camera: <span class="tertiary">${ele.product.frontCamera
            }</span></div>
      <div style="margin-top: 8px;"><a href="#!" onclick ="btnRemove('${ele.product.id
            }')">Remove</a></div>
    </div>
  </div>
  <div class="product__2">
    <div class="qty">
      <span><b>Quantity:</b> </span> &nbsp &nbsp
      <span class="minus bg-dark" onclick ="btnMinus('${ele.product.id}')">-</span>
      <span class="quantityResult mx-2">${ele.quantity}</span>
      <span class="plus bg-dark" onclick ="btnAdd('${ele.product.id}')">+</span>
    </div>
    <div class="product__price"><b>$${ele.quantity * ele.product.price}</b></div>
  </div>
</div>`;
    });
    getEle('cartList').innerHTML = content;

    let cartCount = 0;
    cart.forEach((ele) => {
        cartCount += ele.quantity;
    });
    const subTotal = calculateSubTotal(cart);
    const shipping = subTotal > 0 ? 10 : 0;
    getEle('cartCount').innerHTML = cartCount;
    getEle('shipping').innerHTML = '$' + shipping;
    getEle('subTotal').innerHTML = '$' + subTotal;
    getEle('tax').innerHTML = '$' + Math.floor(subTotal * 0.1);
    getEle('priceTotal').innerHTML = '$' + Math.floor(subTotal * 1.1 + shipping);
};

// Tính tổng tiền của giỏ hàng
const calculateSubTotal = (cart) => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// Tìm cart item trong giỏ hàng theo id sản phẩm
const findItemById = (cart, id) => {
    return cart.find(item => item.product.id === id);
};

// Khởi tạo dữ liệu khi tải trang
window.onload = async () => {
    const phoneList = await service.getPhones();
    renderList(phoneList);
    const storedCart = localStorage.getItem('cart');
    cart = storedCart ? JSON.parse(storedCart) : [];
    renderCart(cart);
};

// Lọc sản phẩm theo loại
getEle('selectList').onchange = async () => {
    const data = await service.getPhones();
    const selectValue = getEle('selectList').value;
    const filteredList = selectValue === 'all' ? data : data.filter(item => item.type === selectValue);
    renderList(filteredList);
};

// Thêm sản phẩm vào giỏ hàng
window.btnAddToCart = async (productId) => {
    const phone = await service.getPhoneById(productId);
    const product = new Product(
        phone.id,
        phone.name,
        phone.price,
        phone.screen,
        phone.backCamera,
        phone.frontCamera,
        phone.img,
        phone.desc,
        phone.type
    );
    let cartItem = cart.find(item => item.product.id === product.id);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push(new CartItem(product, 1));
    }
    renderCart(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
};

// + trong giỏ hàng
window.btnAdd = (id) => {
    // Tìm sản phẩm trong giỏ hàng theo id
    const cartItem = cart.find(item => item.product.id === id);
    if (cartItem) {
        // Tăng số lượng sản phẩm lên 1
        cartItem.quantity += 1;
        // Cập nhật lại giao diện giỏ hàng
        renderCart(cart);
        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

// - trong giỏ hàng
window.btnMinus = (id) => {
    // Tìm sản phẩm trong giỏ hàng theo id
    const cartItem = cart.find(item => item.product.id === id);
    if (cartItem) {
        // Giảm số lượng sản phẩm đi 1, nhưng không nhỏ hơn 1
        cartItem.quantity -= 1;
        // Nếu số lượng bằng 0 thì xóa sản phẩm khỏi giỏ hàng
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.product.id !== id);
        }
        // Cập nhật lại giao diện giỏ hàng
        renderCart(cart);
        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};

// delete
window.btnRemove = (id) => {
    // Xóa sản phẩm khỏi giỏ hàng dựa trên id
    cart = cart.filter(item => item.product.id !== id);
    // Cập nhật lại giao diện giỏ hàng
    renderCart(cart);
    // Lưu lại giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
};

// clear
window.emptyCart = function () {
    cart = [];
    renderCart(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
};

//button thanh toán
window.payNow = () => {
    if (cart.length > 0) {
        Swal.fire({
            icon: 'success',
            title: 'Your order is completed',
            showConfirmButton: false,
            timer: 1500,
        });
        emptyCart();
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your cart is empty',
        });
    }
};
