/* Green Valley International School — Class I to XII timetable data.
   Teachers save from timetable-edit.html. Browser stores in localStorage.
   When PHP is live, the same JSON posts to timetable-save.php. */
(function (global) {
  var DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"];
  var STORE_KEY = "gvis.timetables.v1";
  var STAFF_KEY = "gvis.staff";
  var STAFF_PASS = "GVIS@2026";

  var PERIODS = [
    { id: "asm", no: "A", time: "7:50 – 8:10", kind: "fixed", value: "Assembly" },
    { id: "p1", no: "1", time: "8:10 – 8:50", kind: "class" },
    { id: "p2", no: "2", time: "8:50 – 9:30", kind: "class" },
    { id: "p3", no: "3", time: "9:30 – 10:10", kind: "class" },
    { id: "brk", no: "B", time: "10:10 – 10:25", kind: "fixed", value: "Break" },
    { id: "p4", no: "4", time: "10:25 – 11:05", kind: "class" },
    { id: "p5", no: "5", time: "11:05 – 11:45", kind: "class" },
    { id: "p6", no: "6", time: "11:45 – 12:25", kind: "class" },
    { id: "lun", no: "L", time: "12:25 – 1:00", kind: "fixed", value: "Lunch" },
    { id: "p7", no: "7", time: "1:00 – 1:35", kind: "class" },
    { id: "p8", no: "8", time: "1:35 – 2:10", kind: "class" }
  ];

  var CLASS_IDS = [
    { code: "1A", name: "Class I – A", wing: "primary", grade: 1, teacher: "Ms. Ananya Sharma", room: "101" },
    { code: "1B", name: "Class I – B", wing: "primary", grade: 1, teacher: "Ms. Ritika Sen", room: "102" },
    { code: "2A", name: "Class II – A", wing: "primary", grade: 2, teacher: "Mrs. Neha Bansal", room: "103" },
    { code: "2B", name: "Class II – B", wing: "primary", grade: 2, teacher: "Ms. Pooja Nair", room: "104" },
    { code: "3A", name: "Class III – A", wing: "primary", grade: 3, teacher: "Mrs. Kavita Iyer", room: "105" },
    { code: "3B", name: "Class III – B", wing: "primary", grade: 3, teacher: "Ms. Sneha Gupta", room: "106" },
    { code: "4A", name: "Class IV – A", wing: "primary", grade: 4, teacher: "Mr. Rohan Malik", room: "107" },
    { code: "4B", name: "Class IV – B", wing: "primary", grade: 4, teacher: "Mrs. Divya Kapoor", room: "108" },
    { code: "5A", name: "Class V – A", wing: "primary", grade: 5, teacher: "Mrs. Shalini Rao", room: "109" },
    { code: "5B", name: "Class V – B", wing: "primary", grade: 5, teacher: "Mr. Amit Verma", room: "110" },
    { code: "6A", name: "Class VI – A", wing: "middle", grade: 6, teacher: "Mrs. Meera Joshi", room: "201" },
    { code: "6B", name: "Class VI – B", wing: "middle", grade: 6, teacher: "Mr. Farhan Ali", room: "202" },
    { code: "7A", name: "Class VII – A", wing: "middle", grade: 7, teacher: "Mrs. Anita Deshmukh", room: "203" },
    { code: "7B", name: "Class VII – B", wing: "middle", grade: 7, teacher: "Mr. Vikram Sethi", room: "204" },
    { code: "8A", name: "Class VIII – A", wing: "middle", grade: 8, teacher: "Mrs. Priya Menon", room: "205" },
    { code: "8B", name: "Class VIII – B", wing: "middle", grade: 8, teacher: "Mr. Sandeep Kaur", room: "206" },
    { code: "9A", name: "Class IX – A", wing: "secondary", grade: 9, teacher: "Mrs. Ritu Malhotra", room: "301" },
    { code: "9B", name: "Class IX – B", wing: "secondary", grade: 9, teacher: "Mr. Arjun Bhatia", room: "302" },
    { code: "10A", name: "Class X – A", wing: "secondary", grade: 10, teacher: "Mrs. Sunita Khanna", room: "303" },
    { code: "10B", name: "Class X – B", wing: "secondary", grade: 10, teacher: "Mr. Naveen Pillai", room: "304" },
    { code: "11S", name: "Class XI – Science", wing: "senior", grade: 11, teacher: "Dr. Anil Kapoor", room: "401" },
    { code: "11C", name: "Class XI – Commerce", wing: "senior", grade: 11, teacher: "Mrs. Geeta Narang", room: "402" },
    { code: "11H", name: "Class XI – Humanities", wing: "senior", grade: 11, teacher: "Ms. Ishita Bose", room: "403" },
    { code: "12S", name: "Class XII – Science", wing: "senior", grade: 12, teacher: "Dr. Rahul Mehta", room: "404" },
    { code: "12C", name: "Class XII – Commerce", wing: "senior", grade: 12, teacher: "Mr. Mohit Arora", room: "405" },
    { code: "12H", name: "Class XII – Humanities", wing: "senior", grade: 12, teacher: "Mrs. Leena Das", room: "406" }
  ];

  var PALETTES = {
    primary: ["English", "Hindi", "Mathematics", "EVS", "Computer", "Art", "Music", "Games", "Library", "Value Ed.", "Activity", "Yoga"],
    middle: ["English", "Hindi", "Mathematics", "Science", "Social Sc.", "Sanskrit", "Computer", "Games", "Art / Music", "Library", "Life skills", "Science Lab"],
    secondary: ["English", "Hindi", "Mathematics", "Science", "Social Sc.", "IT", "Games", "Library", "Science Lab", "Work Ed.", "Life skills", "Art"],
    seniorS: ["English", "Physics", "Chemistry", "Mathematics", "Computer Sc.", "P.E.", "Physics Lab", "Chem. Lab", "CS Lab", "Library"],
    seniorC: ["English", "Accountancy", "B. Studies", "Economics", "Mathematics", "I.P.", "P.E.", "Library", "Project", "Life skills"],
    seniorH: ["English", "History", "Pol. Science", "Geography", "Economics", "Psychology", "P.E.", "Library", "Project", "Life skills"]
  };

  var WING_LABEL = {
    primary: "Primary · I to V",
    middle: "Middle · VI to VIII",
    secondary: "Secondary · IX & X",
    senior: "Senior · XI & XII"
  };

  function paletteFor(meta) {
    if (meta.wing === "senior") {
      if (meta.code.indexOf("C") === 2) return PALETTES.seniorC;
      if (meta.code.indexOf("H") === 2) return PALETTES.seniorH;
      return PALETTES.seniorS;
    }
    return PALETTES[meta.wing] || PALETTES.middle;
  }

  function shift(list, n) {
    var out = list.slice();
    var k = ((n % out.length) + out.length) % out.length;
    return out.slice(k).concat(out.slice(0, k));
  }

  function buildGrid(meta) {
    var pool = paletteFor(meta);
    var seed = meta.grade * 3 + (meta.code.charCodeAt(meta.code.length - 1) % 5);
    var grid = {};
    var classRows = PERIODS.filter(function (p) { return p.kind === "class"; });
    classRows.forEach(function (row, ri) {
      var dayPool = shift(pool, seed + ri);
      grid[row.id] = DAYS.map(function (_, di) {
        if (row.id === "p8" && di === 5) return "Dispersal";
        if (row.id === "p7" && di === 5) return meta.wing === "senior" ? "House / CCA" : "House";
        if (row.id === "p1" && di === 0 && meta.wing !== "senior") return dayPool[0];
        return dayPool[(di + ri) % dayPool.length];
      });
    });
    return grid;
  }

  function defaultRecord(meta) {
    return {
      code: meta.code,
      name: meta.name,
      wing: meta.wing,
      grade: meta.grade,
      teacher: meta.teacher,
      room: meta.room,
      effective: "2026-07-21",
      updated: "18 August 2026",
      grid: buildGrid(meta)
    };
  }

  function defaults() {
    var map = {};
    CLASS_IDS.forEach(function (m) { map[m.code] = defaultRecord(m); });
    return map;
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && parsed.classes ? parsed.classes : {};
    } catch (e) {
      return {};
    }
  }

  function writeLocal(classes) {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      session: "2026-27",
      savedAt: new Date().toISOString(),
      classes: classes
    }));
  }

  function mergeClass(saved, meta) {
    var base = defaultRecord(meta);
    if (!saved) return base;
    base.teacher = saved.teacher || base.teacher;
    base.room = saved.room || base.room;
    base.effective = saved.effective || base.effective;
    base.updated = saved.updated || base.updated;
    if (saved.grid) {
      Object.keys(base.grid).forEach(function (pid) {
        if (saved.grid[pid] && saved.grid[pid].length === 6) base.grid[pid] = saved.grid[pid].slice();
      });
    }
    return base;
  }

  function getAll() {
    var saved = readLocal();
    var all = {};
    CLASS_IDS.forEach(function (m) { all[m.code] = mergeClass(saved[m.code], m); });
    return all;
  }

  function getClass(code) {
    var all = getAll();
    return all[code] || getAll()["8A"];
  }

  function formatDate(d) {
    var dt = d instanceof Date ? d : new Date();
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return dt.getDate() + " " + months[dt.getMonth()] + " " + dt.getFullYear();
  }

  function saveClass(record) {
    var saved = readLocal();
    record.updated = formatDate(new Date());
    saved[record.code] = record;
    writeLocal(saved);
    tryPhpSave(record);
    return record;
  }

  function resetClass(code) {
    var saved = readLocal();
    delete saved[code];
    writeLocal(saved);
    var meta = CLASS_IDS.filter(function (m) { return m.code === code; })[0];
    return meta ? defaultRecord(meta) : getClass("8A");
  }

  function tryPhpSave(record) {
    if (typeof fetch !== "function") return;
    fetch("timetable-save.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }).catch(function () { /* static preview — localStorage is the live store */ });
  }

  function subjectKind(text) {
    var s = (text || "").toLowerCase();
    if (/assembly|break|lunch|dispersal/.test(s)) return "break";
    if (/english|hindi|sanskrit|french|language/.test(s)) return "lang";
    if (/math|account/.test(s)) return "math";
    if (/science|evs|physics|chem|bio|lab/.test(s)) return "sci";
    if (/social|history|geograph|pol\.|econom|sst/.test(s)) return "sst";
    if (/computer|i\.p|it\b|cs lab/.test(s)) return "comp";
    if (/game|art|music|p\.e|pe\b|library|life|value|activ|yoga|house|work|project|cca/.test(s)) return "act";
    return "gen";
  }

  function getStaff() {
    try { return JSON.parse(sessionStorage.getItem(STAFF_KEY) || "null"); }
    catch (e) { return null; }
  }

  function setStaff(info) {
    sessionStorage.setItem(STAFF_KEY, JSON.stringify(info));
  }

  function clearStaff() {
    sessionStorage.removeItem(STAFF_KEY);
  }

  function checkStaffLogin(user, pass) {
    var u = (user || "").trim().toLowerCase();
    var p = (pass || "").trim();
    var okMail = /@greenvalley\.edu\.in$/.test(u) || u === "staff" || u === "teacher";
    if (okMail && p === STAFF_PASS) {
      return { email: u.indexOf("@") > -1 ? u : "staff@greenvalley.edu.in", name: "Academic Office" };
    }
    return null;
  }

  global.GVIS_TT = {
    DAYS: DAYS,
    PERIODS: PERIODS,
    CLASS_IDS: CLASS_IDS,
    PALETTES: PALETTES,
    WING_LABEL: WING_LABEL,
    STAFF_PASS: STAFF_PASS,
    paletteFor: paletteFor,
    getAll: getAll,
    getClass: getClass,
    saveClass: saveClass,
    resetClass: resetClass,
    subjectKind: subjectKind,
    getStaff: getStaff,
    setStaff: setStaff,
    clearStaff: clearStaff,
    checkStaffLogin: checkStaffLogin,
    formatDate: formatDate
  };
})(window);
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
