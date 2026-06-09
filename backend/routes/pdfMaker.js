const express = require('express'); 
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true, 
    });
    const page = await browser.newPage();
    await page.setContent('<html><body><h1>Reports</h1><p>This is a simple report.</p></body></html>');
    const pdfBuffer = await page.pdf({ format: 'A5' });
    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=report.pdf',
    });
    res.send(pdfBuffer);

  } 
  catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;