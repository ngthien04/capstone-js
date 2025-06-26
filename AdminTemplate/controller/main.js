const API_URL = 'https://685655e01789e182b37db36f.mockapi.io/api/Product';

window.products = [];

// Lấy danh sách sản phẩm
async function fetchProducts() {
  const res = await axios.get(API_URL);
  return res.data;
}

// Thêm sản phẩm
async function addProduct(product) {
  const res = await axios.post(API_URL, product);
  return res.data;
}

// Xóa sản phẩm
async function deleteProduct(id) {
  await axios.delete(`${API_URL}/${id}`);
}

// Cập nhật sản phẩm
async function updateProduct(id, product) {
  const res = await axios.put(`${API_URL}/${id}`, product);
  return res.data;
}

// Hiển thị danh sách sản phẩm 
function renderTable(products) {
  const tbody = document.getElementById('tablePhone');
  tbody.innerHTML = products.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td><img src="${p.img}" width="50"/></td>
      <td>${p.desc}</td>
      <td>
        <button class="btn" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn" onclick="removeProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Validation form
function validateForm() {
  let valid = true;
  // Tên
  if (!document.getElementById('name').value.trim()) {
    document.getElementById('tbname').innerText = 'Tên không được để trống';
    valid = false;
  } else {
    document.getElementById('tbname').innerText = '';
  }
  // Giá
  const price = document.getElementById('price').value.trim();
  if (!price || isNaN(price) || Number(price) <= 0) {
    document.getElementById('tbprice').innerText = 'Giá phải là số > 0';
    valid = false;
  } else {
    document.getElementById('tbprice').innerText = '';
  }
  // Screen
  if (!document.getElementById('screen').value.trim()) {
    document.getElementById('tbscreen').innerText = 'Screen không được để trống';
    valid = false;
  } else {
    document.getElementById('tbscreen').innerText = '';
  }
  // Back Camera
  if (!document.getElementById('backCam').value.trim()) {
    document.getElementById('tbbackCam').innerText = 'Back Camera không được để trống';
    valid = false;
  } else {
    document.getElementById('tbbackCam').innerText = '';
  }
  // Front Camera
  if (!document.getElementById('frontCam').value.trim()) {
    document.getElementById('tbfrontCam').innerText = 'Front Camera không được để trống';
    valid = false;
  } else {
    document.getElementById('tbfrontCam').innerText = '';
  }
  // Ảnh
  if (!document.getElementById('img').value.trim()) {
    document.getElementById('tbimg').innerText = 'Ảnh không được để trống';
    valid = false;
  } else {
    document.getElementById('tbimg').innerText = '';
  }
  // Mô tả
  if (!document.getElementById('desc').value.trim()) {
    document.getElementById('tbdesc').innerText = 'Mô tả không được để trống';
    valid = false;
  } else {
    document.getElementById('tbdesc').innerText = '';
  }
  // Loại
  if (!document.getElementById('type').value || document.getElementById('type').value === 'Select brand') {
    document.getElementById('tbtype').innerText = 'Chọn loại sản phẩm';
    valid = false;
  } else {
    document.getElementById('tbtype').innerText = '';
  }
  return valid;
}

// Lấy dữ liệu từ form
function getFormData() {
  return {
    name: document.getElementById('name').value,
    price: +document.getElementById('price').value,
    screen: document.getElementById('screen').value,
    backCamera: document.getElementById('backCam').value,
    frontCamera: document.getElementById('frontCam').value,
    img: document.getElementById('img').value,
    desc: document.getElementById('desc').value,
    type: document.getElementById('type').value
  };
}

// Thêm sản phẩm
if (document.getElementById('btnAddPhone')) {
  document.getElementById('btnAddPhone').onclick = async function() {
    if (!validateForm()) return;
    const product = getFormData();
    await addProduct(product);
    await loadAndRender();
    document.getElementById('formPhone').reset();
  };
}

// Xóa sản phẩm
window.removeProduct = async function(id) {
  if (confirm('Bạn có chắc muốn xóa?')) {
    await deleteProduct(id);
    await loadAndRender();
  }
}

// Sửa sản phẩm
window.editProduct = async function(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  const p = res.data;
  document.getElementById('name').value = p.name;
  document.getElementById('price').value = p.price;
  document.getElementById('screen').value = p.screen;
  document.getElementById('backCam').value = p.backCamera;
  document.getElementById('frontCam').value = p.frontCamera;
  document.getElementById('img').value = p.img;
  document.getElementById('desc').value = p.desc;
  document.getElementById('type').value = p.type;
  document.getElementById('btnUpdate').setAttribute('data-id', id);
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}

// Cập nhật sản phẩm
if (document.getElementById('btnUpdate')) {
  document.getElementById('btnUpdate').onclick = async function() {
    if (!validateForm()) return;
    const id = this.getAttribute('data-id');
    if (!id) return;
    const product = getFormData();
    await updateProduct(id, product);
    await loadAndRender();
    document.getElementById('formPhone').reset();
    this.removeAttribute('data-id');
  };
}

// Tìm kiếm sản phẩm theo tên
if (document.getElementById('searchInput')) {
  document.getElementById('searchInput').oninput = function() {
    const keyword = this.value.toLowerCase();
    const filtered = window.products.filter(p => p.name.toLowerCase().includes(keyword));
    renderTable(filtered);
  };
}

// Sắp xếp sản phẩm theo giá
if (document.getElementById('sortAsc')) {
  document.getElementById('sortAsc').onclick = function() {
    const sorted = [...window.products].sort((a, b) => a.price - b.price);
    renderTable(sorted);
  };
}
if (document.getElementById('sortDesc')) {
  document.getElementById('sortDesc').onclick = function() {
    const sorted = [...window.products].sort((a, b) => b.price - a.price);
    renderTable(sorted);
  };
}

window.loadAndRender = async function() {
  window.products = await fetchProducts();
  renderTable(window.products);
}

window.onload = loadAndRender; 