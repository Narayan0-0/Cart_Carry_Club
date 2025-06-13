$(document).ready(function () {
    // Initialize page loader
    showPageLoader();

    // Show page loader function
    function showPageLoader() {
        $("body").prepend(
            '<div class="page-loader"><div class="loader-spinner"></div><div class="loader-text">CarryClub</div></div>'
        );
        setTimeout(function () {
            $(".page-loader").fadeOut("slow");
        }, 600);
    }

    // Smooth scrolling for navigation links
    $('a.nav-link, a.back-to-top, .footer a[href^="#"]').on(
        "click",
        function (e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                $("html, body").animate(
                    {
                        scrollTop: $(hash).offset().top - 70,
                    },
                    800
                );
            }
        }
    );

    // Activate nav links based on scroll position
    $(window).on("scroll", function () {
        const scrollPos = $(document).scrollTop();
        $("a.nav-link").each(function () {
            const section = $($(this).attr("href"));
            if (section.length && 
                section.position().top - 80 <= scrollPos &&
                section.position().top + section.height() > scrollPos
            ) {
                $("a.nav-link").removeClass("active");
                $(this).addClass("active");
            }
        });
    });

    // Trigger scroll event on page load to set the initial active link
    $(window).trigger("scroll");

    // Back to top button visibility
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $(".back-to-top").addClass("show");
        } else {
            $(".back-to-top").removeClass("show");
        }
    });

    // Collection items hover effect
    $(".collection-item").hover(
        function () {
            $(this).find("img").css("transform", "scale(1.05)");
            $(this).find(".collection-overlay").css("opacity", "1");
        },
        function () {
            $(this).find("img").css("transform", "scale(1)");
            $(this).find(".collection-overlay").css("opacity", "0.7");
        }
    );

    // Add to cart functionality
    $(".btn-colour").on("click", function (e) {
        if ($(this).text() === "Add to Cart") {
            e.preventDefault();

            // Get product details
            const card = $(this).closest(".card");
            const productName = card.find(".card-title").text();
            const productPrice = card.find(".fw-bold").text();
            const productImage = card.find("img").attr("src");

            // Store in localStorage
            const cartItem = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1,
            };

            let cart = JSON.parse(localStorage.getItem("carryClubCart")) || [];

            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(
                (item) => item.name === productName
            );
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem("carryClubCart", JSON.stringify(cart));

            // Show animation
            $(this).html('<i class="fas fa-check"></i> Added!');

            // Create and animate the cart notification
            const notification = $(
                '<div class="cart-notification">Item added to cart!</div>'
            );
            $("body").append(notification);
            

            // Reset button text after delay
            setTimeout(() => {
                $(this).html("Add to Cart");
            }, 2000);

            // Update cart count
            updateCartCount();
        }
    });

    // Update cart count badge
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("carryClubCart")) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        // Create or update cart count badge
        if ($(".cart-count").length === 0) {
            $(".navbar-nav").append('<span class="cart-count">' + count + "</span>");
        } else {
            $(".cart-count").text(count);
        }

        // Show/hide based on count
        if (count > 0) {
            $(".cart-count").show();
        } else {
            $(".cart-count").hide();
        }
    }

    // Initialize cart count on page load
    updateCartCount();



    // Newsletter subscription animation
    $("footer form").on("submit", function (e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();

        if (email) {
            $(this).slideUp();
            $(this).after(
                '<div class="alert alert-success newsletter-success">Thank you for subscribing to our newsletter!</div>'
            );

            setTimeout(function () {
                $("footer form")[0].reset();
                $("footer form").slideDown();
                $(".newsletter-success").fadeOut(function () {
                    $(this).remove();
                });
            }, 3000);
        }
    });

    // Form validation and animation
    $("form").on("submit", function (e) {
        e.preventDefault();

        // Simple validation
        let isValid = true;

        if (isValid) {
            // Show success message
            const form = $(this);
            form.slideUp();
            form.after(
                '<div class="alert alert-success mt-3 form-success-message">Thank you for your message! We will get back to you soon.</div>'
            );

            // Reset form after delay
            setTimeout(function () {
                form[0].reset();
                form.slideDown();
                $(".form-success-message").fadeOut(function () {
                    $(this).remove();
                });
            }, 3000);
        }
    });
});
