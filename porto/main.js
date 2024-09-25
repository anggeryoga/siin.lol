document.addEventListener('DOMContentLoaded', function () {
    const pdfContainer = document.getElementById('pdf-container');

    // Array of JPG files that correspond to each page of the PDF
    const pdfImages = [
        'pdf_page1.jpg',
        'pdf_page2.jpg',
        'pdf_page3.jpg'  // Add more pages as necessary
    ];

    // Loop through the images and create img elements
    pdfImages.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = 'PDF Page';
        pdfContainer.appendChild(img);
    });
});
