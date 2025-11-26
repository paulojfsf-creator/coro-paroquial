// ==== app-main.js ====
const PROGRAM_PARTS = [
    { id: 'entrada',        label: 'Entrada',             icon: '🎉' },
    { id: 'atoPenitencial', label: 'Ato Penitencial',     icon: '🙏' },
    { id: 'gloria',         label: 'Glória',              icon: '🎶' },
    { id: 'salmo',          label: 'Salmo Responsorial',  icon: '📖' },
    { id: 'aclamacao',      label: 'Aclamação ao Evangelho', icon: '📜' },
    { id: 'ofertorio',      label: 'Ofertório',           icon: '🎁' },
    { id: 'santo',          label: 'Santo',               icon: '✨' },
    { id: 'paiNosso',       label: 'Pai Nosso',           icon: '🤲' },
    { id: 'paz',            label: 'Paz',                 icon: '🕊️' },
    { id: 'cordeiro',       label: 'Cordeiro de Deus',    icon: '🐑' },
    { id: 'comunhao',       label: 'Comunhão',            icon: '🍞' },
    { id: 'acaoGracas',     label: 'Ação de Graças',      icon: '🙌' },
    { id: 'final',          label: 'Final',               icon: '🚪' }
  ];
  window.PROGRAM_PARTS = PROGRAM_PARTS;


  let songs = [];
  let history = [];
  let partLyricsOverrides = {};
  let currentLyricsPartId = null;
  let currentSongSelectPartId = null;
  let partExtraData = {}; // dados extra por parte: título/tom/letra/acordes/notas
  let songUsageHistory = []; // histórico de utilização de cânticos
  // Registo de utilização de cânticos (para histórico e etiquetas)
  window.recordSongUsage = function(titulo, secaoLabel, dateIso) {
    try {
      const key = 'coroSongUsage_v1';
      const raw = localStorage.getItem(key);
      songUsageHistory = raw ? JSON.parse(raw) : [];
    } catch (e) {
      songUsageHistory = [];
    }
    const todayIso = (dateIso && String(dateIso)) || new Date().toISOString().slice(0,10);
    const entry = {
      date: todayIso,
      section: secaoLabel || null,
      title: titulo || '',
      count: 1
    };
  function loadSongUsageHistory() {
    try {
      const raw = localStorage.getItem('coroSongUsage_v1');
      songUsageHistory = raw ? JSON.parse(raw) : [];
    } catch (e) {
      songUsageHistory = [];
    }
    return songUsageHistory;
  }

  function getLastUsageForTitle(title) {
    if (!title) return null;
    loadSongUsageHistory();
    const filtered = songUsageHistory.filter(function(e) { return e.title === title; });
    if (!filtered.length) return null;
    filtered.sort(function(a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    return filtered[0];
  }

  function describeRecency(dateStr) {
    if (!dateStr) return '';
    const today = new Date();
    const [y, m, d] = dateStr.split('-').map(function(v) { return parseInt(v, 10); });
    if (!y || !m || !d) return '';
    const dt = new Date(y, m - 1, d);
    const diffMs = today.getTime() - dt.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Usado hoje';
    if (diffDays === 1) return 'Usado ontem';
    if (diffDays < 7) return 'Usado há ' + diffDays + ' dias';
    const weeks = Math.round(diffDays / 7);
    if (weeks === 1) return 'Usado há 1 semana';
    if (weeks < 8) return 'Usado há ' + weeks + ' semanas';
    const months = Math.round(diffDays / 30);
    if (months === 1) return 'Usado há 1 mês';
    return 'Usado há ' + months + ' meses';
  }

    const existing = songUsageHistory.find(function(e) {
      return e.date === entry.date && e.section === entry.section && e.title === entry.title;
    });
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      songUsageHistory.push(entry);
    }
    try {
      localStorage.setItem('coroSongUsage_v1', JSON.stringify(songUsageHistory));
    } catch (e) {
      console.warn('Não foi possível guardar histórico de cânticos:', e);
    }
  };

  function loadSongUsageHistory() {
    try {
      const raw = localStorage.getItem('coroSongUsage_v1');
      songUsageHistory = raw ? JSON.parse(raw) : [];
    } catch (e) {
      songUsageHistory = [];
    }
    return songUsageHistory;
  }

  function getLastUsageForTitle(title) {
    if (!title) return null;
    loadSongUsageHistory();
    const filtered = songUsageHistory.filter(function(e) { return e.title === title; });
    if (!filtered.length) return null;
    filtered.sort(function(a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    return filtered[0];
  }

  function describeRecency(dateStr) {
    if (!dateStr) return '';
    const today = new Date();
    const parts = String(dateStr).split('-');
    if (parts.length !== 3) return '';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!y || !m || !d) return '';
    const dt = new Date(y, m - 1, d);
    const diffMs = today.getTime() - dt.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Usado hoje';
    if (diffDays === 1) return 'Usado ontem';
    if (diffDays < 7) return 'Usado há ' + diffDays + ' dias';
    const weeks = Math.round(diffDays / 7);
    if (weeks === 1) return 'Usado há 1 semana';
    if (weeks < 8) return 'Usado há ' + weeks + ' semanas';
    const months = Math.round(diffDays / 30);
    if (months === 1) return 'Usado há 1 mês';
    return 'Usado há ' + months + ' meses';
  }



  function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'success' ? 'toast--success' : type === 'error' ? 'toast--error' : '');
    el.innerHTML = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toast-out 0.2s forwards';
      setTimeout(() => container.removeChild(el), 200);
    }, 2500);
  }

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }
  function diffWeeks(a, b) {
    return Math.round((a - b) / (7 * 24 * 60 * 60 * 1000));
  }
  
  function warnIfProgramHasVeryRecentSongs(program) {
    if (!program || !program.parts) return;
    loadSongUsageHistory();
    const today = new Date();
    const recentWarnings = [];
    program.parts.forEach(function(p) {
      if (!p.title) return;
      const last = getLastUsageForTitle(p.title);
      if (!last || !last.date) return;
      const parts = last.date.split('-');
      if (parts.length !== 3) return;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!y || !m || !d) return;
      const dt = new Date(y, m - 1, d);
      const diffDays = Math.round((today - dt) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        recentWarnings.push(p.label + ' — ' + p.title + ' (' + describeRecency(last.date) + ')');
      }
    });
    if (recentWarnings.length && typeof showToast === 'function') {
      showToast('Atenção: alguns cânticos foram usados muito recentemente:\n' + recentWarnings.join('\n'), 'warning');
    }
  }
function sameDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = 1 + ((h + l - 7 * m + 114) % 31);
    return new Date(year, month - 1, day);
  }

  function firstSundayOnOrAfter(date) {
    const d = new Date(date.getTime());
    const dow = d.getDay();
    const diff = (7 - dow) % 7;
    d.setDate(d.getDate() + diff);
    return d;
  }

  function firstSundayOfAdvent(year) {
    // Domingo que cai em ou depois de 27 de novembro
    return firstSundayOnOrAfter(new Date(year, 10, 27));
  }

  function calculateBaptismOfTheLord(year) {
    // Domingo depois de 6 de janeiro (Epifania fixa a 6)
    const epiphany = new Date(year, 0, 6);
    const d = new Date(epiphany.getTime());
    d.setDate(d.getDate() + 1);
    return firstSundayOnOrAfter(d);
  }


// Festas / Solenidades / Memórias (geral + Braga) para qualquer ano
function getFeastForDate(date) {
  if (!date || !(date instanceof Date)) return null;
  const year = date.getFullYear();

  function md(month, day) {
    return new Date(year, month - 1, day);
  }
  function isSame(d) {
    return sameDate(date, d);
  }

  const easter = calculateEaster(year);
  const palmSunday   = addDays(easter, -7);
  const holyThursday = addDays(easter, -3);
  const goodFriday   = addDays(easter, -2);
  const holySaturday = addDays(easter, -1);
  const divineMercy  = addDays(easter, 7);
  const ascension    = addDays(easter, 42);
  const pentecost    = addDays(easter, 49);
  const trinity      = addDays(easter, 56);
  const corpusChristi= addDays(easter, 60);
  const sacredHeart  = addDays(easter, 68);

  const christmas = md(12, 25);
  let holyFamily = null;
  if (christmas.getDay() === 0) {
    holyFamily = md(12, 30);
  } else {
    for (let d = 26; d <= 31; d++) {
      const cand = md(12, d);
      if (cand.getDay() === 0) {
        holyFamily = cand;
        break;
      }
    }
  }

  const adventStart = firstSundayOfAdvent(year);
  const christKing  = addDays(adventStart, -7);

  // Tríduo Pascal e Páscoa
  if (isSame(palmSunday))   return { name: 'Domingo de Ramos e da Paixão do Senhor', type: 'Festa' };
  if (isSame(holyThursday)) return { name: 'Ceia do Senhor', type: 'Solenidade' };
  if (isSame(goodFriday))   return { name: 'Paixão do Senhor', type: 'Solenidade' };
  if (isSame(holySaturday)) return { name: 'Sábado Santo', type: 'Comemoração' };
  if (isSame(easter))       return { name: 'Páscoa da Ressurreição do Senhor', type: 'Solenidade' };
  if (isSame(divineMercy))  return { name: 'Domingo da Divina Misericórdia', type: 'Festa' };
  if (isSame(ascension))    return { name: 'Ascensão do Senhor', type: 'Solenidade' };
  if (isSame(pentecost))    return { name: 'Domingo de Pentecostes', type: 'Solenidade' };
  if (isSame(trinity))      return { name: 'Santíssima Trindade', type: 'Solenidade' };
  if (isSame(corpusChristi))return { name: 'Santíssimo Corpo e Sangue de Cristo', type: 'Solenidade' };
  if (isSame(sacredHeart))  return { name: 'Sagrado Coração de Jesus', type: 'Solenidade' };

  // Natal + Sagrada Família
  if (isSame(christmas))    return { name: 'Natal do Senhor', type: 'Solenidade' };
  if (holyFamily && isSame(holyFamily)) {
    return { name: 'Sagrada Família de Jesus, Maria e José', type: 'Festa' };
  }

  // Datas fixas principais
  if (isSame(md(1, 1)))  return { name: 'Santa Maria, Mãe de Deus', type: 'Solenidade' };
  if (isSame(md(1, 6)))  return { name: 'Epifania do Senhor', type: 'Solenidade' };
  if (isSame(md(2, 2)))  return { name: 'Apresentação do Senhor', type: 'Festa' };
  if (isSame(md(3, 19))) return { name: 'São José', type: 'Solenidade' };
  if (isSame(md(3, 25))) return { name: 'Anunciação do Senhor', type: 'Solenidade' };
  if (isSame(md(6, 24))) return { name: 'Nascimento de São João Batista', type: 'Solenidade' };
  if (isSame(md(6, 29))) return { name: 'Apóstolos São Pedro e São Paulo', type: 'Solenidade' };
  if (isSame(md(8, 15))) return { name: 'Assunção da Virgem Santa Maria', type: 'Solenidade' };
  if (isSame(md(11, 1))) return { name: 'Todos os Santos', type: 'Solenidade' };
  if (isSame(md(11, 2))) return { name: 'Comemoração de Todos os Fiéis Defuntos', type: 'Comemoração' };
  if (isSame(md(12, 8))) return { name: 'Imaculada Conceição da Virgem Santa Maria', type: 'Solenidade' };

  // Portugal
  if (isSame(md(5, 13))) return { name: 'Nossa Senhora de Fátima', type: 'Memória' };

  // Cristo Rei
  if (isSame(christKing)) {
    return { name: 'Nosso Senhor Jesus Cristo, Rei do Universo', type: 'Solenidade' };
  }

  // Calendário próprio de Braga (datas fixas)
  // Janeiro
  if (isSame(md(1, 10))) return { name: 'Beato Gonçalo de Amarante, presbítero', type: 'Memória' };
  if (isSame(md(1, 15))) return { name: 'Santo Amaro, abade', type: 'Memória' };

  // Fevereiro
  if (isSame(md(2, 27))) return { name: 'São Félix de Braga (Torcato), bispo', type: 'Memória' };

  // Março
  if (isSame(md(3, 1)))  return { name: 'São Rosendo, bispo', type: 'Memória' };

  // Abril
  if (isSame(md(4, 12))) return { name: 'São Vítor, mártir', type: 'Memória' };
  if (isSame(md(4, 22))) return { name: 'Santa Senhorinha, abadessa', type: 'Memória' };
  if (isSame(md(4, 26))) return { name: 'São Pedro de Rates, bispo, padroeiro secundário da Arquidiocese', type: 'Memória' };

  // Junho
  if (isSame(md(6, 12))) return { name: 'Virgem Santa Maria do Sameiro', type: 'Festa' };
  if (isSame(md(6, 26))) return { name: 'São Paio, mártir', type: 'Memória' };

  // Julho
  if (isSame(md(7, 17))) return { name: 'Bem-aventurados Brás Ribeiro, João Fernandes, Inácio de Azevedo e companheiros, mártires', type: 'Memória' };
  if (isSame(md(7, 18))) return { name: 'São Bartolomeu dos Mártires, bispo', type: 'Memória' };
  if (isSame(md(7, 28))) return { name: 'Beato Mário de Gouveia, mártir', type: 'Memória' };

  // Agosto
  if (isSame(md(8, 2)))  return { name: 'São Gualter, presbítero', type: 'Memória' };
  if (isSame(md(8, 25))) return { name: 'Beato Miguel Carvalho, presbítero e mártir', type: 'Memória' };
  if (isSame(md(8, 28))) return { name: 'Aniversário da Dedicação da Igreja Catedral de Braga', type: 'Festa' }; // na catedral seria solenidade

  // Outubro
  if (isSame(md(10, 13))) return { name: 'Beata Alexandrina Maria da Costa, virgem', type: 'Memória' };
  if (isSame(md(10, 19))) return { name: 'São Frutuoso de Braga, bispo', type: 'Memória' };
  if (isSame(md(10, 21))) return { name: 'São João Paulo II, papa', type: 'Memória' };
  if (isSame(md(10, 22))) return { name: 'São Martinho de Braga, bispo, padroeiro principal da Arquidiocese', type: 'Solenidade' };

  // Dezembro
  if (isSame(md(12, 5)))  return { name: 'São Geraldo de Braga, bispo', type: 'Memória' };
  if (isSame(md(12, 10))) return { name: 'Santa Eulália, virgem e mártir', type: 'Memória' };

  return null;
}


    function toRoman(num) {
    if (!num) return '';
    const romans = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let res = '';
    for (const [val, sym] of romans) {
      while (num >= val) {
        res += sym;
        num -= val;
      }
    }
    return res;
  }

  function getSundayCycle(date) {
    // Usa o ano civil, ajustando a partir do 1º domingo do Advento
    let year = date.getFullYear();
    const adventStart = firstSundayOfAdvent(year);
    if (date >= adventStart) {
      year = year + 1;
    }
    const mod = year % 3;
    if (mod === 1) return 'A';
    if (mod === 2) return 'B';
    return 'C';
  }

  function getOrdinaryTimeSundayNumber(date, easter, ashWed, pentecost, adventStart) {
    const year = date.getFullYear();
    const baptism = calculateBaptismOfTheLord(year);
    const firstOTSunday = addDays(baptism, 7);      // 2º Domingo do TC
    const sundayBeforeAsh = addDays(ashWed, -3);    // Domingo antes de 4ª feira de cinzas
    const sundayAfterPent = addDays(pentecost, 7);  // Domingo depois de Pentecostes
    const lastOTSunday  = addDays(adventStart, -7); // Domingo antes do 1º do Advento

    if (date < firstOTSunday || date > lastOTSunday) return null;
    if (date > addDays(ashWed, -1) && date < addDays(pentecost, 1)) return null;
    if (date.getDay() !== 0) return null; // só domingos

    // Antes da Quaresma: progressivo desde o 2º Domingo do TC
    if (date <= sundayBeforeAsh) {
      return 2 + diffWeeks(date, firstOTSunday);
    }
    // Depois de Pentecostes: conta de trás para a frente para garantir que o último é o XXXIV
    return 34 - diffWeeks(lastOTSunday, date);
  }

  function getLiturgicalInfo(date) {
    const year = date.getFullYear();
    const easter = calculateEaster(year);
    const ashWed = addDays(easter, -46);
    const pentecost = addDays(easter, 49);
    const adventStart = firstSundayOfAdvent(year);

    const cycle = getSundayCycle(date);
    const dow = date.getDay();

    let season = 'Tempo Comum';
    let title = '';
    let sundayNumber = null;

    // Determinar tempo litúrgico principal
    const christmasStartPrev = new Date(year - 1, 11, 25);
    const baptismThis = calculateBaptismOfTheLord(year);
    const christmasStartThis = new Date(year, 11, 25);
    const ashWedStart = ashWed;
    const easterOctaveEnd = addDays(easter, 7);

    const inChristmas =
      (date >= christmasStartPrev && date < baptismThis) ||
      (date >= christmasStartThis && date < calculateBaptismOfTheLord(year + 1));

    if (date >= adventStart || date < christmasStartPrev) {
      season = 'Advento';
    } else if (inChristmas) {
      season = 'Natal';
    } else if (date >= ashWedStart && date < easter) {
      season = 'Quaresma';
    } else if (date >= easter && date < pentecost) {
      season = 'Páscoa';
    } else {
      season = 'Tempo Comum';
    }

    // Solenidades fixas principais (Portugal - sem transferência para domingo)
    let isSolemnity = false;
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    if (mm === 12 && dd === 25) {
      // Natividade do Senhor (Natal)
      season = 'Natal';
      title = 'Solenidade da Natividade do Senhor';
      isSolemnity = true;
    } else if (mm === 1 && dd === 1) {
      // Santa Maria Mãe de Deus
      season = 'Natal';
      title = 'Solenidade de Santa Maria, Mãe de Deus';
      isSolemnity = true;
    } else if (mm === 1 && dd === 6) {
      // Epifania do Senhor
      season = 'Natal';
      title = 'Solenidade da Epifania do Senhor';
      isSolemnity = true;
    } else if (mm === 3 && dd === 19) {
      // São José
      season = season || 'Tempo Comum';
      title = 'Solenidade de São José, Esposo da Virgem Maria';
      isSolemnity = true;
    } else if (mm === 3 && dd === 25) {
      // Anunciação do Senhor
      season = season || 'Tempo Comum';
      title = 'Solenidade da Anunciação do Senhor';
      isSolemnity = true;
    } else if (mm === 8 && dd === 15) {
      // Assunção de Nossa Senhora
      season = season || 'Tempo Comum';
      title = 'Solenidade da Assunção de Nossa Senhora';
      isSolemnity = true;
    } else if (mm === 12 && dd === 8) {
      // Imaculada Conceição
      season = season || 'Tempo Comum';
      title = 'Solenidade da Imaculada Conceição';
      isSolemnity = true;
    }

    // Se for solenidade em dia de semana, não calcular número de domingo
    if (isSolemnity && dow !== 0) {
      return {
        title,
        season,
        cycle,
        sundayNumber: null,
        sundayRoman: '—'
      };
    }


    // Solenidades móveis principais ligadas à Páscoa
    const ascension = addDays(easter, 39);      // Quinta-feira da Ascensão
    const pentecostSunday = pentecost;         // já calculado acima
    const trinitySunday = addDays(pentecostSunday, 7);
    const corpusChristi = addDays(trinitySunday, 4); // Quinta-feira seguinte
    const sacredHeart = addDays(corpusChristi, 8);   // Sexta-feira seguinte

    let movableSolemnity = null;
    if (sameDate(date, ascension)) {
      movableSolemnity = {
        id: 'ascension',
        title: 'Solenidade da Ascensão do Senhor',
        seasonHint: 'Páscoa',
        color: 'white'
      };
    } else if (sameDate(date, pentecostSunday)) {
      movableSolemnity = {
        id: 'pentecost',
        title: 'Solenidade de Pentecostes',
        seasonHint: 'Páscoa',
        color: 'red'
      };
    } else if (sameDate(date, trinitySunday)) {
      movableSolemnity = {
        id: 'trinity',
        title: 'Solenidade da Santíssima Trindade',
        seasonHint: 'Tempo Comum',
        color: 'white'
      };
    } else if (sameDate(date, corpusChristi)) {
      movableSolemnity = {
        id: 'corpus_christi',
        title: 'Solenidade do Santíssimo Corpo e Sangue de Cristo',
        seasonHint: 'Tempo Comum',
        color: 'white'
      };
    } else if (sameDate(date, sacredHeart)) {
      movableSolemnity = {
        id: 'sacred_heart',
        title: 'Solenidade do Sagrado Coração de Jesus',
        seasonHint: 'Tempo Comum',
        color: 'white'
      };
    }

    // Combinar solenidades fixas e móveis
    let chosenSolemnity = null;
    if (isSolemnity) {
      chosenSolemnity = {
        id: 'fixed',
        title,
        seasonHint: season,
        color: null
      };
    }
    if (movableSolemnity) {
      // Se houver solenidade móvel neste dia, prevalece sobre a fixa
      chosenSolemnity = movableSolemnity;
      if (movableSolemnity.seasonHint) {
        season = movableSolemnity.seasonHint;
      }
      title = movableSolemnity.title;
    }

    // Não permitir que nenhuma solenidade substitua o Tríduo Pascal (Quinta Santa até Domingo de Páscoa)
    const triduumStart = addDays(easter, -3); // Quinta-feira Santa
    const triduumEnd = easter;               // Domingo de Páscoa
    const inTriduum = date >= triduumStart && date <= triduumEnd;

    if (inTriduum) {
      chosenSolemnity = null;
    }

    // Se for solenidade em dia de semana (não domingo) e for a celebração do dia
    if (chosenSolemnity && dow !== 0) {
      if (chosenSolemnity.seasonHint) {
        season = chosenSolemnity.seasonHint;
      }
      return {
        title: chosenSolemnity.title,
        season,
        cycle,
        sundayNumber: null,
        sundayRoman: '—',
        color: chosenSolemnity.color || null
      };
    }

    if (dow === 0) {
      if (season === 'Tempo Comum') {
        sundayNumber = getOrdinaryTimeSundayNumber(date, easter, ashWed, pentecost, adventStart);
        if (sundayNumber !== null) {
          title = toRoman(sundayNumber) + ' Domingo do Tempo Comum';
        } else {
          title = 'Domingo do Tempo Comum';
        }
      } else if (season === 'Advento') {
        const firstAdv = adventStart;
        const n = 1 + Math.floor((date - firstAdv) / (7 * 24 * 60 * 60 * 1000));
        sundayNumber = n;
        title = toRoman(n) + ' Domingo do Advento';
      } else if (season === 'Natal') {
        const christmasStart = date.getMonth() === 11 ? christmasStartThis : christmasStartPrev;
        const n = 1 + Math.floor((date - christmasStart) / (7 * 24 * 60 * 60 * 1000));
        sundayNumber = n;
        title = toRoman(n) + ' Domingo do Tempo de Natal';
      } else if (season === 'Quaresma') {
        if (sameDate(date, addDays(easter, -7))) {
          sundayNumber = 6;
          title = 'Domingo de Ramos da Paixão do Senhor';
        } else {
          const firstLentSunday = firstSundayOnOrAfter(addDays(ashWed, 1));
          const n = 1 + Math.floor((date - firstLentSunday) / (7 * 24 * 60 * 60 * 1000));
          sundayNumber = n;
          title = toRoman(n) + ' Domingo da Quaresma';
        }
      } else if (season === 'Páscoa') {
        if (sameDate(date, easter)) {
          sundayNumber = 1;
          title = 'Domingo de Páscoa da Ressurreição do Senhor';
        } else {
          const n = 1 + Math.floor((date - easter) / (7 * 24 * 60 * 60 * 1000));
          sundayNumber = n + 1;
          title = toRoman(sundayNumber) + ' Domingo da Páscoa';
        }
      }
    }

    return {
      title,
      season,
      cycle,
      sundayNumber,
      sundayRoman: sundayNumber !== null ? toRoman(sundayNumber) : '—',
      color: null
    };
  }

  function buildDisplayLiturgicalTitle(date, info) {
    if (!info) return '';
    let base = info.title || '';
    if (!date) return base;
    const dow = date.getDay();
    if (dow === 0 && info.cycle) {
      if (base && base.indexOf('Ano ') === -1) {
        base += ' — Ano ' + info.cycle;
      }
    }
    return base;
  }

  function updateLiturgicalTheme(season) {
    let primary = '#004b80';
    let soft = '#d6e4ff';
    if (season === 'Advento' || season === 'Quaresma') {
      primary = '#4b2c6f'; soft = '#ede9fe';
    } else if (season === 'Natal' || season === 'Páscoa') {
      primary = '#92400e'; soft = '#fef3c7';
    } else if (season === 'Tempo Comum') {
      primary = '#166534'; soft = '#dcfce7';
    }
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--primary-soft', soft);
  }

  function applyLiturgicalClass(season) {
    document.body.classList.remove(
      'liturgic-advento','liturgic-quaresma','liturgic-natal','liturgic-pascoa','liturgic-tempocomum',
      'lit-green','lit-purple','lit-red','lit-white','lit-gold'
    );
    if (season === 'Advento') {
      document.body.classList.add('liturgic-advento','lit-purple');
    } else if (season === 'Quaresma') {
      document.body.classList.add('liturgic-quaresma','lit-purple');
    } else if (season === 'Natal') {
      document.body.classList.add('liturgic-natal','lit-gold');
    } else if (season === 'Páscoa') {
      document.body.classList.add('liturgic-pascoa','lit-white');
    } else if (season === 'Tempo Comum') {
      document.body.classList.add('liturgic-tempocomum','lit-green');
    }
  }

  function applyHeaderIcon(season) {
    const titleEl = document.getElementById('headerTitle');
    const pillText = document.getElementById('liturgicalInfoText');
    const pillIcon = document.getElementById('liturgicalIcon');
    let icon = '🎵';
    switch (season) {
      case 'Advento': icon = '🕯'; break;
      case 'Natal': icon = '⭐'; break;
      case 'Quaresma': icon = '✝'; break;
      case 'Páscoa': icon = '🔥'; break;
      case 'Tempo Comum': icon = '🌿'; break;
    }
    pillIcon.innerHTML = icon;
    pillText.innerHTML = season ? ('Tempo: ' + season) : 'Tempo litúrgico não definido';
    titleEl.innerHTML = icon + ' Coro Paroquial São João Batista de Rio Caldo';
  }

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  function getAutoTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hour = new Date().getHours();
    const isNight = (hour >= 20 || hour < 7);
    return (prefersDark || isNight) ? 'dark' : 'light';
  }
  function applyThemeFromStorage() {
    const stored = localStorage.getItem('coroTheme');
    const effective = stored || getAutoTheme();
    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggleBtn.innerHTML = '☀ Modo claro';
    } else {
      document.documentElement.classList.remove('dark');
      themeToggleBtn.innerHTML = '🌙 Modo escuro';
    }
  }
  themeToggleBtn.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('coroTheme', isDark ? 'dark' : 'light');
    applyThemeFromStorage();
  });
  applyThemeFromStorage();

  // ---- Catálogo (Google Sheets + CSV manual) ----
  const csvFileInput = document.getElementById('csvFile');
  const loadCsvBtn = document.getElementById('loadCsvBtn');
  const csvError = document.getElementById('csvError');
  const songsTableContainer = document.getElementById('songsTableContainer');
  const filterAuthor = document.getElementById('filterAuthor');
  const filterTheme = document.getElementById('filterTheme');
  const songSearch = document.getElementById('songSearch');

  const GOOGLE_SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv7BD5eoTpio0s2Vjb6YCuZNmjCyG_leoWxl6v-IkIMV-LiJZNmCwhqA9j68IESZQJiU-H3ri3_flR/pub?gid=1808635095&single=true&output=csv";

  function parseCsvResults(data) {
    songs = data || [];
    window.songs = songs;
    refreshFilters();
    renderSongsTable();
  }

  function loadCsvFromGoogleSheets(done) {
    Papa.parse(GOOGLE_SHEETS_CSV, {
      download: true,
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        if (results && results.data && results.data.length) {
          try { if (typeof done === 'function') done(); } catch(e) { console.error(e); }
          parseCsvResults(results.data);
          showToast('Catálogo carregado automaticamente do Google Sheets.', 'success');
        } else {
          songsTableContainer.innerHTML = 'Não foi possível carregar automaticamente o catálogo. Usa o CSV manual ou tenta mais tarde.';
          showToast('Erro ao carregar catálogo do Google Sheets.', 'error');
        }
      },
      error: (err) => {
        try { if (typeof done === 'function') done(); } catch(e) { console.error(e); }
        console.error(err);
        songsTableContainer.innerHTML = 'Não foi possível carregar automaticamente o catálogo. Usa o CSV manual ou tenta mais tarde.';
        showToast('Erro ao carregar catálogo do Google Sheets.', 'error');
      }
    });
  }

  function renderSongsTable() {
    if (!songs.length) {
      songsTableContainer.classList.add('muted');
      songsTableContainer.innerHTML = 'Sem dados de catálogo para mostrar.';
      return;
    }
    const authorVal = filterAuthor.value;
    const themeVal = filterTheme.value;
    const searchVal = (songSearch.value || '').toLowerCase();
    const filtered = songs.filter(song => {
      const autor = song.Autor || song.autor || '';
      const tema = song.Tema || song.tema || '';
      const titulo = song.Título || song.Titulo || song.titulo || '';
      if (authorVal && autor !== authorVal) return false;
      if (themeVal && tema !== themeVal) return false;
      if (searchVal && !titulo.toLowerCase().includes(searchVal)) return false;
      return true;
    });

    let html = '<table><thead><tr>' +
      '<th>Título</th><th>Tema</th><th>Autor</th><th>Partitura</th><th>Vídeo</th>' +
      '</tr></thead><tbody>';
    filtered.forEach(song => {
      const titulo = song.Título || song.Titulo || song.titulo || '';
      const tema = song.Tema || song.tema || '';
      const autor = song.Autor || song.autor || '';
      const partitura = song.partitura || song.Partitura || '';
      const video = song.video || song.Vídeo || song.Video || '';
      html += '<tr>' +
        '<td>' + titulo + '</td>' +
        '<td>' + tema + '</td>' +
        '<td>' + autor + '</td>' +
        '<td>' + (partitura ? '<a href="' + partitura + '" target="_blank">Partitura</a>' : '<span class="muted">—</span>') + '</td>' +
        '<td>' + (video ? '<a href="' + video + '" target="_blank">Vídeo</a>' : '<span class="muted">—</span>') + '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    songsTableContainer.classList.remove('muted');
    songsTableContainer.innerHTML = html;

    populateSongDropdowns();
  }

  function refreshFilters() {
    const authors = new Set();
    const temas = new Set();
    songs.forEach(s => {
      const autor = s.Autor || s.autor;
      const tema = s.Tema || s.tema;
      if (autor) authors.add(autor);
      if (tema) temas.add(tema);
    });
    filterAuthor.innerHTML = '<option value="">Todos</option>' + Array.from(authors).sort().map(a => '<option>' + a + '</option>').join('');
    filterTheme.innerHTML = '<option value="">Todos</option>' + Array.from(temas).sort().map(t => '<option>' + t + '</option>').join('');
  }

  loadCsvBtn.addEventListener('click', () => {
    csvError.style.display = 'none';
    if (!csvFileInput.files || !csvFileInput.files.length) {
      csvError.innerHTML = 'Escolhe um ficheiro CSV.';
      csvError.style.display = 'block';
      return;
    }
    const file = csvFileInput.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        try {
          parseCsvResults(results.data);
          showToast('CSV carregado com sucesso.', 'success');
        } catch (err) {
          csvError.innerHTML = 'Erro ao processar o CSV.';
          csvError.style.display = 'block';
        }
      },
      error: () => {
        csvError.innerHTML = 'Erro ao ler o ficheiro CSV.';
        csvError.style.display = 'block';
      }
    });
  });

  filterAuthor.addEventListener('change', renderSongsTable);
  filterTheme.addEventListener('change', renderSongsTable);
  songSearch.addEventListener('input', renderSongsTable);

  function populateSongDropdowns() {
    const titles = Array.from(new Set(songs.map(s => s.Título || s.Titulo || s.titulo).filter(Boolean))).sort();
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = '<option value="">— escolher —</option>' +
        titles.map(t => '<option value="' + t + '">' + t + '</option>').join('');
      if (currentValue) select.value = currentValue;
    });
  }

  // ---- Histórico ----
  
  // ---- Histórico de cânticos (por utilização) ----
  function renderSongUsageHistory() {
    loadSongUsageHistory();
    const container = document.getElementById('songHistoryTableContainer');
    const monthInput = document.getElementById('songHistoryMonth');
    const sectionSelect = document.getElementById('songHistorySection');
    const searchInput = document.getElementById('songHistorySearch');
    const summaryEl = document.getElementById('songHistorySummary');

    if (!container) return;

    let filtered = songUsageHistory.slice();

    // Filtro por mês
    if (monthInput && monthInput.value) {
      const [y, m] = monthInput.value.split('-');
      filtered = filtered.filter(function(e) {
        return e.date && e.date.startsWith(monthInput.value);
      });
    }

    // Filtro por secção
    if (sectionSelect && sectionSelect.value) {
      filtered = filtered.filter(function(e) {
        return e.section === sectionSelect.value;
      });
    }

    // Pesquisa por título
    const term = (searchInput && searchInput.value || '').toLowerCase();
    if (term) {
      filtered = filtered.filter(function(e) {
        return (e.title || '').toLowerCase().indexOf(term) !== -1;
      });
    }

    if (!filtered.length) {
      container.classList.add('muted');
      container.innerHTML = 'Ainda não há cânticos registados com estes filtros.';
      if (summaryEl) summaryEl.textContent = '';
      return;
    }

    // Construir conjunto de secções para o dropdown
    if (sectionSelect && !sectionSelect.dataset._filled) {
      const set = new Set();
      songUsageHistory.forEach(function(e) {
        if (e.section) set.add(e.section);
      });
      Array.from(set).sort().forEach(function(sec) {
        const opt = document.createElement('option');
        opt.value = sec;
        opt.textContent = sec;
        sectionSelect.appendChild(opt);
      });
      sectionSelect.dataset._filled = '1';
    }

    // Agregar por data/parte/título (já vem agregado, mas por segurança)
    filtered.sort(function(a, b) {
      const cmp = String(b.date || '').localeCompare(String(a.date || ''));
      if (cmp !== 0) return cmp;
      const sa = (a.section || '').localeCompare(a.section || '');
      if (sa !== 0) return sa;
      return (a.title || '').localeCompare(b.title || '');
    });

    let totalCount = 0;
    filtered.forEach(function(e) { totalCount += e.count || 1; });

    let html = '<table><thead><tr><th>Data</th><th>Secção</th><th>Cântico</th><th>Vezes</th></tr></thead><tbody>';
    filtered.forEach(function(e) {
      html += '<tr>' +
        '<td>' + (e.date || '—') + '</td>' +
        '<td>' + (e.section || '—') + '</td>' +
        '<td>' + (e.title || '—') + '</td>' +
        '<td>' + (e.count || 1) + '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    container.classList.remove('muted');
    container.innerHTML = html;

    if (summaryEl) {
      summaryEl.textContent = filtered.length + ' registo(s), ' + totalCount + ' utilização(ões) no total.';
    }
  }

  function exportSongUsageCsv() {
    loadSongUsageHistory();
    if (!songUsageHistory.length) return;
    let csv = 'data,secao,cantico,contador\n';
    songUsageHistory.forEach(function(e) {
      csv += [
        e.date || '',
        e.section || '',
        e.title || '',
        e.count || 1
      ].map(function(v) {
        const s = String(v).replace(/"/g, '""');
        return '"' + s + '"';
      }).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_canticos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function clearSongUsageHistory() {
    if (!confirm('Tens a certeza que queres apagar o histórico de cânticos?')) return;
    songUsageHistory = [];
    try {
      localStorage.removeItem('coroSongUsage_v1');
    } catch(e) {}
    renderSongUsageHistory();
  }
  function exportFullStateJson() {
    const dateInput = document.getElementById('date');
    const state = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      programDate: dateInput && dateInput.value || null,
      program: {},
      songUsage: []
    };
    // Programa atual
    (window.PROGRAM_PARTS || []).forEach(function(p) {
      const sel = document.getElementById(p.id);
      state.program[p.id] = sel && sel.value || null;
    });
    // Histórico de cânticos
    loadSongUsageHistory();
    state.songUsage = songUsageHistory.slice();

    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estado_coro.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importFullStateJson() {
    const textarea = document.getElementById('fullStateImportArea');
    if (!textarea || !textarea.value.trim()) {
      if (typeof showToast === 'function') showToast('Cola primeiro o JSON exportado.', 'error');
      return;
    }
    let parsed = null;
    try {
      parsed = JSON.parse(textarea.value);
    } catch (e) {
      if (typeof showToast === 'function') showToast('JSON inválido.', 'error');
      return;
    }
    if (!parsed || typeof parsed !== 'object') {
      if (typeof showToast === 'function') showToast('JSON inválido.', 'error');
      return;
    }

    if (!confirm('Isto vai substituir o programa atual e o histórico de cânticos neste dispositivo. Continuar?')) return;

    // Restaurar programa
    if (parsed.program) {
      (window.PROGRAM_PARTS || []).forEach(function(p) {
        const sel = document.getElementById(p.id);
        if (!sel) return;
        const val = parsed.program[p.id];
        if (val) {
          let opt = Array.from(sel.options).find(function(o) { return o.value === val; });
          if (!opt) {
            opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            sel.appendChild(opt);
          }
          sel.value = val;
        } else {
          sel.value = '';
        }
      });
      if (typeof updatePreview === 'function') updatePreview();
    }

    // Restaurar histórico de cânticos
    if (parsed.songUsage && Array.isArray(parsed.songUsage)) {
      songUsageHistory = parsed.songUsage.slice();
      try {
        localStorage.setItem('coroSongUsage_v1', JSON.stringify(songUsageHistory));
      } catch (e) {}
      renderSongUsageHistory();
    }

    if (typeof showToast === 'function') showToast('Estado importado com sucesso.', 'success');
  }

function loadHistory() {
    try {
      const raw = localStorage.getItem('coroLiturgicoHistory_v2');
      history = raw ? JSON.parse(raw) : [];
    } catch (e) {
      history = [];
    }
  }
  function saveHistory() {
    localStorage.setItem('coroLiturgicoHistory_v2', JSON.stringify(history));
  }
  function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!history.length) {
      container.classList.add('muted');
      container.innerHTML = 'Ainda não há domingos guardados.';
      refreshRehearsalPrograms();
      return;
    }
    let html = '<table><thead><tr><th>Data</th><th>Título</th><th>Tempo / Ciclo</th><th>Ações</th></tr></thead><tbody>';
    history.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach((rec, idx) => {
      // Encontrar índice original (não ordenado)
      const originalIdx = history.findIndex(h => h.date === rec.date && h.title === rec.title);
      html += '<tr>' +
        '<td>' + (rec.date || '—') + '</td>' +
        '<td>' + (rec.title || '—') + '</td>' +
        '<td>' + (rec.season || '—') + ' / ' + (rec.cycle || '—') + '</td>' +
        '<td style="display:flex;gap:0.5rem;">' +
          '<button type="button" class="btn secondary small" data-hist-idx="' + originalIdx + '">Carregar</button>' +
          '<button type="button" class="btn small" style="background:#dc2626;" data-hist-del="' + originalIdx + '">Eliminar</button>' +
        '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    container.classList.remove('muted');
    container.innerHTML = html;

    // Listener para carregar
    container.querySelectorAll('button[data-hist-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-hist-idx'), 10);
        loadProgramFromHistory(idx);
      });
    });

    // Listener para eliminar
    container.querySelectorAll('button[data-hist-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-hist-del'), 10);
        if (confirm('Tem a certeza que quer eliminar este programa do histórico?')) {
          history.splice(idx, 1);
          saveHistory();
          renderHistory();
          showToast('Programa eliminado do histórico.', 'success');
        }
      });
    });

    refreshRehearsalPrograms();
  }

  function getProgramFromForm() {
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
      showToast('Escolhe uma data.', 'error');
      return null;
    }
    const [y, m, d] = dateInput.value.split('-').map(v => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    const info = getLiturgicalInfo(dt);
    const litTitleInput = document.getElementById('liturgicalTitle');
    const extraThemeInput = document.getElementById('extraTheme');

    const record = {
      date: dateInput.value,
      title: (litTitleInput.value || buildDisplayLiturgicalTitle(dt, info)),
      extraTheme: extraThemeInput.value || '',
      season: info.season || '',
      cycle: info.cycle || '',
      parts: {}
    };
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (!select || !select.value) return;
      record.parts[part.id] = {
        title: select.value,
        label: part.label
      };
    });
    return record;
  }

  function applyProgramToForm(rec) {
    const dateInput = document.getElementById('date');
    const litTitleInput = document.getElementById('liturgicalTitle');
    const extraThemeInput = document.getElementById('extraTheme');
    const cycleDisplay = document.getElementById('cycleDisplay');

    dateInput.value = rec.date || '';
    litTitleInput.value = rec.title || '';
    extraThemeInput.value = rec.extraTheme || '';
    cycleDisplay.value = (rec.season || '—') + ' / Ano ' + (rec.cycle || '—');

    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (!select) return;
      const p = rec.parts && rec.parts[part.id];
      select.value = p && p.title ? p.title : '';
    });

    if (rec.date) {
      const [y, m, d] = rec.date.split('-').map(v => parseInt(v, 10));
      const dt = new Date(y, m - 1, d);
      const info = getLiturgicalInfo(dt);
      updateLiturgicalTheme(info.season);
      applyLiturgicalClass(info.season);
      applyHeaderIcon(info.season);
      updatePreview();
    }
  }

  function loadProgramFromHistory(idx) {
    const rec = history[idx];
    if (!rec) return;
    applyProgramToForm(rec);
    showToast('Programa carregado do histórico.', 'success');
  }

  const programForm = document.getElementById('programForm');
  programForm.addEventListener('submit', e => {
    e.preventDefault();
    const rec = getProgramFromForm();
    if (!rec) return;
    history.push(rec);
    saveHistory();
    renderHistory();
    updatePreview();
    showToast('Domingo guardado no histórico.', 'success');
  });

  
function updatePreview() {

function updateDashboard() {
  try {
    const dateInput = document.getElementById('date');
    if (!dateInput || !dateInput.value) return;
    const d = new Date(dateInput.value + 'T12:00:00');
    const info = getLiturgicalInfo(d);
    const usage = (typeof loadSongUsageHistory === 'function')
      ? loadSongUsageHistory()
      : (window.songUsageHistory || []);

    const parts = window.PROGRAM_PARTS || [];
    const filled = parts.filter(p => {
      const el = document.getElementById(p.id);
      return el && el.value && el.value.trim() !== '';
    }).length;

    const dashLitTitle = document.getElementById('dashLitTitle');
    const dashLitSeason = document.getElementById('dashLitSeason');
    const dashLitCycle = document.getElementById('dashLitCycle');
    const dashFilledParts = document.getElementById('dashFilledParts');
    const dashTotalParts = document.getElementById('dashTotalParts');
    const dashUsageCount = document.getElementById('dashUsageCount');

    if (dashLitTitle) {
      dashLitTitle.textContent = buildDisplayLiturgicalTitle(d, info);
    }
    if (dashLitSeason) {
      dashLitSeason.textContent = info.season || '';
    }
    if (dashLitCycle) {
      dashLitCycle.textContent = 'Ano ' + (info.cycle || '—');
    }
    if (dashFilledParts) {
      dashFilledParts.textContent = filled;
    }
    if (dashTotalParts) {
      dashTotalParts.textContent = parts.length;
    }
    if (dashUsageCount) {
      dashUsageCount.textContent = (usage || []).length;
    }
  } catch (e) {
    console.error('updateDashboard error', e);
  }
}
    const preview = document.getElementById('previewContainer');
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
      preview.innerHTML = '<p class="small muted">Preenche um programa na aba anterior.</p>';
      return;
    }
    const [y, m, d] = dateInput.value.split('-').map(v => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    const info = getLiturgicalInfo(dt);
    const extraThemeInput = document.getElementById('extraTheme');
    const litTitleInput = document.getElementById('liturgicalTitle');

    const displayTitle = (litTitleInput.value || buildDisplayLiturgicalTitle(dt, info) || 'Programa litúrgico');
    const dataFormatada = dt.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const extraRaw = extraThemeInput.value.trim();
    let extraHtml = '';
    if (extraRaw) {
      let label = '';
      let nome = extraRaw;
      if (/(Solenidade)/i.test(extraRaw)) {
        label = 'Solenidade: ';
        nome = extraRaw.replace(/\s*\(Solenidade\)\s*/i, '');
      } else if (/(Festa)/i.test(extraRaw)) {
        label = 'Festa: ';
        nome = extraRaw.replace(/\s*\(Festa\)\s*/i, '');
      } else if (/(Memória)/i.test(extraRaw)) {
        label = 'Memória: ';
        nome = extraRaw.replace(/\s*\(Memória[^)]*\)\s*/i, '');
      } else if (/(Comemoração)/i.test(extraRaw)) {
        label = 'Comemoração: ';
        nome = extraRaw.replace(/\s*\(Comemoração[^)]*\)\s*/i, '');
      }
      extraHtml = '<div class="meta"><strong>' + (label || '') + nome + '</strong></div>';
    }

    // Logo e imagem
    const logoEl = document.getElementById('folhetoLogo');
    const imgDomingoEl = document.getElementById('folhetoImagemDomingo');
    const logoSrc = logoEl && logoEl.src ? logoEl.src : '';
    const domingoSrc = imgDomingoEl && imgDomingoEl.src ? imgDomingoEl.src : '';

    // Construir blocos de cânticos com letras
    let songsHtml = '';
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (!select || !select.value) return;
      const title = select.value;
      const songInfo = songs.find(s => (s.Título || s.Titulo || s.titulo) === title) || {};
      const author = songInfo.Autor || songInfo.autor || '';
      const override = (partLyricsOverrides[part.id] || '').trim();
      const baseLyrics = (songInfo.Letra || songInfo.letra || '').trim();
      const lyrics = override || baseLyrics;
      let lyricsHtml = '';
      const extra = (window.partExtraData && window.partExtraData[part.id]) || null;
      const effectiveTitle = (extra && extra.title) ? extra.title : title;
      const effectiveLyrics = (extra && extra.lyrics) ? extra.lyrics : lyrics;
      const extraChords = extra && extra.chords;
      const extraNotes = extra && extra.notes;

      if (effectiveLyrics) {
        let htmlLyrics = String(effectiveLyrics)
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n');
        htmlLyrics = htmlLyrics.replace(/\[([^\]]+)\]/g, '<span class="chord">[$1]</span>');
        htmlLyrics = htmlLyrics
          .split('\n')
          .map(l => l.replace(/\s+$/g, ''))
          .join('<br>');
        lyricsHtml = '<div class="leaflet-song-lyrics folheto-letra">' + htmlLyrics + '</div>';
      } else {
        lyricsHtml = '<div class="leaflet-song-meta"><em>Letra não disponível.</em></div>';
      }
      songsHtml += '<div class="leaflet-song">';
      songsHtml += '<div class="leaflet-song-title">' + part.label + ' — ' + effectiveTitle + '</div>';
      if (author) {
        songsHtml += '<div class="leaflet-song-meta">Autor: ' + author + '</div>';
      }
      if (extraChords) {
        songsHtml += '<div class="leaflet-song-meta"><strong>Acordes:</strong> ' + extraChords + '</div>';
      }
      if (extraNotes) {
        songsHtml += '<div class="leaflet-song-meta"><strong>Notas:</strong> ' + extraNotes + '</div>';
      }
      songsHtml += lyricsHtml;
      songsHtml += '</div>';

    });

    if (!songsHtml) {
      preview.innerHTML = '<p class="small muted">Seleciona pelo menos um cântico para ver o folheto.</p>';
      return;
    }

    let html = '';
    html += '<div class="leaflet-frame">';
    html += '  <div class="leaflet-a4">';
    html += '    <div class="leaflet-header" id="leafletHeader">';
    html += '      <div class="leaflet-header-left">';
    if (logoSrc) {
      html += '        <img src="' + logoSrc + '" alt="Logotipo">';
    }
    html += '      </div>';
    html += '      <div class="leaflet-header-center">';
    html += '        <h2>' + displayTitle + '</h2>';
    html += '        <div class="meta">' + dataFormatada + '</div>';
    html +=          extraHtml || '';
    html += '      </div>';
    html += '      <div class="leaflet-header-right">';
    if (domingoSrc) {
      html += '        <img src="' + domingoSrc + '" alt="Imagem do domingo">';
    }
    html += '      </div>';
    html += '    </div>';
    html += '    <div class="leaflet-line" id="leafletLine"></div>';
    html += '    <div class="leaflet-note">Folheto para a assembleia. Respeitar sempre os direitos de autor.</div>';
    html += '    <div class="leaflet-cols" id="leafletSongs">';
    html +=          songsHtml;
    html += '    </div>';
    html += '    <div class="leaflet-footer">';
    html += '      <div>Paróquia / Comunidade</div>';
    html += '      <div>Gerado a partir do programa litúrgico</div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';


    const programForWarnings = {
      date: dateInput.value,
      parts: []
    };
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (!select || !select.value) return;
      programForWarnings.parts.push({
        id: part.id,
        label: part.label,
        title: select.value
      });
    });

    warnIfProgramHasVeryRecentSongs(programForWarnings);

    preview.innerHTML = html;
  }

  PROGRAM_PARTS.forEach(part => {
    const select = document.getElementById(part.id);
    if (select) select.addEventListener('change', updatePreview);
  });


document.getElementById('assemblySheetBtn').addEventListener('click', () => {
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
      showToast('Escolhe uma data primeiro.', 'error');
      return;
    }

    // Verificar se há pelo menos um cântico selecionado
    let hasSong = false;
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (select && select.value) hasSong = true;
    });
    if (!hasSong) {
      showToast('Seleciona pelo menos um cântico antes de gerar o folheto.', 'error');
      return;
    }

    // Gerar o folheto na pré-visualização (mesma lógica)
    if (typeof updatePreview === 'function') {
      updatePreview();
    }

    const preview = document.getElementById('previewContainer');
    if (!preview) {
      showToast('Área de pré-visualização não encontrada.', 'error');
      return;
    }
    const content = preview.innerHTML || '';
    if (!content || /Seleciona pelo menos um cântico/.test(content) || /Preenche um programa/.test(content)) {
      showToast('Preenche o programa e seleciona os cânticos antes de gerar o folheto.', 'error');
      return;
    }

    const leafletCss = `
.leaflet-frame {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}
.leaflet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 14mm 12mm 16mm 18mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: "Noto Serif", "Times New Roman", serif;
  font-size: 11.5pt;
  color: #000;
}
.leaflet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10mm;
}
.leaflet-header-left img,
.leaflet-header-right img {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
}
.leaflet-header-center {
  text-align: center;
  flex-grow: 1;
  padding: 0 8mm;
}
.leaflet-header-center h2 {
  margin: 0;
  font-size: 16pt;
  line-height: 1.2;
}
.leaflet-header-center .meta {
  font-size: 10.5pt;
  margin-top: 4px;
}
.leaflet-line {
  width: 100%;
  height: 1.5px;
  background: #333;
  margin-bottom: 6mm;
}
.leaflet-note {
  font-size: 9pt;
  color: #444;
  margin-bottom: 6mm;
}
.leaflet-cols {
  column-count: 2;
  column-gap: 10mm;
  column-fill: balance;
  width: 100%;
  flex-grow: 1;
}
.leaflet-song {
  break-inside: avoid-column;
  page-break-inside: avoid;
  margin-bottom: 8mm;
}
.leaflet-song-title {
  font-weight: bold;
  font-size: 12.5pt;
  margin-bottom: 3px;
}
.leaflet-song-meta {
  font-size: 10pt;
  margin-bottom: 3px;
  color: #333;
}
.leaflet-song pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 11pt;
  margin: 0;
  padding: 0;
}
.leaflet-footer {
  text-align: center;
  font-size: 9.5pt;
  margin-top: 10mm;
  border-top: 1px solid #333;
  padding-top: 3mm;
}

@page {
  size: A4 portrait;
  margin: 10mm 10mm 12mm 14mm;
}

@media print {
  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .leaflet-frame {
    padding: 0;
  }
  .leaflet-a4 {
    box-shadow: none;
    width: auto;
    height: auto;
    padding: 10mm 8mm 12mm 12mm;
  }
}
`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write('<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>Folheto da assembleia</title><style>' + leafletCss + '</style></head><body>' + content + '</body></html>');
      win.document.close();
      try { win.focus(); win.print(); } catch (e) {}
    } else {
      showToast('Permite pop-ups para ver o folheto.', 'error');
    }
  })
;



document.getElementById('assemblySheetBtnNoLyrics').addEventListener('click', () => {
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
      showToast('Escolhe uma data primeiro.', 'error');
      return;
    }

    let hasSong = false;
    PROGRAM_PARTS.forEach(part => {
      const select = document.getElementById(part.id);
      if (select && select.value) hasSong = true;
    });
    if (!hasSong) {
      showToast('Seleciona pelo menos um cântico antes de gerar o folheto.', 'error');
      return;
    }

    if (typeof updatePreview === 'function') {
      updatePreview();
    }

    const preview = document.getElementById('previewContainer');
    if (!preview) {
      showToast('Área de pré-visualização não encontrada.', 'error');
      return;
    }
    let content = preview.innerHTML || '';
    if (!content) {
      showToast('Preenche o programa antes de gerar o folheto.', 'error');
      return;
    }

    // Remover letras (pre) e a nota de direitos de autor
    content = content.replace(/<div class=\"leaflet-song-lyrics[^>]*>[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class=\"leaflet-note\">[\s\S]*?<\/div>/, '');

    const leafletCss = `
.leaflet-frame {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}
.leaflet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 14mm 12mm 16mm 18mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: "Noto Serif", "Times New Roman", serif;
  font-size: 11.5pt;
  color: #000;
}
.leaflet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10mm;
}
.leaflet-header-left img,
.leaflet-header-right img {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
}
.leaflet-header-center {
  text-align: center;
  flex-grow: 1;
  padding: 0 8mm;
}
.leaflet-header-center h2 {
  margin: 0;
  font-size: 16pt;
  line-height: 1.2;
}
.leaflet-header-center .meta {
  font-size: 10.5pt;
  margin-top: 4px;
}
.leaflet-line {
  width: 100%;
  height: 1.5px;
  background: #333;
  margin-bottom: 6mm;
}
.leaflet-note {
  font-size: 9pt;
  color: #444;
  margin-bottom: 6mm;
}
.leaflet-cols {
  column-count: 2;
  column-gap: 10mm;
  column-fill: balance;
  width: 100%;
  flex-grow: 1;
}
.leaflet-song {
  break-inside: avoid-column;
  page-break-inside: avoid;
  margin-bottom: 8mm;
}
.leaflet-song-title {
  font-weight: bold;
  font-size: 12.5pt;
  margin-bottom: 3px;
}
.leaflet-song-meta {
  font-size: 10pt;
  margin-bottom: 3px;
  color: #333;
}
.leaflet-song pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 11pt;
  margin: 0;
  padding: 0;
}
.leaflet-footer {
  text-align: center;
  font-size: 9.5pt;
  margin-top: 10mm;
  border-top: 1px solid #333;
  padding-top: 3mm;
}

@page {
  size: A4 portrait;
  margin: 10mm 10mm 12mm 14mm;
}

@media print {
  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .leaflet-frame {
    padding: 0;
  }
  .leaflet-a4 {
    box-shadow: none;
    width: auto;
    height: auto;
    padding: 10mm 8mm 12mm 12mm;
  }
}
`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write('<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>Folheto da assembleia (sem letras)</title><style>' + leafletCss + '</style></head><body>' + content + '</body></html>');
      win.document.close();
      try { win.focus(); win.print(); } catch (e) {}
    } else {
      showToast('Permite pop-ups para ver o folheto.', 'error');
    }
  });
  // Ensaios – WhatsApp
  function refreshRehearsalPrograms() {
    const select = document.getElementById('rehearsalProgram');
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '<option value="">— escolher domingo —</option>';
    history.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach((rec, idx) => {
      const opt = document.createElement('option');
      let label = (rec.date || '') + ' – ' + (rec.title || '');
      if (rec.extraTheme) label += ' [' + rec.extraTheme + ']';
      opt.value = idx;
      opt.innerHTML = label;
      select.appendChild(opt);
    });
    if (currentValue) select.value = currentValue;
  }

  document.getElementById('rehearsalWhatsAppBtn').addEventListener('click', () => {
    const dateStr = document.getElementById('rehearsalDate').value;
    const timeStr = document.getElementById('rehearsalTime').value;
    const place = document.getElementById('rehearsalPlace').value.trim();
    const programIdx = document.getElementById('rehearsalProgram').value;
    const notes = document.getElementById('rehearsalNotes').value.trim();

    if (!dateStr || !timeStr) {
      showToast('Preenche a data e a hora do ensaio.', 'error');
      return;
    }
    if (!programIdx) {
      showToast('Escolhe um domingo/programa.', 'error');
      return;
    }
    const rec = history[parseInt(programIdx, 10)];
    if (!rec) {
      showToast('Programa inválido.', 'error');
      return;
    }

    const [y, m, d] = dateStr.split('-').map(v => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    const dataFormatada = dt.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const horaFormatada = timeStr.substring(0,5);

    let text = '';
    text += '🎶 Ensaio do Coro Paroquial São João Batista de Rio Caldo 🎶%0A%0A';
    text += '🗓️ ' + encodeURIComponent(dataFormatada + ' às ' + horaFormatada) + '%0A';
    if (place) text += '📍 Local: ' + encodeURIComponent(place) + '%0A%0A';
    else text += '%0A';
    text += 'Programa: ' + encodeURIComponent(rec.title || '') + '%0A';
    if (rec.extraTheme) text += 'Tema extra: ' + encodeURIComponent(rec.extraTheme) + '%0A';
    text += 'Tempo litúrgico: ' + encodeURIComponent(rec.season || '') + ' | Ciclo: ' + encodeURIComponent(rec.cycle || '') + '%0A%0A';
    if (rec.parts) {
      text += 'Cânticos:%0A';
      Object.keys(rec.parts).forEach(function(partId) {
        var p = rec.parts[partId];
        if (!p || !p.title) return;
        var label = p.label || partId;
        text += '- ' + encodeURIComponent(label + ': ' + p.title) + '%0A';
      });
      text += '%0A';
    }
    if (notes) text += 'Notas: ' + encodeURIComponent(notes) + '%0A';

    const waUrl = 'https://wa.me/?text=' + text;
    window.open(waUrl, '_blank');
  });

  const dateInput = document.getElementById('date');
  const litTitleInput = document.getElementById('liturgicalTitle');
  const extraThemeInput = document.getElementById('extraTheme');
  const cycleDisplay = document.getElementById('cycleDisplay');

  
function updateLiturgicalFromDate() {
    if (!dateInput.value) {
      cycleDisplay.value = '';
      applyHeaderIcon('');
      applyLiturgicalClass('');
      return;
    }
    const [y, m, d] = dateInput.value.split('-').map(v => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    const info = getLiturgicalInfo(dt);
    const display = buildDisplayLiturgicalTitle(dt, info);

    // Atualiza sempre o título litúrgico (corrige bug do domingo preso)
    litTitleInput.value = display;

    // Preencher automaticamente o Tema extra com festa / solenidade / memória, se existir e se o campo estiver vazio
    const feast = getFeastForDate(dt);
    if (feast && !extraThemeInput.value.trim()) {
      extraThemeInput.value = feast.name + ' (' + feast.type + ')';
    }

    cycleDisplay.value = (info.season || '—') + ' / Ano ' + (info.cycle || '—');
    updateLiturgicalTheme(info.season);
    applyLiturgicalClass(info.season);
    applyHeaderIcon(info.season);
    updatePreview();
  }


  dateInput.addEventListener('change', updateLiturgicalFromDate);
  extraThemeInput.addEventListener('input', updatePreview);
  litTitleInput.addEventListener('input', updatePreview);

  
// ---- Programa: edição de letra e catálogo rápido de cânticos ----
function openLyricsModalForPart(partId) {
  const select = document.getElementById(partId);
  if (!select) return;
  if (!select.value) {
    showToast('Escolhe primeiro um cântico para essa parte.', 'error');
    return;
  }
  const title = select.value;
  const songInfo = songs.find(s => (s.Título || s.Titulo || s.titulo) === title) || {};
  const baseLyrics = (songInfo.Letra || songInfo.letra || '').trim();
  const override = (partLyricsOverrides[partId] || '').trim();
  const effective = override || baseLyrics;

  currentLyricsPartId = partId;

  // Usa o editor Quill global, reusando o mesmo modal de letras
  if (window.openLyricsEditorForProgram) {
    const part = PROGRAM_PARTS.find(p => p.id === partId);
    const label = part ? part.label : '';
    // define callback para aplicar letra desta parte
    window.applyProgramLyricsFromEditor = function(htmlContent) {
      if (htmlContent && htmlContent.trim()) {
        partLyricsOverrides[partId] = htmlContent;
      } else {
        delete partLyricsOverrides[partId];
      }
      updatePreview();
      showToast('Letra atualizada para esta parte no programa atual.', 'success');
    };
    window.openLyricsEditorForProgram(partId, effective, 'Editar letra — ' + label);
  } else {
    // fallback antigo com textarea (se editor não carregar por algum motivo)
    const modal = document.getElementById('programLyricsModal');
    const titleEl = document.getElementById('programLyricsModalTitle');
    const songEl = document.getElementById('programLyricsModalSong');
    const ta = document.getElementById('programLyricsTextarea');
    const part = PROGRAM_PARTS.find(p => p.id === partId);
    titleEl.innerHTML = 'Editar letra — ' + (part ? part.label : '');
    songEl.innerHTML = title;
    ta.value = effective;
    modal.hidden = false;
  }
}
function closeLyricsModal() {
  const modal = document.getElementById('programLyricsModal');
  if (modal) {
    const backdrop = modal;
    backdrop.classList.add('modal-closing');
    setTimeout(() => {
      backdrop.hidden = true;
      backdrop.classList.remove('modal-closing');
    }, 180);
  }
  currentLyricsPartId = null;
}

function openSongSelectModal(partId) {
  const modal = document.getElementById('songSelectModal');
  if (!modal) return;
  currentSongSelectPartId = partId;

  const part = PROGRAM_PARTS.find(p => p.id === partId);
  const labelEl = document.getElementById('songSelectPartLabel');
  if (labelEl) {
    const icon = part && part.icon ? part.icon + ' ' : '';
    labelEl.innerHTML = part ? ('Parte: ' + icon + part.label) : '';
  }

  // preencher dropdown de temas (únicos)
  const themeSelect = document.getElementById('songSelectTheme');
  if (themeSelect) {
    const prev = themeSelect.value;
    themeSelect.innerHTML = '<option value="">Todos</option>';
    const themes = new Set();
    songs.forEach(s => {
      const tema = (s.Tema || s.tema || '').trim();
      if (tema) {
        tema.split(/[;,]/).forEach(t => {
          const clean = t.trim();
          if (clean) themes.add(clean);
        });
      }
    });
    Array.from(themes).sort((a, b) => a.localeCompare(b, 'pt-PT')).forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.innerHTML = t;
      themeSelect.appendChild(opt);
    });
    if (Array.from(themes).includes(prev)) {
      themeSelect.value = prev;
    }
  }

  const searchInput = document.getElementById('songSelectSearch');
  if (searchInput) searchInput.value = '';

  // construir sugestões inteligentes
  buildSongSuggestionsForPart(partId);

  renderSongSelectList();
  modal.hidden = false;
}

function closeSongSelectModal() {
  const modal = document.getElementById('songSelectModal');
  if (modal) {
    const backdrop = modal;
    backdrop.classList.add('modal-closing');
    setTimeout(() => {
      backdrop.hidden = true;
      backdrop.classList.remove('modal-closing');
    }, 180);
  }
  currentSongSelectPartId = null;
}


  function getLiturgicalContextForProgram() {
    const dateInput = document.getElementById('date');
    if (!dateInput || !dateInput.value || typeof getLiturgicalInfo !== 'function') {
      return null;
    }
    const parts = dateInput.value.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    return getLiturgicalInfo(dt);
  }

  function scoreSongForContext(song, partId, context, lastUsage) {
    let score = 0;
    const tema = (song.Tema || song.tema || '').toLowerCase();
    const tempo = (song.Tempo || song.tempo || '').toLowerCase();
    const obs = (song['Observações'] || song.Observacoes || song.observacoes || song['observações'] || '').toLowerCase();

    if (context) {
      const season = (context.season || '').toLowerCase();
      const color = (context.color || '').toLowerCase();

      if (season && tempo.indexOf(season) !== -1) score += 3;
      if (season && tema.indexOf(season) !== -1) score += 2;

      if (color && obs.indexOf(color) !== -1) score += 2;
      if (color && tema.indexOf(color) !== -1) score += 1;
    }

    // Bónus simples por parte
    if (partId && obs.indexOf(partId.toLowerCase()) !== -1) score += 1;

    // Penalização se usado muito recentemente
    if (lastUsage && lastUsage.date) {
      const today = new Date();
      const parts = lastUsage.date.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (y && m && d) {
          const dt = new Date(y, m - 1, d);
          const diffDays = Math.round((today - dt) / (1000 * 60 * 60 * 24));
          if (diffDays < 7) score -= 8;         // muito recente
          else if (diffDays < 14) score -= 4;   // recente
          else if (diffDays < 30) score -= 2;   // nas últimas semanas
        }
      }
    }

    return score;
  }

  function buildSongSuggestionsForPart(partId) {
    const suggestionsContainer = document.getElementById('songSelectSuggestions');
    const listEl = document.getElementById('songSelectSuggestionsList');
    if (!suggestionsContainer || !listEl) return;

    if (!songs || !songs.length) {
      suggestionsContainer.style.display = 'none';
      listEl.innerHTML = '';
      return;
    }

    const context = getLiturgicalContextForProgram();
    const scored = [];

    songs.forEach(function(s) {
      const title = (s.Título || s.Titulo || s.titulo || '').trim();
      if (!title) return;
      const last = getLastUsageForTitle(title);
      const score = scoreSongForContext(s, partId, context, last);
      if (score <= 0) return;
      scored.push({ song: s, title: title, last: last, score: score });
    });

    scored.sort(function(a, b) { return b.score - a.score; });

    const top = scored.slice(0, 5);

    if (!top.length) {
      suggestionsContainer.style.display = 'none';
      listEl.innerHTML = '';
      return;
    }

    let html = '';
    top.forEach(function(item) {
      const recency = item.last ? describeRecency(item.last.date) : '';
      const tema = item.song.Tema || item.song.tema || '';
      const tempo = item.song.Tempo || item.song.tempo || '';
      html += '<button type="button" class="btn secondary btn-xs" data-suggest-title="' + String(item.title).replace(/"/g, '&quot;') + '">';
      html += item.title;
      if (tempo) html += ' <span class="small muted">(' + tempo + ')</span>';
      if (recency) html += ' <span class="badge-usage">' + recency + '</span>';
      html += '</button> ';
    });

    listEl.innerHTML = html;
    suggestionsContainer.style.display = 'block';

    // Ligar click dos botões de sugestão
    listEl.querySelectorAll('button[data-suggest-title]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const title = btn.getAttribute('data-suggest-title');
        if (!currentSongSelectPartId || !title) return;
        const select = document.getElementById(currentSongSelectPartId);
        if (select) {
          // criar option se necessário
          let opt = Array.from(select.options).find(function(o) { return o.value === title; });
          if (!opt) {
            opt = document.createElement('option');
            opt.value = title;
            opt.textContent = title;
            select.appendChild(opt);
          }
          select.value = title;
          select.dispatchEvent(new Event('change'));
          if (window.recordSongUsage) {
            const part = (window.PROGRAM_PARTS || []).find(function(p) { return p.id === currentSongSelectPartId; });
            const label = part ? part.label : null;
            const dateInput = document.getElementById('date');
            const dateIso = (dateInput && dateInput.value) || null;
            window.recordSongUsage(title, label, dateIso);
          }
          if (typeof showToast === 'function') {
            const part = (window.PROGRAM_PARTS || []).find(function(p) { return p.id === currentSongSelectPartId; });
            showToast('Cântico sugerido aplicado a ' + (part ? part.label : 'parte') + '.', 'success');
          }
        }
        const modal = document.getElementById('songSelectModal');
        if (modal) modal.hidden = true;
      });
    });
  }
function renderSongSelectList() {
  const listEl = document.getElementById('songSelectList');
  if (!listEl) return;
  if (!songs.length) {
    listEl.innerHTML = '<p class="small muted">Catálogo ainda não carregado.</p>';
    return;
  }

  const search = (document.getElementById('songSelectSearch')?.value || '').toLowerCase();
  const theme = (document.getElementById('songSelectTheme')?.value || '').toLowerCase();

  const filtered = songs.filter(s => {
    const title = (s.Título || s.Titulo || s.titulo || '').toLowerCase();
    const temaRaw = (s.Tema || s.tema || '').toLowerCase();
    const autor = (s.Autor || s.autor || '').toLowerCase();
    const tempo = (s.Tempo || s.tempo || '').toLowerCase();
    const obs = (s['Observações'] || s.Observacoes || s.observacoes || s['observações'] || '').toLowerCase();

    if (theme) {
      const temasArr = temaRaw.split(/[;,]/).map(t => t.trim()).filter(Boolean);
      if (!temasArr.some(t => t.toLowerCase() === theme)) {
        return false;
      }
    }

    if (!search) return true;
    return title.includes(search) || temaRaw.includes(search) || autor.includes(search) || tempo.includes(search) || obs.includes(search);
  });

  if (!filtered.length) {
    listEl.innerHTML = '<p class="small muted">Nenhum cântico encontrado com esses filtros.</p>';
    return;
  }

  const parts = [];
  filtered.forEach(s => {
    const title = s.Título || s.Titulo || s.titulo || '';
    const tema = s.Tema || s.tema || '';
    const autor = s.Autor || s.autor || '';
    const tempo = s.Tempo || s.tempo || '';
    const obs = s['Observações'] || s.Observacoes || s.observacoes || s['observações'] || '';
    const video = s.video || s.Video || s.Vídeo || s['vídeo'] || '';
    const partitura = s.partitura || s.Partitura || '';

    let html = '<div class="song-select-item">';
    html += '<div class="song-select-item-header"><div class="song-select-title">' + title + '</div>';
    if (tema) {
      html += '<div class="song-select-meta">' + tema + '</div>';
    }
    html += '</div>';
    if (autor || tempo || obs) {
      html += '<div class="song-select-meta">';
      const bits = [];
      if (autor) bits.push('Autor: ' + autor);
      if (tempo) bits.push('Tempo: ' + tempo);
      if (obs) bits.push(obs);
      html += bits.join(' • ');
      html += '</div>';
    }
    html += '<div class="song-select-actions">';
    html += '<button type="button" class="btn small program-use-song-btn" data-title="' + String(title).replace(/"/g, '&quot;') + '">Usar</button>';
    html += '<button type="button" class="btn secondary small program-view-lyrics-btn" data-title="' + String(title).replace(/"/g, '&quot;') + '">Letra</button>';
    if (video) {
      html += '<button type="button" class="btn secondary small program-view-video-btn" data-title="' + String(title).replace(/"/g, '&quot;') + '">Vídeo/áudio</button>';
    }
    if (partitura) {
      html += '<button type="button" class="btn secondary small program-view-score-btn" data-title="' + String(title).replace(/"/g, '&quot;') + '">Partitura</button>';
    }
    html += '</div>';
    html += '</div>';
    parts.push(html);
  });

  listEl.innerHTML = parts.join('');
}

function setupProgramButtons() {
  // Botões Selecionar – abrem o catálogo rápido
  document.querySelectorAll('.program-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.getAttribute('data-part-id');
      openSongSelectModal(partId);
    });
  });

  // Botões Editar letra – abrem modal de letra para a parte
  document.querySelectorAll('.program-lyrics-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.getAttribute('data-part-id');
      openLyricsModalForPart(partId);
    });
  });

  // Botões Vídeo/áudio ligados diretamente ao cântico selecionado na parte
  document.querySelectorAll('.program-media-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.getAttribute('data-part-id');
      const select = document.getElementById(partId);
      if (!select || !select.value) {
        showToast('Escolhe primeiro um cântico para essa parte.', 'error');
        return;
      }
      const title = select.value;
      const songInfo = songs.find(s => (s.Título || s.Titulo || s.titulo) === title) || {};
      const videoUrl = songInfo.video || songInfo.Video || songInfo.Vídeo || songInfo['vídeo'] || '';
      if (!videoUrl) {
        showToast('Não há vídeo/áudio associado a este cântico no catálogo.', 'warning');
        return;
      }
      window.open(String(videoUrl), '_blank');
    });
  });

  // Eventos do modal de seleção
  const searchInput = document.getElementById('songSelectSearch');
  const themeSelect = document.getElementById('songSelectTheme');
  const closeBtn = document.getElementById('songSelectCloseBtn');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderSongSelectList());
  }
  if (themeSelect) {
    themeSelect.addEventListener('change', () => renderSongSelectList());
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeSongSelectModal());
  }

  // Delegação de eventos na lista de cânticos
  const listEl = document.getElementById('songSelectList');
  if (listEl) {
    listEl.addEventListener('click', (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const title = target.getAttribute('data-title');
      if (!title) return;
      const songInfo = songs.find(s => (s.Título || s.Titulo || s.titulo) === title) || {};

      if (target.classList.contains('program-use-song-btn')) {
        if (!currentSongSelectPartId) return;
        const select = document.getElementById(currentSongSelectPartId);
        if (select) {
          let foundOpt = null;
          Array.from(select.options).forEach(opt => {
            if (opt.value === title) foundOpt = opt;
          });
          if (!foundOpt) {
            const opt = document.createElement('option');
            opt.value = title;
            opt.innerHTML = title;
            select.appendChild(opt);
          }
          select.value = title;
        }
        closeSongSelectModal();
        updatePreview();
        showToast('Cântico selecionado para "' + (PROGRAM_PARTS.find(p => p.id === currentSongSelectPartId)?.label || '') + '".', 'success');
      } else if (target.classList.contains('program-view-lyrics-btn')) {
        const lyrics = (songInfo.Letra || songInfo.letra || '').trim();
        if (!lyrics) {
          showToast('Não há letra disponível para este cântico no catálogo.', 'warning');
          return;
        }
        // Mostrar letra simples em janela separada
        const w = window.open('', '_blank');
        if (w) {
          w.document.write('<pre style="white-space:pre-wrap;font-family:system-ui, sans-serif;font-size:14px;padding:1rem;">' +
            lyrics.replace(/</g, '&lt;') +
            '</pre>');
          w.document.title = 'Letra — ' + title;
        }
      } else if (target.classList.contains('program-view-video-btn')) {
        const videoUrl = songInfo.video || songInfo.Video || songInfo.Vídeo || songInfo['vídeo'] || '';
        if (!videoUrl) {
          showToast('Não há vídeo/áudio associado a este cântico no catálogo.', 'warning');
          return;
        }
        window.open(String(videoUrl), '_blank');
      } else if (target.classList.contains('program-view-score-btn')) {
        const partUrl = songInfo.partitura || songInfo.Partitura || '';
        if (!partUrl) {
          showToast('Não há partitura associada a este cântico no catálogo.', 'warning');
          return;
        }
        window.open(String(partUrl), '_blank');
      }
    });
  }

  // Modal de letra: botões
  const cancelBtn = document.getElementById('programLyricsCancelBtn');
  const saveBtn = document.getElementById('programLyricsSaveBtn');
  const ta = document.getElementById('programLyricsTextarea');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeLyricsModal();
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!currentLyricsPartId) {
        closeLyricsModal();
        return;
      }
      const value = (ta.value || '').trim();
      if (value) {
        partLyricsOverrides[currentLyricsPartId] = value;
      } else {
        delete partLyricsOverrides[currentLyricsPartId];
      }
      closeLyricsModal();
      updatePreview();
      showToast('Letra atualizada para esta parte no programa atual.', 'success');
    });
  }
}

function init() {
    loadHistory();
    renderHistory();
    loadCsvFromGoogleSheets();
    populateSongDropdowns();
    
    // Inicializar data com hoje se não houver
    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${year}-${month}-${day}`;
      
      // Atualizar campos litúrgicos
      const info = getLiturgicalInfo(today);
      const cycleDisplay = document.getElementById('cycleDisplay');
      if (cycleDisplay) {
        cycleDisplay.value = (info.season || '—') + ' / Ano ' + (info.cycle || '—');
      }
      const liturgicalTitle = document.getElementById('liturgicalTitle');
      if (liturgicalTitle && !liturgicalTitle.value) {
        liturgicalTitle.value = buildDisplayLiturgicalTitle(today, info);
      }
      updateLiturgicalTheme(info.season);
      applyLiturgicalClass(info.season);
      applyHeaderIcon(info.season);
    }
    
    updatePreview();
    refreshRehearsalPrograms();
    setupProgramButtons();

    // Dashboard inicial
    updateDashboard();
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        updatePreview();
        updateDashboard();
      });
    }

    // Atalhos de dashboard para tabs
    document.querySelectorAll('[data-go-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-go-tab');
        const tabBtn = document.querySelector('.tabs button[data-tab="' + tabId + '"]');
        const tabEl = document.getElementById(tabId);
        if (tabBtn && tabEl) {
          document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tabBtn.classList.add('active');
          tabEl.classList.add('active');
        }
      });
    });

    // Botão de exportar folheto em PDF
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Refresh catálogo manual
    const refreshCatalogBtn = document.getElementById('refreshCatalogBtn');
    const catalogStatus = document.getElementById('catalogStatus');
    if (refreshCatalogBtn) {
      refreshCatalogBtn.addEventListener('click', () => {
        if (catalogStatus) {
          catalogStatus.textContent = 'A atualizar catálogo...';
        }
        loadCsvFromGoogleSheets(() => {
          if (catalogStatus) {
            const now = new Date();
            catalogStatus.textContent = 'Catálogo atualizado às ' + now.toLocaleTimeString();
          }
        });
      });
    }

    // Gestor de ensaios
    if (typeof initRehearsalManager === 'function') {
      initRehearsalManager();
    }

    // Histórico de cânticos: ligar eventos
    const monthInput = document.getElementById('songHistoryMonth');
    const sectionSelect = document.getElementById('songHistorySection');
    const searchInput = document.getElementById('songHistorySearch');
    const exportBtn = document.getElementById('songHistoryExportCsvBtn');
    const clearBtn = document.getElementById('songHistoryClearBtn');
    const fullStateExportBtn = document.getElementById('fullStateExportBtn');
    const fullStateImportBtn = document.getElementById('fullStateImportBtn');

    if (monthInput) monthInput.addEventListener('change', renderSongUsageHistory);
    if (sectionSelect) sectionSelect.addEventListener('change', renderSongUsageHistory);
    if (searchInput) searchInput.addEventListener('input', renderSongUsageHistory);
    if (exportBtn) exportBtn.addEventListener('click', exportSongUsageCsv);
    if (clearBtn) clearBtn.addEventListener('click', clearSongUsageHistory);
    if (fullStateExportBtn) fullStateExportBtn.addEventListener('click', exportFullStateJson);
    if (fullStateImportBtn) fullStateImportBtn.addEventListener('click', importFullStateJson);

    renderSongUsageHistory();
  }

  window.addEventListener('DOMContentLoaded', init);


// ==== catalog-actions.js ====
document.addEventListener('DOMContentLoaded', () => {
  const songsTableContainer = document.getElementById('songsTableContainer');
  const lyricsModal = document.getElementById('lyricsModal');
  const lyricsModalTitle = document.getElementById('lyricsModalTitle');
  const lyricsModalTextarea = { value: '' };
  const lyricsModalCancel = document.getElementById('lyricsModalCancel');
  const lyricsModalSave = document.getElementById('lyricsModalSave');

  function enhanceCatalogTable() {
    if (!songsTableContainer) return;
    const table = songsTableContainer.querySelector('table');
    if (!table) return;

    const theadRow = table.querySelector('thead tr');
    if (!theadRow) return;

    const lastTh = theadRow.lastElementChild;
    if (lastTh && lastTh.textContent.trim() === 'Ações') return;

    const th = document.createElement('th');
    th.innerHTML = 'Ações';
    theadRow.appendChild(th);

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const titleCell = row.querySelector('td');
      if (titleCell) {
        const titulo = titleCell.textContent.trim();
        const last = getLastUsageForTitle(titulo);
        if (last) {
          const label = describeRecency(last.date);
          if (label) {
            const span = document.createElement('span');
            span.className = 'badge-usage';
            span.textContent = label;
            titleCell.appendChild(span);
          }
        }
      }

      const td = document.createElement('td');
      const btnLetra = document.createElement('button');
      btnLetra.type = 'button';
      btnLetra.className = 'btn secondary btn-xs';
      btnLetra.dataset.action = 'edit-lyrics';
      btnLetra.innerHTML = 'Letra';

      const btnUsar = document.createElement('button');
      btnUsar.type = 'button';
      btnUsar.className = 'btn secondary btn-xs';
      btnUsar.dataset.action = 'use-song';
      btnUsar.style.marginLeft = '0.25rem';
      btnUsar.innerHTML = 'Usar';

      td.appendChild(btnLetra);
      td.appendChild(btnUsar);
      row.appendChild(td);
    });
  }

  if (typeof renderSongsTable === 'function') {
    const originalRenderSongsTable = renderSongsTable;
    renderSongsTable = function(...args) {
      originalRenderSongsTable.apply(this, args);
      try { enhanceCatalogTable(); } catch(e) { console.error(e); }
    };
  } else {
    setTimeout(() => {
      try { enhanceCatalogTable(); } catch(e) { console.error(e); }
    }, 1500);
  }

  
if (songsTableContainer) {
  songsTableContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const tr = btn.closest('tr');
    if (!tr) return;

    const firstCell = tr.querySelector('td');
    if (!firstCell) return;

    const titulo = firstCell.textContent.trim();
    const song =
      (window.songs || []).find(
        (s) => (s.Título || s.Titulo || s.titulo || '') === titulo
      ) || {};

    if (btn.dataset.action === 'edit-lyrics') {
      lyricsModalTitle.innerHTML = titulo;
      lyricsModalTextarea.value = (song.Letra || song.letra || '').trim();
      lyricsModal.dataset.currentTitle = titulo;
      lyricsModal.style.display = 'block';
      return;
    }

    if (btn.dataset.action === 'use-song') {
      if (!window.PROGRAM_PARTS) return;
      const partLabels = window.PROGRAM_PARTS.map((p) => p.label);
      return window.showUseDropdown(btn, partLabels, titulo);
    }
  });
}
if (lyricsModalCancel) {
    lyricsModalCancel.addEventListener('click', () => {
      lyricsModal.style.display = 'none';
    });
  }
  if (lyricsModal) {
    lyricsModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        lyricsModal.style.display = 'none';
      }
    });
  }
  if (lyricsModalSave) {
    lyricsModalSave.addEventListener('click', () => {
      const titulo = lyricsModal.dataset.currentTitle;
      const newLyrics = lyricsModalTextarea.value || '';
      const song = (window.songs || []).find(s => (s.Título || s.Titulo || s.titulo || '') === titulo);
      if (song) {
        song.Letra = newLyrics;
        song.letra = newLyrics;
        if (typeof showToast === 'function') {
          showToast('Letra atualizada para "' + titulo + '".', 'success');
        }
      }
      lyricsModal.style.display = 'none';
    });
  }
});


// ==== editor-quill.js ====
let quill;
document.addEventListener('DOMContentLoaded', () => {
  const lyricsModal = document.getElementById('lyricsModal');
  const lyricsModalTitle = document.getElementById('lyricsModalTitle');
  const saveBtn = document.getElementById('lyricsModalSave');
  const songsTableContainer = document.getElementById('songsTableContainer');

  function initQuill(content = "") {
    if (!quill) {
      quill = new Quill('#lyricsEditor', {
        theme: 'snow',
        modules: {
          toolbar: {
            container: '#lyricsEditorToolbar',
            handlers: {
              chord: function () {
                const range = quill.getSelection();
                if (!range) return;
                let text = quill.getText(range.index, range.length) || '';
                if (!text.trim()) text = 'C';
                quill.deleteText(range.index, range.length);
                quill.insertText(range.index, '[' + text.trim() + ']', 'bold', true);
              }
            }
          }
        }
      });
    }
    quill.root.innerHTML = content || '';
  }

  // Abrir via catálogo (btn Letra)
  if (songsTableContainer) {
    songsTableContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="edit-lyrics"]');
      if (!btn) return;
      const tr = btn.closest('tr');
      if (!tr) return;
      const firstCell = tr.querySelector('td');
      if (!firstCell) return;
      const titulo = firstCell.textContent.trim();
      const song = (window.songs || []).find(s => (s.Título || s.Titulo || s.titulo || '') === titulo) || {};
      const letra = (song.Letra || song.letra || "").trim();
      lyricsModalTitle.innerHTML = titulo;
      lyricsModal.dataset.mode = 'catalog';
      lyricsModal.dataset.currentTitle = titulo;
      initQuill(letra);
      lyricsModal.style.display = 'block';
    });
  }

  // Guardar (catálogo ou programa)
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const mode = lyricsModal.dataset.mode || 'catalog';
      const htmlContent = quill ? quill.root.innerHTML : '';
      if (mode === 'catalog') {
        const titulo = lyricsModal.dataset.currentTitle;
        const song = (window.songs || []).find(s => (s.Título || s.Titulo || s.titulo || '') === titulo);
        if (song) {
          song.Letra = htmlContent;
          song.letra = htmlContent;
          if (typeof showToast === 'function') {
            showToast('Letra atualizada.', 'success');
          }
        }
      } else if (mode === 'program' && window.applyProgramLyricsFromEditor) {
        // Delega para app-main aplicar a letra à parte correta
        window.applyProgramLyricsFromEditor(htmlContent);
      }
      lyricsModal.style.display = 'none';
    });
  }

  // Expor função global para o programa abrir o editor
  window.openLyricsEditorForProgram = function(partId, currentHtml, titleLabel) {
    if (!lyricsModal) return;
    const title = titleLabel || 'Letra - ' + (partId || '');
    lyricsModalTitle.innerHTML = title;
    lyricsModal.dataset.mode = 'program';
    lyricsModal.dataset.currentPartId = partId || '';
    if (!window.partLyricsOverrides) window.partLyricsOverrides = {};
    initQuill(currentHtml || '');
    lyricsModal.style.display = 'block';
  };
});


// ==== upload-image.js ====
// stub upload-image





// ---- PATCH v11c: Fix modal closing when clicking inside editor ----
document.addEventListener('DOMContentLoaded', () => {
    const lyricsModal = document.getElementById('lyricsModal');
    if (lyricsModal) {
        const modalDialog = lyricsModal.querySelector('.modal-dialog');
        const modalBackdrop = lyricsModal.querySelector('.modal-backdrop');

        if (modalDialog) {
            modalDialog.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => {
                lyricsModal.style.display = 'none';
            });
        }
    }
});




// Modal central para seleção de secção

// Editor de cântico antes de inserir no programa
window.openSongEditModal = function(titulo) {
  const modal = document.getElementById('songEditModal');
  if (!modal) return;

  const titleInput = document.getElementById('songEditTitle');
  const keyInput = document.getElementById('songEditKey');
  const lyricsInput = document.getElementById('songEditLyrics');
  const chordsInput = document.getElementById('songEditChords');
  const notesInput = document.getElementById('songEditNotes');
  const partSelect = document.getElementById('songEditPartSelect');

  if (!partSelect) return;

  // Encontrar cântico no catálogo
  const song = (window.songs || []).find(function(s) {
    return (s.Título || s.Titulo || s.titulo || '') === titulo;
  }) || {};

  if (titleInput) titleInput.value = titulo || '';
  if (keyInput)   keyInput.value = song.Tom || song.tom || '';
  if (lyricsInput) lyricsInput.value = (song.Letra || song.letra || '').trim();
  if (chordsInput) chordsInput.value = song.Acordes || song.acordes || '';
  if (notesInput)  notesInput.value = song.Notas || song.notas || '';

  // Popular lista de secções se ainda não estiver
  while (partSelect.firstChild) {
    partSelect.removeChild(partSelect.firstChild);
  }
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— escolher secção —';
  partSelect.appendChild(defaultOpt);

  (window.PROGRAM_PARTS || []).forEach(function(p) {
    const opt = document.createElement('option');
    opt.value = p.id;
    const icon = p.icon ? p.icon + ' ' : '';
    opt.textContent = icon + p.label;
    partSelect.appendChild(opt);
  });

  modal.dataset.currentTitle = titulo || '';
  modal.hidden = false;
};

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('songEditModal');
  if (!modal) return;

  const cancelBtn = document.getElementById('songEditCancelBtn');
  const saveBtn = document.getElementById('songEditSaveInsertBtn');

  function closeModal() {
    modal.hidden = true;
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const titleInput = document.getElementById('songEditTitle');
      const keyInput = document.getElementById('songEditKey');
      const lyricsInput = document.getElementById('songEditLyrics');
      const chordsInput = document.getElementById('songEditChords');
      const notesInput = document.getElementById('songEditNotes');
      const partSelect = document.getElementById('songEditPartSelect');

      const partId = partSelect ? partSelect.value : '';
      if (!partId) {
        if (window.showToast) window.showToast('Escolhe a secção do programa.', 'error');
        return;
      }

      const selectEl = document.getElementById(partId);
      if (!selectEl) {
        if (window.showToast) window.showToast('Não foi possível encontrar o campo dessa secção.', 'error');
        return;
      }

      const editedTitle = titleInput ? titleInput.value || '' : '';
      const editedLyrics = lyricsInput ? lyricsInput.value || '' : '';
      const editedKey = keyInput ? keyInput.value || '' : '';
      const editedChords = chordsInput ? chordsInput.value || '' : '';
      const editedNotes = notesInput ? notesInput.value || '' : '';

      // Aplicar título ao select (se não estiver vazio)
      if (editedTitle) {
        // Se opção ainda não existir, criá-la
        let opt = Array.from(selectEl.options).find(function(o) { return o.value === editedTitle; });
        if (!opt) {
          opt = document.createElement('option');
          opt.value = editedTitle;
          opt.textContent = editedTitle;
          selectEl.appendChild(opt);
        }
        selectEl.value = editedTitle;
      }

      // Guardar dados extra desta parte
      if (!window.partExtraData) window.partExtraData = {};
      window.partExtraData[partId] = {
        title: editedTitle || selectEl.value,
        key: editedKey,
        lyrics: editedLyrics,
        chords: editedChords,
        notes: editedNotes
      };

      if (window.recordSongUsage) {
        const part = (window.PROGRAM_PARTS || []).find(function(p) { return p.id === partId; });
        const label = part ? part.label : null;
        const dateInput = document.getElementById('date');
        const dateIso = (dateInput && dateInput.value) || null;
        window.recordSongUsage(editedTitle || selectEl.value, label, dateIso);
      }

      if (typeof updatePreview === 'function') {
        updatePreview();
      }
      if (window.showToast) window.showToast('Cântico editado e inserido no programa.', 'success');
      closeModal();
    });
  }
});
window.showUseDropdown = function(btn, partLabels, titulo){
  const m = document.createElement('div');
  m.className = 'use-modal';
  m.innerHTML = `<div class="use-modal-box">
    <h3>Escolher secção para: ${titulo}</h3>
    <div class="use-modal-list"></div>
    <button class="use-modal-close">Fechar</button>
  </div>`;
  document.body.appendChild(m);

  const list = m.querySelector('.use-modal-list');
  const dateInput = document.getElementById('date');
  const date = dateInput && dateInput.value ? dateInput.value : null;

  // Botão por cada parte do programa
  partLabels.forEach(function(label, i) {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = function() {
      const part = window.PROGRAM_PARTS[i];
      const sel = part && document.getElementById(part.id);
      if (sel) {
        sel.value = titulo;
        sel.dispatchEvent(new Event('change'));
      }
      if (window.recordSongUsage) {
        window.recordSongUsage(titulo, label, date);
      }
      m.remove();
    };
    list.appendChild(b);
  });

  // Opção extra: editar antes de inserir
  const editButton = document.createElement('button');
  editButton.textContent = '✏️ Editar antes de inserir';
  editButton.onclick = function() {
    if (window.openSongEditModal) {
      window.openSongEditModal(titulo);
    }
    m.remove();
  };
  list.appendChild(editButton);

  const closeBtn = m.querySelector('.use-modal-close');
  if (closeBtn) {
    closeBtn.onclick = function() { m.remove(); };
  }
};

// ========== SISTEMA DE SUGESTÕES INTELIGENTES V24 ==========

/**
 * Calcula um score para um cântico baseado no contexto litúrgico
 * @param {Object} song - Objeto do cântico do catálogo
 * @param {String} partId - ID da parte do programa (entrada, comunhao, etc)
 * @param {Object} litInfo - Informação litúrgica da data (season, color, cycle, etc)
 * @returns {Number} - Score de adequação (0-100+)
 */
function scoreSongForContext(song, partId, litInfo) {
  let score = 0;
  
  if (!song || !litInfo) return 0;
  
  const titulo = (song.Título || song.titulo || '').toLowerCase();
  const secao = (song.Secção || song.secao || song.section || '').toLowerCase();
  const tempo = (song.Tempo || song.tempo || '').toLowerCase();
  const tags = (song.Tags || song.tags || '').toLowerCase();
  const season = (litInfo.season || '').toLowerCase();
  const color = (litInfo.color || '').toLowerCase();
  
  // 1. Adequação da secção (peso alto)
  const partLabel = PROGRAM_PARTS.find(p => p.id === partId)?.label?.toLowerCase() || '';
  if (secao.includes(partLabel)) {
    score += 40;
  } else if (secao.includes('entrada') && partId === 'entrada') {
    score += 40;
  } else if (secao.includes('comunhão') && partId === 'comunhao') {
    score += 40;
  } else if (secao.includes('ofertório') && partId === 'ofertorio') {
    score += 40;
  } else if (secao.includes('final') && partId === 'final') {
    score += 40;
  } else if (secao.includes('aclamação') && partId === 'aclamacao') {
    score += 40;
  } else if (secao.includes('salmo') && partId === 'salmo') {
    score += 40;
  } else if (secao.includes('glória') && partId === 'gloria') {
    score += 40;
  } else if (secao.includes('santo') && partId === 'santo') {
    score += 40;
  } else if (secao.includes('cordeiro') && partId === 'cordeiro') {
    score += 40;
  } else if (secao.includes('pai nosso') && partId === 'paiNosso') {
    score += 40;
  } else if (secao.includes('paz') && partId === 'paz') {
    score += 40;
  } else if (secao.includes('penitencial') && partId === 'atoPenitencial') {
    score += 40;
  } else if (secao.includes('graças') && partId === 'acaoGracas') {
    score += 40;
  }
  
  // 2. Adequação ao tempo litúrgico (peso médio-alto)
  if (season) {
    if (tempo.includes(season) || tags.includes(season)) {
      score += 25;
    }
    // Casos especiais
    if (season === 'advento' && (tempo.includes('advento') || tags.includes('advento'))) {
      score += 25;
    }
    if (season === 'natal' && (tempo.includes('natal') || tags.includes('natal'))) {
      score += 25;
    }
    if (season === 'quaresma' && (tempo.includes('quaresma') || tags.includes('quaresma'))) {
      score += 25;
    }
    if (season === 'páscoa' && (tempo.includes('páscoa') || tempo.includes('pascoa') || tags.includes('páscoa') || tags.includes('pascoa'))) {
      score += 25;
    }
    if (season === 'tempo comum' && (tempo.includes('comum') || tags.includes('comum'))) {
      score += 10;
    }
  }
  
  // 3. Adequação à cor litúrgica
  if (color) {
    if (tags.includes(color)) {
      score += 10;
    }
  }
  
  // 4. Palavras-chave específicas por tempo
  if (season === 'páscoa' || season === 'pascoa') {
    if (titulo.includes('aleluia') || tags.includes('aleluia')) {
      score += 15;
    }
    if (titulo.includes('ressurreição') || titulo.includes('ressurreicao') || tags.includes('ressurreição')) {
      score += 10;
    }
  }
  
  if (season === 'natal') {
    if (titulo.includes('natal') || titulo.includes('noite') || titulo.includes('belém')) {
      score += 10;
    }
  }
  
  if (season === 'quaresma') {
    if (titulo.includes('quaresma') || titulo.includes('conversão') || titulo.includes('conversao')) {
      score += 10;
    }
  }
  
  // 5. Penalização por uso recente
  const lastUsage = getLastUsageForTitle(song.Título || song.titulo);
  if (lastUsage && lastUsage.date) {
    const daysSince = getDaysSince(lastUsage.date);
    if (daysSince < 7) {
      score -= 30; // Usado há menos de 1 semana
    } else if (daysSince < 30) {
      score -= 15; // Usado há menos de 1 mês
    } else if (daysSince < 90) {
      score -= 5; // Usado há menos de 3 meses
    }
  }
  
  // 6. Bónus pequeno para cânticos mais conhecidos (opcional)
  // Pode ser baseado em frequência de uso histórica, popularidade, etc.
  
  return Math.max(0, score); // Score nunca negativo
}

/**
 * Calcula dias desde uma data
 */
function getDaysSince(dateStr) {
  if (!dateStr) return 999;
  const today = new Date();
  const [y, m, d] = dateStr.split('-').map(v => parseInt(v, 10));
  if (!y || !m || !d) return 999;
  const dt = new Date(y, m - 1, d);
  const diffMs = today.getTime() - dt.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Constrói sugestões para cada parte do programa
 * @param {Object} litInfo - Informação litúrgica da data
 * @returns {Object} - Objeto com sugestões por parte {partId: [{song, score}, ...]}
 */
function buildSuggestionsForDay(litInfo) {
  const suggestions = {};
  
  if (!songs || songs.length === 0) {
    return suggestions;
  }
  
  PROGRAM_PARTS.forEach(part => {
    const scored = songs.map(song => ({
      song: song,
      score: scoreSongForContext(song, part.id, litInfo)
    }))
    .filter(item => item.score > 0) // Só cânticos com alguma relevância
    .sort((a, b) => b.score - a.score); // Ordena por score decrescente
    
    // Pega os top 3
    suggestions[part.id] = scored.slice(0, 3);
  });
  
  return suggestions;
}

/**
 * Renderiza a interface de sugestões
 */
function renderDailySuggestions() {
  const dateInput = document.getElementById('date');
  if (!dateInput || !dateInput.value) {
    document.getElementById('suggestionsContainer').innerHTML = '<p class="muted">Seleciona uma data no Programa para ver sugestões.</p>';
    return;
  }
  
  const date = dateInput.value;
  const litInfo = getLiturgicalInfo(date);
  const displayTitle = buildDisplayLiturgicalTitle(date, litInfo);
  
  // Atualiza cabeçalho litúrgico
  document.getElementById('suggestionsDate').textContent = formatDate(date);
  document.getElementById('suggestionsTitle').textContent = displayTitle || '—';
  document.getElementById('suggestionsSeason').textContent = capitalizeFirst(litInfo.season || '—');
  document.getElementById('suggestionsColor').textContent = capitalizeFirst(litInfo.color || '—');
  document.getElementById('suggestionsCycle').textContent = litInfo.cycle || '—';
  
  // Constrói sugestões
  const allSuggestions = buildSuggestionsForDay(litInfo);
  
  let html = '';
  
  PROGRAM_PARTS.forEach(part => {
    const partSuggestions = allSuggestions[part.id] || [];
    
    if (partSuggestions.length === 0) {
      return; // Não mostra partes sem sugestões
    }
    
    html += `<div class="suggestions-part">`;
    html += `<h3>${part.icon} ${part.label}</h3>`;
    html += `<div class="suggestions-list">`;
    
    partSuggestions.forEach(item => {
      const song = item.song;
      const score = item.score;
      const titulo = song.Título || song.titulo || 'Sem título';
      const autor = song.Autor || song.autor || '';
      const secao = song.Secção || song.secao || '';
      const tempo = song.Tempo || song.tempo || '';
      
      // Verifica uso recente
      const lastUsage = getLastUsageForTitle(titulo);
      let usageText = '';
      let usageClass = '';
      if (lastUsage && lastUsage.date) {
        const recencyText = describeRecency(lastUsage.date);
        const daysSince = getDaysSince(lastUsage.date);
        usageText = recencyText;
        usageClass = daysSince < 30 ? 'recent' : '';
      }
      
      html += `<div class="suggestion-card">`;
      html += `<div class="suggestion-info">`;
      html += `<div class="suggestion-title">${escapeHtml(titulo)}</div>`;
      html += `<div class="suggestion-meta">`;
      if (autor) html += `<span>🎵 ${escapeHtml(autor)}</span>`;
      if (secao) html += `<span>📂 ${escapeHtml(secao)}</span>`;
      if (tempo) html += `<span>📅 ${escapeHtml(tempo)}</span>`;
      html += `<span class="suggestion-score">Score: ${score}</span>`;
      if (usageText) html += `<span class="suggestion-usage ${usageClass}">${usageText}</span>`;
      html += `</div>`;
      html += `</div>`;
      html += `<div class="suggestion-actions">`;
      html += `<button type="button" class="btn small" onclick="useSuggestionInProgram('${escapeHtml(titulo)}', '${part.id}', '${date}')">Usar</button>`;
      
      // Botão Ver letra (se existir)
      const letra = song.Letra || song.letra || '';
      if (letra && letra.trim()) {
        html += `<button type="button" class="btn small secondary" onclick="viewSongLyrics('${escapeHtml(titulo)}', ${JSON.stringify(letra).replace(/'/g, "&#39;")})">Ver letra</button>`;
      }
      
      html += `</div>`;
      html += `</div>`;
    });
    
    html += `</div>`;
    html += `</div>`;
  });
  
  if (html === '') {
    html = '<p class="muted">Não foram encontradas sugestões adequadas para esta data. Tenta atualizar o catálogo ou ajustar as tags dos cânticos.</p>';
  }
  
  document.getElementById('suggestionsContainer').innerHTML = html;
}

/**
 * Usa uma sugestão no programa
 */
window.useSuggestionInProgram = function(titulo, partId, date) {
  const partField = document.getElementById(partId);
  if (partField) {
    partField.value = titulo;
    partField.dispatchEvent(new Event('change'));
    
    // Regista uso
    const partLabel = PROGRAM_PARTS.find(p => p.id === partId)?.label || '';
    if (window.recordSongUsage) {
      window.recordSongUsage(titulo, partLabel, date);
    }
    
    showToast('✓ "' + titulo + '" adicionado a ' + partLabel, 'success');
    
    // Opcional: mudar para aba Programa
    // switchTab('tab-programa');
  }
};

/**
 * Mostra letra de um cântico (modal simples)
 */
window.viewSongLyrics = function(titulo, letra) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal">
      <h3>${escapeHtml(titulo)}</h3>
      <div style="max-height: 400px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; background: var(--bg-soft); padding: 0.75rem; border-radius: 0.5rem;">
${escapeHtml(letra)}
      </div>
      <div class="modal-actions">
        <button type="button" class="btn secondary" onclick="this.closest('.modal-backdrop').remove()">Fechar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Fechar ao clicar fora
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
};

/**
 * Utilitários
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ========== INICIALIZAÇÃO DAS SUGESTÕES ==========

// Atualiza sugestões quando a data muda
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.addEventListener('change', function() {
      // Só atualiza se estivermos na aba de sugestões ou se for explicitamente pedido
      const suggestionsTab = document.getElementById('tab-sugestoes');
      if (suggestionsTab && !suggestionsTab.classList.contains('active')) {
        // Não atualiza automaticamente se não estiver na aba
        return;
      }
      renderDailySuggestions();
    });
  }
  
  // Listener para quando mudar para aba Sugestões
  const suggestionsTabBtn = document.querySelector('[data-tab="tab-sugestoes"]');
  if (suggestionsTabBtn) {
    suggestionsTabBtn.addEventListener('click', function() {
      // Pequeno delay para garantir que a aba está visível
      setTimeout(renderDailySuggestions, 100);
    });
  }
});