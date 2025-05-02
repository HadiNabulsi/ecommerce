<template>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <!-- Logo and Social Icons -->
          <div class="col-md-3 mb-4 mb-md-0">
            <div class="footer-logo-container">
              <img src="/Icons/Logo.png" alt="Developer Test Logo" class="footer-logo mb-4" />
            </div>
            <div class="social-icons">
              <a href="https://facebook.com" target="_blank" aria-label="Facebook" class="social-icon">
                <img src="/Icons/Facebook.png" alt="Facebook" />
              </a>
              <a href="https://youtube.com" target="_blank" aria-label="YouTube" class="social-icon">
                <img src="/Icons/Youtube.png" alt="YouTube" />
              </a>
              <a href="https://instagram.com" target="_blank" aria-label="Instagram" class="social-icon">
                <img src="/Icons/Instagram.png" alt="Instagram" />
              </a>
              <a href="https://twitter.com" target="_blank" aria-label="Twitter" class="social-icon">
                <img src="/Icons/Twitter.png" alt="Twitter" />
              </a>
            </div>
          </div>
          
          <div class="row footer-links-row">
            <div class="d-flex">
              <!-- Navigation Links -->
              <div class="col-md-3 mb-4 mb-md-0 footer-links footer-column-left">
                <NuxtLink to="/" class="footer-heading">
                  <h5>Home</h5>
                </NuxtLink>
                <ul class="list-unstyled">
                  <li class="footer-list-item"><NuxtLink to="/#">About us</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/#">Media center</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/#">Contact Us</NuxtLink></li>
                </ul>
              </div>
              
              <!-- Shop Links -->
              <div class="col-md-3 mb-4 mb-md-0 footer-links ml-n5">
                <NuxtLink to="/#" class="footer-heading">
                  <h5>Shop</h5>
                </NuxtLink>
                <ul class="list-unstyled">
                  <li class="footer-list-item"><NuxtLink to="/category/electronics">Electronics</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/category/jewelery">Jwelery</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/category/men's clothing">Men Clothing</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/category/women's clothing">Women Clothing</NuxtLink></li>
                </ul>
              </div>
              
              <!-- Contact Information -->
              <div class="col-md-3 mb-4 mb-md-0 footer-links ml-n5">
                <NuxtLink to="/contact" class="footer-heading">
                  <h5>Contact us</h5>
                </NuxtLink>
                <ul class="list-unstyled">
                  <li class="footer-list-item"><NuxtLink to="/#">+971 00 000 0000</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/#">+971 0 000 0000</NuxtLink></li>
                  <li class="footer-list-item"><NuxtLink to="/#">info@developertest.com</NuxtLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="white-divider"></div>
        <div class="copyright-container">
          <div class="copyright">
            <p>&copy; Developer Test 2024. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  /* إلغاء مؤشر التنقل السفلي بالمتصفح */
  .footer {
    background-color: #000;
    color: #fff;
    padding: 20px 0px;
  }
  
  .footer-logo-container {
    margin-bottom: 10px;
  }
  
  .footer-logo {
    max-width: 400px;
    margin-left: -100px;
    margin-top: -35px;
  }
  
  .social-icons {
    display: flex;
    gap: 25px;
    margin-top: -85px;
    margin-bottom: 15px;
  }
  
  .social-icon {
    display: inline-block;
    transition: opacity 0.3s ease;
  }
  
  .social-icon img {
    width: 38px;
    height: 38px;
    filter: brightness(0) invert(1); /* تحويل الأيقونات إلى اللون الأبيض */
  }
  
  .social-icon:hover {
    opacity: 0.7;
  }
  
  .footer h5 {
    color: #fff;
    font-weight: 500;
    font-size: 1.1rem;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
  }
  
  .footer-links ul li {
    font-size: 2rem;
    margin-bottom: 1px;
  }
  
  .footer-links a, .footer-contact a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 1.2rem;
  }
  
  .footer-links a:hover, .footer-contact a:hover {
    color: #f0e241;
  }
  
  .footer-heading {
    text-decoration: none;
    color: #fff;
    display: block;
    margin-bottom: 10px;
  }
  
  .footer-heading:hover {
    color: #f0e241;
  }
  
  .footer-heading h5 {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.8rem;
    width: 314px;
    height: 48px;
    line-height: 48px;
  }
  
  .footer-contact {
    margin-top: 80px;
  }
  
  .contact-info {
    margin-top: 20px;
  }
  
  .contact-info li {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  .copyright-container {
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    position: relative;
    text-align: center;
    font-weight: 300;
    font-size: 1.2rem;
    color: #ffffff;
  }
  
  .copyright {
    margin-top: -28px;
    margin-bottom: -20px;
    font-weight: 300;
    font-size: 1.3rem;
    color: #ffffff;
  }
  
  .white-divider {
    width: 95vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -47.5vw;
    margin-right: -47.5vw;
    height: 2px;
    background-color: #ffffff;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .footer-links-row {
    margin-top: 20px;
    column-gap: 0;
    justify-content: center;
    row-gap: 20px;
  }
  
  .footer-links {
    margin-top: 50px;
  }
  
  .footer-column-left {
    margin-left: 100px;
    padding-right: 0;
    width: 314px;
  }
  
  .footer-column-middle {
    margin-left: -100px;
    padding-right: 0;
    width: 314px;
  }
  
  .col-md-4 {
    padding-left: 0;
    padding-right: 0;
    min-height: 200px;
    margin-right: -20px;
  }
  
  .footer-list-item {
    margin-bottom: 15px;
  }
  
  .ml-n5 {
    margin-left: -10px;
  }
  
  .row {
    display: flex;
    flex-wrap: nowrap;
  }
  
  @media (max-width: 768px) {
    .footer {
      padding: 40px 0 20px;
    }
    
    .footer-logo {
      max-width: 150px;
    }
    
    .footer h5 {
      margin-bottom: 10px;
      margin-top: 20px;
    }
    
    .copyright {
      margin-top: 30px;
    }
    
    .row {
      flex-wrap: wrap;
    }
  }
  </style>