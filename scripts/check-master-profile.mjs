import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('lab/master-profile',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const reports=[];
try {
 for(const [name,width,height,reducedMotion] of [['desktop',1440,1000,'no-preference'],['mobile',390,844,'no-preference'],['reduced',390,844,'reduce']]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion}); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.locator('#minimal-content').waitFor({state:'visible'});
 const text=await page.locator('#minimal-content').textContent();
 for(const required of ['Vicots','Lead Senior Developer','Human Action Recognition','Education','Silver Medalist (Department)','Jest','MCP']) if(!text.includes(required))throw Error(name+': missing '+required);
 if(/fictional|Current Position/.test(text))throw Error('Stale profile content');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 await page.screenshot({path:`lab/master-profile/${name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Switch to immersive portfolio'}).click();
 await page.locator('.portfolio-world').waitFor({state:'visible'});
 await page.getByRole('button',{name:'Work',exact:true}).click();
 await page.waitForTimeout(reducedMotion==='reduce'?200:1200);
 await page.screenshot({path:`lab/master-profile/${name}-work.png`});
 await page.getByRole('button',{name:'Switch to full profile'}).click();
 await page.locator('#minimal-content').waitFor({state:'visible'});
 const download=await page.request.get('http://127.0.0.1:4173/Muhammad-Reebal-Raza-CV.tex');
 if(!download.ok() || !(await download.text()).includes('Human Action Recognition'))throw Error('Master download incorrect');
 reports.push({name,overflow,errors}); await page.close();
 }
}finally{await browser.close();}
await writeFile('lab/master-profile/checks.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports,null,2));
if(reports.some(r=>r.overflow||r.errors.length))process.exitCode=1;