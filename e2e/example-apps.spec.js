/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { expect } = require('chai')
const puppeteer = require('puppeteer')
const serveApp = require('./serve-example-apps')

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('example app', async () => {
  let browser, page, servers
  before(async function () {
    servers = await serveApp()
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })
  it('works', async () => {
    await page.goto('http://localhost:3000')
    // test fre
    await sleep(1000)
    const freHello = await page.evaluate(
      () =>
        document.querySelector('child-fre').shadowRoot.querySelector('h1')
          .textContent
    )
    expect(freHello).to.eq('Hello Fre!!')
    // test react
    await page.click('header button:nth-child(2)')
    await sleep(1000)
    const reactHello = await page.evaluate(
      () =>
        document.querySelector('child-react').shadowRoot.querySelector('h1')
          .textContent
    )
    expect(reactHello.startsWith('Hello React'))
    // test vue
    await page.click('header button:nth-child(3)')
    await sleep(1000)
    const vueHello = await page.evaluate(
      () =>
        document.querySelector('child-vue').shadowRoot.querySelector('h1')
          .textContent
    )
    expect(vueHello.startsWith('Hello vue'))
  })
  after(async () => {
    await browser.close()
    servers.forEach((server) => server.close())
  })
})
