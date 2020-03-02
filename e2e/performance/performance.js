/* eslint-disable no-console */
var stats = require('stats-lite')

const url = process.argv[2]
const maxRuns = parseInt(process.argv[3]) + 1
const showBrowser = process.argv[4] === 'true'
const showDevTools = process.argv[5] === 'true'

console.log(`Testing performance at ${url}`)
if (url === undefined || maxRuns === undefined) {
  console.log('Please provide a valid url and maxRuns parameter')
  process.exit(1)
}

const puppeteer = require('puppeteer')
const fs = require('fs')

const run = async () => {
  const times = []

  try {
    const browser = await puppeteer.launch({ headless: !showBrowser, devtools: showDevTools })
    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.waitFor(1000)

    let numRums = 0

    await page.exposeFunction('storeTime', async time => {
      if (numRums > 0) {
        times.push(time)

        console.log(`Run ${numRums}: ${time} ms`)
      }

      numRums++

      if (numRums < maxRuns) {
        start = new Date().getTime()
        await page.setCacheEnabled(false)
        await page.reload()
        await evaluate()
      } else {
        const fileLoc = 'e2e/performance/results.csv'

        fs.appendFile(fileLoc, times.join(',') + '\n', () => {})
        console.log('\nRESULTS')
        console.log(`Results written to ${fileLoc}`)
        console.log(`25th percentile: ${stats.percentile(times, 0.25)} ms`)
        console.log(`50th percentile: ${stats.median(times)} ms`)
        console.log(`75th percentile: ${stats.percentile(times, 0.75)} ms`)
        console.log(`90th percentile: ${stats.percentile(times, 0.9)} ms`)
        console.log(`99th percentile: ${stats.percentile(times, 0.99)} ms`)

        await browser.close()
      }
    })

    const evaluate = async () => {
      await page.evaluate(
        ({ start }) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(async mutation => {
              const firstChild = mutation.addedNodes[0].firstElementChild

              if (firstChild && firstChild.id === 'launcher') {
                const end = new Date().getTime()

                await window.storeTime(end - start)
              }
            })
          })

          observer.observe(document.body, {
            attributes: true,
            childList: true,
            characterData: true
          })
        },
        { start }
      )
    }

    let start = new Date().getTime()

    await page.goto(url)
    await evaluate()
  } catch (err) {
    console.log(err)
  }
}

run()
/* eslint-enable no-console */
