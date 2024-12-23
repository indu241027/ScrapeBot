const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
import { test, expect } from '@playwright/test';

test('Scrap Product names with Price and Link',async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the e-commerce page with products ordered by Price
    await page.goto('https://www.scrapingcourse.com/ecommerce');
    
    // Wait for the product names to load (using the class selector for "product-name")
    await page.waitForSelector('.product-name'); // Wait until the product names are loaded
    

    // Extract product information with price and product link
    const products = await page.$$eval('.products .product', items =>
    items.map(item => {
   const name = item.querySelector('.woocommerce-loop-product__title').textContent.trim();
   const price = item.querySelector('.price').textContent.trim();
   const link = item.querySelector('.products img').getAttribute('src');
    return { name, price,link};
   })
   );
   // Take a screenshot of the page
    await page.screenshot({ path: './screenshots/demo2_output.png' });

   // Saving the product information based on the Filter[low to High order]
    fs.writeFileSync("./output-json/demo2_output.json", JSON.stringify(products, null, 2));
    console.log("Data saved in the test-results Folder");
   
    await browser.close();
    });

    