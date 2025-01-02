$(document).ready(function() {
    // 輪播圖相關功能
    let currentIndex = 0;
    const totalImages = $('.carousel-images img').length;
    let carouselWidth = $('.carousel-container').width();

    // 更新輪播圖位置
    function updateCarousel() {
        const offset = -currentIndex * carouselWidth;
        $('.carousel-images').css('transform', `translateX(${offset}px)`);
    }

    // 下一張按鈕點擊事件
    $('#nextBtn').click(function(e) {
        e.preventDefault();
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
        autoSlideInterval = setInterval(autoSlide, 3000);
    });

    // 上一張按鈕點擊事件
    $('#prevBtn').click(function(e) {
        e.preventDefault();
        clearInterval(autoSlideInterval);
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
        autoSlideInterval = setInterval(autoSlide, 3000);
    });

    // 自動輪播
    function autoSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    let autoSlideInterval = setInterval(autoSlide, 3000);

    // 滑鼠懸停時暫停自動輪播
    $('.carousel-container').hover(
        function() {
            clearInterval(autoSlideInterval);
        },
        function() {
            autoSlideInterval = setInterval(autoSlide, 3000);
        }
    );

    $(document).ready(function() {
        // 所有商品選單點擊事件
        $('.products-dropdown > a').click(function(e) {
            e.preventDefault(); // 防止預設行為
            $(this).toggleClass('active');
        });
    
        // 子選單項目點擊事件
        $('.dropdown-menu a').click(function() {
            // 更新所有商品的粗體狀態
            $('.products-dropdown > a').addClass('active');
            
            // 這裡可以添加頁面跳轉邏輯
            // window.location.href = $(this).attr('href');
        });
    });

    // 購物車相關功能
    const cartIcon = document.getElementById('nav-cart-icon');
    const shoppingCart = document.getElementById('shopping-cart');

    // 點擊購物車圖示切換側欄
    cartIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        shoppingCart.classList.toggle('show');
    });

    // 點擊購物車內容時防止關閉
    shoppingCart.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 點擊頁面其他區域關閉側欄
    document.addEventListener('click', function(e) {
        if (shoppingCart.classList.contains('show')) {
            shoppingCart.classList.remove('show');
        }
    });

    // 數量增減按鈕功能
    $('.quantity-btn').on('click', function() {
        const input = $(this).siblings('.quantity-input');
        let value = parseInt(input.val());
        
        if ($(this).hasClass('plus')) {
            input.val(value + 1);
        } else if ($(this).hasClass('minus') && value > 1) {
            input.val(value - 1);
        }
        updateSubtotal();
    });

    // 移除商品按鈕功能
    $('.remove-item').on('click', function() {
        $(this).closest('.cart-item').remove();
        updateSubtotal();
    });

    // 更新小計
    function updateSubtotal() {
        let total = 0;
        $('.cart-item').each(function() {
            const price = parseInt($(this).find('.price').text().replace('NT$ ', ''));
            const quantity = parseInt($(this).find('.quantity-input').val());
            total += price * quantity;
        });
        $('.subtotal-amount').text('NT$ ' + total);
    }

    // 監聽數量輸入框的變化
    $('.quantity-input').on('change', function() {
        let value = parseInt($(this).val());
        
        // 確保數量不小於1
        if (value < 1) {
            $(this).val(1);
        }
        updateSubtotal();
    });

    // 結帳按鈕點擊事件
    $('.checkout-btn').on('click', function() {
        alert('前往結帳頁面');
        // 這裡可以添加跳轉到結帳頁面的邏輯
    });

    // 初始化小計
    updateSubtotal();

    // 視窗調整大小時更新輪播圖
    $(window).resize(function() {
        carouselWidth = $('.carousel-container').width();
        updateCarousel();
    });

});