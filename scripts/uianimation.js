/*
    University of Cologne
    BSI1 WiSe 2020/2021
    Project: Brandberg
    Janik Lierfeld
*/

// When the user scrolls in his browser window, the following functions are executed
  window.onscroll = () => { navbarFunction(); scrollFunction() };


// Scroll To Top Function
  function scrollFunction() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
      document.getElementById("scrollTopButton").style.display = "block";
    } else {
      document.getElementById("scrollTopButton").style.display = "none";
    }
  }


  // When the user clicks on the button, scroll to the top of the website
  function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


// Sticky Navbar Function
  var body = document.querySelector("body");
  var navbar = document.querySelector(".navbar");
  var menuBtn = document.querySelector(".menu-btn");
  var cancelBtn = document.querySelector(".cancel-btn");
  var logo = document.querySelector(".logo");
  var menuli = document.querySelector(".menu-list")

  menuBtn.onclick = () => {
    navbar.classList.add("show");
    menuBtn.classList.add("hide");
    body.classList.add("disabled");
  }
  cancelBtn.onclick = () => {
    body.classList.remove("disabled");
    navbar.classList.remove("show");
    menuBtn.classList.remove("hide");
  }

  function navbarFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      navbar.classList.add("sticky");
      logo.classList.add("logo-sticky");
      menuli.classList.add("menu-li-sticky");
    } else {
      navbar.classList.remove("sticky");
      logo.classList.remove("logo-sticky");
      menuli.classList.remove ("menu-li-sticky");
    }
  }