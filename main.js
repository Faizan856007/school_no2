(function () {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector("header nav");
  const overlay = document.querySelector(".nav-overlay");
  const headerBtns = document.querySelector(".header-btns");
  const backToTop = document.getElementById("backToTop");
  const form = document.getElementById("contactForm");

  function closeMenu() {
    nav && nav.classList.remove("mobile-open");
    headerBtns && headerBtns.classList.remove("mobile-open");
    overlay && overlay.classList.remove("show");
    document.querySelectorAll(".has-dropdown.open").forEach(function (el) {
      el.classList.remove("open");
    });
    if (menuBtn) {
      const icon = menuBtn.querySelector("i");
      if (icon) icon.className = "fa-solid fa-bars";
    }
  }

  function openMenu() {
    nav && nav.classList.add("mobile-open");
    headerBtns && headerBtns.classList.add("mobile-open");
    overlay && overlay.classList.add("show");
    if (menuBtn) {
      const icon = menuBtn.querySelector("i");
      if (icon) icon.className = "fa-solid fa-xmark";
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      if (nav && nav.classList.contains("mobile-open")) closeMenu();
      else openMenu();
    });
  }
  if (overlay) overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".has-dropdown > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth > 1180) return;
      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  document.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 1180 && !link.closest(".has-dropdown > a")) {
        closeMenu();
      }
    });
  });

  if (header && !header.querySelector(".scroll-progress")) {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    header.appendChild(bar);
  }
  const progress = header && header.querySelector(".scroll-progress");

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 500);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + "%";
    }
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function postForm(url, formEl, done) {
    fetch(url, { method: "POST", body: new FormData(formEl) })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (out) { done(out.data, out.ok); })
      .catch(function () { done({ ok: false, error: "Server not reachable. Start Apache + MySQL and check config.php." }, false); });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector(".send-btn");
      const old = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      postForm("contact.php", form, function (data, ok) {
        if (ok && data.ok) {
          if (btn) btn.textContent = "Message sent";
          form.reset();
        } else if (btn) {
          btn.textContent = (data && data.error) ? data.error : "Try again";
        }
        setTimeout(function () {
          if (btn) { btn.disabled = false; btn.textContent = old || "Send Message"; }
        }, 2400);
      });
    });
  }



  document.querySelectorAll("#dlCats button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#dlCats button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-dl");
      document.querySelectorAll("[data-dl-sec]").forEach(function (sec) {
        sec.style.display = (f === "all" || sec.getAttribute("data-dl-sec") === f) ? "" : "none";
      });
    });
  });

  document.querySelectorAll("#faqCats button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#faqCats button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-faq");
      document.querySelectorAll(".faq-item[data-faq]").forEach(function (item) {
        item.style.display = (f === "all" || item.getAttribute("data-faq") === f) ? "" : "none";
        item.classList.remove("open");
      });
    });
  });

  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.parentElement;
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (el) { el.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  document.querySelectorAll(".ne-filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".ne-filters button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      const f = btn.getAttribute("data-filter");
      document.querySelectorAll(".ne-card").forEach(function (card) {
        const show = f === "all" || card.getAttribute("data-tag") === f;
        card.style.display = show ? "" : "none";
      });
    });
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const roleInput = document.getElementById("loginRole");
    const idLabel = document.getElementById("idLabel");
    const submit = document.getElementById("loginSubmit");
    const msg = document.getElementById("loginMsg");
    const hint = document.getElementById("loginHint");
    const pass = document.getElementById("loginPass");
    const eye = document.getElementById("togglePass");
    const copy = {
      parent: [
        "Registered mobile / email",
        "10-digit mobile or email",
        "Sign in as parent",
        "Parents use the mobile given at admission. See all wards, pay fees and download receipts."
      ],
      student: [
        "Admission number",
        "e.g. GVIS/2024/0842",
        "Sign in as student",
        "Students use the admission number. First password is date of birth (DDMMYYYY)."
      ],
      staff: [
        "School email",
        "name@greenvalley.edu.in",
        "Sign in as staff",
        "Staff use the official school email and ERP password. Do not share this login."
      ]
    };
    function setSubmitLabel(text) {
      if (!submit) return;
      submit.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> ' + text;
    }
    document.querySelectorAll(".login-tabs button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".login-tabs button").forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        const tab = btn.getAttribute("data-tab");
        roleInput.value = tab;
        const c = copy[tab];
        const input = loginForm.userid;
        if (idLabel) idLabel.textContent = c[0];
        input.placeholder = c[1];
        setSubmitLabel(c[2]);
        if (hint) hint.textContent = c[3];
        if (msg) msg.className = "form-msg";
      });
    });
    if (eye && pass) {
      eye.addEventListener("click", function () {
        var show = pass.type === "password";
        pass.type = show ? "text" : "password";
        eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
        var ico = eye.querySelector("i");
        if (ico) ico.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
      });
    }
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var role = roleInput ? roleInput.value : "parent";
      if (role === "staff" && window.GVIS_TT) {
        var staff = window.GVIS_TT.checkStaffLogin(loginForm.userid.value, loginForm.password.value);
        if (staff) {
          window.GVIS_TT.setStaff(staff);
          window.location.href = "timetable-edit.html";
          return;
        }
        if (msg) {
          msg.className = "form-msg show err";
          msg.textContent = "Staff demo: staff@greenvalley.edu.in and password GVIS@2026";
        }
        return;
      }
      if (msg) {
        msg.className = "form-msg show err";
        msg.textContent = "This is a demo portal page. Live ERP login will open here once the school server is connected.";
      }
    });
    const forgot = document.getElementById("forgotBtn");
    if (forgot) {
      forgot.addEventListener("click", function () {
        if (msg) {
          msg.className = "form-msg show ok";
          msg.textContent = "SMS RESET from your registered mobile, or visit the front desk with parent ID. We never ask for your password on a call.";
        }
      });
    }
    const otpBtn = document.getElementById("otpBtn");
    if (otpBtn) {
      otpBtn.addEventListener("click", function () {
        if (msg) {
          msg.className = "form-msg show ok";
          msg.textContent = "OTP will be sent to the registered mobile once the live ERP is connected. For now, use password sign-in.";
        }
      });
    }
  }

  document.querySelectorAll(".res-tabs button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".res-tabs button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var id = btn.getAttribute("data-res");
      document.querySelectorAll(".res-panel").forEach(function (p) {
        p.classList.toggle("on", p.getAttribute("data-panel") === id);
      });
    });
  });

  function wireSimpleForm(id, msgId, url) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const msg = document.getElementById(msgId);
      const phone = form.phone ? String(form.phone.value || "").replace(/\D/g, "") : "";
      if (form.phone && phone.length !== 10) {
        if (msg) {
          msg.className = "form-msg show";
          msg.style.background = "rgba(192,57,43,0.1)";
          msg.style.color = "#c0392b";
          msg.textContent = "Please enter a valid 10-digit mobile number.";
        }
        return;
      }
      const btn = form.querySelector(".send-btn");
      if (btn) btn.disabled = true;
      postForm(url, form, function (data, ok) {
        if (msg) {
          msg.className = "form-msg show " + (ok && data.ok ? "success" : "");
          msg.style.background = ok && data.ok ? "" : "rgba(192,57,43,0.1)";
          msg.style.color = ok && data.ok ? "" : "#c0392b";
          msg.textContent = (ok && data.ok) ? (data.message || "Saved.") : ((data && data.error) || "Could not save. Start Apache + MySQL.");
        }
        if (ok && data.ok) form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.getAttribute("data-label") || "Submit";
        }
      });
    });
  }
  wireSimpleForm("tcForm", "tcMsg", "tc-save.php");
  wireSimpleForm("careerForm", "careerMsg", "career-save.php");

  const applyForm = document.getElementById("applyForm");
  if (applyForm) {
    applyForm.querySelectorAll("input[type='file']").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var tag = inp.parentElement.querySelector(".file-name");
        if (tag) tag.textContent = inp.files && inp.files[0] ? inp.files[0].name : "";
      });
    });
    applyForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const phone = (applyForm.phone.value || "").replace(/\D/g, "");
      const msg = document.getElementById("applyMsg");
      if (phone.length !== 10) {
        if (msg) {
          msg.className = "form-msg show";
          msg.style.background = "rgba(192,57,43,0.1)";
          msg.style.color = "#c0392b";
          msg.textContent = "Please enter a valid 10-digit mobile number.";
        }
        return;
      }
      var fileErr = "";
      var okType = /\.(pdf|jpe?g|png)$/i;
      applyForm.querySelectorAll("input[type='file']").forEach(function (inp) {
        var f = inp.files && inp.files[0];
        if (inp.required && !f) fileErr = "Please upload all required documents (photo, birth certificate and both Aadhaar copies).";
        if (f && !okType.test(f.name)) fileErr = "Documents must be PDF, JPG or PNG.";
        if (f && f.size > 2 * 1024 * 1024) fileErr = "Each document must be under 2 MB.";
      });
      if (fileErr) {
        if (msg) {
          msg.className = "form-msg show";
          msg.style.background = "rgba(192,57,43,0.1)";
          msg.style.color = "#c0392b";
          msg.textContent = fileErr;
        }
        return;
      }
      const btn = applyForm.querySelector(".send-btn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      postForm("apply.php", applyForm, function (data, ok) {
        if (ok && data.ok) {
          if (msg) {
            msg.className = "form-msg show success";
            msg.style.background = "";
            msg.style.color = "";
            msg.textContent = data.message || "Thank you. The Admissions Desk will call you within 2 working days.";
          }
          applyForm.reset();
          applyForm.querySelectorAll(".file-name").forEach(function (el) { el.textContent = ""; });
        } else if (msg) {
          msg.className = "form-msg show";
          msg.style.background = "rgba(192,57,43,0.1)";
          msg.style.color = "#c0392b";
          msg.textContent = (data && data.error) ? data.error : "Could not save. Start Apache + MySQL.";
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Submit application";
        }
      });
    });
  }
})();
