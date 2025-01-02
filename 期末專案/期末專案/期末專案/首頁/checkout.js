$(document).ready(function() {
    // 從 localStorage 獲取購物車數據
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // 如果購物車為空，返回首頁
    if (cartItems.length === 0) {
        alert('購物車是空的，請先添加商品！');
        window.location.href = 'test.html';
        return;
    }
    
    // 顯示購物車商品
    displayCartItems(cartItems);
    
    // 計算並顯示總金額
    updateTotalAmount(cartItems);
    
    // 表單提交處理
    $('.checkout-form').on('submit', function(e) {
        e.preventDefault();
        
        // 驗證表單
        if (!validateForm()) {
            return;
        }
        
        // 獲取表單數據
        const orderData = {
            name: $('#name').val().trim(),
            phone: $('#phone').val().trim(),
            email: $('#email').val().trim(),
            address: $('#address').val().trim(),
            paymentMethod: $('input[name="payment"]:checked').val(),
            items: cartItems,
            total: calculateTotal(cartItems),
            orderDate: new Date().toISOString()
        };
        
        // 保存訂單數據到 localStorage（可選）
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 顯示訂單成功消息
        showSuccessMessage(orderData);
        
        // 清空購物車
        localStorage.removeItem('cartItems');
        
        // 延遲後重定向到首頁
        setTimeout(() => {
            window.location.href = 'test.html';
        }, 2000);
    });
});

// 顯示購物車商品
function displayCartItems(items) {
    const cartItemsContainer = $('.cart-items');
    cartItemsContainer.empty();
    
    items.forEach(item => {
        const itemHtml = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">NT$ ${item.price}</p>
                    <p class="item-quantity">數量：${item.quantity}</p>
                    <p class="item-subtotal">小計：NT$ ${item.price * item.quantity}</p>
                </div>
            </div>
        `;
        cartItemsContainer.append(itemHtml);
    });
}

// 表單驗證
function validateForm() {
    const name = $('#name').val().trim();
    const phone = $('#phone').val().trim();
    const email = $('#email').val().trim();
    const address = $('#address').val().trim();
    
    if (!name) {
        alert('請輸入姓名');
        return false;
    }
    
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
        alert('請輸入有效的手機號碼（10位數字）');
        return false;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('請輸入有效的電子郵件地址');
        return false;
    }
    
    if (!address) {
        alert('請輸入配送地址');
        return false;
    }
    
    return true;
}

// 顯示成功消息
function showSuccessMessage(orderData) {
    const message = `
        <div class="success-message">
            <h2>訂單已成功提交！</h2>
            <p>訂單編號：${generateOrderNumber()}</p>
            <p>總金額：NT$ ${orderData.total}</p>
            <p>我們將盡快處理您的訂單</p>
        </div>
    `;
    
    $('body').append(message);
}

// 生成訂單編號
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
}

// 計算總金額
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 更新顯示的總金額
function updateTotalAmount(items) {
    const total = calculateTotal(items);
    $('.amount').text(`NT$ ${total}`);
} 