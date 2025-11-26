// ==== Exportação para DOCX e PDF ====

function getProgramDataForExport() {
  const dateInput = document.getElementById('date');
  const liturgicalTitle = document.getElementById('liturgicalTitle');
  const extraTheme = document.getElementById('extraTheme');
  
  if (!dateInput || !dateInput.value) {
    showToast('Preenche primeiro a data do programa.', 'error');
    return null;
  }

  const data = {
    date: dateInput.value,
    title: liturgicalTitle ? liturgicalTitle.value : '',
    extraTheme: extraTheme ? extraTheme.value : '',
    parts: []
  };

  // Coletar todas as partes do programa
  PROGRAM_PARTS.forEach(part => {
    const select = document.getElementById(part.id);
    if (select && select.value) {
      const songTitle = select.value;
      const song = songs.find(s => 
        (s.Título || s.Titulo || s.titulo) === songTitle
      );
      
      data.parts.push({
        label: part.label,
        icon: part.icon,
        title: songTitle,
        author: song ? (song.Autor || song.autor || '') : '',
        lyrics: song ? (song.Letra || song.letra || '') : ''
      });
    }
  });

  return data;
}

function exportToDocx() {
  const data = getProgramDataForExport();
  if (!data) return;

  try {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertInchesToTwip } = docx;

    const children = [];

    // Cabeçalho
    children.push(
      new Paragraph({
        text: "Coro Paroquial São João Batista de Rio Caldo",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    children.push(
      new Paragraph({
        text: data.title || 'Programa Litúrgico',
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );

    if (data.extraTheme) {
      children.push(
        new Paragraph({
          text: data.extraTheme,
          alignment: AlignmentType.CENTER,
          italics: true,
          spacing: { after: 200 }
        })
      );
    }

    children.push(
      new Paragraph({
        text: `Data: ${formatDatePT(data.date)}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Adicionar cada parte do programa
    data.parts.forEach((part, index) => {
      // Título da parte
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${part.icon} ${part.label}`,
              bold: true,
              size: 28,
              color: "1f2937"
            })
          ],
          spacing: { before: 300, after: 100 }
        })
      );

      // Título do cântico
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: part.title,
              bold: true,
              size: 24
            })
          ],
          spacing: { after: 50 }
        })
      );

      // Autor
      if (part.author) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Autor: ${part.author}`,
                italics: true,
                size: 20,
                color: "6b7280"
              })
            ],
            spacing: { after: 100 }
          })
        );
      }

      // Letra
      if (part.lyrics) {
        const lyricsLines = part.lyrics.split('\n');
        lyricsLines.forEach(line => {
          children.push(
            new Paragraph({
              text: line || ' ',
              spacing: { after: 50 }
            })
          );
        });
      }

      // Separador entre partes
      if (index < data.parts.length - 1) {
        children.push(
          new Paragraph({
            text: '___________________________________',
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          })
        );
      }
    });

    // Criar documento com margens personalizadas
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.79),    // 2cm
              right: convertInchesToTwip(0.39),  // 1cm
              bottom: convertInchesToTwip(0.39), // 1cm
              left: convertInchesToTwip(0.79)    // 2cm
            }
          }
        },
        children: children
      }]
    });

    // Gerar e baixar
    Packer.toBlob(doc).then(blob => {
      const fileName = `Programa_${data.date}_${slugify(data.title)}.docx`;
      saveAs(blob, fileName);
      showToast('Documento DOCX exportado com sucesso!', 'success');
    });

  } catch (error) {
    console.error('Erro ao exportar DOCX:', error);
    showToast('Erro ao exportar DOCX. Tenta novamente.', 'error');
  }
}

function exportToPdfJs() {
  const data = getProgramDataForExport();
  if (!data) return;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Margens
    const marginLeft = 20;   // 2cm
    const marginRight = 10;  // 1cm
    const marginTop = 20;    // 2cm
    const marginBottom = 10; // 1cm
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    let y = marginTop;

    // Função para adicionar nova página se necessário
    function checkNewPage(heightNeeded) {
      if (y + heightNeeded > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
        return true;
      }
      return false;
    }

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Coro Paroquial São João Batista de Rio Caldo', pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(14);
    doc.text(data.title || 'Programa Litúrgico', pageWidth / 2, y, { align: 'center' });
    y += 8;

    if (data.extraTheme) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'italic');
      doc.text(data.extraTheme, pageWidth / 2, y, { align: 'center' });
      y += 8;
    }

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Data: ${formatDatePT(data.date)}`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Adicionar cada parte
    data.parts.forEach((part, index) => {
      checkNewPage(30);

      // Título da parte
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${part.icon} ${part.label}`, marginLeft, y);
      y += 7;

      // Título do cântico
      doc.setFontSize(11);
      doc.text(part.title, marginLeft, y);
      y += 6;

      // Autor
      if (part.author) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(`Autor: ${part.author}`, marginLeft, y);
        doc.setTextColor(0, 0, 0);
        y += 6;
      }

      // Letra
      if (part.lyrics) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        const lyricsLines = part.lyrics.split('\n');
        lyricsLines.forEach(line => {
          checkNewPage(5);
          if (line.trim()) {
            const wrappedLines = doc.splitTextToSize(line, contentWidth);
            wrappedLines.forEach(wrappedLine => {
              checkNewPage(5);
              doc.text(wrappedLine, marginLeft + 5, y);
              y += 5;
            });
          } else {
            y += 3;
          }
        });
      }

      y += 5;

      // Separador
      if (index < data.parts.length - 1) {
        checkNewPage(5);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginLeft, y, pageWidth - marginRight, y);
        y += 8;
      }
    });

    // Salvar PDF
    const fileName = `Programa_${data.date}_${slugify(data.title)}.pdf`;
    doc.save(fileName);
    showToast('PDF exportado com sucesso!', 'success');

  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    showToast('Erro ao exportar PDF. Tenta novamente.', 'error');
  }
}

function formatDatePT(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function slugify(text) {
  if (!text) return 'programa';
  return text
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íì]/g, 'i')
    .replace(/[óòôõ]/g, 'o')
    .replace(/[úù]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Adicionar listeners quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  const exportDocxBtn = document.getElementById('exportDocxBtn');
  const exportPdfJsBtn = document.getElementById('exportPdfJsBtn');

  if (exportDocxBtn) {
    exportDocxBtn.addEventListener('click', exportToDocx);
  }

  if (exportPdfJsBtn) {
    exportPdfJsBtn.addEventListener('click', exportToPdfJs);
  }
});
