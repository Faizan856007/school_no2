/* Timetable view + teacher editor for Green Valley International School */
(function () {
  var TT = window.GVIS_TT;
  if (!TT) return;

  var DAY_LABEL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function qs(name) {
    var p = new URLSearchParams(window.location.search);
    return p.get(name);
  }

  function fillClassSelect(sel, wing, current) {
    if (!sel) return;
    var list = TT.CLASS_IDS.filter(function (c) { return !wing || wing === "all" || c.wing === wing; });
    var groups = { primary: "Primary · I–V", middle: "Middle · VI–VIII", secondary: "Secondary · IX–X", senior: "Senior Secondary · XI–XII" };
    sel.innerHTML = "";
    var last = "";
    list.forEach(function (c) {
      if (c.wing !== last) {
        last = c.wing;
        var og = document.createElement("optgroup");
        og.label = groups[c.wing] || c.wing;
        sel.appendChild(og);
      }
      var opt = document.createElement("option");
      opt.value = c.code;
      opt.textContent = c.name;
      sel.lastChild.appendChild(opt);
    });
    if (current && [].some.call(sel.options, function (o) { return o.value === current; })) {
      sel.value = current;
    } else if (sel.options.length) {
      sel.selectedIndex = 0;
    }
  }

  function cellHtml(text) {
    var parts = String(text || "").split(/\s+\/\s+/);
    var main = parts[0] || "";
    var extra = parts.slice(1).join(" / ");
    return "<span class=\"tt-sub\">" + escapeHtml(main) + "</span>" +
      (extra ? "<span class=\"tt-tname\">" + escapeHtml(extra) + "</span>" : "");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function renderViewTable(rec) {
    var tbody = document.querySelector("#timetableTable tbody");
    if (!tbody) return;
    tbody.innerHTML = TT.PERIODS.map(function (p) {
      var isBreak = p.kind === "fixed";
      var cells = DAY_LABEL.map(function (_, i) {
        var val = isBreak ? p.value : rec.grid[p.id][i];
        var kind = TT.subjectKind(val);
        return "<td class=\"sub-" + kind + "\">" + cellHtml(val) + "</td>";
      }).join("");
      return "<tr class=\"" + (isBreak ? "tt-break" : "") + "\">" +
        "<th><span>" + p.no + "</span>" + p.time + "</th>" + cells + "</tr>";
    }).join("");
  }

  function updateMeta(rec) {
    var nameEl = document.getElementById("ttClassName");
    var teacherEl = document.getElementById("ttTeacher");
    var roomEl = document.getElementById("ttRoom");
    var wingEl = document.getElementById("ttWing");
    var updatedEl = document.querySelector(".tt-updated");
    var printTitle = document.getElementById("ttPrintTitle");
    if (nameEl) nameEl.textContent = rec.name;
    if (teacherEl) teacherEl.textContent = rec.teacher;
    if (roomEl) roomEl.textContent = rec.room;
    if (wingEl) wingEl.textContent = TT.WING_LABEL[rec.wing] || rec.wing;
    if (updatedEl) {
      updatedEl.textContent = "Last updated: " + rec.updated + "  ·  Effective from " + prettyDate(rec.effective);
    }
    if (printTitle) {
      printTitle.textContent = rec.name + " · Session 2026–27 · Room " + rec.room + " · Class teacher: " + rec.teacher;
    }
    var editLink = document.getElementById("ttEditLink");
    if (editLink) editLink.href = "timetable-edit.html?class=" + encodeURIComponent(rec.code);
  }

  function prettyDate(iso) {
    if (!iso) return "21 July 2026";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return parseInt(p[2], 10) + " " + months[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  function initView() {
    var sel = document.getElementById("ttClass");
    if (!sel) return;
    var wing = "all";
    var start = qs("class") || "8A";
    fillClassSelect(sel, wing, start);

    function show() {
      var rec = TT.getClass(sel.value);
      renderViewTable(rec);
      updateMeta(rec);
    }

    sel.addEventListener("change", show);

    document.querySelectorAll("[data-wing]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-wing]").forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        wing = btn.getAttribute("data-wing");
        var keep = sel.value;
        fillClassSelect(sel, wing, keep);
        show();
      });
    });

    var printBtn = document.getElementById("ttPrint");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    show();
  }

  function renderEditTable(rec) {
    var tbody = document.querySelector("#ttEditTable tbody");
    if (!tbody) return;
    tbody.innerHTML = TT.PERIODS.map(function (p) {
      var isBreak = p.kind === "fixed";
      var cells = DAY_LABEL.map(function (_, i) {
        if (isBreak) {
          return "<td><input value=\"" + escapeHtml(p.value) + "\" readonly></td>";
        }
        var val = rec.grid[p.id][i] || "";
        return "<td><input name=\"" + p.id + "[]\" data-pid=\"" + p.id + "\" data-day=\"" + i + "\" value=\"" + escapeHtml(val) + "\"></td>";
      }).join("");
      return "<tr class=\"" + (isBreak ? "tt-break" : "") + "\">" +
        "<th><span>" + p.no + "</span>" + p.time + "</th>" + cells + "</tr>";
    }).join("");
  }

  function paintChips(rec) {
    var box = document.getElementById("ttChips");
    if (!box) return;
    var meta = TT.CLASS_IDS.filter(function (c) { return c.code === rec.code; })[0] || TT.CLASS_IDS[0];
    var list = TT.paletteFor(meta).concat(["House", "Dispersal"]);
    box.innerHTML = list.map(function (s) {
      return "<button type=\"button\" class=\"tt-chip sub-" + TT.subjectKind(s) + "\" data-sub=\"" + escapeHtml(s) + "\">" + escapeHtml(s) + "</button>";
    }).join("");
  }

  function collectRecord(sel) {
    var code = sel.value;
    var rec = TT.getClass(code);
    rec.teacher = (document.getElementById("ttTeacherIn") || {}).value || rec.teacher;
    rec.room = (document.getElementById("ttRoomIn") || {}).value || rec.room;
    rec.effective = (document.getElementById("ttEffective") || {}).value || rec.effective;
    rec.grid = rec.grid || {};
    document.querySelectorAll("#ttEditTable input[data-pid]").forEach(function (inp) {
      var pid = inp.getAttribute("data-pid");
      var day = parseInt(inp.getAttribute("data-day"), 10);
      if (!rec.grid[pid]) rec.grid[pid] = ["", "", "", "", "", ""];
      rec.grid[pid][day] = inp.value.trim();
    });
    return rec;
  }

  function fillMetaFields(rec) {
    var t = document.getElementById("ttTeacherIn");
    var r = document.getElementById("ttRoomIn");
    var e = document.getElementById("ttEffective");
    if (t) t.value = rec.teacher;
    if (r) r.value = rec.room;
    if (e) e.value = rec.effective || "2026-07-21";
  }

  function showDesk(on) {
    var gate = document.getElementById("ttGate");
    var desk = document.getElementById("ttDesk");
    if (gate) gate.hidden = !!on;
    if (desk) desk.hidden = !on;
    var who = document.getElementById("ttStaffWho");
    var staff = TT.getStaff();
    if (who && staff) who.textContent = staff.email;
  }

  function initEdit() {
    var gateForm = document.getElementById("ttStaffForm");
    var sel = document.getElementById("ttEditClass");
    if (!gateForm && !sel) return;

    showDesk(!!TT.getStaff());

    if (gateForm) {
      gateForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var user = gateForm.userid.value;
        var pass = gateForm.password.value;
        var msg = document.getElementById("ttGateMsg");
        var staff = TT.checkStaffLogin(user, pass);
        if (!staff) {
          if (msg) {
            msg.className = "form-msg show err";
            msg.textContent = "Use your school email and staff password. Demo: staff@greenvalley.edu.in  /  GVIS@2026";
          }
          return;
        }
        TT.setStaff(staff);
        showDesk(true);
      });
    }

    var logout = document.getElementById("ttLogout");
    if (logout) {
      logout.addEventListener("click", function () {
        TT.clearStaff();
        showDesk(false);
      });
    }

    if (!sel) return;
    var start = qs("class") || "8A";
    fillClassSelect(sel, "all", start);

    var paint = "";

    function load() {
      var rec = TT.getClass(sel.value);
      renderEditTable(rec);
      fillMetaFields(rec);
      paintChips(rec);
      var note = document.getElementById("ttEditNote");
      if (note) note.textContent = rec.name + " · last saved " + rec.updated;
    }

    sel.addEventListener("change", load);

    var chips = document.getElementById("ttChips");
    if (chips) {
      chips.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-sub]");
        if (!btn) return;
        paint = btn.getAttribute("data-sub");
        chips.querySelectorAll(".tt-chip").forEach(function (c) { c.classList.toggle("on", c === btn); });
      });
    }

    var table = document.getElementById("ttEditTable");
    if (table) {
      table.addEventListener("focusin", function (e) {
        var inp = e.target;
        if (inp.tagName === "INPUT" && paint && !inp.readOnly) inp.value = paint;
      });
    }

    var form = document.getElementById("ttEditForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!TT.getStaff()) {
          showDesk(false);
          return;
        }
        var rec = collectRecord(sel);
        TT.saveClass(rec);
        var msg = document.getElementById("ttSaveMsg");
        if (msg) {
          msg.className = "form-msg show success";
          msg.textContent = rec.name + " saved. Parents and students will see this on the Class Timetable page.";
        }
        var note = document.getElementById("ttEditNote");
        if (note) note.textContent = rec.name + " · last saved " + rec.updated;
      });
    }

    var resetBtn = document.getElementById("ttReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Reset this class to the Academic Office default timetable?")) return;
        var rec = TT.resetClass(sel.value);
        renderEditTable(rec);
        fillMetaFields(rec);
        paintChips(rec);
        var msg = document.getElementById("ttSaveMsg");
        if (msg) {
          msg.className = "form-msg show success";
          msg.textContent = rec.name + " restored to the default weekly plan.";
        }
      });
    }

    load();
  }

  initView();
  initEdit();
})();
