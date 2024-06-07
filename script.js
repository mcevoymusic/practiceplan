document.getElementById('practiceForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;
    const pieceName = document.getElementById('pieceName').value;
    const dueDate = new Date(document.getElementById('dueDate').value);
    const totalBars = parseInt(document.getElementById('totalBars').value);
    const targetSpeed = parseInt(document.getElementById('targetSpeed').value);
    const sessionsPerWeek = parseInt(document.getElementById('sessionsPerWeek').value);

    const startDate = new Date();
    const daysBetween = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.ceil(daysBetween / 7);
    const practiceSessions = totalWeeks * sessionsPerWeek;

    const halfSpeed = Math.round(targetSpeed * 0.5);
    const middleSpeed = Math.round(targetSpeed * 0.75);

    const pdf = new jsPDF();

    const logoUrl = 'https://raw.githubusercontent.com/mcevoymusic/myassets/main/Tiny%20transparent%20logo.png';

    // Function to add logo and text to each page
    const addLogoAndText = () => {
        pdf.addImage(logoUrl, 'PNG', 150, 10, 50, 42); // Positioned to the right
        pdf.setFontSize(24); // Match the header text size
        pdf.setTextColor('#ffffff'); // Set text color to white
        pdf.setFont('Lexend Zetta'); // Set the font
        pdf.text(`Practice Planner`, 10, 30);
        pdf.setFontSize(16);
        pdf.text(`Practice Plan for ${pieceName}`, 10, 50);
        pdf.text(`Due Date: ${dueDate.toLocaleDateString()}`, 10, 60); // Add due date to the header
        pdf.setFontSize(12);
    };

    // Set black background for the first page
    pdf.setFillColor(18, 18, 18); // RGB for black background
    pdf.rect(0, 0, 210, 297, 'F'); // A4 dimensions: 210mm x 297mm

    // Add logo and text to the first page
    addLogoAndText();

    let currentY = 80; // Adjusted to accommodate due date
    let practiceCount = 1;

    // Calculate remaining sessions for sections
    const remainingSessions = practiceSessions - 3;
    const sectionSize = Math.ceil(totalBars / (remainingSessions / 3));
    const speeds = [halfSpeed, middleSpeed, targetSpeed];

    // Initial sessions for sections
    let weekCount = 1;
    let sessionCount = 1;
    pdf.text(`Week ${weekCount}`, 10, currentY);
    currentY += 10;
    for (let section = 0; section < Math.ceil(totalBars / sectionSize); section++) {
        const barStart = section * sectionSize + 1;
        const barEnd = Math.min((section + 1) * sectionSize, totalBars);

        speeds.forEach(speed => {
            if (practiceCount > remainingSessions) return;
            if (sessionCount > sessionsPerWeek) {
                weekCount++;
                sessionCount = 1;
                pdf.text(`Week ${weekCount}`, 10, currentY);
                currentY += 10;
            }
            pdf.text(`  Session ${sessionCount}: Practice bars ${barStart} to ${barEnd} at ${speed} BPM`, 10, currentY);
            currentY += 10;
            practiceCount++;
            sessionCount++;

            if (currentY > 270) {
                pdf.addPage();
                pdf.setFillColor(18, 18, 18);
                pdf.rect(0, 0, 210, 297, 'F');
                pdf.setTextColor('#ffffff');
                addLogoAndText();
                currentY = 80; // Adjusted to accommodate due date
            }
        });
    }

    // Last 3 sessions for the entire piece
    const lastSessions = [
        { speed: halfSpeed, text: "50% speed" },
        { speed: middleSpeed, text: "75% speed" },
        { speed: targetSpeed, text: "100% speed" }
    ];

    weekCount = totalWeeks;
    sessionCount = (practiceCount - 1) % sessionsPerWeek + 1;
    pdf.text(`Week ${weekCount}`, 10, currentY);
    currentY += 10;
    lastSessions.forEach((session, index) => {
        if (sessionCount > sessionsPerWeek) {
            weekCount++;
            sessionCount = 1;
            pdf.text(`Week ${weekCount}`, 10, currentY);
            currentY += 10;
        }
        pdf.text(`  Session ${sessionCount}: Practice entire piece at ${session.text} (${session.speed} BPM)`, 10, currentY);
        currentY += 10;
        sessionCount++;

        if (currentY > 270) {
            pdf.addPage();
            pdf.setFillColor(18, 18, 18);
            pdf.rect(0, 0, 210, 297, 'F');
            pdf.setTextColor('#ffffff');
            addLogoAndText();
            currentY = 80; // Adjusted to accommodate due date
            pdf.text(`Week ${weekCount}`, 10, currentY);
            currentY += 10;
        }
    });

    currentY += 20;
    pdf.text("Gradual Tempo Increase:", 10, currentY);
    currentY += 10;
    pdf.text("Start at a slow tempo and gradually increase by small increments each session.", 10, currentY);
    currentY += 10;
    pdf.text("Use a metronome and ensure accuracy before increasing speed.", 10, currentY);

    pdf.save(`${pieceName}_practice_plan.pdf`);
});
