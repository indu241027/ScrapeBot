const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'      
  });
import { test, expect } from '@playwright/test';

test('Login and Purchase item automatically', async() => {

  //Reading credentials from .env file
  const username = process.env.USER;
  const password = process.env.PASSWORD;
  const gotoURL = process.env.LINK;


  //Navigate to the cart and scraping the product info if Added
  // Navigate to the login page
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  // Navigate to the login page
  await page.goto(gotoURL);

  // Perform login
  await page.fill('#user-name', username); // Replace with your username
  await page.fill('#password', password);   // Replace with your password
  await page.click('#login-button');


  // Verify login success (optional)
  await page.waitForSelector('.title');

  // Take a screenshot of the login page
  await page.screenshot({ path: './screenshots/1_login.png' });

  // Filter products by price (low to high)
  await page.click('.product_sort_container'); // Open the sort dropdown
  await page.selectOption('.product_sort_container', 'lohi'); // Select 'Price (low to high)'

  // Wait for products to be sorted
  await page.waitForTimeout(2000); // Wait for sorting to complete
 // Take a screenshot of the Page applied filter by price
   await page.screenshot({ path: './screenshots/2_Sorted.png' });

  // Add the first two items to the cart
  const productButtons = await page.$$('.btn_primary'); // Select all 'Add to cart' buttons
  await productButtons[1].click(); // Add the  item
  await productButtons[2].click(); // Add the  item
  


  // Navigate to the cart
  await page.click('.shopping_cart_link');
  await page.waitForTimeout(2000); 

  // Take a screenshot of the page
  await page.screenshot({ path: './screenshots/3_AddedItem.png' });

  // Proceed to checkout
  await page.click('.checkout_button');

  // Provide shipping details
  await page.fill('#first-name', 'User'); // Replace with your first name
  await page.fill('#last-name', 'choice');   // Replace with your last name
  await page.fill('#postal-code', '12345'); // Replace with your postal code
  await page.click('.btn_primary.cart_button');

  // Complete the purchase
  await page.click('.btn_action');
  await page.waitForTimeout(2000); 
 
  // Take a screenshot of the purchased successfully
  await page.screenshot({ path: './screenshots/4_Purchased.png' });
  
});
