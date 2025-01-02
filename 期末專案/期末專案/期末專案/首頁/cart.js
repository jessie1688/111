$(document).ready(function() {
    // 從 localStorage 加載購物車數據
    loadCartFromStorage();

    // 點擊加入購物車按鈕
    $('.add-to-cart').click(function() {
        const button = $(this);
        const product = {
            name: button.data('name'),
            price: button.data('price'),
            image: button.data('image'),
            quantity: 1
        };
        
        addToCart(product);
        saveCartToStorage();
        alert('商品已加入購物車！');
    });

    // 點擊購物車圖標顯示/隱藏購物車
    $('#nav-cart-icon').click(function() {
        $('#shopping-cart').toggleClass('active');
    });

    // 更新數量
    $(document).on('click', '.quantity-btn', function() {
        const input = $(this).siblings('.quantity-input');
        let value = parseInt(input.val());
        
        if ($(this).hasClass('plus')) {
            value++;
        } else if ($(this).hasClass('minus') && value > 1) {
            value--;
        }
        
        input.val(value);
        updateCartTotal();
        saveCartToStorage();
    });

    // 移除商品
    $(document).on('click', '.remove-item', function() {
        $(this).closest('.cart-item').remove();
        updateCartTotal();
        saveCartToStorage();
    });

    // 結帳按鈕點擊事件
    $(document).on('click', '.checkout-btn', function() {
        // 檢查購物車是否為空
        if ($('.cart-item').length === 0) {
            alert('購物車是空的，請先添加商品！');
            return;
        }

        // 將購物車數據保存到 localStorage
        saveCartToStorage();
        
        // 跳轉到結帳頁面
        window.location.href = 'checkout.html';
    });
});

// 從 localStorage 加載購物車數據
function loadCartFromStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    $('.cart-items').empty();
    
    cartItems.forEach(item => {
        addToCart(item, false);
    });
    
    updateCartTotal();
}

// 添加商品到購物車
function addToCart(product, shouldUpdate = true) {
    // 檢查商品是否已在購物車中
    const existingItem = $(`.cart-item h3:contains("${product.name}")`).closest('.cart-item');
    
    if (existingItem.length > 0) {
        // 如果商品已存在，增加數量
        const quantityInput = existingItem.find('.quantity-input');
        const currentQuantity = parseInt(quantityInput.val());
        quantityInput.val(currentQuantity + product.quantity);
    } else {
        // 如果商品不存在，添加新項目
        const cartItem = `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="price">NT$ ${product.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="${product.quantity}" min="1" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item">&times;</button>
            </div>
        `;
        
        $('.cart-items').append(cartItem);
    }
    
    if (shouldUpdate) {
        updateCartTotal();
    }
}

// 更新購物車總金額
function updateCartTotal() {
    let total = 0;
    $('.cart-item').each(function() {
        const price = parseInt($(this).find('.price').text().replace('NT$ ', ''));
        const quantity = parseInt($(this).find('.quantity-input').val());
        total += price * quantity;
    });
    
    $('.subtotal-amount').text(`NT$ ${total}`);
}

// 保存購物車數據到 localStorage
function saveCartToStorage() {
    const cartItems = [];
    $('.cart-item').each(function() {
        const item = {
            name: $(this).find('h3').text(),
            price: parseInt($(this).find('.price').text().replace('NT$ ', '')),
            quantity: parseInt($(this).find('.quantity-input').val()),
            image: $(this).find('.cart-item-image').attr('src')
        };
        cartItems.push(item);
    });
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
} 